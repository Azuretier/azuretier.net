'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
};

const FadeUpStagger = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial='hidden'
      animate='show'
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const FadeUpDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, children }, ref) => (
    <motion.div ref={ref} className={className} variants={FADE_UP_ANIMATION_VARIANTS}>
      {children}
    </motion.div>
  ),
);
FadeUpDiv.displayName = 'FadeUpDiv';

const FadeUpCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, children }, ref) => (
    <motion.div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground shadow', className)}
      variants={FADE_UP_ANIMATION_VARIANTS}
    >
      {children}
    </motion.div>
  ),
);
FadeUpCard.displayName = 'FadeUpDiv';

export { FADE_UP_ANIMATION_VARIANTS, FadeUpStagger, FadeUpDiv, FadeUpCard };