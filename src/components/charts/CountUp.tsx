'use client';

import { Text, type TextProps } from '@mantine/core';
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Props extends Omit<TextProps, 'children'> {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}

export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  duration = 0.9,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (latest) => latest.toFixed(decimals));
  const [animatedText, setAnimatedText] = useState('0');

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(mv, value, { duration, ease: 'easeOut' });
    const unsub = display.on('change', (v) => setAnimatedText(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, inView, reduced, decimals, duration, mv, display]);

  // With reduced motion the value is derived straight from the prop — no
  // animation state to keep in sync.
  const text = reduced ? value.toFixed(decimals) : animatedText;

  return (
    <Text component="span" ref={ref} {...rest}>
      {text}
      {suffix}
    </Text>
  );
}
