'use client';

import { useSyncExternalStore } from 'react';
import { ReactLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';

const COARSE_QUERY = '(max-width: 1023px), (pointer: coarse)';

const desktopLenisOptions: LenisOptions = {
  autoRaf: true,
  /** Softer than default — premium editorial glide without lag. */
  lerp: 0.085,
  smoothWheel: true,
  wheelMultiplier: 0.92,
  touchMultiplier: 1,
  syncTouch: false,
  anchors: true,
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  respectReducedMotion: true,
};

function subscribe(onChange: () => void) {
  const media = window.matchMedia(COARSE_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(COARSE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Site-wide Lenis on desktop. Narrow / touch devices use native scroll so
 * homepage pin choreography and momentum scrolling stay usable.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const preferNative = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (preferNative) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={desktopLenisOptions}>
      {children}
    </ReactLenis>
  );
}
