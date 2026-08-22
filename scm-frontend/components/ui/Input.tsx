import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  loading?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, loading, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-body font-medium text-charcoal">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled || loading}
            className={cn(
              "flex h-12 w-full rounded-[10px] border-[1.5px] border-cream-dark bg-white px-4 py-2 text-sm font-body placeholder:text-gray-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              (disabled || loading) && "cursor-not-allowed opacity-50 bg-gray-50",
              className
            )}
            {...props}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-500 font-body">{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
