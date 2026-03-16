'use client';

import { useEffect } from 'react';
import { initializeSeedData } from '@/utils/seedData';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeSeedData();
  }, []);

  return <>{children}</>;
}
