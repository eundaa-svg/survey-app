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
      <div className={`${widthClass} group relative`}>
        {label && (
          <label
            className={`absolute left-0 transition-all duration-200 pointer-events-none ${
              isActive
                ? 'text-xs text-primary-500 -top-5 font-medium'
                : 'text-base text-gray-500 top-3.5'
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder || (label ? '' : '')}
          className={`${widthClass} bg-transparent border-0 border-b-2 pb-2 pt-4 text-base transition-all duration-300 outline-none ${
            error
              ? 'border-b-danger text-danger focus:border-b-danger'
              : 'border-b-gray-300 focus:border-b-primary-500 text-gray-900'
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
