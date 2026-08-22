'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp, fadeIn } from './variants';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'none';
}

export function FadeIn({ children, className, delay = 0, direction = 'up' }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Clone the variant to inject the delay
  const variantWithDelay = {
    ... (direction === 'up' ? fadeInUp : fadeIn),
    visible: {
      ... (direction === 'up' ? fadeInUp.visible : fadeIn.visible),
      transition: {
        ... (direction === 'up' ? fadeInUp.visible.transition : fadeIn.visible.transition),
        delay
      }
    }
  };

  return (
    <motion.div
      variants={variantWithDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
