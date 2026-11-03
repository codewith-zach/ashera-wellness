'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

const PETALS = ['🌸', '🌿', '✿', '🌼', '💮'];

interface PetalConfig {
  left: number;
  dx: number;
  dy: number;
  delay: number;
  rotate: number;
  fontSize: number;
  emojiIndex: number;
}

function buildPetals(count: number): PetalConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    dx: (Math.random() - 0.5) * 240,
    dy: -200 - Math.random() * 240,
    delay: Math.random() * 0.2,
    rotate: Math.random() * 720 - 360,
    fontSize: 24 + Math.random() * 14,
    emojiIndex: i % PETALS.length,
  }));
}

interface Props {
  show: boolean;
}

export function Confetti({ show }: Props) {
  const reduced = useReducedMotion();
  // Random petal geometry is generated once per mount in a lazy initializer —
  // impure calls there don't run during render.
  const [petals] = useState(() => buildPetals(26));
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
      {petals.map((p, i) => (
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
            x: p.dx,
            y: p.dy,
            scale: [0.6, 1.1, 0.9],
            rotate: p.rotate,
          }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 80,
            left: `${p.left}%`,
            fontSize: p.fontSize,
          }}
        >
          {PETALS[p.emojiIndex]}
        </motion.div>
      ))}
    </div>
  );
}
