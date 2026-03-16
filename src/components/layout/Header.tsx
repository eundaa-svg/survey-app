'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, LogOut, FileText, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import FullscreenSearch from './FullscreenSearch';

interface HeaderProps {
  unreadCount?: number;
  userName?: string;
  userInitial?: string;
}

const Header = ({ unreadCount = 0, userName = 'User', userInitial = 'U' }: HeaderProps) => {
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 좌측: 로고 */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-lg group-hover:bg-primary-600 transition-colors">
              U
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:inline">UniSurvey</span>
          </Link>

          {/* 중앙: 검색바 (sm 이상만) */}
          <div className="flex-1 max-w-xs mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="search"
                placeholder="설문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* 우측: 모바일 검색 아이콘 + 알림 + 프로필 */}
          <div className="flex items-center gap-1">
            {/* 모바일 검색 아이콘 (sm 미만만 표시) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="검색"
            >
              <Search size={22} className="text-gray-600" />
            </button>

            {/* 알림 벨 */}
            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors group">
              <Bell size={22} className="text-gray-600 group-hover:text-primary-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* 프로필 드롭다운 */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                  {session?.user?.nickname?.[0]?.toUpperCase() || userInitial}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-600 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* 외부 클릭으로 닫기 */}
              {isProfileOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
              )}

              {/* 드롭다운 메뉴 */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.nickname || userName}</p>
                    <p className="text-xs text-gray-500 mt-1">{session?.user?.department || '계정 관리'}</p>
                  </div>

                  <nav className="py-2">
                    <Link
                      href="/mypage"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      마이페이지
                    </Link>
                    <Link
                      href="/mypage?tab=surveys"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FileText size={16} />
                      내 설문
                    </Link>
                  </nav>

                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={async () => {
                        await signOut({ redirect: true, callbackUrl: '/login' });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 풀스크린 검색 오버레이 */}
      <FullscreenSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
