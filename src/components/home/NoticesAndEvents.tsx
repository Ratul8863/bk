'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { cn } from '@/lib/utils';

export type NoticesAndEventsItem = {
  id: string;
  href: string;
  title: string;
  summary?: string;
  imageUrl?: string | null;
};

type Tab = 'notices' | 'events';

type NoticesAndEventsProps = {
  notices: NoticesAndEventsItem[];
  events: NoticesAndEventsItem[];
  fallbackImage?: string;
};

const VISIBLE = 3;

function NoticeEventCard({
  slide,
  imageSrc,
  compact = false,
}: {
  slide: NoticesAndEventsItem;
  imageSrc: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        'flex h-full flex-col bg-ink',
        compact
          ? 'gap-4 rounded-[1.5rem] p-3.5'
          : 'gap-6 rounded-[2.125rem] p-5',
      )}
    >
      <ImageFrame
        src={imageSrc}
        alt=""
        aspect="video"
        sizes={
          compact
            ? '(max-width: 640px) 85vw, 352px'
            : '(max-width: 1024px) 50vw, 33vw'
        }
        frameClassName={cn(
          'shrink-0 border-0 bg-[#d9d9d9]',
          compact ? 'rounded-[1.15rem]' : 'rounded-[1.5625rem]',
        )}
        className="object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 text-paper sm:gap-4">
        <h3
          className={cn(
            'font-instrument font-medium leading-snug',
            compact ? 'text-lg' : 'text-xl sm:text-2xl',
          )}
        >
          {slide.title}
        </h3>
        {slide.summary ? (
          <p
            className={cn(
              'line-clamp-3 font-instrument leading-normal text-paper/90',
              compact ? 'text-sm' : 'text-sm sm:text-base',
            )}
          >
            {slide.summary}
          </p>
        ) : null}
      </div>

      <Button
        href={slide.href}
        variant="onInk"
        size={compact ? 'md' : 'lg'}
        className={cn(
          'mt-auto w-fit font-normal tracking-normal',
          !compact && 'h-13.5 px-6',
        )}
      >
        Learn More
      </Button>
    </article>
  );
}

function TabToggle({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (next: Tab) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      role="tablist"
      aria-label="Notices and events"
    >
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'notices'}
        onClick={() => onChange('notices')}
        className={cn(
          'rounded-full px-5 py-3 font-instrument text-sm transition-colors sm:px-6 sm:py-4 sm:text-base',
          tab === 'notices'
            ? 'bg-ink text-paper'
            : 'border border-ink text-ink hover:bg-ink hover:text-paper',
        )}
      >
        Notices
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={tab === 'events'}
        onClick={() => onChange('events')}
        className={cn(
          'rounded-full px-5 py-3 font-instrument text-sm transition-colors sm:px-6 sm:py-4 sm:text-base',
          tab === 'events'
            ? 'bg-ink text-paper'
            : 'border border-ink text-ink hover:bg-ink hover:text-paper',
        )}
      >
        Events
      </button>
    </div>
  );
}

/**
 * Small screens: horizontal snap deck — same idea as BKSR in Media.
 */
function NoticesEventsMobileDeck({
  slides,
  tab,
  imageFor,
}: {
  slides: NoticesAndEventsItem[];
  tab: Tab;
  imageFor: (slide: NoticesAndEventsItem) => string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [tab]);

  const syncIndex = () => {
    const root = scrollerRef.current;
    if (!root) return;
    const slide = root.children[0] as HTMLElement | undefined;
    if (!slide) return;
    const step = slide.offsetWidth + 16;
    if (step <= 0) return;
    const next = Math.round(root.scrollLeft / step);
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  };

  const goTo = (next: number) => {
    const root = scrollerRef.current;
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    const slideEl = root?.children[0] as HTMLElement | undefined;
    if (root && slideEl) {
      const step = slideEl.offsetWidth + 16;
      root.scrollTo({ left: clamped * step, behavior: 'smooth' });
    }
    setIndex(clamped);
  };

  if (!slides.length) {
    return (
      <p className="font-instrument text-sm text-ink/70 lg:hidden">
        {tab === 'notices'
          ? 'Notices will appear here when published.'
          : 'Events will appear here when published.'}
      </p>
    );
  }

  return (
    <div className="w-full lg:hidden">
      <div className="mb-4 flex items-end justify-between gap-3">
        <p className="font-sans text-[0.6875rem] font-semibold tracking-[0.12em] text-ink/55">
          {tab === 'notices' ? 'NOTICES' : 'EVENTS'}
        </p>
        <p
          className="font-sans text-[0.6875rem] font-medium tabular-nums text-ink/45"
          data-notice-events-index
        >
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(slides.length).padStart(2, '0')}
        </p>
      </div>

      <ul
        ref={scrollerRef}
        data-lenis-prevent
        onScroll={syncIndex}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={tab === 'notices' ? 'Notices' : 'Events'}
      >
        {slides.map((slide) => (
          <li
            key={`${tab}-${slide.id}`}
            className="w-[min(100%,20.5rem)] shrink-0 snap-start sm:w-[22rem]"
          >
            <NoticeEventCard
              slide={slide}
              imageSrc={imageFor(slide)}
              compact
            />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-[width,background-color] duration-300',
                i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25',
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous card"
            disabled={index <= 0}
            onClick={() => goTo(index - 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Next card"
            disabled={index >= slides.length - 1}
            onClick={() => goTo(index + 1)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Desktop: three equal navy cards. */
function NoticesEventsDesktopGrid({
  slides,
  tab,
  imageFor,
}: {
  slides: NoticesAndEventsItem[];
  tab: Tab;
  imageFor: (slide: NoticesAndEventsItem) => string;
}) {
  if (!slides.length) {
    return (
      <p className="hidden font-instrument text-base text-ink/70 lg:block">
        {tab === 'notices'
          ? 'Notices will appear here when published.'
          : 'Events will appear here when published.'}
      </p>
    );
  }

  return (
    <ul className="hidden w-full min-w-0 gap-5 lg:grid lg:grid-cols-3">
      {slides.map((slide) => (
        <li key={`${tab}-${slide.id}`} className="min-w-0">
          <NoticeEventCard slide={slide} imageSrc={imageFor(slide)} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Figma Pharmacinta 212:75 — Notice & Events
 * Desktop: 3-card grid · Mobile: BKSR-in-Media style swipe deck
 */
export function NoticesAndEvents({
  notices,
  events,
  fallbackImage = '/media/prototype/bksr-hero-seminar.jpg',
}: NoticesAndEventsProps) {
  const [tab, setTab] = useState<Tab>('notices');

  const slides = (tab === 'notices' ? notices : events).slice(0, VISIBLE);
  if (!notices.length && !events.length) return null;

  const imageFor = (slide: NoticesAndEventsItem) =>
    slide.imageUrl || fallbackImage;

  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10">
      <NoticesEventsMobileDeck
        slides={slides}
        tab={tab}
        imageFor={imageFor}
      />
      <NoticesEventsDesktopGrid
        slides={slides}
        tab={tab}
        imageFor={imageFor}
      />

      <TabToggle tab={tab} onChange={setTab} />
    </div>
  );
}
