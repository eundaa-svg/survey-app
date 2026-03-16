'use client';

import React, { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Circle, CheckSquare } from 'lucide-react';
import type { QuestionOption } from '@/stores/surveyCreateStore';

function genId() {
  return Math.random().toString(36).slice(2, 11);
}

// ── Sortable option row ───────────────────────────────────────────────────────
function SortableOption({
  option,
  isRadio,
  onChange,
  onDelete,
  canDelete,
}: {
  option: QuestionOption;
  isRadio: boolean;
  onChange: (text: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: option.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group py-0.5">
      {/* Drag handle */}
      <button
        type="button"
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </button>

      {/* Type icon */}
      <div className="flex-shrink-0 text-gray-400">
        {isRadio ? <Circle size={15} /> : <CheckSquare size={15} />}
      </div>

      {/* Text input */}
      <input
        type="text"
        value={option.text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="선택지"
        className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-primary-400 text-sm text-gray-700 bg-transparent outline-none py-0.5 transition-colors placeholder:text-gray-400"
      />

      {/* Delete */}
      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface ChoiceEditorProps {
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  options: QuestionOption[];
  onUpdate: (options: QuestionOption[]) => void;
}

export default function ChoiceEditor({ type, options, onUpdate }: ChoiceEditorProps) {
  const isRadio = type === 'SINGLE_CHOICE';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIdx = options.findIndex((o) => o.id === active.id);
        const newIdx = options.findIndex((o) => o.id === over.id);
        onUpdate(arrayMove(options, oldIdx, newIdx));
      }
    },
    [options, onUpdate]
  );

  const addOption = () =>
    onUpdate([...options, { id: genId(), text: `선택지 ${options.length + 1}` }]);

  const updateOption = useCallback(
    (id: string, text: string) =>
      onUpdate(options.map((o) => (o.id === id ? { ...o, text } : o))),
    [options, onUpdate]
  );

  const deleteOption = useCallback(
    (id: string) => onUpdate(options.filter((o) => o.id !== id)),
    [options, onUpdate]
  );

  return (
    <div className="space-y-1">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={options.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          {options.map((opt) => (
            <SortableOption
              key={opt.id}
              option={opt}
              isRadio={isRadio}
              onChange={(text) => updateOption(opt.id, text)}
              onDelete={() => deleteOption(opt.id)}
              canDelete={options.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add option */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-shrink-0 text-gray-300">
          {isRadio ? <Circle size={15} /> : <CheckSquare size={15} />}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="text-sm text-primary-500 hover:text-primary-700 font-medium transition-colors"
        >
          선택지 추가
        </button>
      </div>
    </div>
  );
}
