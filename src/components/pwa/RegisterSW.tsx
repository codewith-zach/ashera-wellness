'use client';

import { useEffect } from 'react';

/**
 * Registers the hand-rolled service worker (public/sw.js). Production only —
 * caching during development gets in the way of live reloads.
 */
export function RegisterSW() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
  }, []);

  return null;
}
