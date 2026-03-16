'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { Plus, ClipboardList } from 'lucide-react';
import { useSurveyCreateStore, createDefaultQuestion } from '@/stores/surveyCreateStore';
import QuestionCard from './QuestionCard';
import Button from '@/components/ui/Button';

// ── Add between button ────────────────────────────────────────────────────────
function AddBetweenButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative flex items-center justify-center h-8 group">
      {/* connector line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-200 group-hover:bg-primary-200 transition-colors" />
      <button
        type="button"
        onClick={onClick}
        className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-gray-300 group-hover:border-primary-400 group-hover:bg-primary-50 text-gray-400 group-hover:text-primary-500 flex items-center justify-center transition-all shadow-sm"
        title="이 위치에 질문 추가"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center py-16 gap-5">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
        <ClipboardList size={28} className="text-primary-400" />
      </div>
      <div className="text-center">
        <p className="text-gray-700 font-semibold text-base">첫 번째 질문을 추가하세요</p>
        <p className="text-gray-400 text-sm mt-1">질문을 추가해 설문을 구성할 수 있어요</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
      >
        <Plus size={16} />
        질문 추가
      </button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Step2Questions() {
  const {
    step2: { questions },
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
    setCurrentStep,
  } = useSurveyCreateStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIdx = questions.findIndex((q) => q.id === active.id);
        const newIdx = questions.findIndex((q) => q.id === over.id);
        reorderQuestions(arrayMove(questions, oldIdx, newIdx));
      }
    },
    [questions, reorderQuestions]
  );

  const handleAddAt = useCallback(
    (afterIndex?: number) => {
      const q = createDefaultQuestion();
      addQuestion(q, afterIndex);
      setFocusedId(q.id);
    },
    [addQuestion]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const idx = questions.findIndex((q) => q.id === id);
      deleteQuestion(id);
      // focus adjacent question after delete
      const remaining = questions.filter((q) => q.id !== id);
      if (remaining.length > 0) {
        const nextIdx = Math.min(idx, remaining.length - 1);
        setFocusedId(remaining[nextIdx].id);
      } else {
        setFocusedId(null);
      }
    },
    [questions, deleteQuestion]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      duplicateQuestion(id);
      // find the duplicated id (inserted right after)
      // we do this in the next tick after store update
      setTimeout(() => {
        const updated = useSurveyCreateStore.getState().step2.questions;
        const idx = updated.findIndex((q) => q.id === id);
        if (idx !== -1 && updated[idx + 1]) setFocusedId(updated[idx + 1].id);
      }, 0);
    },
    [duplicateQuestion]
  );

  const activeQuestion = questions.find((q) => q.id === activeId);

  return (
    <div className="space-y-0">
      {questions.length === 0 ? (
        <EmptyState onAdd={() => handleAddAt()} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0">
              {/* Top add button */}
              <AddBetweenButton onClick={() => handleAddAt(-1)} />

              {questions.map((question, index) => (
                <React.Fragment key={question.id}>
                  <QuestionCard
                    question={question}
                    index={index}
                    isActive={focusedId === question.id}
                    onFocus={() => setFocusedId(question.id)}
                    onUpdate={(updates) => updateQuestion(question.id, updates)}
                    onDelete={() => handleDelete(question.id)}
                    onDuplicate={() => handleDuplicate(question.id)}
                  />
                  <AddBetweenButton onClick={() => handleAddAt(index)} />
                </React.Fragment>
              ))}
            </div>
          </SortableContext>

          {/* Drag overlay: ghost card while dragging */}
          <DragOverlay>
            {activeQuestion ? (
              <div className="bg-white rounded-xl shadow-2xl ring-2 ring-primary-300 opacity-95 pl-9 pr-6 pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 text-xs font-semibold text-gray-400">
                    Q{questions.findIndex((q) => q.id === activeQuestion.id) + 1}
                  </span>
                  <p className="flex-1 min-w-0 text-[15px] font-medium text-gray-900 truncate">
                    {activeQuestion.title || '(제목 없음)'}
                  </p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(1)}
        >
          이전
        </Button>
        <Button
          variant="primary"
          disabled={questions.length === 0}
          onClick={() => {
            if (questions.length > 0) setCurrentStep(3);
          }}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
