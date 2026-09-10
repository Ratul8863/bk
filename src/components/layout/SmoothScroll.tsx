'use client';

import { ReactLenis } from 'lenis/react';
import type { LenisOptions } from 'lenis';

const lenisOptions: LenisOptions = {
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

type SmoothScrollProps = {
  children: React.ReactNode;
};

/**
 * Site-wide Lenis smooth scroll (native scroll under the hood —
 * sticky, scroll-margin, and Focus Areas pin progress keep working).
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
