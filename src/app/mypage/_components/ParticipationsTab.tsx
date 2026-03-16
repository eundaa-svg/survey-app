'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

interface Participation {
  surveyId: string;
  surveyTitle: string;
  createdAt: string;
  rewardAmount: number;
}

export default function ParticipationsTab({ user }: { user: User }) {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const responses = JSON.parse(localStorage.getItem('unisurvey_responses') || '[]');
      const mine = responses
        .filter((r: any) => r.nickname === user.nickname)
        .map((r: any) => ({
          surveyId: r.surveyId,
          surveyTitle: r.surveyTitle || '설문',
          createdAt: r.createdAt,
          rewardAmount: r.rewardAmount || 0,
        }));
      setParticipations(mine.reverse());
    } catch (err) {
      console.error('Failed to load participations:', err);
    } finally {
      setLoading(false);
    }
  }, [user.nickname]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">아직 참여한 설문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {participations.map((p, i) => (
        <Card key={p.surveyId + '_' + i}>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{p.surveyTitle}</h3>
                <p className="text-xs text-gray-400 mt-2">
                  참여일: {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-green-600">
                  +{p.rewardAmount}P
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
