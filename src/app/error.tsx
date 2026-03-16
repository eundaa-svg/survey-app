'use client';

import { useEffect } from 'react';
import { Card, CardBody } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center space-y-6 py-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문제가 발생했습니다</h2>
            <p className="text-gray-600">일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            새로고침
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
