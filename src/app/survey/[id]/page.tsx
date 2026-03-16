'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import { ChevronLeft, AlertCircle, Gift, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/stores/toastStore';
import { Survey, Question } from '@/utils/seedData';

export default function SurveyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const surveyId = params.id as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSurvey();
  }, [surveyId]);

  const fetchSurvey = () => {
    try {
      setLoading(true);
      const surveysJson = localStorage.getItem('surveys');
      if (!surveysJson) {
        showError('설문을 찾을 수 없습니다');
        setLoading(false);
        return;
      }

      const surveys = JSON.parse(surveysJson) as Survey[];
      const found = surveys.find((s) => s.id === surveyId);

      if (!found) {
        showError('설문을 찾을 수 없습니다');
      } else {
        setSurvey(found);
      }
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
    if (!survey || !user) return;

    try {
      setSubmitting(true);

      // 응답 데이터 구성
      const responseData = {
        id: `response_${Date.now()}`,
        surveyId: survey.id,
        userId: user.id,
        nickname: user.nickname,
        responses: survey.questions.map((q) => ({
          questionId: q.id,
          answer: answers[q.id] || '',
        })),
        createdAt: new Date().toISOString(),
      };

      // localStorage에 응답 저장
      let responses = [];
      const responsesJson = localStorage.getItem('responses');
      if (responsesJson) {
        responses = JSON.parse(responsesJson);
      }
      responses.push(responseData);
      localStorage.setItem('responses', JSON.stringify(responses));

      // 설문의 currentResponses 증가
      const surveysJson = localStorage.getItem('surveys');
      if (surveysJson) {
        const surveys = JSON.parse(surveysJson) as Survey[];
        const updatedSurveys = surveys.map((s) => {
          if (s.id === survey.id) {
            return { ...s, currentResponses: s.currentResponses + 1 };
          }
          return s;
        });
        localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
      }

      // 현재 사용자의 포인트 업데이트
      const usersJson = localStorage.getItem('users');
      if (usersJson) {
        const users = JSON.parse(usersJson);
        Object.keys(users).forEach((userId) => {
          if (users[userId].id === user.id) {
            users[userId].points = (users[userId].points || 0) + (survey.rewardAmount || 0);
          }
        });
        localStorage.setItem('users', JSON.stringify(users));

        // currentUser 업데이트
        const updatedUser = {
          ...user,
          points: user.points + (survey.rewardAmount || 0),
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      // 참여 내역 저장
      let participations = [];
      const participationsJson = localStorage.getItem(`participations_${user.id}`);
      if (participationsJson) {
        participations = JSON.parse(participationsJson);
      }
      participations.push({
        surveyId: survey.id,
        surveyTitle: survey.title,
        participatedAt: new Date().toISOString(),
        pointsEarned: survey.rewardAmount || 0,
      });
      localStorage.setItem(`participations_${user.id}`, JSON.stringify(participations));

      setSubmitted(true);
      success('설문 응답이 완료되었습니다!');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      showError('응답 제출 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">설문을 찾을 수 없습니다</p>
          <Button variant="primary" onClick={() => router.push('/')} className="mt-4">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">응답 완료!</h2>
          <p className="text-gray-600 mb-2">감사합니다!</p>
          <p className="text-primary-600 font-semibold text-lg">
            +{survey.rewardAmount || 0}P를 받으셨습니다
          </p>
          <p className="text-gray-500 text-sm mt-4">곧 홈으로 돌아갑니다...</p>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(survey.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
      >
        <ChevronLeft size={20} />
        뒤로가기
      </button>

      {/* 상단: 설문 제목 + 카테고리 + 설명 */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{survey.title}</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {survey.category === 'ACADEMIC'
              ? '학술'
              : survey.category === 'RESEARCH'
              ? '연구'
              : survey.category === 'CAMPUS'
              ? '캠퍼스'
              : '기타'}
          </span>
        </div>
        <p className="text-gray-600">{survey.description}</p>
      </div>

      {/* 정보 카드 3열 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">보상</p>
              <p className="text-lg font-bold text-gray-900">{survey.rewardAmount || 0}P</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">소요시간</p>
              <p className="text-lg font-bold text-gray-900">약 {survey.estimatedMinutes}분</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">마감일</p>
              <p className="text-lg font-bold text-gray-900">D-{daysLeft}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 의뢰자 정보 + 응답 현황 */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
              {survey.creator.nickname[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{survey.creator.nickname}</p>
              <p className="text-sm text-gray-500">{survey.creator.department}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">응답 현황</span>
              <span className="font-medium text-gray-900">
                {survey.currentResponses} / {survey.maxResponses}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(survey.currentResponses / survey.maxResponses) * 100}%`,
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 구분선 */}
      <hr className="border-gray-200" />

      {/* 질문 카드들 */}
      <div className="space-y-6">
        {survey.questions.map((question: Question, index: number) => (
          <Card key={question.id}>
            <CardBody className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                {index + 1}. {question.question}
              </h3>

              {/* 단일선택 */}
              {question.type === 'radio' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* 복수선택 */}
              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(answers[question.id] || []).includes(option)}
                        onChange={() => handleToggleMultiple(question.id, option)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* 단문형 */}
              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="답변을 입력하세요"
                />
              )}

              {/* 장문형 */}
              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="답변을 입력하세요"
                  rows={4}
                />
              )}

              {/* 척도 */}
              {question.type === 'scale' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{question.scaleLabels?.min}</span>
                    <span>{question.scaleLabels?.max}</span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswerChange(question.id, value)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                          answers[question.id] === value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 하단 제출 버튼 */}
      <div className="sticky bottom-0 bg-background py-4 border-t border-gray-200">
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={submitting}
          isLoading={submitting}
        >
          응답 제출
        </Button>
      </div>
    </div>
  );
}
