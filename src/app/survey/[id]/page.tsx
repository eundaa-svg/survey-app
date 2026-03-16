'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import Confetti from '@/components/ui/Confetti';
import { useToast } from '@/stores/toastStore';

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  isRequired: boolean;
  options?: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: {
    nickname: string;
    department: string;
  };
  currentResponses: number;
  maxResponses: number;
  estimatedMinutes: number;
  deadline: string;
  rewardType: string;
  rewardAmount?: number;
  rewardDescription?: string;
  status: string;
  questions: Question[];
}

export default function SurveyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { success, error: showError } = useToast();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [surveyId]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/surveys/${surveyId}`);
      if (!response.ok) throw new Error('설문 조회 실패');
      const data = await response.json();
      setSurvey(data);
    } catch (err) {
      showError('설문을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleToggleMultiple = (questionId: string, optionText: string) => {
    const current = answers[questionId] || [];
    if (current.includes(optionText)) {
      handleAnswerChange(questionId, current.filter((v: string) => v !== optionText));
    } else {
      handleAnswerChange(questionId, [...current, optionText]);
    }
  };

  const handleSubmit = async () => {
    if (!survey) return;

    try {
      setSubmitting(true);

      const responseAnswers = survey.questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] || '',
        selectedOptions: Array.isArray(answers[q.id]) ? answers[q.id] : null,
      }));

      const response = await fetch(`/api/surveys/${surveyId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: responseAnswers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '응답 제출 실패');
      }

      setShowConfetti(true);
      setSubmitted(true);
      success('설문 응답이 완료되었습니다! 포인트를 획득했습니다.');

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      showError(err.message || '응답 제출 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
        <p className="text-gray-500 mt-4">로딩 중...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">설문을 찾을 수 없습니다</h2>
          <Button variant="primary" onClick={() => router.push('/')} className="mt-4">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(survey.deadline) < new Date();
  const isInactive = survey.status !== 'ACTIVE';

  if (isExpired || isInactive) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ChevronLeft size={20} />
          뒤로가기
        </button>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">
            {isExpired ? '마감된 설문입니다' : '더 이상 참여할 수 없는 설문입니다'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isExpired ? '설문 마감일이 지났습니다' : '설문의 상태가 변경되었습니다'}
          </p>
          <Button variant="primary" onClick={() => router.push('/')} className="mt-4">
            다른 설문 보기
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        {showConfetti && <Confetti />}
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardBody className="text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <span className="text-3xl">✨</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">응답이 완료되었습니다!</h2>
              <p className="text-gray-600">
                {survey.rewardType === 'POINT'
                  ? `${survey.rewardAmount || 0}P의 포인트를 획득했습니다`
                  : '소중한 응답 감사합니다!'}
              </p>
              <p className="text-sm text-gray-500">잠시 후 홈으로 이동합니다...</p>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ChevronLeft size={20} />
        뒤로가기
      </button>

      {/* 설문 헤더 */}
      <Card className="mb-6">
        <CardBody className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
              <p className="text-gray-600 mt-2">{survey.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">예상 시간</p>
              <p className="text-lg font-semibold text-gray-900">{survey.estimatedMinutes}분</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">응답 현황</p>
              <p className="text-lg font-semibold text-gray-900">
                {survey.currentResponses}/{survey.maxResponses}명
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">포상</p>
              <p className="text-lg font-semibold text-primary-600">
                {survey.rewardType === 'POINT'
                  ? `${survey.rewardAmount || 0}P`
                  : survey.rewardDescription || '보상 있음'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">작성자</p>
              <p className="text-lg font-semibold text-gray-900">{survey.creator.nickname}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 질문 영역 */}
      <div className="space-y-6">
        {survey.questions.map((question, idx) => (
          <Card key={question.id}>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Q{idx + 1}. {question.title}
                </h3>
                {question.description && (
                  <p className="text-sm text-gray-600 mt-1">{question.description}</p>
                )}
              </div>

              {/* 단일 선택 */}
              {question.type === 'SINGLE_CHOICE' && (
                <div className="space-y-2">
                  {(() => {
                    try {
                      const options = question.options ? JSON.parse(question.options) : [];
                      return options.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name={question.id}
                            value={opt}
                            checked={answers[question.id] === opt}
                            onChange={() => handleAnswerChange(question.id, opt)}
                            className="w-4 h-4 text-primary-600 cursor-pointer"
                          />
                          <span className="flex-1 text-gray-700">{opt}</span>
                        </label>
                      ));
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              )}

              {/* 복수 선택 */}
              {question.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {(() => {
                    try {
                      const options = question.options ? JSON.parse(question.options) : [];
                      return options.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={(answers[question.id] || []).includes(opt)}
                            onChange={() => handleToggleMultiple(question.id, opt)}
                            className="w-4 h-4 text-primary-600 rounded cursor-pointer"
                          />
                          <span className="flex-1 text-gray-700">{opt}</span>
                        </label>
                      ));
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              )}

              {/* 척도 */}
              {question.type === 'SCALE' && (
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswerChange(question.id, num.toString())}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                        answers[question.id]?.toString() === num.toString()
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {/* 단답형 */}
              {question.type === 'SHORT_TEXT' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="답을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              )}

              {/* 장문형 */}
              {question.type === 'LONG_TEXT' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="답을 입력하세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 제출 버튼 */}
      <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
          className="px-8 py-3"
        >
          취소
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          isLoading={submitting}
          disabled={submitting}
          className="px-8 py-3"
        >
          {submitting ? '제출 중...' : '응답 제출'}
        </Button>
      </div>
    </div>
  );
}
