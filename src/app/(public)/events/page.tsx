import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/types/content';

export const metadata = buildPageMetadata(
  'Events',
  'Upcoming and past events from BK School of Research.',
  '/events',
);

function EventRow({ event }: { event: Event }) {
  return (
    <li>
      <Link
        href={`/events/${event.slug}`}
        className="bksr-panel group flex gap-4 p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(13,39,69,0.06),0_28px_48px_-28px_rgba(13,39,69,0.4)] motion-reduce:hover:translate-y-0 sm:gap-5 sm:p-5"
      >
        <div className="min-w-[3.5rem] sm:min-w-[4.5rem]">
          <p className="font-display text-3xl text-ink">
            {formatDate(event.startAt, 'd')}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-red">
            {formatDate(event.startAt, 'MMM yyyy')}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-display text-xl text-ink transition-colors group-hover:text-accent sm:text-2xl">
            {event.title}
          </span>
          {event.location ? (
            <p className="mt-1 text-sm text-muted">{event.location}</p>
          ) : null}
          {event.summary ? (
            <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-muted">
              {event.summary}
            </p>
          ) : null}
        </div>
        {event.featuredImageUrl ? (
          <span className="hidden w-28 shrink-0 sm:block md:w-36" aria-hidden>
            <ImageFrame
              src={event.featuredImageUrl}
              alt=""
              aspect="video"
              sizes="144px"
              framed
            />
          </span>
        ) : null}
      </Link>
    </li>
  );
}

export default function EventsPage() {
  const upcoming = getEvents({ eventStatus: 'upcoming' });
  const past = getEvents({ eventStatus: 'past' });

  return (
    <>
      <PageHero
        eyebrow="Calendar"
        title="Events"
        description="Webinars, workshops, and gatherings associated with BKSR."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-3xl text-ink">Upcoming</h2>
          {upcoming.length ? (
            <ul className="mt-6 grid gap-4">
              {upcoming.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-6"
              title="No upcoming events"
              description="Past events are listed below."
            />
          )}

          <h2 className="mt-16 font-display text-3xl text-ink">Past</h2>
          {past.length ? (
            <ul className="mt-6 grid gap-4">
              {past.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-6" title="No past events listed" />
          )}
        </Container>
      </Section>
    </>
  );
}
