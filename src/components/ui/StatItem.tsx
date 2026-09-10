'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type StatItemProps = {
  label: string;
  value: string;
  note?: string;
  className?: string;
};

function parseStatValue(value: string): {
  prefix: string;
  number: number | null;
  suffix: string;
} {
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return { prefix: '', number: null, suffix: value };
  const numeric = Number(match[2].replace(/,/g, ''));
  if (Number.isNaN(numeric)) return { prefix: '', number: null, suffix: value };
  return { prefix: match[1] ?? '', number: numeric, suffix: match[3] ?? '' };
}

export function StatItem({ label, value, note, className }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parsed = parseStatValue(value);
  const [display, setDisplay] = useState(
    parsed.number == null ? value : `${parsed.prefix}0${parsed.suffix}`,
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || parsed.number == null || hasAnimated) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      setDisplay(value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setHasAnimated(true);

        const target = parsed.number!;
        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(`${parsed.prefix}${current}${parsed.suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated, parsed.number, parsed.prefix, parsed.suffix, value]);

  return (
    <div ref={ref} className={cn('min-w-0', className)}>
      <p className="font-display text-4xl font-normal tracking-normal text-ink md:text-5xl">
        {display}
      </p>
      <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-accent">
        {label}
      </p>
      {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
    </div>
  );
}
