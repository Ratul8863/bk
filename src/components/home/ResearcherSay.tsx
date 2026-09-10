'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import { Reveal } from '@/components/motion/Reveal';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export type ResearcherSayItem = {
  imageSrc: string;
  quote: string;
  name: string;
  role: string;
};

type ResearcherSayProps = {
  items: ResearcherSayItem[];
  title: string;
  subtitle: string;
  className?: string;
};

const SCRUB = 0.4;

/** Resting gap between cards (px) — Tailwind gap-24. */
const GAP_PX = 96;

/**
 * Max gap shrink while the rear card has moved and the next hasn’t yet.
 * Rest 96 → closest ~40. Cards never touch; motion is forward-only.
 */
const MAX_COMPRESS = 56;

function SectionIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <EditorialHeading as="h2" size="xl" className="text-balance">
        {title}
      </EditorialHeading>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-lg md:text-xl">
        {subtitle}
      </p>
    </Reveal>
  );
}

function QuoteBody({ item }: { item: ResearcherSayItem }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-[1.5rem] bg-[#0b233f] p-4 text-paper sm:rounded-[1.875rem] sm:p-5">
      <p className="font-sans text-base leading-7 text-paper sm:text-2xl sm:leading-9">
        {item.quote}
      </p>

      <div className="mt-6 flex items-center gap-2.5 sm:mt-0">
        <div className="relative h-[56px] w-[48px] shrink-0 overflow-hidden rounded-[6px] bg-surface sm:h-[70px] sm:w-[60px]">
          <Image
            src={item.imageSrc}
            alt=""
            fill
            sizes="60px"
            className="object-cover grayscale"
          />
        </div>
        <div className="min-w-0 text-paper">
          <p className="font-sans text-base font-medium leading-6 sm:text-xl sm:leading-7">
            {item.name}
          </p>
          <p className="mt-0.5 font-sans text-sm leading-5 text-paper/80 sm:mt-1 sm:text-base sm:leading-6">
            {item.role}
          </p>
        </div>
      </div>
    </article>
  );
}

function TrackCards({ items }: { items: ResearcherSayItem[] }) {
  return (
    <>
      {items.flatMap((item) => [
        <li
          key={`${item.imageSrc}-photo`}
          data-inchworm-card
          className="relative aspect-412/531 w-[min(78vw,18rem)] shrink-0 overflow-hidden rounded-[1.5rem] bg-surface will-change-transform sm:w-[min(78vw,20rem)] sm:rounded-[1.875rem]"
        >
          <Image
            src={item.imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 78vw, 320px"
            className="object-cover grayscale"
          />
        </li>,
        <li
          key={`${item.imageSrc}-quote`}
          data-inchworm-card
          className="aspect-412/531 w-[min(78vw,18rem)] shrink-0 will-change-transform sm:w-[min(78vw,20rem)]"
        >
          <QuoteBody item={item} />
        </li>,
      ])}
    </>
  );
}

/**
 * Inchworm: each scroll “lane” runs a forward chain —
 * last card moves → closes on the previous → that one moves → … → front.
 * Another scroll beat repeats the same chain. Forward-only, smooth scrub.
 */
export function ResearcherSay({
  items,
  title,
  subtitle,
  className,
}: ResearcherSayProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      track.querySelectorAll('[data-inchworm-card]'),
    );
    if (!cards.length) return;

    const getTravel = () =>
      Math.max(0, track.scrollWidth - viewport.clientWidth);

    const getStep = () => {
      const first = cards[0];
      if (!first) return 320 + GAP_PX;
      const styles = getComputedStyle(track);
      const gap =
        Number.parseFloat(styles.columnGap || styles.gap || String(GAP_PX)) ||
        GAP_PX;
      return first.offsetWidth + gap;
    };

    const ctx = gsap.context(() => {
      const travel = getTravel();
      if (travel <= 0) return;

      const step = getStep();
      const steps = Math.max(1, Math.ceil(travel / step));
      // Next card starts after the previous has moved ~MAX_COMPRESS (forward only).
      const chainOverlap = 1 - Math.min(0.25, MAX_COMPRESS / Math.max(step, 1));

      gsap.set(cards, { x: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin,
          scrub: SCRUB,
          start: 'top top',
          end: () => `+=${Math.max(Math.round(getTravel() * 1.3), 1)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      for (let beat = 1; beat <= steps; beat += 1) {
        const beatIndex = beat;
        const toX = () => -Math.min(beatIndex * getStep(), getTravel());

        // Last → … → first: each move causes the next to follow.
        for (let i = cards.length - 1; i >= 0; i -= 1) {
          const isFirstInChain = i === cards.length - 1;
          tl.to(
            cards[i],
            {
              x: toX,
              duration: 1,
              ease: 'power1.out',
            },
            isFirstInChain ? undefined : `-=${chainOverlap}`,
          );
        }
      }
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    const images = [...track.querySelectorAll('img')];
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh);
    });

    const ro = new ResizeObserver(refresh);
    ro.observe(viewport);
    ro.observe(track);

    const readyTimer = window.setTimeout(refresh, 120);

    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener('load', refresh);
      images.forEach((img) => img.removeEventListener('load', refresh));
      ro.disconnect();
      ctx.revert();
    };
  }, [items.length, reduceMotion]);

  if (!items.length) return null;

  if (reduceMotion) {
    return (
      <section
        className={cn(
          'border-t border-border bg-white py-16 md:py-24',
          className,
        )}
      >
        <SectionIntro title={title} subtitle={subtitle} />
        <div
          data-lenis-prevent
          className="mt-10 overflow-x-auto px-4 sm:mt-14 sm:px-6 md:mt-16 lg:px-8 xl:px-16 2xl:px-[100px]"
        >
          <ul className="mx-auto flex w-max flex-nowrap gap-8 pb-2 sm:gap-16 md:gap-24">
            <TrackCards items={items} />
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cn('relative overflow-x-clip border-t border-border bg-white', className)}
    >
      <div
        ref={pinRef}
        className="flex min-h-svh flex-col justify-center overflow-hidden py-12 sm:py-16 md:py-24"
      >
        <SectionIntro title={title} subtitle={subtitle} />

        <div
          ref={viewportRef}
          className="relative mt-8 w-full overflow-hidden sm:mt-14 md:mt-16"
        >
          <ul
            ref={trackRef}
            className="flex w-max flex-nowrap gap-8 px-4 sm:gap-16 sm:px-6 md:gap-24 lg:px-8 xl:px-16 2xl:px-[100px]"
          >
            <TrackCards items={items} />
          </ul>
        </div>
      </div>
    </section>
  );
}
