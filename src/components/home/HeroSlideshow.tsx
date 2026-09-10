'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type HeroSlide = {
  src: string;
  alt: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  /** Auto-advance interval in ms */
  intervalMs?: number;
  className?: string;
};

export function HeroSlideshow({
  slides,
  intervalMs = 4000,
  className,
}: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [slides.length, intervalMs, paused]);

  if (!slides.length) return null;

  return (
    <div
      className={cn('absolute inset-0', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-[70%_35%]"
          />
        </div>
      ))}

      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(13,39,69,0.94)_0%,rgba(13,39,69,0.78)_42%,rgba(13,39,69,0.35)_70%,rgba(13,39,69,0.15)_100%)]"
        aria-hidden
      />

      {slides.length > 1 ? (
        <div className="absolute bottom-8 right-6 z-10 flex items-center gap-2 sm:bottom-10 sm:right-10">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 rounded-none transition-[width,background-color] duration-300',
                i === index
                  ? 'w-8 bg-paper'
                  : 'w-1.5 bg-paper/40 hover:bg-paper/70',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
