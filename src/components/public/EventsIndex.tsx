'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { cn, formatDate } from '@/lib/utils';
import type { Event } from '@/types/content';

type FilterKey = 'all' | 'upcoming' | 'past';

type EventsIndexProps = {
  upcoming: Event[];
  past: Event[];
  fallbackImage: string;
  /** eventId â†’ registration form slug when a published form is linked */
  registrationByEventId?: Record<string, string>;
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All gatherings' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Archive' },
];

const chipScroll =
  'flex w-max max-w-none gap-2 sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2.5';
const chipScroller =
  '-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden';

function EventDateStamp({
  date,
  tone = 'ink',
  size = 'md',
}: {
  date: string;
  tone?: 'ink' | 'paper' | 'accent';
  size?: 'md' | 'lg';
}) {
  const day = formatDate(date, 'd');
  const month = formatDate(date, 'MMM');
  const year = formatDate(date, 'yyyy');

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-center justify-center text-center',
        size === 'lg'
          ? 'min-w-[4.25rem] rounded-[1.1rem] px-2.5 py-2.5 sm:min-w-[6.5rem] sm:rounded-[1.5rem] sm:px-5 sm:py-5'
          : 'min-w-[3.5rem] rounded-[1rem] px-2 py-2 sm:min-w-[4.75rem] sm:rounded-[1.25rem] sm:px-3 sm:py-3',
        tone === 'ink' && 'bg-ink text-paper',
        tone === 'paper' && 'bg-paper text-ink',
        tone === 'accent' && 'bg-accent text-white',
      )}
    >
      <span
        className={cn(
          'font-sans font-semibold uppercase tracking-[0.14em]',
          size === 'lg'
            ? 'text-[0.55rem] sm:text-[0.65rem] sm:tracking-[0.16em]'
            : 'text-[0.55rem] sm:text-[0.6rem]',
          tone === 'ink' || tone === 'accent' ? 'text-white/70' : 'text-brand-red',
        )}
      >
        {month}
      </span>
      <span
        className={cn(
          'font-display leading-none',
          size === 'lg'
            ? 'mt-0.5 text-3xl sm:mt-1 sm:text-5xl'
            : 'mt-0.5 text-2xl sm:text-3xl',
        )}
      >
        {day}
      </span>
      <span
        className={cn(
          'mt-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.12em] sm:mt-1 sm:text-[0.6rem] sm:tracking-[0.14em]',
          tone === 'ink' || tone === 'accent' ? 'text-white/55' : 'text-muted',
        )}
      >
        {year}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
  onInk = false,
}: {
  status: Event['eventStatus'];
  onInk?: boolean;
}) {
  const label =
    status === 'upcoming'
      ? 'Upcoming'
      : status === 'cancelled'
        ? 'Cancelled'
        : 'Archived';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.14em]',
        onInk
          ? 'border-paper/30 text-paper/85'
          : status === 'upcoming'
            ? 'border-accent/25 bg-accent/5 text-accent'
            : 'border-ink/15 text-ink/70',
      )}
    >
      {label}
    </span>
  );
}

function MetaChip({
  children,
  onInk = false,
}: {
  children: React.ReactNode;
  onInk?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em] sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.12em]',
        onInk
          ? 'border-paper/25 text-paper/75'
          : 'border-ink/12 text-ink/65',
      )}
    >
      {children}
    </span>
  );
}

