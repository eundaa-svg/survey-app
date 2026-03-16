'use client';

import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  count?: number;
  circle?: boolean;
  variant?: 'card' | 'text' | 'line';
}

const Skeleton = ({
  width = '100%',
  height = '16px',
  count = 1,
  circle = false,
  variant = 'text',
  className = '',
  ...props
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const variantClasses = {
    card: 'rounded-xl',
    text: `rounded-md ${circle ? 'rounded-full' : ''}`,
    line: 'rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={style}
          className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer ${variantClasses[variant]} ${className}`}
          {...props}
        />
      ))}
    </>
  );
};

export default Skeleton;
