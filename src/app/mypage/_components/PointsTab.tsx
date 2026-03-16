'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { User } from '@/providers/AuthProvider';

interface PointRecord {
  id: string;
  type: string;
  amount: number;
  surveyTitle: string;
  date: string;
}

export default function PointsTab({ user }: { user: User }) {
  const [points, setPoints] = useState(user.points || 0);
  const [history, setHistory] = useState<PointRecord[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setPoints(currentUser.points || 0);

    const records = JSON.parse(localStorage.getItem('unisurvey_points') || '[]');
    setHistory(records);
  }, []);

  return (
    <div className="space-y-6">
      {/* 포인트 잔액 */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardBody className="py-8">
          <p className="text-sm opacity-90">보유 포인트</p>
          <p className="text-5xl font-bold mt-2">{points.toLocaleString()}P</p>
        </CardBody>
      </Card>

      {/* 포인트 내역 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">포인트 내역</h3>
        </CardHeader>
        <CardBody>
          {history.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">아직 포인트 내역이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.surveyTitle}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(record.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-600">+{record.amount.toLocaleString()}P</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
