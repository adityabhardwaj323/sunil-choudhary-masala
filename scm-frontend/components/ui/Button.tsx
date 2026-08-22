'use client';

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, useReducedMotion } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'small' | 'cart';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const baseStyles = 'inline-flex items-center justify-center font-body font-semibold transition-all duration-250 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-brand-red text-white px-7 py-3.5 hover:bg-brand-red-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(181,57,10,0.4)] text-[15px] rounded-[6px]',
      secondary: 'bg-transparent text-brand-red border-2 border-brand-red px-7 py-3.5 hover:bg-brand-red hover:text-white hover:-translate-y-0.5 text-[15px] rounded-[6px]',
      icon: 'w-10 h-10 rounded-full bg-transparent text-charcoal hover:bg-cream-dark hover:text-brand-red hover:-translate-y-px',
      small: 'bg-brand-red text-white px-4 py-2 hover:bg-saffron hover:-translate-y-px text-sm rounded-[6px]',
      cart: 'bg-brand-red text-white px-4 py-2 hover:bg-brand-red-dark rounded-[7px] text-sm'
    };

    return (
      <motion.button
        ref={ref}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props as any}
      />
    );
  }
);
Button.displayName = 'Button';

