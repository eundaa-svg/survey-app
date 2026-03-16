'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@/components/ui';
import { Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/stores/toastStore';
import { User } from '@/providers/AuthProvider';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function MySurveysTab({ user }: { user: User }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 내 설문 가져오기
    try {
      const mySurveysJson = localStorage.getItem(`my_surveys_${user.id}`);
      if (mySurveysJson) {
        const mySurveys = JSON.parse(mySurveysJson);
        setSurveys(mySurveys);
      }
    } catch (err) {
      console.error('Failed to load surveys:', err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

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
              <div className="ml-4">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  survey.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                  survey.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {survey.status === 'DRAFT' ? '임시저장' : survey.status === 'ACTIVE' ? '진행중' : '완료'}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
