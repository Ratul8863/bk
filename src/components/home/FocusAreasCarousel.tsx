'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { animate } from 'motion/react';
import { useSimplifiedMotion } from '@/hooks/useSimplifiedMotion';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { cn } from '@/lib/utils';

export type FocusAreaItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

type FocusAreasCarouselProps = {
  areas: FocusAreaItem[];
};

function padIndex(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function FocusAreasCarousel({ areas }: FocusAreasCarouselProps) {
  const simplified = useSimplifiedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const simplifiedScrollerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef({
    viewportWidth: 0,
    trackWidth: 0,
    step: 332,
    maxManual: 0,
    startX: 0,
    revealX: 0,
  });
  const scrollXRef = useRef(800);
  const manualXRef = useRef(0);
  const manualIndexRef = useRef(0);
  const buttonsReadyRef = useRef(false);

  const [overflowSteps, setOverflowSteps] = useState(0);
  const [manualIndex, setManualIndex] = useState(0);
  const [buttonsReady, setButtonsReady] = useState(false);
  /** Extra pin distance: fill the row, then reveal one more card, then unlock. */
  const [pinExtra, setPinExtra] = useState(0);

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${scrollXRef.current + manualXRef.current}px, 0, 0)`;
  };

  const applyNav = (ready: boolean) => {
    const nav = navRef.current;
    if (!nav) return;
    nav.style.opacity = ready ? '1' : '0';
    nav.style.transform = ready ? 'translateY(0px)' : 'translateY(18px)';
    nav.style.pointerEvents = ready ? 'auto' : 'none';
    nav.setAttribute('aria-hidden', ready ? 'false' : 'true');
  };

  useEffect(() => {
    if (simplified) return;
    manualIndexRef.current = manualIndex;
    const target = -Math.min(
      manualIndex * metricsRef.current.step,
      Math.max(metricsRef.current.maxManual - metricsRef.current.revealX, 0),
    );
    const controls = animate(manualXRef.current, target, {
      type: 'spring',
      stiffness: 170,
      damping: 30,
      mass: 0.5,
      onUpdate: (value) => {
        manualXRef.current = value;
        applyTransform();
      },
    });
    return () => controls.stop();
  }, [manualIndex, simplified]);

  useEffect(() => {
    if (simplified) return;

    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    /** Row fills first; remaining progress reveals exactly one more card, then unlock. */
    const FILL_AT = 0.78;

    const applyProgress = (progress: number) => {
      const { viewportWidth, startX, revealX } = metricsRef.current;
      if (!viewportWidth) return;

      const p = Math.min(Math.max(progress, 0), 1);
      if (p <= FILL_AT) {
        const t = p / FILL_AT;
        scrollXRef.current = startX * (1 - t);
      } else {
        const t = (p - FILL_AT) / (1 - FILL_AT);
        scrollXRef.current = -revealX * t;
      }
      applyTransform();

      const ready = p >= FILL_AT;
      if (buttonsReadyRef.current !== ready) {
        buttonsReadyRef.current = ready;
        setButtonsReady(ready);
      }
      applyNav(ready);

      if (p < FILL_AT && manualIndexRef.current !== 0) {
        manualIndexRef.current = 0;
        manualXRef.current = 0;
        setManualIndex(0);
        applyTransform();
      }
    };

    const readProgress = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        applyProgress(1);
        return;
      }
      const rect = section.getBoundingClientRect();
      applyProgress(Math.min(Math.max(-rect.top / scrollable, 0), 1));
    };

    const measure = () => {
      const cards = [
        ...track.querySelectorAll<HTMLElement>('[data-focus-card]'),
      ];
      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];
      if (!firstCard || !lastCard) return;

      const styles = getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '24') || 24;
      const padLeft = Number.parseFloat(styles.paddingLeft || '0') || 0;
      const padRight = Number.parseFloat(styles.paddingRight || '0') || 0;
      const step = firstCard.offsetWidth + gap;
      const viewportWidth = viewport.clientWidth;
      if (viewportWidth < 32) return;

      const trackWidth = lastCard.offsetLeft + lastCard.offsetWidth + padRight;
      const maxManual = Math.max(trackWidth - viewportWidth, 0);
      const totalSteps = maxManual <= 1 ? 0 : Math.ceil(maxManual / step);
      const buttonSteps = Math.max(0, totalSteps - (maxManual > 0 ? 1 : 0));

      const startX = Math.max(
        viewportWidth - padLeft - firstCard.offsetWidth * 1.05,
        viewportWidth * 0.58,
      );
      const revealX = Math.min(step, maxManual);

      const nextPinExtra = Math.round(
        Math.min(
          Math.max(
            startX * 0.65 + revealX * 1.35,
            window.innerHeight * 0.85,
          ),
          window.innerHeight * 1.15,
        ),
      );
      setPinExtra((prev) => (prev === nextPinExtra ? prev : nextPinExtra));

      metricsRef.current = {
        viewportWidth,
        trackWidth,
        step,
        maxManual,
        startX,
        revealX,
      };
      setOverflowSteps((prev) => (prev === buttonSteps ? prev : buttonSteps));
      readProgress();
    };

    let frame = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      readProgress();
      frame = window.requestAnimationFrame(tick);
    };

    measure();
    frame = window.requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    resizeObserver.observe(section);

    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [areas.length, simplified]);

  const canPrev = manualIndex > 0;
  const canNext = manualIndex < overflowSteps;

  const go = (direction: -1 | 1) => {
    if (!buttonsReadyRef.current && !simplified) return;
    setManualIndex((current) =>
      Math.min(Math.max(current + direction, 0), overflowSteps),
    );
  };

  const scrollSimplified = (direction: -1 | 1) => {
    const scroller = simplifiedScrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>('li');
    const step = card ? card.offsetWidth + 16 : 280;
    scroller.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  if (!areas.length) return null;

  if (simplified) {
    return (
      <section className="border-t border-border bg-white py-12 sm:py-16 md:py-24">
        <Container>
          <HeaderCopy />
        </Container>
        <div
          ref={simplifiedScrollerRef}
          data-lenis-prevent
          className="mt-8 overflow-x-auto scroll-smooth px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          <ul className="mx-auto flex w-max snap-x snap-mandatory items-stretch gap-4 pb-2 sm:gap-6">
            {areas.map((area, index) => (
              <li
                key={area.id}
                className="flex w-[min(82vw,17.5rem)] shrink-0 snap-center sm:w-77"
              >
                <FocusCard area={area} index={index} />
              </li>
            ))}
          </ul>
        </div>
        <div
          data-focus-nav
          className="mt-8 flex items-center justify-center gap-5 sm:mt-10 sm:gap-6"
        >
          <NavButton
            label="Previous focus areas"
            onClick={() => scrollSimplified(-1)}
            mirrored
          />
          <NavButton
            label="Next focus areas"
            onClick={() => scrollSimplified(1)}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border bg-white"
      style={{ height: `calc(100svh + ${Math.max(pinExtra, 520)}px)` }}
    >
      <div className="sticky top-0 flex min-h-svh flex-col justify-center overflow-x-clip overflow-y-hidden py-12 sm:py-16 md:py-20">
        <Container>
          <HeaderCopy />
        </Container>

        <div
          ref={viewportRef}
          className="relative mt-8 w-full overflow-hidden sm:mt-12 md:mt-14"
        >
          <ul
            ref={trackRef}
            className="flex w-max items-stretch gap-4 px-4 will-change-transform sm:gap-6 sm:px-6 lg:px-8"
            style={{ transform: 'translate3d(70vw, 0, 0)' }}
          >
            {areas.map((area, index) => (
              <li
                key={area.id}
                data-focus-card
                className="flex w-[min(82vw,17.5rem)] shrink-0 sm:w-77 lg:w-81.5"
              >
                <FocusCard area={area} index={index} />
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={navRef}
          data-focus-nav
          data-overflow-steps={overflowSteps}
          data-manual-index={manualIndex}
          className="mt-10 flex items-center justify-center gap-6"
          style={{
            opacity: 0,
            transform: 'translateY(18px)',
            pointerEvents: 'none',
          }}
          aria-hidden={!buttonsReady}
        >
          <NavButton
            label="Previous focus areas"
            onClick={() => go(-1)}
            disabled={!canPrev}
            mirrored
          />
          <NavButton
            label="Next focus areas"
            onClick={() => go(1)}
            disabled={!canNext}
          />
        </div>
      </div>
    </section>
  );
}

function HeaderCopy() {
  return (
    <div className="mx-auto w-full max-w-6xl text-center">
      <EditorialHeading
        as="h2"
        size="xl"
        className="text-pretty lg:text-nowrap"
      >
        Our Focus
      </EditorialHeading>
      <p className="mx-auto mt-4 max-w-5xl text-sm leading-relaxed text-muted sm:text-lg md:text-xl lg:max-w-none lg:whitespace-nowrap">
        Advancing evidence-based research at the intersection of people, policy,
        and progress.
      </p>
    </div>
  );
}

function FocusCard({
  area,
  index,
}: {
  area: FocusAreaItem;
  index: number;
}) {
  return (
    <Link
      href={`/research/areas#${area.slug}`}
      className="group flex h-full w-full flex-col rounded-[1.5rem] bg-[#e5ebf3] p-5 text-ink transition-colors duration-300 hover:bg-[#dce5f0] sm:rounded-[1.875rem] sm:p-7.5"
    >
      <p className="font-display text-[2.75rem] leading-none tracking-tight sm:text-[4.5rem]">
        {padIndex(index)}
      </p>
      <div
        className="mt-6 h-px w-full shrink-0 bg-ink/75 sm:mt-10"
        aria-hidden
      />
      <div className="mt-6 flex min-h-0 flex-1 flex-col sm:mt-10">
        <h3 className="font-sans text-xl font-semibold leading-tight transition-colors group-hover:text-accent sm:text-[2rem]">
          {area.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-ink/80 sm:mt-6 sm:text-base">
          {area.description}
        </p>
        <div className="mt-auto flex pt-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink py-2.5 pl-5 pr-4 font-sans text-sm font-medium text-paper transition-colors duration-200 group-hover:bg-accent">
            View
            <ArrowRight
              className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function NavButton({
  label,
  onClick,
  disabled,
  mirrored,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  mirrored?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-full p-2.5 transition-colors',
        disabled
          ? 'cursor-not-allowed bg-[#d9dee5] text-white'
          : 'bg-ink text-paper hover:bg-accent',
      )}
    >
      {mirrored ? (
        <ArrowLeft className="size-7.5" strokeWidth={1.5} aria-hidden />
      ) : (
        <ArrowRight className="size-7.5" strokeWidth={1.5} aria-hidden />
      )}
    </button>
  );
}
