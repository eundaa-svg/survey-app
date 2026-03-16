'use client';

import React, { useState } from 'react';
import { Card, CardBody, Badge, ProgressBar } from '@/components/ui';
import { useSurveyCreateStore } from '@/stores/surveyCreateStore';
import { useAuth } from '@/providers/AuthProvider';
import { Gift, Clock, Calendar, Users, Home, CheckCircle } from 'lucide-react';

export default function Step4Preview() {
  const { step1, step2, step3, setCurrentStep, reset } = useSurveyCreateStore();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const getDaysLeft = () => {
    if (!step1.deadline) return 0;
    const deadline = new Date(step1.deadline);
    const now = new Date();
    return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRewardLabel = () => {
    if (step3.rewardType === 'POINT') {
      return `${(step3.rewardAmount || 0).toLocaleString()}P 지급`;
    } else if (step3.rewardType === 'GIFTCARD') {
      return `${step3.giftcardName} 추첨 (${step3.giftcardWinners}명)`;
    } else {
      return step3.rewardDescription || '보상 있음';
    }
  };

  const getCategoryLabel = () => {
    const map: Record<string, string> = {
      ACADEMIC: '학술연구',
      RESEARCH: '연구',
      CAMPUS: '캠퍼스생활',
      OTHER: '기타',
    };
    return map[step1.category as string] || '기타';
  };

  const handlePublish = () => {
    setShowConfirm(true);
  };

  const confirmPublish = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      // 보상 정보 확인
      console.log('Step3 Reward Info:', {
        rewardType: step3.rewardType,
        rewardAmount: step3.rewardAmount,
        giftcardName: step3.giftcardName,
        giftcardWinners: step3.giftcardWinners,
        rewardDescription: step3.rewardDescription,
      });

      const rewardType = step3.rewardType || 'POINT';
      const newSurvey = {
        id: 'survey_' + Date.now(),
        title: step1.title || '제목 없는 설문',
        description: step1.description || '',
        category: step1.category || '기타',
        creator: {
          nickname: currentUser.nickname || user?.nickname || '익명',
          department: currentUser.department || user?.department || '',
        },
        rewardType,
        rewardAmount: rewardType === 'POINT' ? (step3.rewardAmount || 100) : 0,
        giftcardName: rewardType === 'GIFTCARD' ? (step3.giftcardName || '') : '',
        giftcardWinners: rewardType === 'GIFTCARD' ? (step3.giftcardWinners || 0) : 0,
        customReward: rewardType === 'CUSTOM' ? (step3.rewardDescription || '') : '',
        estimatedMinutes: step1.estimatedMinutes || 5,
        deadline: step1.deadline
          ? new Date(step1.deadline).toISOString()
          : new Date(Date.now() + 7 * 86400000).toISOString(),
        maxResponses: step1.maxResponses || 50,
        university: currentUser.university || '',
        currentResponses: 0,
        createdAt: new Date().toISOString(),
        status: 'ACTIVE',
        questions: step2.questions.map((q) => ({
          ...q,
          options: q.options?.map((o) => o.text) || [],
        })),
      };

      const existing = JSON.parse(localStorage.getItem('unisurvey_surveys') || '[]');
      existing.unshift(newSurvey);
      localStorage.setItem('unisurvey_surveys', JSON.stringify(existing));

      // 폼 데이터 초기화
      reset();
      localStorage.removeItem('survey-create-draft');
      localStorage.removeItem('survey_draft');
      localStorage.removeItem('survey_create_data');
      localStorage.removeItem('surveyCreateStore');

      alert('설문이 발행되었습니다! 🎉');
      window.location.href = '/';
    } catch (e) {
      console.error('발행 에러:', e);
      alert('발행에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 미리보기 모드 배너 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <p className="text-sm text-blue-700 font-medium">미리보기 모드 - 응답자가 보게 될 화면입니다</p>
      </div>

      {/* 설문 정보 카드 */}
      <Card variant="form" className="bg-gradient-to-br from-primary-50 to-primary-100">
        <CardBody className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{step1.title || '제목 없는 설문'}</h1>
              <Badge variant={'primary' as any} size="sm">
                {getCategoryLabel()}
              </Badge>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {step1.description || '설문 설명이 없습니다'}
          </p>
        </CardBody>
      </Card>

      {/* 정보 카드 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="form">
          <CardBody className="flex flex-col items-center justify-center space-y-2 py-4">
            <Gift size={24} className="text-primary-500" />
            <p className="text-xs text-gray-600">보상</p>
            <p className="text-lg font-bold text-gray-900 text-center">{getRewardLabel()}</p>
          </CardBody>
        </Card>

        <Card variant="form">
          <CardBody className="flex flex-col items-center justify-center space-y-2 py-4">
            <Clock size={24} className="text-info-500" />
            <p className="text-xs text-gray-600">예상 소요시간</p>
            <p className="text-lg font-bold text-gray-900">약 {step1.estimatedMinutes || 5}분</p>
          </CardBody>
        </Card>

        <Card variant="form">
          <CardBody className="flex flex-col items-center justify-center space-y-2 py-4">
            <Calendar size={24} className="text-warning-500" />
            <p className="text-xs text-gray-600">마감일</p>
            <p className="text-lg font-bold text-gray-900">
              {step1.deadline ? `D-${getDaysLeft()}` : '미설정'}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* 응답 현황 */}
      <Card variant="form">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
              {(step1.title || '설').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">UniSurvey</p>
              <p className="text-sm text-gray-600">설문 제작자</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">참여 현황</p>
              <p className="text-sm font-semibold text-gray-900">0/{step1.maxResponses || 50}명</p>
            </div>
            <ProgressBar progress={0} variant="primary" size="sm" />
          </div>
        </CardBody>
      </Card>

      {/* 구분선 */}
      <div className="border-t-2 border-gray-200" />

      {/* 질문 미리보기 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">설문 질문</h2>

        {step2.questions.length === 0 ? (
          <Card variant="form">
            <CardBody className="py-8 text-center">
              <p className="text-gray-500">아직 질문이 없습니다</p>
            </CardBody>
          </Card>
        ) : (
          step2.questions.map((question, index) => (
            <Card key={question.id} variant="form">
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-primary-600">Q{index + 1}</p>
                    <h3 className="text-base font-semibold text-gray-900">
                      {question.title || '제목 없는 질문'}
                      {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {question.type === 'SINGLE_CHOICE'
                      ? '단일선택'
                      : question.type === 'MULTIPLE_CHOICE'
                        ? '복수선택'
                        : question.type === 'SHORT_TEXT'
                          ? '단답형'
                          : question.type === 'LONG_TEXT'
                            ? '장문형'
                            : question.type === 'SCALE'
                              ? '척도'
                              : '매트릭스'}
                  </span>
                </div>

                {/* 질문 타입별 미리보기 */}
                <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
                  {question.type === 'SINGLE_CHOICE' && (
                    <div className="space-y-2">
                      {question.options && question.options.length > 0 ? (
                        question.options.map((opt, i) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            <span className="text-gray-700">{opt.text || `선택지 ${i + 1}`}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">선택지가 없습니다</span>
                      )}
                    </div>
                  )}

                  {question.type === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-2">
                      {question.options && question.options.length > 0 ? (
                        question.options.map((opt, i) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border-2 border-gray-300" />
                            <span className="text-gray-700">{opt.text || `선택지 ${i + 1}`}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">선택지가 없습니다</span>
                      )}
                    </div>
                  )}

                  {question.type === 'SHORT_TEXT' && (
                    <input
                      type="text"
                      placeholder="단답형 응답"
                      disabled
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-gray-400"
                    />
                  )}

                  {question.type === 'LONG_TEXT' && (
                    <textarea
                      placeholder="장문형 응답"
                      disabled
                      rows={3}
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-gray-400 resize-none"
                    />
                  )}

                  {question.type === 'SCALE' && (
                    <div className="flex gap-2 justify-between">
                      {Array.from({ length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 }).map(
                        (_, i) => (
                          <button
                            key={i}
                            disabled
                            className="flex-1 py-2 rounded border border-gray-300 bg-white text-gray-400 text-sm font-medium"
                          >
                            {(question.scaleMin || 1) + i}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setCurrentStep(3)}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
        >
          이전
        </button>
        <button
          onClick={() => {
            // 임시저장 시뮬레이션
            alert('임시저장되었습니다');
          }}
          className="flex-1 px-6 py-3 border border-primary-500 text-primary-600 font-medium rounded-full hover:bg-primary-50 transition-colors"
        >
          임시저장
        </button>
        <button
          onClick={handlePublish}
          className="flex-1 px-6 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
        >
          발행하기
        </button>
      </div>

      {/* 발행 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">설문 발행하기</h3>
                <p className="text-gray-600">
                  설문을 발행하면 모든 사용자가 응답할 수 있습니다. 진행하시겠습니까?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex-1 px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
                >
                  발행하기
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
