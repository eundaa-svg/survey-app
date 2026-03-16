'use client';

import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'survey' | 'reward' | 'deadline' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  linkUrl?: string;
}

interface NotificationDropdownProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

const typeIcons = {
  survey: <CheckCircle size={18} className="text-blue-500" />,
  reward: <Zap size={18} className="text-yellow-500" />,
  deadline: <AlertCircle size={18} className="text-orange-500" />,
  system: <Info size={18} className="text-gray-500" />,
};

const NotificationDropdown = ({
  notifications = [],
  onDismiss,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const handleDismiss = (id: string) => {
    onDismiss?.(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors group"
      >
        <Bell size={22} className="text-gray-600 group-hover:text-primary-500" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* 헤더 */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">알림</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500 mt-1">읽지 않은 알림 {unreadCount}개</p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 알림 목록 */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 opacity-20" />
                <p>알림이 없습니다</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50 ${
                    notification.read ? 'bg-white' : 'bg-primary-50'
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {typeIcons[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-sm font-medium text-gray-900 ${
                          !notification.read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(notification.id);
                          }}
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 푸터 */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <button
                onClick={() => {
                  onMarkAllAsRead?.();
                  setIsOpen(false);
                }}
                className="w-full text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                모두 읽음으로 표시
              </button>
            </div>
          )}
        </div>
      )}

      {/* 배경 클릭 시 닫기 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown;
