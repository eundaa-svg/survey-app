import Link from 'next/link';
import { Card, CardBody } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center space-y-6 py-12">
          <div>
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
            <p className="text-gray-600">요청하신 페이지가 존재하지 않습니다.</p>
          </div>

          <Link href="/">
            <button className="w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors">
              홈으로 돌아가기
            </button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
