import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface SessionUser { id: string }

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function escapeCsv(val: string | null | undefined): string {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { orderIndex: 'asc' } } },
  });
  if (!survey) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (survey.creatorId !== user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const type = request.nextUrl.searchParams.get('type') ?? 'raw';

  const responses = await prisma.response.findMany({
    where: { surveyId: params.id, isCompleted: true },
    include: {
      respondent: { select: { nickname: true, department: true, grade: true } },
      answers: true,
    },
    orderBy: { completedAt: 'asc' },
  });

  const BOM = '\uFEFF'; // Excel BOM for Korean

  // ── Raw CSV: one row per response ─────────────────────────────────────────
  if (type === 'raw') {
    const qHeaders = survey.questions.map((q) => escapeCsv(`Q${survey.questions.indexOf(q) + 1}. ${q.title}`));
    const header = ['응답ID', '이름', '학과', '학년', '완료일시', ...qHeaders].join(',');

    const rows = responses.map((r) => {
      const cols: string[] = [
        escapeCsv(r.id.slice(0, 8)),
        escapeCsv(r.respondent.nickname),
        escapeCsv(r.respondent.department),
        escapeCsv(r.respondent.grade != null ? String(r.respondent.grade) : null),
        escapeCsv(r.completedAt?.toISOString().slice(0, 16).replace('T', ' ') ?? null),
      ];

      for (const q of survey.questions) {
        const ans = r.answers.find((a) => a.questionId === q.id);
        if (!ans) { cols.push(''); continue; }

        if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
          const selIds = parseJson<string[]>(ans.selectedOptions, []);
          const opts = parseJson<{ id: string; text: string }[]>(q.options, []);
          const texts = selIds.map((id) => opts.find((o) => o.id === id)?.text ?? id).join('; ');
          cols.push(escapeCsv(texts));
        } else if (q.type === 'MATRIX') {
          const vals = parseJson<Record<string, string>>(ans.value, {});
          const matrix = parseJson<{ rows: { id: string; text: string }[]; columns: { id: string; text: string }[] }>(
            q.options, { rows: [], columns: [] }
          );
          const text = Object.entries(vals)
            .map(([rId, cId]) => {
              const row = matrix.rows.find((r) => r.id === rId)?.text ?? rId;
              const col = matrix.columns.find((c) => c.id === cId)?.text ?? cId;
              return `${row}→${col}`;
            })
            .join('; ');
          cols.push(escapeCsv(text));
        } else {
          cols.push(escapeCsv(ans.value));
        }
      }
      return cols.join(',');
    });

    const csv = BOM + [header, ...rows].join('\r\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="responses_${params.id}.csv"`,
      },
    });
  }

  // ── Summary CSV: aggregated per question+option ───────────────────────────
  const header = ['질문번호', '질문', '유형', '항목', '응답수', '비율(%)'].join(',');
  const rows: string[] = [];

  for (let qi = 0; qi < survey.questions.length; qi++) {
    const q = survey.questions[qi];
    const qLabel = `Q${qi + 1}`;
    const qAnswers = responses.flatMap((r) => r.answers.filter((a) => a.questionId === q.id));
    const total = responses.length;

    if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
      const opts = parseJson<{ id: string; text: string }[]>(q.options, []);
      const counts: Record<string, number> = {};
      for (const ans of qAnswers) {
        for (const id of parseJson<string[]>(ans.selectedOptions, [])) {
          counts[id] = (counts[id] ?? 0) + 1;
        }
      }
      for (const opt of opts) {
        const c = counts[opt.id] ?? 0;
        rows.push([qLabel, escapeCsv(q.title), q.type, escapeCsv(opt.text), c, total > 0 ? Math.round(c / total * 100) : 0].join(','));
      }
    } else if (q.type === 'SCALE') {
      const values = qAnswers.map((a) => Number(a.value)).filter((v) => !isNaN(v) && v !== 0);
      const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0';
      rows.push([qLabel, escapeCsv(q.title), 'SCALE', '평균', avg, ''].join(','));
      const dist: Record<number, number> = {};
      for (const v of values) dist[v] = (dist[v] ?? 0) + 1;
      for (const [v, c] of Object.entries(dist)) {
        rows.push([qLabel, '', '', `값: ${v}`, c, total > 0 ? Math.round(Number(c) / total * 100) : 0].join(','));
      }
    } else if (q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') {
      const texts = qAnswers.map((a) => a.value).filter(Boolean);
      rows.push([qLabel, escapeCsv(q.title), q.type, `총 ${texts.length}개 응답`, texts.length, ''].join(','));
    } else if (q.type === 'MATRIX') {
      const matrix = parseJson<{ rows: { id: string; text: string }[]; columns: { id: string; text: string }[] }>(q.options, { rows: [], columns: [] });
      for (const row of matrix.rows) {
        for (const col of matrix.columns) {
          let cnt = 0;
          for (const ans of qAnswers) {
            const vals = parseJson<Record<string, string>>(ans.value, {});
            if (vals[row.id] === col.id) cnt++;
          }
          rows.push([qLabel, escapeCsv(q.title), 'MATRIX', escapeCsv(`${row.text} × ${col.text}`), cnt, total > 0 ? Math.round(cnt / total * 100) : 0].join(','));
        }
      }
    }
  }

  const csv = BOM + [header, ...rows].join('\r\n');
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="summary_${params.id}.csv"`,
    },
  });
}
