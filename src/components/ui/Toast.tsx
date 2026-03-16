import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const Toast = ({ type = 'info', message, onClose }: ToastProps) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose ?? (() => {}), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-success text-success',
    error: 'bg-red-50 border-danger text-danger',
    info: 'bg-blue-50 border-blue-500 text-blue-600',
    warning: 'bg-orange-50 border-warning text-warning',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg border-l-4 flex items-center gap-3 ${typeStyles[type]} animate-slide-in`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;