function FeaturedEvent({
  event,
  imageSrc,
  formSlug,
}: {
  event: Event;
  imageSrc: string;
  formSlug?: string;
}) {
  const isUpcoming = event.eventStatus === 'upcoming';
  const formOpen = Boolean(formSlug);
  const primaryHref = isUpcoming
    ? formOpen
      ? `/forms/${formSlug}`
      : event.registrationUrl || `/events/${event.slug}`
    : event.recordingUrl || `/events/${event.slug}`;
  const primaryLabel = isUpcoming
    ? formOpen || event.registrationUrl
      ? 'Register'
      : 'View event'
    : event.recordingUrl
      ? 'Watch recording'
      : 'View event';
  const primaryExternal = Boolean(
    isUpcoming
      ? !formOpen && event.registrationUrl
      : event.recordingUrl,
  );

  return (
    <article className="min-w-0 overflow-hidden rounded-[1.35rem] bg-ink p-2.5 sm:rounded-[2.5rem] sm:p-4 lg:p-5">
      <div className="grid gap-3 sm:gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <div className="relative min-w-0 overflow-hidden rounded-[1.1rem] lg:col-span-5 sm:rounded-[1.75rem]">
          <ImageFrame
            src={imageSrc}
            alt=""
            aspect="video"
            sizes="(max-width: 1024px) 100vw, 42vw"
            frameClassName="border-0 bg-[#d9d9d9] rounded-[1.1rem] sm:rounded-[1.75rem]"
            className="object-cover"
          />
          <div className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4">
            <EventDateStamp date={event.startAt} tone="paper" size="lg" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center px-1 pb-1 pt-0.5 text-paper sm:px-3 lg:col-span-7 lg:px-4 lg:py-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <StatusBadge status={event.eventStatus} onInk />
            {event.isOnline ? <MetaChip onInk>Online</MetaChip> : null}
            <time className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-paper/55 sm:text-[0.6875rem] sm:tracking-[0.16em]">
              <span className="sm:hidden">
                {formatDate(event.startAt, 'd MMM yyyy')}
              </span>
              <span className="hidden sm:inline">
                {formatDate(event.startAt, "d MMMM yyyy Â· h:mm a")}
              </span>
            </time>
          </div>

          <h2 className="mt-2.5 text-balance font-instrument text-[1.35rem] font-medium leading-snug text-paper sm:mt-4 sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            <Link
              href={`/events/${event.slug}`}
              className="break-words transition-colors hover:text-white"
            >
              {event.title}
            </Link>
          </h2>

          {event.speakers?.length ? (
            <p className="mt-2 line-clamp-2 font-instrument text-sm text-paper/75 sm:mt-4 sm:line-clamp-none sm:text-base">
              With{' '}
              {event.speakers.filter((s) => !/moderator/i.test(s)).join(' Â· ')}
            </p>
          ) : null}

          {event.summary ? (
            <p className="mt-2 line-clamp-3 max-w-2xl font-instrument text-sm leading-relaxed text-paper/80 sm:mt-3 sm:line-clamp-none sm:text-base">
              {event.summary}
            </p>
          ) : null}

          {event.location ? (
            <p className="mt-2 line-clamp-1 text-sm text-paper/55 sm:mt-3">
              {event.location}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <Button
              href={primaryHref}
              external={primaryExternal}
              variant="onInk"
              size="md"
              className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
            >
              {primaryLabel}
            </Button>
            <Button
              href={`/events/${event.slug}`}
              variant="onInkSecondary"
              size="md"
              className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
            >
              Event details
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventCard({
  event,
  imageSrc,
}: {
  event: Event;
  imageSrc: string;
}) {
  const isUpcoming = event.eventStatus === 'upcoming';

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-ink/10 bg-white transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25 motion-reduce:hover:translate-y-0 sm:rounded-[2rem]">
      <Link
        href={`/events/${event.slug}`}
        className="relative block min-w-0 shrink-0"
        aria-hidden
      >
        <ImageFrame
          src={imageSrc}
          alt=""
          aspect="video"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          frameClassName="border-0 rounded-none"
          className="object-cover"
        />
        <div className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4">
          <EventDateStamp
            date={event.startAt}
            tone={isUpcoming ? 'accent' : 'ink'}
          />
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5 sm:gap-3.5 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <StatusBadge status={event.eventStatus} />
          {event.isOnline ? <MetaChip>Online</MetaChip> : null}
        </div>

        <h3 className="text-balance font-instrument text-base font-medium leading-snug text-ink sm:text-xl">
          <Link
            href={`/events/${event.slug}`}
            className="break-words transition-colors group-hover:text-accent"
          >
            {event.title}
          </Link>
        </h3>

        {event.speakers?.length ? (
          <p className="line-clamp-1 text-sm leading-snug text-muted sm:line-clamp-2">
            {event.speakers[0]}
            {event.speakers.length > 1 ? ' + moderator' : null}
          </p>
        ) : null}

        {event.summary ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {event.summary}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 sm:pt-2">
          <Button
            href={`/events/${event.slug}`}
            variant="secondary"
            size="sm"
            className="font-normal tracking-normal"
          >
            View event
          </Button>
          {!isUpcoming && event.recordingUrl ? (
            <Link
              href={event.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:text-ink"
            >
              Recording â†’
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function QuietSeason({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-[1.35rem] bg-ink px-4 py-7 text-paper sm:rounded-[2.25rem] sm:px-8 sm:py-10 lg:px-10',
        className,
      )}
    >
      <div className="grid gap-5 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
            Next on the calendar
          </p>
          <h3 className="mt-2.5 text-balance font-instrument text-xl font-medium leading-snug sm:mt-3 sm:text-3xl lg:text-4xl">
            No upcoming session posted yet â€” the programme archive stays open.
          </h3>
          <p className="mt-2.5 max-w-xl font-instrument text-sm leading-relaxed text-paper/75 sm:mt-3 sm:text-base">
            Seminars, webinars, and training calls appear here when scheduled.
            Meanwhile, explore past gatherings or follow ongoing activities.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
          <Button
            href="/activities"
            variant="onInk"
            size="md"
            className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
          >
            Activities
          </Button>
          <Button
            href="/contact"
            variant="onInkSecondary"
            size="md"
            className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
          >
            Suggest a session
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EventsIndex({
  upcoming,
  past,
  fallbackImage,
  registrationByEventId = {},
}: EventsIndexProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const all = useMemo(() => [...upcoming, ...past], [upcoming, past]);

  const filtered = useMemo(() => {
    if (filter === 'upcoming') return upcoming;
    if (filter === 'past') return past;
    return all;
  }, [filter, upcoming, past, all]);

  const availableFilters = useMemo(() => {
    return FILTERS.filter((entry) => {
      if (entry.key === 'all') return all.length > 0;
      if (entry.key === 'upcoming') return true;
      return past.length > 0;
    });
  }, [all.length, past.length]);

  const spotlight =
    filter === 'past'
      ? past[0]
      : filter === 'upcoming'
        ? upcoming[0]
        : (upcoming[0] ?? past[0]);

  const rest = filtered.filter((event) => event.id !== spotlight?.id);

  if (!all.length) {
    return (
      <EmptyState
        title="No events listed yet"
        description="Webinars, workshops, and gatherings will appear here when scheduled."
      />
    );
  }

  return (
    <div className="min-w-0 space-y-7 sm:space-y-12">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 max-w-2xl">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Programme calendar
          </p>
          <p className="mt-1.5 text-balance font-instrument text-base leading-snug text-ink sm:mt-2 sm:text-xl">
            Webinars, workshops, and research conversations hosted by BKSR.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            <MetaChip>
              {all.length} {all.length === 1 ? 'gathering' : 'gatherings'}
            </MetaChip>
            {upcoming.length ? (
              <MetaChip>{upcoming.length} upcoming</MetaChip>
            ) : (
              <MetaChip>Season quiet</MetaChip>
            )}
            <MetaChip>{past.length} in archive</MetaChip>
          </div>
        </div>

        <div className={chipScroller}>
          <div className={chipScroll} role="tablist" aria-label="Filter events">
            {availableFilters.map((entry) => {
              const active = filter === entry.key;
              return (
                <button
                  key={entry.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(entry.key)}
                  className={cn(
                    'inline-flex shrink-0 items-center justify-center rounded-full border px-3.5 py-2 font-sans text-xs transition-[background-color,border-color,color,box-shadow] duration-200 sm:rounded-3xl sm:px-5 sm:py-3 sm:text-sm',
                    active
                      ? 'border-ink bg-ink text-paper shadow-[0_10px_28px_-18px_rgba(13,39,69,0.55)]'
                      : 'border-ink/15 bg-white text-ink/75 hover:border-ink/35 hover:text-ink',
                  )}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filter === 'upcoming' && !upcoming.length ? <QuietSeason /> : null}

      {filter === 'upcoming' && !upcoming.length ? null : !filtered.length ? (
        <EmptyState
          title="Nothing in this view"
          description="Try another filter to browse the programme."
        />
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {spotlight ? (
            <FeaturedEvent
              event={spotlight}
              imageSrc={spotlight.featuredImageUrl || fallbackImage}
              formSlug={
                registrationByEventId[spotlight.id]
              }
            />
          ) : null}

          {rest.length ? (
            <div className="min-w-0">
              <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
                <h3 className="min-w-0 text-balance font-display text-xl text-ink sm:text-3xl">
                  {filter === 'upcoming'
                    ? 'Coming up'
                    : filter === 'past'
                      ? 'From the archive'
                      : upcoming.length
                        ? 'Also on the calendar'
                        : 'From the archive'}
                </h3>
                <p className="hidden shrink-0 text-sm text-muted sm:block">
                  {rest.length} more
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {rest.map((event) => (
                  <li key={event.id} className="min-w-0">
                    <EventCard
                      event={event}
                      imageSrc={event.featuredImageUrl || fallbackImage}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
