'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@/components/ui';
import { Plus, AlertCircle } from 'lucide-react';
import { User } from '@/providers/AuthProvider';
import { getMySurveys } from '@/lib/surveyStorage';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  currentResponses: number;
}

function dedup(surveys: Survey[]): Survey[] {
  return surveys.reduce((acc: Survey[], survey) => {
    const key = survey.title + '_' + survey.id.slice(0, 8);
    if (!acc.find((s) => s.title === survey.title && s.createdAt === survey.createdAt)) {
      acc.push(survey);
    }
    return acc;
  }, []);
}

export default function MySurveysTab({ user }: { user: User }) {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const mySurveys = getMySurveys(user.nickname);
      const mapped = mySurveys.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        status: s.status,
        createdAt: s.createdAt,
        currentResponses: s.currentResponses || 0,
      }));
      setSurveys(dedup(mapped));
    } catch (err) {
      console.error('Failed to load surveys:', err);
    } finally {
      setLoading(false);
    }
  }, [user.nickname]);

  const handleDelete = (surveyId: string, currentResponses: number) => {
    const message =
      currentResponses > 0
        ? `이미 ${currentResponses}명이 참여한 설문입니다. 삭제하더라도 참여자에게 지급된 보상은 유지됩니다. 정말 삭제하시겠습니까?`
        : '이 설문을 삭제하시겠습니까?';

    if (confirm(message)) {
      const all = JSON.parse(localStorage.getItem('unisurvey_surveys') || '[]');
      const filtered = all.filter((s: any) => s.id !== surveyId);
      localStorage.setItem('unisurvey_surveys', JSON.stringify(filtered));
      alert('설문이 삭제되었습니다.');
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">아직 만든 설문이 없습니다</p>
        <p className="text-gray-400 text-sm mb-6">첫 설문을 만들어보세요!</p>
        <Button
          variant="primary"
          onClick={() => router.push('/survey/create')}
          className="inline-flex items-center gap-2"
        >
          <Plus size={20} />
          설문 만들기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => (
        <Card key={survey.id}>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  생성일: {new Date(survey.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    survey.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : survey.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {survey.status === 'DRAFT'
                    ? '임시저장'
                    : survey.status === 'ACTIVE'
                    ? '진행중'
                    : '완료'}
                </span>
                <button
                  onClick={() => handleDelete(survey.id, survey.currentResponses)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
