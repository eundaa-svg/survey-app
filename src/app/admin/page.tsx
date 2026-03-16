'use client';

import { Card, CardBody, CardHeader } from '@/components/ui';
import Button from '@/components/ui/Button';
import BarChart from '@/components/chart/BarChart';

export default function AdminPage() {
  // TODO: 관리자 권한 확인

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">플랫폼 통계 및 관리</p>
        </div>

        {/* 주요 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm">총 사용자</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">1,234</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm">총 설문</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">567</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm">총 응답</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">8,901</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-gray-600 text-sm">지급 포인트</p>
              <p className="text-3xl font-bold text-primary-600 mt-2">890K</p>
            </CardBody>
          </Card>
        </div>

        {/* 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardBody>
              <BarChart
                data={[
                  { name: '월', value: 120 },
                  { name: '화', value: 145 },
                  { name: '수', value: 132 },
                  { name: '목', value: 156 },
                  { name: '금', value: 167 },
                  { name: '토', value: 145 },
                  { name: '일', value: 134 },
                ]}
                title="일일 활성 사용자"
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <BarChart
                data={[
                  { name: '1주', value: 890 },
                  { name: '2주', value: 945 },
                  { name: '3주', value: 1024 },
                  { name: '4주', value: 1042 },
                ]}
                title="주별 새로운 설문"
              />
            </CardBody>
          </Card>
        </div>

        {/* 관리 버튼 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">관리</h3>
          </CardHeader>
          <CardBody className="space-y-2">
            <Button variant="secondary" fullWidth>
              사용자 관리
            </Button>
            <Button variant="secondary" fullWidth>
              설문 관리
            </Button>
            <Button variant="secondary" fullWidth>
              포인트 관리
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
