'use client';

import React, { useMemo, useEffect } from 'react';
import StepIndicator from './_components/StepIndicator';
import Step1BasicInfo from './_components/Step1BasicInfo';
import Step2Questions from './_components/Step2Questions';
import Step3Reward from './_components/Step3Reward';
import Step4Preview from './_components/Step4Preview';
import { useSurveyCreateStore } from '@/stores/surveyCreateStore';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';

export default function SurveyCreatePage() {
  const { currentStep, step1, step2, step3, reset } = useSurveyCreateStore();

  useEffect(() => {
    reset();
    localStorage.removeItem('survey-create-draft');
    localStorage.removeItem('survey_draft');
    localStorage.removeItem('survey_create_data');
    localStorage.removeItem('surveyFormData');
    localStorage.removeItem('survey_form');
  }, []);

  // Check if any data has been entered
  const isDirty = useMemo(
    () =>
      step1.title.trim() !== '' ||
      step1.description.trim() !== '' ||
      step2.questions.length > 0 ||
      step3.rewardType !== 'POINT',
    [step1, step2, step3]
  );

  // Warn user before leaving if there's unsaved data
  useBeforeUnload(isDirty);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 스텝 인디케이터 */}
      <StepIndicator currentStep={currentStep} />

      {/* 스텝별 콘텐츠 */}
      {currentStep === 1 && <Step1BasicInfo />}
      {currentStep === 2 && <Step2Questions />}
      {currentStep === 3 && <Step3Reward />}
      {currentStep === 4 && <Step4Preview />}
    </div>
  );
}
