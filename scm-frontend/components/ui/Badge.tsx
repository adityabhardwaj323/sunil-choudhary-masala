import React from 'react';
import { cn } from './Button';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'product';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-body transition-colors';
    
    const variants = {
      default: 'bg-cream-dark text-charcoal',
      success: 'bg-green-100 text-brand-green',
      warning: 'bg-saffron/20 text-saffron',
      error: 'bg-red-100 text-brand-red',
      product: 'bg-brand-red text-white uppercase tracking-wider text-[10px] px-2',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
