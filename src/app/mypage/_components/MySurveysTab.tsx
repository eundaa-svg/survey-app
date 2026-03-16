'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@/components/ui';
import { Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/stores/toastStore';
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

export default function MySurveysTab({ user }: { user: User }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Survey | null>(null);

  useEffect(() => {
    try {
      const mySurveys = getMySurveys(user.nickname);
      setSurveys(mySurveys.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        status: s.status,
        createdAt: s.createdAt,
        currentResponses: s.currentResponses || 0,
      })));
    } catch (err) {
      console.error('Failed to load surveys:', err);
    } finally {
      setLoading(false);
    }
  }, [user.nickname]);

  const handleDelete = (survey: Survey) => {
    setDeleteTarget(survey);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const all = JSON.parse(localStorage.getItem('unisurvey_surveys') || '[]');
    const filtered = all.filter((s: any) => s.id !== deleteTarget.id);
    localStorage.setItem('unisurvey_surveys', JSON.stringify(filtered));
    setSurveys((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    success('설문이 삭제되었습니다');
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
              <div className="ml-4 flex items-center gap-2">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  survey.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                  survey.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {survey.status === 'DRAFT' ? '임시저장' : survey.status === 'ACTIVE' ? '진행중' : '완료'}
                </span>
                <button
                  onClick={() => handleDelete(survey)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1"
                >
                  삭제
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900">설문 삭제</h3>
            <p className="text-gray-600">
              {deleteTarget.currentResponses > 0
                ? `이미 ${deleteTarget.currentResponses}명이 참여한 설문입니다. 삭제하더라도 참여자에게 지급된 보상은 유지됩니다. 정말 삭제하시겠습니까?`
                : '이 설문을 삭제하시겠습니까?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
