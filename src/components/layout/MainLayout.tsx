'use client';

import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: {
    unreadCount?: number;
    userName?: string;
    userInitial?: string;
  };
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  );
};

export default MainLayout;
