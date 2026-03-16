'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLocalStorageFormOptions {
  /** 저장 간격 (ms), 기본값 5000ms */
  interval?: number;
  /** 저장 전 콜백 */
  onSave?: () => void;
}

export function useLocalStorageForm<T extends Record<string, unknown>>(
  key: string,
  defaultValues: T,
  options: UseLocalStorageFormOptions = {}
) {
  const { interval = 5000, onSave } = options;

  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const valuesRef = useRef<T>(defaultValues);

  // 초기값: localStorage에서 불러오기
  const getSaved = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }, [key]);

  // 저장
  const save = useCallback(
    (values: T) => {
      if (typeof window === 'undefined') return;
      try {
        valuesRef.current = values;
        localStorage.setItem(key, JSON.stringify(values));
        setLastSaved(new Date());
        onSave?.();
      } catch {
        // 저장 실패 시 무시 (quota exceeded 등)
      }
    },
    [key, onSave]
  );

  // 5초마다 자동 저장
  const startAutoSave = useCallback(
    (getValues: () => T) => {
      const timer = setInterval(() => {
        if (isDirty) {
          save(getValues());
        }
      }, interval);
      return () => clearInterval(timer);
    },
    [interval, isDirty, save]
  );

  // 삭제 (제출 후 초기화)
  const clear = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    setIsDirty(false);
    setLastSaved(null);
  }, [key]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  return {
    getSaved,
    save,
    clear,
    startAutoSave,
    markDirty,
    isDirty,
    lastSaved,
  };
}
