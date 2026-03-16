'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, ProgressBar } from '@/components/ui';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/stores/toastStore';

interface Participation {
  id: string;
  survey: {
    id: string;
    title: string;
    category: string;
    rewardType: string;
    rewardAmount?: number;
    rewardDescription?: string;
  };
  isCompleted: boolean;
  rewardClaimed: boolean;
  completedAt?: string;
}

export default function ParticipationsTab() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/me/participations');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('참여 내역 조회 실패');
      const data = await response.json();
      setParticipations(data);
    } catch (err) {
      showError('참여 내역을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (participations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">참여한 설문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participations.map((p) => (
        <Card key={p.id}>
          <CardBody className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-gray-900 flex-1">{p.survey.title}</h3>
              {p.isCompleted && (
                <div className="flex items-center gap-1 text-sm text-success font-medium flex-shrink-0">
                  <CheckCircle size={16} />
                  완료
                </div>
              )}
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>카테고리: {p.survey.category}</span>
              <span>
                포상:
                {p.survey.rewardType === 'POINT'
                  ? `${p.survey.rewardAmount || 0}P`
                  : p.survey.rewardDescription}
              </span>
            </div>

            {p.completedAt && (
              <p className="text-xs text-gray-500">
                완료일: {new Date(p.completedAt).toLocaleDateString('ko-KR')}
              </p>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
