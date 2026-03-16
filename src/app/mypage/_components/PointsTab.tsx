'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useToast } from '@/stores/toastStore';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface PointsData {
  balance: number;
  transactions: Transaction[];
}

export default function PointsTab() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [data, setData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/me/points');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('포인트 조회 실패');
      const pointsData = await response.json();
      setData(pointsData);
    } catch (err) {
      showError('포인트 정보를 불러올 수 없습니다');
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">포인트 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 포인트 잔액 */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardBody className="py-8">
          <p className="text-sm opacity-90">보유 포인트</p>
          <p className="text-5xl font-bold mt-2">{data.balance.toLocaleString()}P</p>
        </CardBody>
      </Card>

      {/* 거래 내역 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">거래 내역</h3>
        </CardHeader>
        <CardBody>
          {data.transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">거래 내역이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {data.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3 flex-1">
                    {tx.type === 'EARN' ? (
                      <TrendingUp className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-danger flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold whitespace-nowrap ml-2 ${
                      tx.type === 'EARN' ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {tx.type === 'EARN' ? '+' : '-'}{tx.amount.toLocaleString()}P
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
