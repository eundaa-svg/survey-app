'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronDown,
  Circle,
  CheckSquare,
  Minus,
  AlignLeft,
  BarChart2,
  Grid,
} from 'lucide-react';
import type { Step2Question, QuestionType } from '@/stores/surveyCreateStore';
import ChoiceEditor from './editors/ChoiceEditor';
import ScaleEditor from './editors/ScaleEditor';
import MatrixEditor from './editors/MatrixEditor';
import BottomSheet from '@/components/ui/BottomSheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ── Question type config ──────────────────────────────────────────────────────
const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: 'SINGLE_CHOICE', label: '단일 선택', icon: Circle },
  { value: 'MULTIPLE_CHOICE', label: '복수 선택', icon: CheckSquare },
  { value: 'SHORT_TEXT', label: '단답형', icon: Minus },
  { value: 'LONG_TEXT', label: '장문형', icon: AlignLeft },
  { value: 'SCALE', label: '척도', icon: BarChart2 },
  { value: 'MATRIX', label: '매트릭스', icon: Grid },
];

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── Type Dropdown ─────────────────────────────────────────────────────────────
function TypeDropdown({
  currentType,
  onSelect,
}: {
  currentType: QuestionType;
  onSelect: (t: QuestionType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = QUESTION_TYPES.find((t) => t.value === currentType)!;
  const Icon = current.icon;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        <Icon size={14} />
        {current.label}
        <ChevronDown
          size={13}
          className={`transition-transform text-gray-400 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 w-44 py-1 overflow-hidden">
          {QUESTION_TYPES.map(({ value, label, icon: ItemIcon }) => (
            <button
              key={value}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                currentType === value
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ItemIcon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface QuestionCardProps {
  question: Step2Question;
  index: number;
  isActive: boolean;
  onFocus: () => void;
  onUpdate: (updates: Partial<Step2Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function QuestionCard({
  question,
  index,
  isActive,
  onFocus,
  onUpdate,
  onDelete,
  onDuplicate,
}: QuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isTypeSheetOpen, setIsTypeSheetOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTypeChange = (type: QuestionType) => {
    const updates: Partial<Step2Question> = { type };
    if (
      (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') &&
      !question.options?.length
    ) {
      updates.options = [{ id: genId(), text: '선택지 1' }];
    }
    if (type === 'SCALE') {
      updates.scaleMin = question.scaleMin ?? 1;
      updates.scaleMax = question.scaleMax ?? 5;
      updates.scaleLabelMin = question.scaleLabelMin ?? '';
      updates.scaleLabelMax = question.scaleLabelMax ?? '';
    }
    if (type === 'MATRIX') {
      updates.matrixRows = question.matrixRows?.length
        ? question.matrixRows
        : [{ id: genId(), text: '항목 1' }];
      updates.matrixColumns = question.matrixColumns?.length
        ? question.matrixColumns
        : [1, 2, 3, 4, 5].map((n) => ({ id: genId(), text: String(n) }));
    }
    onUpdate(updates);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl transition-all duration-200 ${
        isDragging
          ? 'shadow-2xl scale-[1.02] z-50 ring-2 ring-primary-200'
          : isActive
          ? 'shadow-md'
          : 'shadow-sm hover:shadow-md'
      }`}
      onClick={onFocus}
    >
      {/* Active indicator — left purple bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-200 ${
          isActive ? 'bg-primary-500' : 'bg-transparent'
        }`}
      />

      {/* Drag handle */}
      <button
        type="button"
        className="absolute top-5 left-3 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={18} />
      </button>

      {/* Card content */}
      <div className="pl-9 pr-6 pt-5 pb-4">
        {/* Question number badge */}
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-0.5 text-xs font-semibold text-gray-400">
            Q{index + 1}
          </span>

          {/* Title input */}
          <input
            type="text"
            value={question.title}
            onChange={(e) => {
              e.stopPropagation();
              onUpdate({ title: e.target.value });
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="질문을 입력하세요"
            className="flex-1 min-w-0 text-[15px] font-medium text-gray-900 bg-transparent border-0 border-b border-gray-200 pb-1 outline-none focus:border-primary-400 transition-colors placeholder:text-gray-400 placeholder:font-normal"
          />

          {/* Type dropdown / Bottom sheet */}
          {isMobile ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTypeSheetOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {QUESTION_TYPES.find((t) => t.value === question.type)?.icon && (
                  React.createElement(QUESTION_TYPES.find((t) => t.value === question.type)!.icon, { size: 14 })
                )}
                {QUESTION_TYPES.find((t) => t.value === question.type)?.label}
                <ChevronDown size={13} className="text-gray-400" />
              </button>

              <BottomSheet isOpen={isTypeSheetOpen} onClose={() => setIsTypeSheetOpen(false)} title="질문 유형 선택">
                <div className="space-y-1">
                  {QUESTION_TYPES.map(({ value, label, icon: ItemIcon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        handleTypeChange(value);
                        setIsTypeSheetOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                        question.type === value
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ItemIcon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </BottomSheet>
            </>
          ) : (
            <TypeDropdown currentType={question.type} onSelect={handleTypeChange} />
          )}
        </div>

        {/* Type-specific editor area */}
        <div className="mt-5 ml-5" onClick={(e) => e.stopPropagation()}>
          {(question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && (
            <ChoiceEditor
              type={question.type}
              options={question.options ?? []}
              onUpdate={(options) => onUpdate({ options })}
            />
          )}

          {question.type === 'SHORT_TEXT' && (
            <input
              type="text"
              disabled
              placeholder="단답형 텍스트"
              className="w-full max-w-xs border-b border-gray-300 pb-1 text-sm text-gray-400 bg-transparent outline-none cursor-not-allowed"
            />
          )}

          {question.type === 'LONG_TEXT' && (
            <textarea
              disabled
              placeholder="장문형 텍스트"
              rows={2}
              className="w-full border-b border-gray-300 pb-1 text-sm text-gray-400 bg-transparent outline-none resize-none cursor-not-allowed"
            />
          )}

          {question.type === 'SCALE' && (
            <ScaleEditor
              scaleMin={question.scaleMin ?? 1}
              scaleMax={question.scaleMax ?? 5}
              scaleLabelMin={question.scaleLabelMin ?? ''}
              scaleLabelMax={question.scaleLabelMax ?? ''}
              onUpdate={(updates) => onUpdate(updates)}
            />
          )}

          {question.type === 'MATRIX' && (
            <MatrixEditor
              rows={question.matrixRows ?? []}
              columns={question.matrixColumns ?? []}
              onUpdate={(updates) => onUpdate(updates)}
            />
          )}
        </div>

        {/* Bottom toolbar */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-1">
          <button
            type="button"
            title="복제"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Copy size={17} />
          </button>

          <button
            type="button"
            title="삭제"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={17} />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm text-gray-600 select-none">필수</span>
            <Toggle
              checked={question.isRequired}
              onChange={(v) => onUpdate({ isRequired: v })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
