'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Badge, ProgressBar, Button } from '@/components/ui';
import { Plus, Gift, Clock, Users, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import { useToast } from '@/stores/toastStore';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
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
  const { success, error } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, [selectedCategory, selectedSort]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sort', selectedSort);

      const response = await fetch(`/api/surveys?${params.toString()}`);
      if (!response.ok) throw new Error('설문 조회 실패');

      const data = await response.json();
      setSurveys(data);
      setFilteredSurveys(data);
    } catch (err) {
      error('설문 목록을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    router.push('/survey/create');
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">UniSurvey</h1>
          <p className="text-lg opacity-90">대학 캠퍼스 내 다양한 설문에 참여하고 포인트를 획득하세요</p>
        </div>
        <Button
          onClick={handleCreateSurvey}
          className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold flex items-center gap-2 flex-shrink-0"
        >
          <Plus size={20} />
          설문 만들기
        </Button>
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
            {SORT_OPTIONS.find((s) => s.value === selectedSort)?.label}
            <ChevronDown size={16} />
          </button>

          {showSort && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedSort(opt.value);
                    setShowSort(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                    selectedSort === opt.value
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
      ) : filteredSurveys.length === 0 ? (
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
          {filteredSurveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  );
}
