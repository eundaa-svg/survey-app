'use client';

import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'academic' | 'research' | 'campus' | 'other' | 'active' | 'deadline' | 'closed';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  // 기본 상태
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-success font-medium',
  warning: 'bg-orange-100 text-warning font-medium',
  danger: 'bg-red-100 text-danger font-medium',
  info: 'bg-blue-100 text-blue-600 font-medium',

  // 카테고리
  academic: 'bg-blue-100 text-blue-700 font-medium',
  research: 'bg-purple-100 text-primary-600 font-medium',
  campus: 'bg-green-100 text-success font-medium',
  other: 'bg-gray-100 text-gray-700',

  // 상태
  active: 'bg-green-100 text-success font-semibold',
  deadline: 'bg-orange-100 text-warning font-semibold',
  closed: 'bg-gray-200 text-gray-600 font-medium',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', children, className = '', ...props }, ref) => {
    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5 rounded-full',
      md: 'text-sm px-3 py-1.5 rounded-full',
    };

    return (
      <span
        ref={ref}
        className={`inline-block ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
