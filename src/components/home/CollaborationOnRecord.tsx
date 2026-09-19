'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type CollaborationItem = {
  id: string;
  /** Vertical strip label when collapsed */
  shortLabel: string;
  /** Expanded panel heading */
  title: string;
  description: string;
  /** Institution logo / mark (not a photo) */
  imageSrc?: string;
  href?: string;
};

type CollaborationOnRecordProps = {
  items: CollaborationItem[];
  /** Index of the panel open by default (desktop) */
  defaultActiveIndex?: number;
  className?: string;
};

function InstitutionLogo({
  src,
  title,
  size = 'desktop',
}: {
  src: string;
  title: string;
  size?: 'desktop' | 'mobile';
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_1px_0_rgba(255,255,255,0.12)]',
        size === 'desktop'
          ? 'size-[7.5rem] p-3.5 lg:size-[8.75rem] lg:rounded-[1.5rem] lg:p-4'
          : 'size-[5.5rem] rounded-[1.1rem] p-2.5',
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={`${title} logo`}
          fill
          sizes={size === 'desktop' ? '140px' : '88px'}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export function CollaborationOnRecord({
  items,
  defaultActiveIndex = 0,
  className,
}: CollaborationOnRecordProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const initial = Math.min(
    Math.max(defaultActiveIndex, 0),
    Math.max(items.length - 1, 0),
  );
  const [activeIndex, setActiveIndex] = useState(initial);

  if (items.length === 0) return null;

  return (
    <div className={cn('mt-12', className)}>
      {/* Desktop / tablet accordion — hover expands in place */}
      <ul
        className="hidden h-[21rem] gap-4 lg:h-[22.5rem] lg:gap-5 md:flex"
        onMouseLeave={() => setActiveIndex(initial)}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const panelId = `${baseId}-panel-${item.id}`;
          const labelId = `${baseId}-label-${item.id}`;

          return (
            <li
              key={item.id}
              className={cn(
                'relative h-full min-w-0',
                reduceMotion
                  ? 'transition-none'
                  : 'transition-[flex-grow,flex-basis,flex-shrink] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isActive
                  ? 'grow-[1.85] basis-0'
                  : 'grow-0 shrink-0 basis-[7.75rem] lg:basis-[8.5rem]',
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onFocusCapture={() => setActiveIndex(index)}
            >
              {/* Collapsed strip — long labels wrap to 2 vertical lines, never spill out */}
              <div
                aria-hidden={isActive}
                className={cn(
                  'absolute inset-0 z-1 flex items-center justify-center overflow-hidden rounded-[1.35rem] bg-[#e5ebf3] px-2.5 py-5',
                  reduceMotion
                    ? 'transition-none'
                    : 'transition-opacity duration-300 ease-out',
                  isActive
                    ? 'pointer-events-none opacity-0'
                    : 'opacity-100 delay-75',
                )}
              >
                <p
                  id={labelId}
                  className={cn(
                    'box-border h-[calc(100%-0.75rem)] w-[2.7em] overflow-hidden',
                    'text-center font-instrument text-[clamp(1.05rem,1.35vw,1.35rem)] leading-[1.25] text-ink',
                    '[writing-mode:vertical-rl] rotate-180',
                    'break-words [overflow-wrap:anywhere]',
                  )}
                >
                  {item.shortLabel}
                </p>
              </div>

              {/* Expanded navy panel — logo + copy in one row */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={labelId}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 z-2 flex items-center overflow-hidden rounded-[1.75rem] bg-[#0b233f] px-7 py-6 lg:rounded-[2rem] lg:px-9 lg:py-7',
                  reduceMotion
                    ? 'transition-none'
                    : 'transition-opacity duration-500 ease-out',
                  isActive
                    ? 'pointer-events-auto opacity-100 delay-100'
                    : 'pointer-events-none opacity-0',
                )}
              >
                <div className="flex w-full min-w-0 items-center gap-6 lg:gap-8">
                  {item.imageSrc ? (
                    <InstitutionLogo src={item.imageSrc} title={item.title} />
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <h3 className="max-w-[34rem] font-instrument text-[clamp(1.45rem,2.15vw,2.15rem)] font-medium leading-[1.2] tracking-[-0.01em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[32rem] font-instrument text-[clamp(1rem,1.15vw,1.2rem)] leading-7 text-white/90">
                      {item.description}
                    </p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex font-sans text-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        View on record
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={cn(
                  'absolute inset-0 z-3 rounded-[1.35rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  isActive && 'pointer-events-none',
                )}
                aria-expanded={isActive}
                aria-controls={panelId}
                aria-label={item.shortLabel}
                tabIndex={isActive ? -1 : 0}
                onFocus={() => setActiveIndex(index)}
              />
            </li>
          );
        })}
      </ul>

      {/* Mobile — stacked; tap expands in place */}
      <ul className="flex flex-col gap-2.5 md:hidden">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const panelId = `${baseId}-m-panel-${item.id}`;

          return (
            <li
              key={item.id}
              className={cn(
                'overflow-hidden rounded-[1.25rem]',
                reduceMotion
                  ? 'transition-none'
                  : 'transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isActive ? 'bg-[#0b233f]' : 'bg-[#e5ebf3]',
              )}
            >
              <button
                type="button"
                className={cn(
                  'flex w-full items-center px-4 py-3.5 text-left font-instrument text-base sm:px-5 sm:py-4 sm:text-lg',
                  isActive ? 'text-white' : 'text-ink',
                )}
                aria-expanded={isActive}
                aria-controls={panelId}
                onClick={() => setActiveIndex(index)}
              >
                {item.shortLabel}
              </button>
              <div
                id={panelId}
                role="region"
                className={cn(
                  'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                  isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex items-start gap-4 px-4 pb-4 sm:gap-5 sm:px-5 sm:pb-5">
                    {item.imageSrc ? (
                      <InstitutionLogo
                        src={item.imageSrc}
                        title={item.title}
                        size="mobile"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <h3 className="font-instrument text-lg font-medium leading-snug text-white sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="font-instrument text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
                        {item.description}
                      </p>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="inline-flex font-sans text-sm font-semibold text-white underline-offset-4 hover:underline"
                        >
                          View on record
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
