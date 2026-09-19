import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { cn, formatDate } from '@/lib/utils';
import type { Event, Notice, NoticeType } from '@/types/content';

const NOTICE_TYPE_LABELS: Record<NoticeType, string> = {
  vacancy: 'Vacancy',
  announcement: 'Announcement',
  deadline: 'Deadline',
  general: 'Notice',
};

type NewsEventsHubProps = {
  notices: Notice[];
  events: Event[];
  noticesImage: string;
  eventsImage: string;
  fallbackImage: string;
};

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

function EventDateStamp({ date }: { date: string }) {
  return (
    <div className="flex min-w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-[1rem] bg-ink px-2 py-2 text-center text-paper sm:min-w-[4.25rem] sm:rounded-[1.15rem] sm:px-3 sm:py-3">
      <span className="font-sans text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-white/70 sm:text-[0.6rem] sm:tracking-[0.16em]">
        {formatDate(date, 'MMM')}
      </span>
      <span className="mt-0.5 font-display text-2xl leading-none sm:text-3xl">
        {formatDate(date, 'd')}
      </span>
      <span className="mt-0.5 font-sans text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white/55 sm:mt-1 sm:text-[0.6rem]">
        {formatDate(date, 'yyyy')}
      </span>
    </div>
  );
}

function GatewayCard({
  href,
  eyebrow,
  title,
  description,
  imageSrc,
  countLabel,
  action,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  countLabel: string;
  action: string;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] bg-ink p-2.5 sm:rounded-[2.25rem] sm:p-4">
      <Link
        href={href}
        className="relative block min-w-0 overflow-hidden rounded-[1.1rem] sm:rounded-[1.65rem]"
        aria-hidden
      >
        <ImageFrame
          src={imageSrc}
          alt=""
          aspect="video"
          sizes="(max-width: 640px) 100vw, 50vw"
          frameClassName="border-0 bg-[#d9d9d9] rounded-[1.1rem] sm:rounded-[1.65rem]"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 px-1 pb-1 pt-3.5 text-paper sm:gap-4 sm:px-2 sm:pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <MetaChip onInk>{eyebrow}</MetaChip>
          <MetaChip onInk>{countLabel}</MetaChip>
        </div>
        <h2 className="text-balance font-instrument text-2xl font-medium leading-tight sm:text-4xl">
          <Link href={href} className="transition-colors hover:text-white">
            {title}
          </Link>
        </h2>
        <p className="max-w-md font-instrument text-sm leading-relaxed text-paper/80 sm:text-base">
          {description}
        </p>
        <div className="mt-auto pt-1 sm:pt-2">
          <Button
            href={href}
            variant="onInk"
            size="md"
            className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
          >
            {action}
          </Button>
        </div>
      </div>
    </article>
  );
}

