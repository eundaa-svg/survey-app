'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@/components/ui';
import { Plus, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/stores/toastStore';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
  currentResponses: number;
  maxResponses: number;
  createdAt: string;
}

export default function MySurveysTab() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/me/surveys');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('설문 조회 실패');
      const data = await response.json();
      setSurveys(data);
    } catch (err) {
      showError('내 설문을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const response = await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('삭제 실패');
      success('설문이 삭제되었습니다');
      setSurveys(surveys.filter((s) => s.id !== id));
    } catch (err) {
      showError('설문 삭제 중 오류가 발생했습니다');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500" />
        <p className="text-gray-500 mt-4">로딩 중...</p>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">작성한 설문이 없습니다</p>
        <Button
          variant="primary"
          onClick={() => router.push('/survey/create')}
          className="inline-flex items-center gap-2"
        >
          <Plus size={20} />
          첫 설문 만들기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => (
        <Card key={survey.id}>
          <CardBody className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{survey.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{survey.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>상태: {survey.status === 'DRAFT' ? '임시저장' : survey.status === 'ACTIVE' ? '진행 중' : '완료'}</span>
                <span>응답: {survey.currentResponses}/{survey.maxResponses}명</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              {survey.status === 'DRAFT' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => router.push(`/survey/create?id=${survey.id}`)}
                  className="flex items-center gap-1"
                >
                  <Edit size={16} />
                  편집
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDeleteSurvey(survey.id)}
                className="flex items-center gap-1"
              >
                <Trash2 size={16} />
                삭제
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
