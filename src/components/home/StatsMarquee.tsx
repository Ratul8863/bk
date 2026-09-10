'use client';

import { cn } from '@/lib/utils';

export type StatMarqueeItem = {
  id: string;
  label: string;
  value: string;
};

type StatsMarqueeProps = {
  items: StatMarqueeItem[];
  className?: string;
};

function StatCard({ stat }: { stat: StatMarqueeItem }) {
  const longValue = stat.value.length > 8;

  return (
    <div className="flex w-max min-w-[11.5rem] shrink-0 flex-col gap-3 border border-paper/35 p-4 sm:min-w-[14rem] sm:p-5">
      <p
        className={cn(
          'whitespace-nowrap font-display leading-none tracking-[-0.02em] text-paper',
          longValue
            ? 'text-xl sm:text-2xl md:text-[1.75rem]'
            : 'text-2xl sm:text-3xl md:text-[2.5rem]',
        )}
      >
        {stat.value}
      </p>
      <p className="whitespace-nowrap font-sans text-sm leading-snug text-paper/75 sm:text-base">
        {stat.label}
      </p>
    </div>
  );
}

function StatTrack({
  items,
  ariaHidden,
  keyPrefix,
}: {
  items: StatMarqueeItem[];
  ariaHidden?: boolean;
  keyPrefix: string;
}) {
  return (
    <div
      className="flex shrink-0 gap-4 pe-4"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((stat, index) => (
        <StatCard key={`${keyPrefix}-${stat.id}-${index}`} stat={stat} />
      ))}
    </div>
  );
}

export function StatsMarquee({ items, className }: StatsMarqueeProps) {
  if (!items.length) return null;

  // Repeat enough times so one track always spans past the viewport on wide screens.
  const trackItems =
    items.length >= 8
      ? items
      : Array.from({ length: Math.ceil(8 / items.length) }, () => items).flat();

  return (
    <div
      className={cn(
        'w-full max-w-full overflow-x-hidden border-y border-paper/15 bg-ink py-8 text-paper md:py-10',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max max-w-none',
          'animate-[bksr-marquee_48s_linear_infinite]',
          'motion-reduce:animate-none motion-reduce:mx-auto motion-reduce:w-full motion-reduce:max-w-5xl motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-4 motion-reduce:px-6',
        )}
      >
        <StatTrack items={trackItems} keyPrefix="a" />
        <StatTrack items={trackItems} ariaHidden keyPrefix="b" />
      </div>
    </div>
  );
}
