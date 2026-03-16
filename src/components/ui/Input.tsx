'use client';

import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className = '', placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value);
    const widthClass = fullWidth ? 'w-full' : '';

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isActive = isFocused || hasValue;

    return (
      <div className={`${widthClass} group`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${widthClass} bg-white border-2 rounded-lg px-3 py-2 text-base transition-all duration-300 outline-none ${
            error
              ? 'border-danger focus:border-danger focus:ring-2 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-gray-900'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-danger text-xs mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-gray-500 text-xs mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
