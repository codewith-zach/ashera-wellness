'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from './variants';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MotionFade({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
