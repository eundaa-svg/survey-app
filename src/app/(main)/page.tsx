'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Badge, ProgressBar, Button } from '@/components/ui';
import { Plus, Gift, Clock, Users, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { useToast } from '@/stores/toastStore';
import { useAuth } from '@/providers/AuthProvider';
import Skeleton from '@/components/ui/Skeleton';
import { loadSurveys } from '@/lib/surveyStorage';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt?: string;
  creator: {
    nickname: string;
    department: string;
  };
  currentResponses: number;
  maxResponses: number;
  estimatedMinutes: number;
  deadline: string;
  rewardType: string;
  rewardAmount?: number;
  rewardDescription?: string;
  status: string;
}

const FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'ACADEMIC', label: '학술연구' },
  { value: 'RESEARCH', label: '일반 연구' },
  { value: 'CAMPUS', label: '캠퍼스' },
  { value: 'OTHER', label: '기타' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'deadline', label: '마감임박순' },
  { value: 'reward', label: '보상높은순' },
];

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    ACADEMIC: 'primary',
    RESEARCH: 'info',
    CAMPUS: 'success',
    OTHER: 'default',
  };
  return map[category] ?? 'default';
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    ACADEMIC: '학술',
    RESEARCH: '연구',
    CAMPUS: '캠퍼스',
    OTHER: '기타',
  };
  return map[category] ?? '기타';
}

function getDaysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function SurveyCard({ survey, onResponded }: { survey: Survey; onResponded?: () => void }) {
  const daysLeft = getDaysLeft(survey.deadline);
  const isUrgent = daysLeft <= 3 && daysLeft > 0;
  const isClosed = survey.status !== 'ACTIVE';
  const categoryColor = getCategoryColor(survey.category);
  const categoryLabel = getCategoryLabel(survey.category);
  const responseRatio = (survey.currentResponses / survey.maxResponses) * 100;

  const rewardLabel =
    survey.rewardType === 'POINT'
      ? `${(survey.rewardAmount ?? 0).toLocaleString()}P 지급`
      : survey.rewardDescription ?? '보상 있음';

  if (isClosed) {
    return (
      <div className="relative h-full group opacity-60">
        <Card
          className="h-full cursor-not-allowed"
        >
          <CardBody className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-1" />
              <Badge variant={categoryColor as any} size="sm">
                {categoryLabel}
              </Badge>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{survey.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>

            <div className="border-t border-gray-100" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(survey.creator.nickname ?? '?').charAt(0)}
              </div>
              <span className="text-sm text-gray-700 truncate">
                {survey.creator.department} {survey.creator.nickname}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm font-bold text-primary-600">
              <Gift size={16} className="flex-shrink-0" />
              {rewardLabel}
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-auto">
              <div className="flex items-center gap-1">
                <Clock size={14} />약 {survey.estimatedMinutes}분
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {survey.currentResponses}/{survey.maxResponses}명
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="text-center text-sm text-gray-500 py-2">
                {survey.status === 'CLOSED' ? '마감된 설문입니다' : '완료된 설문입니다'}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/survey/${survey.id}`}>
      <div className="relative h-full group">
        <Card
          className="h-full cursor-pointer group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all"
        >
          <CardBody className="space-y-4 h-full flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-1" />
              <Badge variant={categoryColor as any} size="sm">
                {categoryLabel}
              </Badge>
              {isUrgent && (
                <Badge variant="danger" size="sm" className="ml-2">
                  D-{daysLeft}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{survey.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>

            <div className="border-t border-gray-100" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(survey.creator.nickname ?? '?').charAt(0)}
              </div>
              <span className="text-sm text-gray-700 truncate">
                {survey.creator.department} {survey.creator.nickname}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm font-bold text-primary-600">
              <Gift size={16} className="flex-shrink-0" />
              {rewardLabel}
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-auto">
              <div className="flex items-center gap-1">
                <Clock size={14} />약 {survey.estimatedMinutes}분
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {survey.currentResponses}/{survey.maxResponses}명
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                D-{daysLeft}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <ProgressBar value={responseRatio} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">{Math.round(responseRatio)}% 완료</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { error } = useToast();
  const { isLoggedIn, isLoading: isAuthLoading, user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortType, setSortType] = useState('latest');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.replace('/login');
      return;
    }
    if (!isAuthLoading) {
      fetchSurveys();
    }
  }, [selectedCategory, sortType, isAuthLoading, isLoggedIn, router]);

  useEffect(() => {
    // 페이지 포커스 시 데이터 새로고침
    function handleFocus() {
      const all = loadSurveys();
      console.log('[home focus] 설문 수:', all.length);
      setSurveys(all);
      setLoading(false);
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchSurveys = () => {
    try {
      setLoading(true);
      const allSurveys = loadSurveys();
      console.log('[home fetch] 설문 수:', allSurveys.length, '카테고리:', selectedCategory);

      const filtered = selectedCategory === 'all'
        ? allSurveys
        : allSurveys.filter((s: any) => s.category === selectedCategory);

      setSurveys(filtered);
    } catch (err) {
      error('설문 목록을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useMemo로 정렬된 설문 계산
  const sortedSurveys = useMemo(() => {
    const sorted = [...surveys];
    
    switch (sortType) {
      case 'latest':
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'deadline':
        sorted.sort((a, b) => {
          const dateA = new Date(a.deadline).getTime();
          const dateB = new Date(b.deadline).getTime();
          return dateA - dateB;
        });
        break;
      case 'reward':
        sorted.sort((a, b) => {
          return (b.rewardAmount || 0) - (a.rewardAmount || 0);
        });
        break;
    }
    
    return sorted;
  }, [surveys, sortType]);

  const handleCreateSurvey = () => {
    router.push('/survey/create');
  };

  const handleSortChange = (newSort: string) => {
    setSortType(newSort);
    setShowSort(false);
  };

  if (isAuthLoading || !isLoggedIn) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Skeleton height={200} className="rounded-2xl" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div className="space-y-2">
          <p className="text-lg opacity-90">안녕하세요, {user?.nickname}님</p>
          <h1 className="text-4xl font-bold">UniSurvey</h1>
          <p className="text-lg opacity-90">대학 캠퍼스 내 다양한 설문에 참여하고 포인트를 획득하세요</p>
        </div>
        <button
          onClick={() => router.push('/survey/create')}
          style={{
            backgroundColor: 'white',
            color: '#5b21b6',
            padding: '14px 32px',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: '2px solid white',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '20px', color: '#5b21b6' }}>+</span>
          <span style={{ color: '#5b21b6' }}>설문 만들기</span>
        </button>
      </div>

      {/* 필터 & 정렬 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedCategory(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === opt.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            {SORT_OPTIONS.find((s) => s.value === sortType)?.label}
            <ChevronDown size={16} />
          </button>

          {showSort && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortChange(opt.value)}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    sortType === opt.value
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 설문 그리드 */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
          <p className="text-gray-500 mt-4">로딩 중...</p>
        </div>
      ) : sortedSurveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 등록된 설문이 없습니다.</p>
          <p className="text-gray-400 text-sm">첫 설문을 만들어보세요!</p>
          <Button
            variant="primary"
            onClick={handleCreateSurvey}
            className="mt-6 inline-flex items-center gap-2"
          >
            <Plus size={20} />
            설문 만들기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  );
}
