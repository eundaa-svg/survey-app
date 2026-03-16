'use client';

import { useAuth } from '@/providers/AuthProvider';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ToastContainer from './ToastContainer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-full h-full bg-background" />;
  }

  return (
    <>
      <Header />
      <Sidebar />
      <main className="fixed inset-0 top-16 lg:left-64 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
        {children}
      </main>
      <BottomNav />
      <ToastContainer />
    </>
  );
}
