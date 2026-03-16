'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';

interface FullscreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenSearch({ isOpen, onClose }: FullscreenSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        setQuery('');
      }
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
      {/* 검색 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 h-16">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <ArrowLeft size={22} className="text-gray-700" />
        </button>

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="설문 검색..."
            className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!query ? (
          <div className="text-center py-16">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">설문을 검색해보세요</p>
            <p className="text-gray-400 text-sm mt-1">제목이나 키워드로 검색할 수 있습니다</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">
              &quot;<span className="text-primary-600 font-medium">{query}</span>&quot; 검색 결과
            </p>
            <p className="text-gray-400 text-sm mt-2">검색 기능은 준비 중입니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
