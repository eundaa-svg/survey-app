'use client';

import React from 'react';
import { Coins, Gift, Sparkles, Info, Users, ChevronRight } from 'lucide-react';
import { useSurveyCreateStore, type RewardType } from '@/stores/surveyCreateStore';
import Button from '@/components/ui/Button';

// ── Reward type config ────────────────────────────────────────────────────────
const REWARD_TYPES: {
  value: RewardType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    value: 'POINT',
    label: '포인트 지급',
    sublabel: '응답자 전원에게 포인트 지급',
    icon: Coins,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
  },
  {
    value: 'GIFTCARD',
    label: '기프티콘 / 상품 추첨',
    sublabel: '당첨자를 선발해 상품 지급',
    icon: Gift,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-400',
  },
  {
    value: 'CUSTOM',
    label: '커스텀 보상',
    sublabel: '직접 보상 내용을 기술',
    icon: Sparkles,
    color: 'text-primary-500',
    bg: 'bg-primary-50',
    border: 'border-primary-400',
  },
];

// ── Number input with +/- buttons ─────────────────────────────────────────────
function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 99999,
  step = 1,
  label,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  unit?: string;
}) {
  const adjust = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={value <= min}
          className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="w-24 text-center border border-gray-300 rounded-lg px-2 py-2 text-sm font-semibold text-gray-800 outline-none focus:border-primary-400 transition-colors"
        />
        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={value >= max}
          className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          +
        </button>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard() {
  const { step1, step3 } = useSurveyCreateStore();
  const { rewardType, rewardAmount, giftcardName, giftcardWinners, rewardDescription } = step3;
  const maxResponses = step1.maxResponses;

  let summaryText = '';
  let detail = '';

  if (rewardType === 'POINT') {
    const total = rewardAmount * maxResponses;
    summaryText = `포인트 ${rewardAmount.toLocaleString()}P`;
    detail = `${rewardAmount.toLocaleString()}P × ${maxResponses}명 = 총 ${total.toLocaleString()}P`;
  } else if (rewardType === 'GIFTCARD') {
    summaryText = giftcardName || '(상품명 미입력)';
    detail = `응답자 중 ${giftcardWinners}명에게 ${giftcardName || '상품'} 추첨 지급`;
  } else {
    summaryText = '커스텀 보상';
    detail = rewardDescription || '보상 내용을 입력해주세요';
  }

  const typeConfig = REWARD_TYPES.find((t) => t.value === rewardType)!;
  const Icon = typeConfig.icon;

  return (
    <div className={`rounded-xl border-2 ${typeConfig.border} ${typeConfig.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon size={20} className={typeConfig.color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">보상 요약</p>
          <p className="text-base font-bold text-gray-900">{summaryText}</p>
          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{detail}</p>
        </div>
      </div>
    </div>
  );
}

// ── Point form ────────────────────────────────────────────────────────────────
function PointForm() {
  const { step1, step3, setStep3 } = useSurveyCreateStore();
  const { rewardAmount } = step3;
  const maxResponses = step1.maxResponses;
  const total = rewardAmount * maxResponses;

  return (
    <div className="space-y-5">
      <NumberStepper
        label="1인당 지급 포인트"
        value={rewardAmount}
        onChange={(v) => setStep3({ rewardAmount: v })}
        min={50}
        max={10000}
        step={50}
        unit="P"
      />

      {/* Auto budget calculation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 space-y-1">
        <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
          <ChevronRight size={12} />
          총 예산 자동 계산
        </p>
        <p className="text-sm text-amber-900 font-medium">
          {rewardAmount.toLocaleString()}P × {maxResponses}명 ={' '}
          <span className="text-base font-bold">{total.toLocaleString()}P</span>
        </p>
        <p className="text-xs text-amber-600 leading-relaxed flex items-start gap-1 pt-0.5">
          <Info size={11} className="flex-shrink-0 mt-0.5" />
          발행 시 총 예산만큼 포인트가 차감됩니다
        </p>
      </div>

      <p className="text-xs text-gray-400">
        * 목표 응답 수는 Step 1에서 설정한 값({maxResponses}명)을 기준으로 합니다.
      </p>
    </div>
  );
}

// ── Giftcard form ─────────────────────────────────────────────────────────────
function GiftcardForm() {
  const { step3, setStep3 } = useSurveyCreateStore();
  const { giftcardName, giftcardWinners, giftcardDescription } = step3;

  return (
    <div className="space-y-5">
      <Field label="상품명">
        <input
          type="text"
          value={giftcardName}
          onChange={(e) => setStep3({ giftcardName: e.target.value })}
          placeholder="예: 스타벅스 아메리카노 Tall"
          maxLength={60}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400 transition-colors placeholder:text-gray-400"
        />
      </Field>

      <NumberStepper
        label="당첨자 수"
        value={giftcardWinners}
        onChange={(v) => setStep3({ giftcardWinners: v })}
        min={1}
        max={999}
        step={1}
        unit="명"
      />

      <Field label="상품 설명 (선택)">
        <textarea
          value={giftcardDescription}
          onChange={(e) => setStep3({ giftcardDescription: e.target.value })}
          placeholder="상품에 대한 추가 설명을 입력하세요"
          rows={3}
          maxLength={300}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400 resize-none transition-colors placeholder:text-gray-400"
        />
      </Field>

      {/* Preview */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
        <Users size={15} className="text-rose-400 flex-shrink-0" />
        <p className="text-sm text-rose-800 font-medium">
          응답자 중{' '}
          <span className="font-bold">{giftcardWinners}명</span>에게{' '}
          <span className="font-bold">{giftcardName || '(상품명)'}</span> 추첨 지급
        </p>
      </div>
    </div>
  );
}

// ── Custom form ───────────────────────────────────────────────────────────────
function CustomForm() {
  const { step3, setStep3 } = useSurveyCreateStore();
  const { rewardDescription } = step3;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">보상 내용</label>
      <textarea
        value={rewardDescription}
        onChange={(e) => setStep3({ rewardDescription: e.target.value })}
        placeholder="실험 참여 크레딧 부여, 수업 가산점 등"
        rows={5}
        maxLength={500}
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400 resize-none transition-colors placeholder:text-gray-400"
      />
      <div className="flex justify-end">
        <span className="text-xs text-gray-400">{rewardDescription.length}/500</span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Step3Reward() {
  const { step3, setStep3, setCurrentStep } = useSurveyCreateStore();
  const { rewardType } = step3;

  const canGoNext = () => {
    if (rewardType === 'POINT') return step3.rewardAmount > 0;
    if (rewardType === 'GIFTCARD') return step3.giftcardName.trim().length > 0;
    if (rewardType === 'CUSTOM') return step3.rewardDescription.trim().length > 0;
    return false;
  };

  return (
    <div className="space-y-5">
      {/* Summary card — live updates */}
      <SummaryCard />

      {/* Main card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Color bar */}
        <div className="h-1 bg-primary-500" />

        <div className="p-6 space-y-6">
          {/* Reward type selector */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">보상 유형 선택</p>
            <div className="grid grid-cols-1 gap-3">
              {REWARD_TYPES.map(({ value, label, sublabel, icon: Icon, color, bg, border }) => {
                const selected = rewardType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStep3({ rewardType: value })}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? `${border} ${bg}`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Icon circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected ? 'bg-white shadow-sm' : 'bg-gray-100'
                      }`}
                    >
                      <Icon size={18} className={selected ? color : 'text-gray-400'} />
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          selected ? 'text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
                    </div>

                    {/* Radio dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selected ? `${border} bg-white` : 'border-gray-300'
                      }`}
                    >
                      {selected && (
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            value === 'POINT'
                              ? 'bg-amber-400'
                              : value === 'GIFTCARD'
                              ? 'bg-rose-400'
                              : 'bg-primary-500'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Type-specific form */}
          <div>
            {rewardType === 'POINT' && <PointForm />}
            {rewardType === 'GIFTCARD' && <GiftcardForm />}
            {rewardType === 'CUSTOM' && <CustomForm />}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="secondary" onClick={() => setCurrentStep(2)}>
          이전
        </Button>
        <Button
          variant="primary"
          disabled={!canGoNext()}
          onClick={() => {
            if (canGoNext()) setCurrentStep(4);
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
