'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import MySurveysTab from './_components/MySurveysTab';
import ParticipationsTab from './_components/ParticipationsTab';
import PointsTab from './_components/PointsTab';
import SettingsTab from './_components/SettingsTab';
import Skeleton from '@/components/ui/Skeleton';

const tabs = [
  { id: 'surveys', label: '내 설문' },
  { id: 'participations', label: '참여 내역' },
  { id: 'points', label: '포인트' },
  { id: 'settings', label: '설정' },
] as const;

type TabId = (typeof tabs)[number]['id'];

function MyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>('surveys');
  const { isLoggedIn, user, isLoading } = useAuth();

  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab as TabId);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    router.push(`/mypage?tab=${tabId}`);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton width={300} height={32} />
        <Skeleton height={48} />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
      </div>
    );
  }

  // 비로그인 상태 (리다이렉트 중)
  if (!isLoggedIn || !user) {
    return null;
  }

  // 로그인 상태 - 마이페이지 표시
  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">안녕하세요, {user.nickname}님</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div>
          {activeTab === 'surveys' && <MySurveysTab user={user} />}
          {activeTab === 'participations' && <ParticipationsTab user={user} />}
          {activeTab === 'points' && <PointsTab user={user} onTabChange={(tab) => handleTabChange(tab as TabId)} />}
          {activeTab === 'settings' && <SettingsTab user={user} />}
        </div>
      </div>
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton width={300} height={32} />
          <Skeleton height={48} />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={100} />
            ))}
          </div>
        </div>
      }
    >
      <MyPageContent />
    </Suspense>
  );
}
