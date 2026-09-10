'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

export type AtAGlanceItem = {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

type AtAGlanceProps = {
  items: AtAGlanceItem[];
  lead?: string;
};

/** Stack offsets — mobile keeps cards inside the viewport; desktop matches Figma depth. */
const STACK_MOBILE = [
  { x: 0, y: 36, z: 30, shadow: true },
  { x: 12, y: 18, z: 20, shadow: true },
  { x: 24, y: 2, z: 10, shadow: false },
] as const;

const STACK_DESKTOP = [
  { x: 0, y: 56, z: 30, shadow: true },
  { x: 28, y: 28, z: 20, shadow: true },
  { x: 56, y: 4, z: 10, shadow: false },
] as const;

export function AtAGlance({ items, lead }: AtAGlanceProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(true);
  const count = items.length;

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  if (!count) return null;

  const go = (delta: number) => {
    setActive((current) => (current + delta + count) % count);
  };

  const stackRank = (index: number) => (index - active + count) % count;
  const stack = compact ? STACK_MOBILE : STACK_DESKTOP;
  const maxOffsetX = stack[stack.length - 1]?.x ?? 0;

  return (
    <Section
      tone="ink"
      spaced={false}
      className="overflow-x-clip bg-[#0b233f] py-12 sm:py-14 md:py-18 lg:py-20"
    >
      <Container>
        <div className="flex flex-col items-stretch gap-8 sm:gap-10 lg:flex-row lg:items-center lg:gap-10 xl:gap-14">
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-8 text-white sm:gap-10 lg:min-h-[22.5rem] lg:max-w-xl xl:max-w-2xl">
            <p className="max-w-[22ch] font-instrument text-[1.4rem] font-normal leading-snug tracking-normal sm:max-w-none sm:text-[2rem] sm:leading-[1.2] lg:text-[2.25rem] lg:leading-[1.25]">
              {lead ? (
                lead
              ) : (
                <>
                  Explore our research,
                  <br className="hidden sm:block" />{' '}
                  publications, and upcoming events shaping the work of BKSR.
                </>
              )}
            </p>
            <h2 className="font-display text-[1.85rem] font-normal leading-none tracking-normal sm:text-[2.75rem] lg:text-[3rem] lg:leading-tight">
              At a Glance
            </h2>
          </div>

          <div className="flex min-w-0 w-full shrink-0 flex-col items-center gap-5 sm:w-auto sm:flex-row sm:items-end sm:gap-8 lg:gap-10">
            <div className="relative z-40 order-2 flex items-center gap-4 sm:order-1">
              <NavButton
                label="Previous glance card"
                direction="prev"
                onClick={() => go(-1)}
              />
              <NavButton
                label="Next glance card"
                direction="next"
                onClick={() => go(1)}
              />
            </div>

            <div
              className="relative order-1 h-[17.5rem] w-full max-w-[min(100%,24rem)] overflow-hidden sm:order-2 sm:h-[22.5rem] sm:w-[24rem] sm:overflow-visible lg:w-[26rem]"
              aria-live="polite"
            >
              {items.map((item, index) => {
                const rank = stackRank(index);
                const pose =
                  stack[Math.min(rank, stack.length - 1)] ?? stack[0];
                const isFront = rank === 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-hidden={!isFront}
                    tabIndex={isFront ? 0 : -1}
                    className={cn(
                      'absolute left-0 top-0 flex flex-col gap-3 rounded-[1.5rem] bg-white p-1',
                      'w-[calc(100%-var(--stack-x))] sm:w-[22.5rem]',
                      pose.shadow &&
                        'shadow-[4px_-10px_8px_rgba(0,0,0,0.22)]',
                      !reduceMotion &&
                        'transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      !isFront && 'pointer-events-none',
                    )}
                    style={{
                      ['--stack-x' as string]: `${maxOffsetX}px`,
                      zIndex: pose.z,
                      transform: `translate(${pose.x}px, ${pose.y}px)`,
                      opacity: rank > 2 ? 0 : 1,
                    }}
                  >
                    <div className="px-3 pt-2.5 sm:px-3.5 sm:pt-3">
                      <p className="font-instrument text-[1.35rem] font-normal leading-tight tracking-normal text-black sm:text-[1.75rem] sm:leading-9">
                        {item.label}
                      </p>
                    </div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] bg-[#d9d9d9]">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        sizes="(max-width: 640px) 90vw, 360px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function NavButton({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: 'prev' | 'next';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-12"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Figma-exported glyph */}
      <img
        src="/media/prototype/at-a-glance-arrow.svg"
        alt=""
        width={22}
        height={22}
        className={cn('size-5.5', direction === 'prev' && 'rotate-180')}
        aria-hidden
      />
    </button>
  );
}
