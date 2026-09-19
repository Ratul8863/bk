'use client';

import { useSyncExternalStore } from 'react';
import { useReducedMotion } from 'motion/react';

const MOBILE_QUERY = '(max-width: 1023px)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** SSR/first paint: assume desktop so pin sections don’t flash short→tall on large screens. */
function getServerSnapshot() {
  return false;
}

/**
 * True when scroll-pinned homepage choreography should be replaced with
 * swipe/stack layouts — reduced motion, or tablet/phone widths.
 */
export function useSimplifiedMotion() {
  const reduceMotion = useReducedMotion();
  const isNarrow = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return Boolean(reduceMotion || isNarrow);
}
