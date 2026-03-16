'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, type ToastItem } from '@/stores/toastStore';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'bg-white border-l-4 border-success text-gray-800',
  error: 'bg-white border-l-4 border-danger text-gray-800',
  info: 'bg-white border-l-4 border-blue-500 text-gray-800',
  warning: 'bg-white border-l-4 border-warning text-gray-800',
};

const ICON_STYLES = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-blue-500',
  warning: 'text-warning',
};

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const [exiting, setExiting] = useState(false);
  const duration = toast.duration ?? 4000;
  const Icon = ICONS[toast.type];

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), duration - 300);
    const removeTimer = setTimeout(onRemove, duration);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onRemove]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onRemove, 250);
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-sm
        ${STYLES[toast.type]}
        ${exiting ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <Icon size={18} className={`mt-0.5 flex-shrink-0 ${ICON_STYLES[toast.type]}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-0.5 hover:bg-gray-100 rounded transition-colors"
      >
        <X size={14} className="text-gray-400" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
