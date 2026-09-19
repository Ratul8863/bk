'use client';

import { useEffect, useState } from 'react';
import { Lottie } from 'lottie-react';
import { cn } from '@/lib/utils';

export type FormSidePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  lottieSrc: string;
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Navy side panel with Lottie — used on join / auth / verify form pages.
 * Pause control satisfies WCAG 2.2.2 for autoplay motion.
 */
export function FormSidePanel({
  eyebrow,
  title,
  description,
  lottieSrc,
  footer,
  className,
}: FormSidePanelProps) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduceMotion(mq.matches);
      if (mq.matches) setPaused(true);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const playing = !paused && !reduceMotion;

  return (
    <div className={cn(className)}>
      <div className="relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[1.75rem] bg-ink px-6 py-8 text-paper sm:min-h-[22rem] sm:px-8 sm:py-10 lg:min-h-full lg:sticky lg:top-28">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-brand-blue/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-brand-red/15 blur-3xl"
          aria-hidden
        />

        <div className="relative z-[1] flex flex-1 flex-col">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-[15ch] font-display text-3xl leading-tight text-paper sm:text-[2rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">
            {description}
          </p>

          <div className="relative mx-auto mt-6 w-full max-w-[16rem] flex-1 sm:mt-8 sm:max-w-[18rem]">
            <div
              className="flex h-56 w-full items-center justify-center sm:h-64"
              aria-hidden
            >
              <Lottie
                key={`${lottieSrc}-${playing ? 'play' : 'pause'}`}
                src={lottieSrc}
                loop={playing}
                autoplay={playing}
                className="h-full w-full"
              />
            </div>
            {!reduceMotion ? (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="absolute bottom-1 right-1 rounded-full border border-paper/25 bg-ink/70 px-2.5 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-paper/80 backdrop-blur-sm transition hover:border-paper/50 hover:text-paper"
              >
                {paused ? 'Play' : 'Pause'}
              </button>
            ) : null}
          </div>

          {footer ? (
            <div className="relative z-[1] mt-6 text-xs leading-relaxed text-paper/55">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
