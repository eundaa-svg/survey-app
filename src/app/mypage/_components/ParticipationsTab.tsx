'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

interface Participation {
  surveyId: string;
  surveyTitle: string;
  participatedAt: string;
  pointsEarned: number;
}

export default function ParticipationsTab({ user }: { user: User }) {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const participationsJson = localStorage.getItem(`participations_${user.id}`);
      if (participationsJson) {
        const data = JSON.parse(participationsJson);
        setParticipations(data);
      }
    } catch (err) {
      console.error('Failed to load participations:', err);
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
      {participations.map((participation) => (
        <Card key={participation.surveyId}>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{participation.surveyTitle}</h3>
                <p className="text-xs text-gray-400 mt-2">
                  참여일: {new Date(participation.participatedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-primary-600">
                  +{participation.pointsEarned}P
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
