'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'font-medium rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 inline-flex items-center justify-center gap-2';

    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md active:bg-primary-700 shadow-sm',
      secondary: 'bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 hover:shadow-md active:bg-primary-100',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:shadow-sm active:bg-gray-200',
      danger: 'bg-danger text-white hover:bg-red-600 hover:shadow-md active:bg-red-700 shadow-sm',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-6 py-2.5 text-base h-10',
      lg: 'px-8 py-3 text-lg h-12',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
