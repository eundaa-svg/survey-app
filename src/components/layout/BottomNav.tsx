'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Plus, User } from 'lucide-react';

const BottomNav = () => {
  const pathname = usePathname();

  const items = [
    { label: '홈', href: '/', icon: Home },
    { label: '검색', href: '/search', icon: Search },
    { label: '만들기', href: '/survey/create', icon: Plus },
    { label: '마이', href: '/mypage', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30">
      <div className="h-16 flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 h-full flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-500 border-t-2 border-primary-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
