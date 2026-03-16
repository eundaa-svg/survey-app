'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/stores/toastStore';
import { Survey, Question } from '@/utils/seedData';
import { addSurvey } from '@/lib/surveyStorage';

const CATEGORIES = [
  { value: 'ACADEMIC', label: '학술' },
  { value: 'RESEARCH', label: '연구' },
  { value: 'CAMPUS', label: '캠퍼스' },
  { value: 'OTHER', label: '기타' },
];

const QUESTION_TYPES = [
  { value: 'radio', label: '단일선택' },
  { value: 'checkbox', label: '복수선택' },
  { value: 'text', label: '단문형' },
  { value: 'textarea', label: '장문형' },
  { value: 'scale', label: '척도' },
];

export default function CreateSurveyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ACADEMIC',
    estimatedMinutes: 10,
    maxResponses: 100,
    rewardAmount: 500,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [questions, setQuestions] = useState<Partial<Question>[]>([
    { id: 'q1', type: 'radio', question: '', options: [] },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const options = updated[qIndex].options || [];
    options[oIndex] = value;
    updated[qIndex].options = options;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) {
      updated[qIndex].options = [];
    }
    updated[qIndex].options!.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options?.splice(oIndex, 1);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q${prev.length + 1}`,
        type: 'radio',
        question: '',
        options: [],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      showError('설문 제목을 입력해주세요');
      return;
    }

    if (!formData.description.trim()) {
      showError('설문 설명을 입력해주세요');
      return;
    }

    if (questions.length === 0) {
      showError('최소 1개 이상의 질문을 추가해주세요');
      return;
    }

    for (const q of questions) {
      if (!q.question?.trim()) {
        showError('모든 질문을 입력해주세요');
        return;
      }
      if ((q.type === 'radio' || q.type === 'checkbox') && (!q.options || q.options.length < 2)) {
        showError('선택형 질문은 최소 2개의 선택지를 입력해주세요');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const newSurvey: Survey = {
        id: `survey_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        creator: {
          nickname: user?.nickname || '익명',
          department: user?.department || '미입력',
        },
        currentResponses: 0,
        maxResponses: formData.maxResponses,
        estimatedMinutes: formData.estimatedMinutes,
        deadline: new Date(formData.deadline).toISOString(),
        rewardType: 'POINT',
        rewardAmount: formData.rewardAmount,
        status: 'ACTIVE',
        creatorId: user?.id || '',
        createdAt: new Date().toISOString(),
        questions: questions.map((q) => ({
          id: q.id || `q${Math.random()}`,
          type: q.type || 'radio',
          question: q.question || '',
          options: q.options || [],
        })),
      };

      // surveyStorage를 통해 추가
      addSurvey(newSurvey);

      success('설문이 발행되었습니다!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      showError('설문 발행 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900">설문 만들기</h1>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">기본 정보</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설문 제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="설문 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설문 설명 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="설문에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                마감일 *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleFormChange('deadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예상 소요시간 (분)
              </label>
              <input
                type="number"
                value={formData.estimatedMinutes}
                onChange={(e) => handleFormChange('estimatedMinutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 응답자 수
              </label>
              <input
                type="number"
                value={formData.maxResponses}
                onChange={(e) => handleFormChange('maxResponses', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보상 (P) *
              </label>
              <input
                type="number"
                value={formData.rewardAmount}
                onChange={(e) => handleFormChange('rewardAmount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 질문들 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">질문 작성</h2>

        {questions.map((q, qIndex) => (
          <Card key={qIndex}>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        질문 유형
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {QUESTION_TYPES.map((qt) => (
                          <option key={qt.value} value={qt.value}>
                            {qt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      질문 내용 *
                    </label>
                    <input
                      type="text"
                      value={q.question || ''}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="질문을 입력하세요"
                    />
                  </div>

                  {/* 선택지 (라디오, 체크박스) */}
                  {(q.type === 'radio' || q.type === 'checkbox') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">선택지 *</label>
                      {q.options?.map((option, oIndex) => (
                        <div key={oIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={`선택지 ${oIndex + 1}`}
                          />
                          <button
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(qIndex)}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        <Plus size={16} />
                        선택지 추가
                      </button>
                    </div>
                  )}
                </div>

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}

        <button
          onClick={addQuestion}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Plus size={20} />
          질문 추가
        </button>
      </div>

      {/* 발행 버튼 */}
      <div className="flex gap-3 sticky bottom-0 bg-background py-4 border-t border-gray-200">
        <Button variant="secondary" fullWidth onClick={() => router.back()}>
          취소
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={handlePublish}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          설문 발행
        </Button>
      </div>
    </div>
  );
}
