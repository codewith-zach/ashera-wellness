'use client';

import dynamic from 'next/dynamic';

/**
 * Client-only ambient petals. Framer-motion renders motion values
 * differently during SSR than its client engine does (string vs numeric
 * styles, computed px), which React 19 flags as a hydration mismatch —
 * so the layer never renders on the server at all.
 */
export const AmbientPetals = dynamic(
  () => import('./PetalLayer').then((m) => m.PetalLayer),
  { ssr: false },
);
