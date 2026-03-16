'use client';

import { useEffect } from 'react';

/**
 * 페이지 이탈 시 작성 중인 내용이 있으면 경고 다이얼로그를 표시합니다.
 * @param isDirty - true이면 경고 활성화
 * @param message - 브라우저 경고 메시지 (일부 브라우저는 무시)
 */
export function useBeforeUnload(
  isDirty: boolean,
  message = '작성 중인 내용이 있습니다. 페이지를 나가시겠습니까?'
) {
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // 구식 브라우저 지원
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);
}
