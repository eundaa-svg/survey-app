'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, Badge, ProgressBar, Button } from '@/components/ui';
import { Clock, Users, Calendar, RefreshCw } from 'lucide-react';
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

function SurveyCard({ survey }: { survey: Survey }) {
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
        <Card className="h-full cursor-not-allowed">
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
                {survey.creator.department}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-primary-600">
              {rewardLabel}
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
        <Card className="h-full cursor-pointer group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
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
                {survey.creator.department}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-primary-600">
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

export default function RecommendedPage() {
  const { error } = useToast();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedSurveys();
  }, []);

  const fetchRecommendedSurveys = async () => {
    try {
      setLoading(true);
      // Recommended는 모든 ACTIVE 설문과 동일하게 처리
      const response = await fetch('/api/surveys');
      if (!response.ok) throw new Error('설문 조회 실패');
      const data = await response.json();
      // 간단한 정렬: 포인트 높은 순서
      const sorted = [...data].sort((a, b) => (b.rewardAmount || 0) - (a.rewardAmount || 0));
      setSurveys(sorted);
    } catch (err) {
      error('추천 설문을 불러올 수 없습니다');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">추천 설문</h1>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
          <p className="text-gray-500 mt-4">로딩 중...</p>
        </div>
      ) : surveys.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">추천 설문이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <SurveyCard key={survey.id} survey={survey} />
          ))}
        </div>
      )}
    </div>
  );
}
