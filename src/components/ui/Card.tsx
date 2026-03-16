'use client';

import React from 'react';

type ColorBarColor = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'form';
  colorBar?: ColorBarColor;
  children: React.ReactNode;
}

const colorBarMap: Record<ColorBarColor, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-blue-500',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', colorBar = 'primary', children, className = '', ...props }, ref) => {
    const hasColorBar = variant === 'form';

    return (
      <div
        ref={ref}
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}
        {...props}
      >
        {hasColorBar && (
          <div className={`h-1 w-full ${colorBarMap[colorBar]}`} />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl ${className}`} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
