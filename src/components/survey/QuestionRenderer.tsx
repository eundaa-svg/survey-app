import React from 'react';
import Input from '@/components/ui/Input';

interface Question {
  id: string;
  type: 'text' | 'multiple' | 'checkbox' | 'scale' | 'matrix';
  title: string;
  options?: string[];
  required?: boolean;
  description?: string;
}

interface QuestionRendererProps {
  question: Question;
  value?: any;
  onChange?: (value: any) => void;
}

const QuestionRenderer = ({ question, value, onChange }: QuestionRendererProps) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            placeholder="응답을 입력하세요"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
      case 'multiple':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="w-4 h-4 text-primary-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  value={option}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...(value || []), option]
                      : (value || []).filter((v: string) => v !== option);
                    onChange?.(updated);
                  }}
                  className="w-4 h-4 text-primary-500 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'scale':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onChange?.(num)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  value === num
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-lg font-medium text-gray-900 mb-2">
        {question.title}
        {question.required && <span className="text-danger ml-1">*</span>}
      </label>
      {question.description && (
        <p className="text-gray-600 text-sm mb-4">{question.description}</p>
      )}
      {renderInput()}
    </div>
  );
};

export default QuestionRenderer;
