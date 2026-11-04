'use client';

import { motion, useReducedMotion } from 'framer-motion';

const PETALS = ['🌸', '🌿', '✿', '🌼'];

/**
 * Deterministic 0..1 pseudo-random from a seed. Using index-seeded values
 * (instead of Math.random) keeps the server and client renders identical,
 * so hydration never mismatches.
 */
function pseudo(seed: number): number {
  const x = Math.sin(seed * 999.73) * 10000;
  return x - Math.floor(x);
}

function buildPetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: pseudo(i * 5 + 1) * 100,
    fontSize: 16 + pseudo(i * 5 + 2) * 18,
    duration: 22 + pseudo(i * 5 + 3) * 26,
    delay: -pseudo(i * 5 + 4) * 40,
    drift: (pseudo(i * 5 + 5) - 0.5) * 120,
    emojiIndex: i % PETALS.length,
  }));
}

/**
 * Slow-drifting decorative petals for full-page backgrounds.
 * Hidden entirely for reduced-motion users.
 */
export function PetalLayer({ count = 12 }: { count?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const petals = buildPetals(count);

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
