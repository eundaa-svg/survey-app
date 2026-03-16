'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BookOpen,
  Building2,
  GraduationCap,
  MoreHorizontal,
  ChevronDown,
  X,
  Minus,
  Plus,
} from 'lucide-react';
import { Button, Card, CardBody } from '@/components/ui';
import { useSurveyCreateStore, type CategoryType } from '@/stores/surveyCreateStore';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const step1Schema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이내로 입력해주세요'),
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .max(500, '설명은 500자 이내로 입력해주세요'),
  category: z.enum(['ACADEMIC', 'RESEARCH', 'CAMPUS', 'OTHER'], {
    errorMap: () => ({ message: '카테고리를 선택해주세요' }),
  }),
  targetAll: z.boolean(),
  targetDepartments: z.array(z.string()),
  targetGrades: z.array(z.number()),
  maxResponses: z
    .number()
    .min(10, '최소 10명 이상이어야 합니다')
    .max(500, '최대 500명까지 가능합니다'),
  deadline: z
    .string()
    .min(1, '마감일을 선택해주세요')
    .refine(
      (v) => new Date(v).getTime() > Date.now() + 24 * 60 * 60 * 1000,
      '최소 1일 이후 날짜를 선택해주세요'
    ),
  estimatedMinutes: z.number().min(1),
});

type Step1FormData = z.infer<typeof step1Schema>;

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES: {
  value: CategoryType;
  label: string;
  sub: string;
  icon: React.ElementType;
}[] = [
  { value: 'ACADEMIC', label: '학술연구', sub: '논문·연구 목적', icon: BookOpen },
  { value: 'CAMPUS', label: '캠퍼스생활', sub: '시설·행사·학생회', icon: Building2 },
  { value: 'RESEARCH', label: '수업관련', sub: '강의·과제·평가', icon: GraduationCap },
  { value: 'OTHER', label: '기타', sub: '분류되지 않은 주제', icon: MoreHorizontal },
];

const DEPARTMENTS = [
  '경영학과', '컴퓨터공학과', '전자공학과', '심리학과', '사회학과',
  '국문학과', '영문학과', '수학과', '물리학과', '화학과', '생명과학과',
  '법학과', '행정학과', '교육학과', '미디어학과',
];

const GRADES = [
  { value: 1, label: '1학년' },
  { value: 2, label: '2학년' },
  { value: 3, label: '3학년' },
  { value: 4, label: '4학년' },
  { value: 5, label: '대학원' },
];

const ESTIMATED_MINUTES = [1, 3, 5, 10, 15, 20, 30];

// Minimum deadline: tomorrow
function getMinDeadline(): string {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return tomorrow.toISOString().split('T')[0];
}

