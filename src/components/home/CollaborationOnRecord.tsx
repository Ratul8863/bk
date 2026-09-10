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
  imageSrc?: string;
  href?: string;
};

type CollaborationOnRecordProps = {
  items: CollaborationItem[];
  /** Index of the panel open by default (desktop) */
  defaultActiveIndex?: number;
  className?: string;
};

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
        className="hidden h-[35.6875rem] gap-5 md:flex"
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
                  ? 'grow-[1.8] basis-0'
                  : 'grow-0 shrink-0 basis-[7.8125rem]',
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onFocusCapture={() => setActiveIndex(index)}
            >
              {/* Collapsed strip — vertical label (Figma rotated pill) */}
              <div
                aria-hidden={isActive}
                className={cn(
                  'absolute inset-0 z-1 flex items-center justify-center rounded-[1.25rem] bg-[#e5ebf3] px-3 py-6',
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
                  className="max-h-full origin-center whitespace-nowrap font-instrument text-[clamp(1.25rem,1.8vw,2rem)] leading-tight text-ink [writing-mode:vertical-rl] rotate-180"
                >
                  {item.shortLabel}
                </p>
              </div>

              {/* Expanded navy panel — reveals in the same slot */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={labelId}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 z-2 flex flex-col overflow-hidden rounded-[2.5rem] bg-[#0b233f] p-10',
                  reduceMotion
                    ? 'transition-none'
                    : 'transition-opacity duration-500 ease-out',
                  isActive
                    ? 'pointer-events-auto opacity-100 delay-100'
                    : 'pointer-events-none opacity-0',
                )}
              >
                <h3 className="max-w-[38rem] shrink-0 font-instrument text-[clamp(1.5rem,2.4vw,2.5rem)] font-medium leading-[1.2] text-white">
                  {item.title}
                </h3>

                <div className="mt-auto flex min-h-0 items-start gap-5 pt-8">
                  {item.imageSrc ? (
                    <div className="relative aspect-[375/252] w-[min(100%,23.4375rem)] max-w-[48%] shrink-0 overflow-hidden rounded-[1.875rem] bg-white/10">
                      <Image
                        src={item.imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 1200px) 40vw, 375px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1 pt-1">
                    <p className="font-instrument text-[clamp(1rem,1.2vw,1.25rem)] leading-7 text-white">
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
                  'absolute inset-0 z-3 rounded-[1.25rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
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
                'overflow-hidden rounded-[1.15rem]',
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
                  <div className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-5 sm:pb-5">
                    <h3 className="font-instrument text-lg font-medium leading-snug text-white sm:text-xl">
                      {item.title}
                    </h3>
                    {item.imageSrc ? (
                      <div className="relative aspect-[375/252] overflow-hidden rounded-[1.15rem]">
                        <Image
                          src={item.imageSrc}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 375px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
