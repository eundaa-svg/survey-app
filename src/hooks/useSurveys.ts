'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type FilterType =
  | 'all'
  | 'department'
  | 'urgent'
  | 'highreward'
  | 'academic'
  | 'research'
  | 'campus';

export type SortType = 'latest' | 'deadline' | 'reward';

export interface SurveyItem {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: {
    id: string;
    name: string | null;
    department: string | null;
  };
  rewardType: string;
  rewardAmount: number | null;
  rewardDescription: string | null;
  estimatedMinutes: number;
  currentResponses: number;
  maxResponses: number;
  deadline: string;
  createdAt: string;
  hasResponded: boolean;
}

interface UseSurveysOptions {
  filter?: FilterType;
  sort?: SortType;
  limit?: number;
}

export function useSurveys({
  filter = 'all',
  sort = 'latest',
  limit = 12,
}: UseSurveysOptions = {}) {
  const [surveys, setSurveys] = useState<SurveyItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSurveys = useCallback(
    async (opts: { currentCursor: string | null; append: boolean }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (opts.append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams({ filter, sort, limit: String(limit) });
        if (opts.currentCursor) params.set('cursor', opts.currentCursor);

        const res = await fetch(`/api/surveys?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? 'fetch_error');
        }

        const data: { surveys: SurveyItem[]; nextCursor: string | null; hasMore: boolean } =
          await res.json();

        setSurveys((prev: SurveyItem[]) => (opts.append ? [...prev, ...data.surveys] : data.surveys));
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('설문 목록을 불러오지 못했습니다.');
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filter, sort, limit]
  );

  // Reset + initial fetch whenever filter/sort changes
  useEffect(() => {
    setSurveys([]);
    setCursor(null);
    setHasMore(false);
    fetchSurveys({ currentCursor: null, append: false });
  }, [fetchSurveys]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          fetchSurveys({ currentCursor: cursor, append: true });
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, cursor, fetchSurveys]);

  const retry = useCallback(() => {
    setSurveys([]);
    setCursor(null);
    setHasMore(false);
    fetchSurveys({ currentCursor: null, append: false });
  }, [fetchSurveys]);

  return {
    surveys,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
  };
}

// Keep backward-compatible single survey fetcher
export const useSurvey = (id: string) => {
  const [data, setData] = useState<SurveyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/surveys/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch survey');
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => setError('설문을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data, isLoading, error };
};
