'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import {
  Users,
  Clock,
  Download,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Button from '@/components/ui/Button';

// ── Types ─────────────────────────────────────────────────────────────────────
interface QuestionOption { id: string; text: string }

interface OptionStat { id: string; text: string; count: number; pct: number }

interface QuestionStat {
  questionId: string;
  type: string;
  title: string;
  isRequired: boolean;
  totalAnswers: number;
  // SINGLE / MULTIPLE
  options?: OptionStat[];
  // SCALE
  scaleAvg?: number;
  distribution?: { value: number; count: number }[];
  // TEXT
  textAnswers?: string[];
  // MATRIX
  matrixRows?: QuestionOption[];
  matrixColumns?: QuestionOption[];
  matrixCells?: Record<string, Record<string, number>>;
}

interface StatsData {
  survey: {
    id: string;
    title: string;
    status: string;
    currentResponses: number;
    maxResponses: number;
    estimatedMinutes: number;
    deadline: string;
  };
  totalResponses: number;
  trend: { date: string; count: number }[];
  departments: string[];
  grades: number[];
  questions: QuestionStat[];
}

// ── Circular progress ─────────────────────────────────────────────────────────
function CircularProgress({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="rotate-[-90deg]">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="#673ab7" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  );
}

// ── Trend mini chart ──────────────────────────────────────────────────────────
function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <Line type="monotone" dataKey="count" stroke="#673ab7" strokeWidth={2} dot={false} />
          <XAxis dataKey="date" hide />
          <Tooltip
            contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
            formatter={(v: number) => [`${v}명`, '']}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Choice bar chart ──────────────────────────────────────────────────────────
