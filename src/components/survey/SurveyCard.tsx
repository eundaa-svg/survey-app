import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import Badge from '@/components/ui/Badge';
import { FileText, Clock, Users } from 'lucide-react';

interface SurveyCardProps {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'closed' | 'draft';
  responseCount: number;
  deadline?: Date;
  questionCount: number;
}

const SurveyCard = ({
  id,
  title,
  description,
  status,
  responseCount,
  deadline,
  questionCount,
}: SurveyCardProps) => {
  const statusText = {
    active: '진행 중',
    closed: '종료됨',
    draft: '임시저장',
  };

  const statusVariant = {
    active: 'success',
    closed: 'default',
    draft: 'info',
  } as const;

  const isDeadlineSoon = deadline && new Date(deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <Link href={`/survey/${id}`}>
      <Card variant="form" className="cursor-pointer hover:shadow-md transition-shadow">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">{title}</h3>
            <Badge variant={statusVariant[status]} size="sm">
              {statusText[status]}
            </Badge>
          </div>

          {description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FileText size={16} />
              <span>{questionCount}개 질문</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{responseCount}개 응답</span>
            </div>
            {deadline && (
              <div className={`flex items-center gap-1 ${isDeadlineSoon ? 'text-warning' : ''}`}>
                <Clock size={16} />
                <span>{new Date(deadline).toLocaleDateString('ko-KR')}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SurveyCard;
