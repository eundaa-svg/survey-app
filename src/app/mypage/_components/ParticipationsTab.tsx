'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui';
import { AlertCircle, X, ChevronRight } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

interface Response {
  surveyId: string;
  surveyTitle: string;
  rewardAmount: number;
  nickname: string;
  answers: Record<string, any>;
  createdAt: string;
}

interface SurveyData {
  id: string;
  title: string;
  category: string;
  rewardAmount: number;
  creator: { nickname: string; department: string };
  questions: any[];
}

function getSurveyMap(): Record<string, SurveyData> {
  try {
    const all = JSON.parse(localStorage.getItem('unisurvey_surveys') || '[]');
    return Object.fromEntries(all.map((s: SurveyData) => [s.id, s]));
  } catch {
    return {};
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  ACADEMIC: '학술연구',
  RESEARCH: '연구',
  CAMPUS: '캠퍼스생활',
  OTHER: '기타',
};

export default function ParticipationsTab({ user }: { user: User }) {
  const [participations, setParticipations] = useState<Response[]>([]);
  const [surveyMap, setSurveyMap] = useState<Record<string, SurveyData>>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Response | null>(null);

  useEffect(() => {
    try {
      const map = getSurveyMap();
      setSurveyMap(map);

      const responses: Response[] = JSON.parse(localStorage.getItem('unisurvey_responses') || '[]');
      const mine = responses
        .filter((r) => r.nickname === user.nickname)
        .map((r) => {
          const survey = map[r.surveyId];
          return {
            ...r,
            surveyTitle: r.surveyTitle || survey?.title || '삭제된 설문',
            rewardAmount: r.rewardAmount || survey?.rewardAmount || 0,
          };
        })
        .reverse();
      setParticipations(mine);
    } catch (err) {
      console.error('Failed to load participations:', err);
    } finally {
      setLoading(false);
    }
  }, [user.nickname]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">아직 참여한 설문이 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {participations.map((p, i) => (
          <Card
            key={p.surveyId + '_' + i}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelected(p)}
          >
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{p.surveyTitle}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <p className="text-sm font-bold text-green-600">+{p.rewardAmount}P</p>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 상세 모달 */}
      {selected && (() => {
        const survey = surveyMap[selected.surveyId];
        const title = selected.surveyTitle || survey?.title || '삭제된 설문';
        const points = selected.rewardAmount || survey?.rewardAmount || 0;
        const questions: any[] = survey?.questions || [];

        return (
          <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-bold text-gray-900">참여 내역 상세</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4 space-y-5">
                {/* 설문 제목 + 카테고리 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  {survey?.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {CATEGORY_LABEL[survey.category] || survey.category}
                    </span>
                  )}
                </div>

                {/* 의뢰자 */}
                {survey?.creator && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                      {survey.creator.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{survey.creator.nickname}</p>
                      <p className="text-xs text-gray-500">{survey.creator.department}</p>
                    </div>
                  </div>
                )}

                {/* 참여 정보 */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">참여일</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selected.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">받은 포인트</span>
                    <span className="font-bold text-green-600">+{points}P</span>
                  </div>
                </div>

                {/* 내 답변 요약 */}
                {selected.answers && Object.keys(selected.answers).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">내 답변</h4>
                    <div className="space-y-3">
                      {Object.entries(selected.answers).map(([qId, answer], idx) => {
                        const q = questions.find((q: any) => q.id === qId);
                        const qTitle = q?.title || q?.question || `질문 ${idx + 1}`;
                        const answerText = Array.isArray(answer)
                          ? answer.join(', ')
                          : String(answer ?? '');
                        return (
                          <div key={qId} className="border border-gray-100 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Q{idx + 1}. {qTitle}</p>
                            <p className="text-sm font-medium text-gray-900">
                              {answerText || '(미응답)'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
