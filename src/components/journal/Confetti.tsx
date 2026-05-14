'use client';

import { motion, useReducedMotion } from 'framer-motion';

const PETALS = ['🌸', '🌿', '✿', '🌼', '💮'];

interface Props {
  show: boolean;
}

export function Confetti({ show }: Props) {
  const reduced = useReducedMotion();
  if (!show || reduced) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {Array.from({ length: 26 }).map((_, i) => {
        const left = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 240;
        const dy = -200 - Math.random() * 240;
        const delay = Math.random() * 0.2;
        const rotate = Math.random() * 720 - 360;
        const petal = PETALS[i % PETALS.length];
        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: 0,
              y: 0,
              scale: 0.6,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: dx,
              y: dy,
              scale: [0.6, 1.1, 0.9],
              rotate,
            }}
            transition={{ duration: 1.5, delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 80,
              left: `${left}%`,
              fontSize: 24 + Math.random() * 14,
            }}
          >
            {petal}
          </motion.div>
        );
      })}
    </div>
  );
}