function ChoiceChart({ options, total }: { options: OptionStat[]; total: number }) {
  const data = options.map((o) => ({ name: o.text, count: o.count, pct: o.pct }));
  const maxLen = Math.max(...options.map((o) => o.text.length), 8);
  const yWidth = Math.min(maxLen * 7 + 8, 180);

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
      <div style={{ height: options.length * 44 + 32, minWidth: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis type="number" domain={[0, Math.max(total, 1)]} hide />
            <YAxis type="category" dataKey="name" width={yWidth} tick={{ fontSize: 13, fill: '#374151' }} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(v: number) => [`${v}명 (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, '응답 수']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 12, fill: '#9ca3af', formatter: (v: number) => `${v}` }}>
              {data.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? '#673ab7' : '#9c27b0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Scale histogram ───────────────────────────────────────────────────────────
function ScaleHistogram({ avg, distribution }: { avg: number; distribution: { value: number; count: number }[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-primary-600">{avg.toFixed(1)}</span>
        <span className="text-sm text-gray-500">평균</span>
      </div>
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="h-32 min-w-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="value" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                formatter={(v: number) => [`${v}명`, '응답']}
              />
              <Bar dataKey="count" fill="#673ab7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Text answers list ─────────────────────────────────────────────────────────
function TextAnswerList({ answers }: { answers: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? answers : answers.slice(0, 5);
  return (
    <div className="space-y-1.5">
      {visible.map((text, i) => (
        <div key={i} className="flex gap-2.5 text-sm">
          <span className="text-gray-300 font-mono flex-shrink-0">{i + 1}.</span>
          <span className="text-gray-700 leading-relaxed">{text}</span>
        </div>
      ))}
      {answers.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((p) => !p)}
          className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 font-medium mt-2 transition-colors"
        >
          {showAll ? <><ChevronUp size={13} /> 접기</> : <><ChevronDown size={13} /> {answers.length - 5}개 더 보기</>}
        </button>
      )}
    </div>
  );
}

// ── Matrix heatmap ────────────────────────────────────────────────────────────
function MatrixHeatmap({
  rows, columns, cells,
}: {
  rows: QuestionOption[];
  columns: QuestionOption[];
  cells: Record<string, Record<string, number>>;
}) {
  const allCounts = rows.flatMap((r) => columns.map((c) => cells[r.id]?.[c.id] ?? 0));
  const maxCount = Math.max(...allCounts, 1);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 text-gray-400 font-normal min-w-[100px] border-b border-gray-100" />
            {columns.map((col) => (
              <th key={col.id} className="text-center px-3 py-2 font-medium text-gray-600 border-b border-gray-100 min-w-[60px] whitespace-nowrap">
                {col.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-50 last:border-0">
              <td className="px-3 py-2.5 text-gray-700 font-medium border-r border-gray-100">{row.text}</td>
              {columns.map((col) => {
                const count = cells[row.id]?.[col.id] ?? 0;
                const intensity = count / maxCount;
                const bg = count === 0
                  ? undefined
                  : `rgba(103, 58, 183, ${0.1 + intensity * 0.7})`;
                const textColor = intensity > 0.5 ? '#fff' : '#374151';
                return (
                  <td key={col.id} className="text-center px-3 py-2.5 transition-colors" style={{ backgroundColor: bg }}>
                    <span className="font-semibold" style={{ color: count === 0 ? '#d1d5db' : textColor }}>
                      {count}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Question result card ──────────────────────────────────────────────────────
function QuestionResultCard({ q, index, total }: { q: QuestionStat; index: number; total: number }) {
  const typeLabel: Record<string, string> = {
    SINGLE_CHOICE: '단일 선택', MULTIPLE_CHOICE: '복수 선택',
    SHORT_TEXT: '단답형', LONG_TEXT: '장문형',
    SCALE: '척도', MATRIX: '매트릭스',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-1 bg-primary-500" />
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-gray-400">Q{index + 1}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{typeLabel[q.type] ?? q.type}</span>
              {q.isRequired && <span className="text-xs text-red-400">필수</span>}
            </div>
            <p className="text-base font-semibold text-gray-900">{q.title}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-bold text-primary-600">{q.totalAnswers}</span>
            <p className="text-xs text-gray-400">/{total}명 응답</p>
          </div>
        </div>

        {/* Renderers */}
        {(q.type === 'SINGLE_CHOICE' || q.type === 'MULTIPLE_CHOICE') && q.options && (
          <ChoiceChart options={q.options} total={total} />
        )}
        {q.type === 'SCALE' && q.scaleAvg !== undefined && q.distribution && (
          <ScaleHistogram avg={q.scaleAvg} distribution={q.distribution} />
        )}
        {(q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') && q.textAnswers && (
          q.textAnswers.length > 0
            ? <TextAnswerList answers={q.textAnswers} />
            : <p className="text-sm text-gray-400">텍스트 응답 없음</p>
        )}
        {q.type === 'MATRIX' && q.matrixRows && q.matrixColumns && q.matrixCells && (
          <MatrixHeatmap rows={q.matrixRows} columns={q.matrixColumns} cells={q.matrixCells} />
        )}
      </div>
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
function FilterBar({
  departments, grades, dept, grade, onChange,
}: {
  departments: string[];
  grades: number[];
  dept: string;
  grade: string;
  onChange: (dept: string, grade: string) => void;
}) {
  if (departments.length === 0 && grades.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-gray-600">필터:</span>
      {departments.length > 0 && (
        <select
          value={dept}
          onChange={(e) => onChange(e.target.value, grade)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-primary-400 bg-white"
        >
          <option value="">전체 학과</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      {grades.length > 0 && (
        <select
          value={grade}
          onChange={(e) => onChange(dept, e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-primary-400 bg-white"
        >
          <option value="">전체 학년</option>
          {grades.map((g) => <option key={g} value={String(g)}>{g}학년</option>)}
        </select>
      )}
      {(dept || grade) && (
        <button
          type="button"
          onClick={() => onChange('', '')}
          className="text-xs text-primary-500 hover:text-primary-700 font-medium"
        >
          초기화
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SurveyResultsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const [phase, setPhase] = useState<'loading' | 'unauthorized' | 'error' | 'data'>('loading');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [deptFilter, setDeptFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const fetchStats = useCallback(
    async (dept: string, grade: string) => {
      const qs = new URLSearchParams();
      if (dept) qs.set('department', dept);
      if (grade) qs.set('grade', grade);
      const url = `/api/surveys/${surveyId}/stats${qs.toString() ? `?${qs}` : ''}`;

      const res = await fetch(url);
      if (res.status === 403) { setPhase('unauthorized'); return; }
      if (!res.ok) { setPhase('error'); return; }
      const data = await res.json() as StatsData;
      setStats(data);
      setPhase('data');
    },
    [surveyId]
  );

  useEffect(() => { fetchStats('', ''); }, [fetchStats]);

  const handleFilterChange = (dept: string, grade: string) => {
    setDeptFilter(dept);
    setGradeFilter(grade);
    fetchStats(dept, grade);
  };

  const downloadCsv = (type: 'raw' | 'summary') => {
    window.open(`/api/surveys/${surveyId}/export?type=${type}`, '_blank');
  };

  // ── Render states ──────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  if (phase === 'unauthorized') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm max-w-sm w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Lock size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">접근 권한 없음</h2>
          <p className="text-sm text-gray-500">설문 생성자만 결과를 확인할 수 있습니다.</p>
          <Button variant="secondary" onClick={() => router.push('/')} className="w-full">
            메인으로
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'error' || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <AlertCircle size={36} className="text-red-400 mx-auto" />
          <p className="text-gray-600">데이터를 불러올 수 없습니다</p>
          <Button variant="secondary" onClick={() => fetchStats('', '')}>다시 시도</Button>
        </div>
      </div>
    );
  }

  const { survey, totalResponses, trend, departments, grades, questions } = stats;
  const progressPct = survey.maxResponses > 0
    ? Math.round((survey.currentResponses / survey.maxResponses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft size={16} />
            메인
          </button>
          <h1 className="flex-1 text-sm font-semibold text-gray-900 truncate text-center">
            {survey.title} — 결과 분석
          </h1>
          {/* Export buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => downloadCsv('raw')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Download size={13} />
              원본 CSV
            </button>
            <button
              type="button"
              onClick={() => downloadCsv('summary')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              <Download size={13} />
              요약 CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Response count */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <CircularProgress value={survey.currentResponses} max={survey.maxResponses} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">총 응답</p>
              <p className="text-3xl font-bold text-gray-900">{totalResponses}</p>
              <p className="text-xs text-gray-400 mt-0.5">/ {survey.maxResponses}명 목표</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-xs text-gray-400">{progressPct}%</span>
              </div>
            </div>
          </div>

          {/* Estimated time */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">예상 소요시간</span>
            </div>
            <div>
              <span className="text-4xl font-bold text-gray-900">{survey.estimatedMinutes}</span>
              <span className="text-lg text-gray-400 ml-1">분</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(survey.deadline) > new Date() ? '진행 중' : '마감됨'} · {survey.status}
            </p>
          </div>

          {/* Trend */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <Users size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">최근 7일 응답 추이</span>
            </div>
            <TrendChart data={trend} />
            <div className="flex justify-between text-xs text-gray-300 mt-1 px-1">
              <span>{trend[0]?.date}</span>
              <span>{trend[trend.length - 1]?.date}</span>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <FilterBar
          departments={departments}
          grades={grades}
          dept={deptFilter}
          grade={gradeFilter}
          onChange={handleFilterChange}
        />

        {/* Question result cards */}
        {questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-400">질문 데이터가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <QuestionResultCard key={q.questionId} q={q} index={i} total={totalResponses} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
