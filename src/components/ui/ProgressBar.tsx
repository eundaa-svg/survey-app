'use client';

import React from 'react';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number; // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const variantColors = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    progress,
    variant = 'primary',
    size = 'md',
    showLabel = false,
    animated = true,
    className = '',
    ...props
  }, ref) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div
            className={`${sizeClasses[size]} ${variantColors[variant]} transition-all duration-300 ease-out ${
              animated ? 'animate-pulse' : ''
            }`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        {showLabel && (
          <p className="text-xs text-gray-600 mt-1 font-medium">{clampedProgress}%</p>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