function NoticeFeedCard({
  notice,
  imageSrc,
}: {
  notice: Notice;
  imageSrc: string;
}) {
  return (
    <li className="min-w-0">
      <Link
        href={`/notices/${notice.slug}`}
        className="group flex h-full min-w-0 gap-2.5 overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white p-2.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25 motion-reduce:hover:translate-y-0 sm:gap-4 sm:rounded-[1.75rem] sm:p-4"
      >
        <span
          className="relative w-20 shrink-0 overflow-hidden rounded-[0.85rem] sm:w-28 sm:rounded-[1rem]"
          aria-hidden
        >
          <ImageFrame
            src={imageSrc}
            alt=""
            aspect="square"
            sizes="112px"
            frameClassName="border-0 rounded-[0.85rem] sm:rounded-[1rem]"
            className="object-cover"
          />
        </span>
        <span className="min-w-0 flex-1 py-0.5">
          <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <MetaChip>{NOTICE_TYPE_LABELS[notice.noticeType]}</MetaChip>
            <time className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[0.65rem] sm:tracking-[0.14em]">
              {formatDate(
                notice.publishedAt ?? notice.createdAt,
                'd MMM yyyy',
              )}
            </time>
          </span>
          <span className="mt-1.5 block text-balance font-instrument text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent sm:mt-2 sm:text-lg">
            {notice.title}
          </span>
          {notice.summary ? (
            <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted sm:mt-1.5">
              {notice.summary}
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  );
}

function EventFeedCard({
  event,
  imageSrc,
}: {
  event: Event;
  imageSrc: string;
}) {
  return (
    <li className="min-w-0">
      <Link
        href={`/events/${event.slug}`}
        className="group flex h-full min-w-0 items-start gap-2.5 overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white p-2.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25 motion-reduce:hover:translate-y-0 sm:gap-4 sm:rounded-[1.75rem] sm:p-4"
      >
        <EventDateStamp date={event.startAt} />
        <span className="min-w-0 flex-1 py-0.5">
          <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <MetaChip>
              {event.eventStatus === 'upcoming' ? 'Upcoming' : 'Archived'}
            </MetaChip>
            {event.isOnline ? <MetaChip>Online</MetaChip> : null}
          </span>
          <span className="mt-1.5 block text-balance font-instrument text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent sm:mt-2 sm:text-lg">
            {event.title}
          </span>
          {event.speakers?.length ? (
            <span className="mt-1 line-clamp-1 block text-sm text-muted sm:mt-1.5">
              {event.speakers[0]}
            </span>
          ) : null}
        </span>
        <span
          className="hidden w-24 shrink-0 overflow-hidden rounded-[0.9rem] sm:block md:w-32 md:rounded-[1rem]"
          aria-hidden
        >
          <ImageFrame
            src={imageSrc}
            alt=""
            aspect="square"
            sizes="128px"
            frameClassName="border-0 rounded-[0.9rem] md:rounded-[1rem]"
            className="object-cover"
          />
        </span>
      </Link>
    </li>
  );
}

export function NewsEventsHub({
  notices,
  events,
  noticesImage,
  eventsImage,
  fallbackImage,
}: NewsEventsHubProps) {
  const recentNotices = notices.slice(0, 3);
  const recentEvents = events.slice(0, 3);
  const upcomingCount = events.filter(
    (event) => event.eventStatus === 'upcoming',
  ).length;

  return (
    <div className="min-w-0 space-y-10 sm:space-y-16 lg:space-y-20">
      <div className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Updates desk
            </p>
            <p className="mt-1.5 text-balance font-instrument text-base leading-snug text-ink sm:mt-2 sm:text-xl">
              Two streams â€” the institutional bulletin and the research
              programme calendar.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <MetaChip>
              {notices.length}{' '}
              {notices.length === 1 ? 'notice' : 'notices'}
            </MetaChip>
            <MetaChip>
              {events.length}{' '}
              {events.length === 1 ? 'event' : 'events'}
            </MetaChip>
            <MetaChip>
              {upcomingCount
                ? `${upcomingCount} upcoming`
                : 'Season quiet'}
            </MetaChip>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <li className="min-w-0">
            <GatewayCard
              href="/notices"
              eyebrow="Bulletin"
              title="Notices"
              description="Vacancies, announcements, and institutional updates from BKSR."
              imageSrc={noticesImage}
              countLabel={`${notices.length} posted`}
              action="Browse notices"
            />
          </li>
          <li className="min-w-0">
            <GatewayCard
              href="/events"
              eyebrow="Calendar"
              title="Events"
              description="Webinars, workshops, and research conversations from the BKSR calendar."
              imageSrc={eventsImage}
              countLabel={`${events.length} gatherings`}
              action="Browse events"
            />
          </li>
        </ul>
      </div>

      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:gap-10 xl:gap-14">
        <section className="min-w-0" aria-labelledby="hub-notices-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-6 sm:gap-4">
            <div className="min-w-0">
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Bulletin
              </p>
              <h2
                id="hub-notices-heading"
                className="mt-1 font-display text-xl text-ink sm:text-3xl"
              >
                Recent notices
              </h2>
            </div>
            <ArrowLink href="/notices">All notices</ArrowLink>
          </div>

          {recentNotices.length ? (
            <ul className="grid gap-3 sm:gap-4">
              {recentNotices.map((notice) => (
                <NoticeFeedCard
                  key={notice.id}
                  notice={notice}
                  imageSrc={notice.featuredImageUrl || fallbackImage}
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-[1.25rem] border border-border bg-white px-4 py-7 text-sm text-muted sm:rounded-[1.5rem] sm:px-5 sm:py-8">
              Notices will appear here when published.
            </p>
          )}
        </section>

        <section className="min-w-0" aria-labelledby="hub-events-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-6 sm:gap-4">
            <div className="min-w-0">
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Calendar
              </p>
              <h2
                id="hub-events-heading"
                className="mt-1 font-display text-xl text-ink sm:text-3xl"
              >
                Recent events
              </h2>
            </div>
            <ArrowLink href="/events">All events</ArrowLink>
          </div>

          {recentEvents.length ? (
            <ul className="grid gap-3 sm:gap-4">
              {recentEvents.map((event) => (
                <EventFeedCard
                  key={event.id}
                  event={event}
                  imageSrc={event.featuredImageUrl || fallbackImage}
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-[1.25rem] border border-border bg-white px-4 py-7 text-sm text-muted sm:rounded-[1.5rem] sm:px-5 sm:py-8">
              Events will appear here when scheduled.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
