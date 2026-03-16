'use client';

import { useAuth } from '@/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ToastContainer from './ToastContainer';

const AUTH_PAGES = ['/login', '/signup'];

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn } = useAuth();
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  if (isLoading) {
    return <div className="w-full h-full bg-background" />;
  }

  // 로그인/회원가입 페이지는 헤더/사이드바 숨김
  if (isAuthPage) {
    return (
      <>
        <main className="w-full h-full overflow-y-auto overflow-x-hidden">{children}</main>
        <ToastContainer />
      </>
    );
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