// Format date to Korean string: "2026년 3월 28일"
function formatDeadline(dateString: string): string {
  if (!dateString) return '날짜 선택';
  const date = new Date(dateString + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Floating label title input — extracted to satisfy Rules of Hooks */
function TitleInput({
  value,
  onChange,
  onBlur,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none ${
          isActive ? 'text-xs text-primary-500 -top-5 font-medium' : 'text-base text-gray-500 top-3.5'
        }`}
      >
        설문 제목 *
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur(); }}
        maxLength={100}
        className={`w-full bg-transparent border-0 border-b-2 pb-2 pt-4 text-base text-gray-900 transition-all duration-300 outline-none ${
          error ? 'border-b-red-500' : focused ? 'border-b-primary-500' : 'border-b-gray-300'
        }`}
      />
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-red-500 text-xs font-medium">{error}</p>
        ) : (
          <span />
        )}
        <span className={`text-xs ${value.length > 90 ? 'text-orange-500' : 'text-gray-400'}`}>
          {value.length}/100
        </span>
      </div>
    </div>
  );
}

/** Google Forms-style floating label textarea */
function FloatingTextarea({
  label,
  value,
  onChange,
  maxLength,
  rows = 3,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  rows?: number;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative group">
      <label
        className={`absolute left-0 transition-all duration-200 pointer-events-none ${
          isActive ? 'text-xs text-primary-500 -top-5 font-medium' : 'text-base text-gray-500 top-3'
        }`}
      >
        {label}
      </label>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full bg-transparent border-0 border-b-2 pb-2 pt-4 text-base text-gray-900 resize-none transition-all duration-300 outline-none ${
          error
            ? 'border-b-red-500'
            : focused
            ? 'border-b-primary-500'
            : 'border-b-gray-300'
        }`}
      />
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-red-500 text-xs font-medium">{error}</p>
        ) : (
          <span />
        )}
        <span className={`text-xs ${value.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

/** Toggle switch */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/** Custom multi-select dropdown for departments */
function DepartmentSelect({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggle = (dept: string) => {
    onChange(
      value.includes(dept) ? value.filter((d) => d !== dept) : [...value, dept]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-primary-400 transition-colors"
      >
        <span className={value.length === 0 ? 'text-gray-400' : 'text-gray-700'}>
          {value.length === 0 ? '학과 선택 (복수 선택 가능)' : `${value.length}개 선택됨`}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform text-gray-400 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {DEPARTMENTS.map((dept) => (
            <label
              key={dept}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={value.includes(dept)}
                onChange={() => toggle(dept)}
                className="accent-primary-500 w-4 h-4"
              />
              {dept}
            </label>
          ))}
        </div>
      )}

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((dept) => (
            <span
              key={dept}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-200"
            >
              {dept}
              <button
                type="button"
                onClick={() => toggle(dept)}
                className="hover:text-primary-900"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Step1BasicInfo() {
  const { step1, setStep1, setCurrentStep } = useSurveyCreateStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: step1.title,
      description: step1.description,
      category: (step1.category as CategoryType) || undefined,
      targetAll: step1.targetAll,
      targetDepartments: step1.targetDepartments,
      targetGrades: step1.targetGrades,
      maxResponses: step1.maxResponses,
      deadline: step1.deadline,
      estimatedMinutes: step1.estimatedMinutes,
    },
  });

  const titleValue = watch('title') ?? '';
  const descValue = watch('description') ?? '';
  const selectedCategory = watch('category');
  const targetAll = watch('targetAll');
  const maxResponses = watch('maxResponses');

  const onSubmit = (data: Step1FormData) => {
    setStep1(data);
    setCurrentStep(2);
  };

  // Max responses +/- handlers
  const adjustMaxResponses = (delta: number) => {
    const next = Math.min(500, Math.max(10, (maxResponses || 100) + delta));
    setValue('maxResponses', next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card variant="form" colorBar="primary">
        <CardBody className="space-y-8 py-8 px-6 sm:px-8">

          {/* ── 제목 ─────────────────────────────────── */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TitleInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.title?.message}
              />
            )}
          />

          {/* ── 설문 설명 ─────────────────────────────── */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <FloatingTextarea
                label="설문 설명 *"
                value={field.value}
                onChange={field.onChange}
                maxLength={500}
                rows={4}
                error={errors.description?.message}
              />
            )}
          />

          <div className="border-t border-gray-100" />

          {/* ── 카테고리 ──────────────────────────────── */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">카테고리 *</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(({ value, label, sub, icon: Icon }) => {
                const isSelected = selectedCategory === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('category', value, { shouldValidate: true })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                        {label}
                      </p>
                      <p className={`text-xs ${isSelected ? 'text-primary-500' : 'text-gray-400'}`}>
                        {sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs font-medium">{errors.category.message}</p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── 대상 설정 ─────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">대상 설정</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {targetAll ? '모든 학생에게 설문이 공개됩니다' : '특정 학과/학년만 참여할 수 있습니다'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${targetAll ? 'text-primary-600' : 'text-gray-400'}`}>
                  전체 대상
                </span>
                <Controller
                  name="targetAll"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      checked={field.value}
                      onChange={(v) => {
                        field.onChange(v);
                        if (v) {
                          setValue('targetDepartments', []);
                          setValue('targetGrades', []);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Animated reveal when targetAll is OFF */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              targetAll ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
            }`}>
              <div className="space-y-4 pt-2 pl-0 border-l-2 border-primary-100 pl-4">
                {/* 학과 멀티셀렉트 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">학과 선택</label>
                  <Controller
                    name="targetDepartments"
                    control={control}
                    render={({ field }) => (
                      <DepartmentSelect value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>

                {/* 학년 체크박스 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">학년 선택</label>
                  <Controller
                    name="targetGrades"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {GRADES.map(({ value, label }) => {
                          const isChecked = field.value.includes(value);
                          return (
                            <label
                              key={value}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all ${
                                isChecked
                                  ? 'bg-primary-500 text-white border-primary-500'
                                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={() => {
                                  field.onChange(
                                    isChecked
                                      ? field.value.filter((g) => g !== value)
                                      : [...field.value, value]
                                  );
                                }}
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── 목표 응답 수 ──────────────────────────── */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">목표 응답 수</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => adjustMaxResponses(-10)}
                disabled={maxResponses <= 10}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                {...register('maxResponses', { valueAsNumber: true })}
                className="w-24 text-center border border-gray-300 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 outline-none focus:border-primary-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => adjustMaxResponses(10)}
                disabled={maxResponses >= 500}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
              <span className="text-sm text-gray-400">명 (10~500명)</span>
            </div>
            {errors.maxResponses && (
              <p className="text-red-500 text-xs font-medium">{errors.maxResponses.message}</p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── 마감일 & 예상 소요시간 ──────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 마감일 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">마감일 *</label>
              <div className="relative">
                <input
                  type="date"
                  min={getMinDeadline()}
                  {...register('deadline')}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors ${
                    errors.deadline
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                />
                {watch('deadline') && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 pointer-events-none bg-white px-2">
                    {formatDeadline(watch('deadline'))}
                  </div>
                )}
              </div>
              {errors.deadline && (
                <p className="text-red-500 text-xs font-medium">{errors.deadline.message}</p>
              )}
            </div>

            {/* 예상 소요시간 */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">예상 소요시간</label>
              <select
                {...register('estimatedMinutes', { valueAsNumber: true })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 transition-colors bg-white"
              >
                {ESTIMATED_MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m}분
                  </option>
                ))}
              </select>
            </div>
          </div>

        </CardBody>

        {/* ── 하단 "다음" 버튼 ─────────────────────────── */}
        <div className="px-6 sm:px-8 py-5 border-t border-gray-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg">
            다음 단계
          </Button>
        </div>
      </Card>
    </form>
  );
}
