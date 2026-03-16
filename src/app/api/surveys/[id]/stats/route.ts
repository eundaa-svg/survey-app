import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface SessionUser { id: string; name?: string | null; email?: string | null }

// ── Parse helpers ─────────────────────────────────────────────────────────────
function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

interface QuestionOption { id: string; text: string }
interface ScaleConfig { scaleMin: number; scaleMax: number }
interface MatrixConfig { rows: QuestionOption[]; columns: QuestionOption[] }

function getQuestionConfig(type: string, optionsRaw: string | null) {
  if (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE')
    return { options: parseJson<QuestionOption[]>(optionsRaw, []) };
  if (type === 'SCALE')
    return { scale: parseJson<ScaleConfig>(optionsRaw, { scaleMin: 1, scaleMax: 5 }) };
  if (type === 'MATRIX')
    return { matrix: parseJson<MatrixConfig>(optionsRaw, { rows: [], columns: [] }) };
  return {};
}

// ── Main ──────────────────────────────────────────────────────────────────────
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

  // Filter params
  const { searchParams } = request.nextUrl;
  const filterDept = searchParams.get('department') || null;
  const filterGrade = searchParams.get('grade') ? Number(searchParams.get('grade')) : null;

  // Fetch responses with answers
  const responses = await prisma.response.findMany({
    where: {
      surveyId: params.id,
      isCompleted: true,
      ...(filterDept || filterGrade
        ? {
            respondent: {
              ...(filterDept ? { department: filterDept } : {}),
              ...(filterGrade ? { grade: filterGrade } : {}),
            },
          }
        : {}),
    },
    include: {
      respondent: { select: { department: true, grade: true } },
      answers: true,
    },
    orderBy: { completedAt: 'asc' },
  });

  const totalResponses = responses.length;

  // ── Trend: last 7 days ────────────────────────────────────────────────────
  const trend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      count: responses.filter(
        (r) => r.completedAt?.toISOString().slice(0, 10) === dateStr
      ).length,
    };
  });

  // ── Demographics (for filter dropdowns) ──────────────────────────────────
  const allResponses = await prisma.response.findMany({
    where: { surveyId: params.id, isCompleted: true },
    include: { respondent: { select: { department: true, grade: true } } },
  });
  const departments = Array.from(new Set(allResponses.map((r) => r.respondent.department).filter(Boolean))) as string[];
  const grades = Array.from(new Set(allResponses.map((r) => r.respondent.grade).filter((v): v is number => v !== null)));

  // ── Per-question aggregation ──────────────────────────────────────────────
  const questionStats = survey.questions.map((q) => {
    const config = getQuestionConfig(q.type, q.options);
    const qAnswers = responses.flatMap((r) => r.answers.filter((a) => a.questionId === q.id));
    const total = responses.length; // denominator = respondents, not answers

    const base = {
      questionId: q.id,
      type: q.type,
      title: q.title,
      isRequired: q.isRequired,
      totalAnswers: qAnswers.length,
    };

    if (q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') {
      const opts = (config as { options: QuestionOption[] }).options;
      const counts: Record<string, number> = {};
      for (const ans of qAnswers) {
        const sel = parseJson<string[]>(ans.selectedOptions, []);
        for (const id of sel) counts[id] = (counts[id] ?? 0) + 1;
      }
      return {
        ...base,
        options: opts.map((o) => ({
          id: o.id,
          text: o.text,
          count: counts[o.id] ?? 0,
          pct: total > 0 ? Math.round(((counts[o.id] ?? 0) / total) * 100) : 0,
        })),
      };
    }

    if (q.type === 'SCALE') {
      const { scale } = config as { scale: ScaleConfig };
      const values = qAnswers.map((a) => Number(a.value)).filter((v) => !isNaN(v) && v !== 0);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const dist: Record<number, number> = {};
      for (const v of values) dist[v] = (dist[v] ?? 0) + 1;
      const distribution = Array.from(
        { length: (scale.scaleMax ?? 5) - (scale.scaleMin ?? 1) + 1 },
        (_, i) => {
          const val = (scale.scaleMin ?? 1) + i;
          return { value: val, count: dist[val] ?? 0 };
        }
      );
      return { ...base, scaleAvg: Math.round(avg * 10) / 10, distribution };
    }

    if (q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') {
      const texts = qAnswers.map((a) => a.value).filter((v): v is string => !!v?.trim());
      return { ...base, textAnswers: texts };
    }

    if (q.type === 'MATRIX') {
      const { matrix } = config as { matrix: MatrixConfig };
      const cells: Record<string, Record<string, number>> = {};
      for (const row of matrix.rows) {
        cells[row.id] = {};
        for (const col of matrix.columns) cells[row.id][col.id] = 0;
      }
      for (const ans of qAnswers) {
        const vals = parseJson<Record<string, string>>(ans.value, {});
        for (const [rowId, colId] of Object.entries(vals)) {
          if (cells[rowId]) cells[rowId][colId] = (cells[rowId][colId] ?? 0) + 1;
        }
      }
      return { ...base, matrixRows: matrix.rows, matrixColumns: matrix.columns, matrixCells: cells };
    }

    return base;
  });

  return NextResponse.json({
    survey: {
      id: survey.id,
      title: survey.title,
      status: survey.status,
      currentResponses: survey.currentResponses,
      maxResponses: survey.maxResponses,
      estimatedMinutes: survey.estimatedMinutes,
      deadline: survey.deadline.toISOString(),
    },
    totalResponses,
    trend,
    departments,
    grades: grades.sort((a, b) => a - b),
    questions: questionStats,
  });
}
