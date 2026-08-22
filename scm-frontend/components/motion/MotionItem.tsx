'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp, fadeIn } from './variants';

interface MotionItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'none';
  whileHover?: any;
}

export function MotionItem({ children, className, direction = 'up', whileHover }: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const variant = direction === 'up' ? fadeInUp : fadeIn;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={variant} className={className} whileHover={whileHover}>
      {children}
    </motion.div>
  );
}
