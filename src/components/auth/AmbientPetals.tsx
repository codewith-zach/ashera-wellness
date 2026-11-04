'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

const PETALS = ['🌸', '🌿', '✿', '🌼'];

interface DriftPetal {
  left: number;
  fontSize: number;
  duration: number;
  delay: number;
  drift: number;
  emojiIndex: number;
}

/**
 * Slow-drifting decorative petals for full-page backgrounds.
 * Geometry is generated once per mount in a lazy initializer so no impure
 * calls happen during render; hidden entirely for reduced-motion users.
 */
export function AmbientPetals({ count = 12 }: { count?: number }) {
  const reduced = useReducedMotion();
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      fontSize: 16 + Math.random() * 18,
      duration: 22 + Math.random() * 26,
      delay: -Math.random() * 40,
      drift: (Math.random() - 0.5) * 120,
      emojiIndex: i % PETALS.length,
    })),
  );

  if (reduced) return null;

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {petals.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: '-8vh', opacity: 0 }}
          animate={{
            y: ['-8vh', '108vh'],
            x: [0, p.drift, 0],
            rotate: [0, 200],
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            fontSize: p.fontSize,
            lineHeight: 1,
            willChange: 'transform',
          }}
        >
          {PETALS[p.emojiIndex]}
        </motion.span>
      ))}
    </div>
  );
}
