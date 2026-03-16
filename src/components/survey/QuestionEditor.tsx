import React from 'react';
import { Card } from '@/components/ui';
import { X, Plus } from 'lucide-react';

interface Question {
  id: string;
  type: 'text' | 'multiple' | 'checkbox' | 'scale' | 'matrix';
  title: string;
  options?: string[];
  required?: boolean;
}

interface QuestionEditorProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}

const QuestionEditor = ({ question, onUpdate, onDelete }: QuestionEditorProps) => {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdate({ ...question, title: e.target.value })}
              className="w-full text-lg font-medium focus:outline-none bg-transparent"
              placeholder="질문을 입력하세요"
            />
          </div>
          <button onClick={onDelete} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <select
          value={question.type}
          onChange={(e) => onUpdate({ ...question, type: e.target.value as any })}
          className="mb-4 px-3 py-2 rounded-lg border border-gray-300"
        >
          <option value="text">단문형</option>
          <option value="multiple">객관식</option>
          <option value="checkbox">체크박스</option>
          <option value="scale">등급</option>
        </select>

        {(question.type === 'multiple' || question.type === 'checkbox') && (
          <div className="space-y-2">
            {question.options?.map((option, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const updated = [...(question.options || [])];
                    updated[idx] = e.target.value;
                    onUpdate({ ...question, options: updated });
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                  placeholder="선택지"
                />
                <button
                  onClick={() => {
                    const updated = question.options?.filter((_, i) => i !== idx) || [];
                    onUpdate({ ...question, options: updated });
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(question.options || []), ''];
                onUpdate({ ...question, options: updated });
              }}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-600 mt-2"
            >
              <Plus size={16} />
              선택지 추가
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ ...question, required: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700">필수 문항</span>
        </label>
      </div>
    </Card>
  );
};

export default QuestionEditor;
