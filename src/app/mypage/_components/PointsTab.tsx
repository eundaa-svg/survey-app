'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import { TrendingUp } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

export default function PointsTab({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      {/* 포인트 잔액 */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardBody className="py-8">
          <p className="text-sm opacity-90">보유 포인트</p>
          <p className="text-5xl font-bold mt-2">{user.points.toLocaleString()}P</p>
        </CardBody>
      </Card>

      {/* 포인트 안내 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">포인트 정보</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">설문 참여 포인트</p>
              <p className="text-sm text-gray-600 mt-1">설문에 응답하면 포인트를 얻을 수 있습니다</p>
            </div>
          </div>
          <div className="text-center py-4 text-gray-500 text-sm">
            <p>거래 내역은 참여한 설문에서 확인할 수 있습니다</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
