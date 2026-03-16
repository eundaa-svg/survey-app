'use client';

import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, label: '기본정보' },
  { number: 2, label: '질문작성' },
  { number: 3, label: '보상설정' },
  { number: 4, label: '미리보기' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <React.Fragment key={step.number}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-primary-500 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-primary-500 text-primary-600'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isCompleted || isCurrent ? 'text-primary-600' : 'text-gray-400'
                } ${isCurrent ? 'font-bold' : ''}`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-1 mb-5 transition-all ${
                  currentStep > step.number ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
