import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-[52px] h-[3px] rounded-full bg-gradient-to-r from-brand-red to-saffron",
          className
        )}
        {...props}
      />
    );
  }
);
SectionDivider.displayName = 'SectionDivider';
