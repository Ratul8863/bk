import Link from 'next/link';
import { format, parseISO, isValid } from 'date-fns';
import { MetaLine } from '@/components/ui/MetaLine';
import type { Event } from '@/types/content';
import { cn } from '@/lib/utils';

type EventRowProps = {
  event: Event;
  className?: string;
};

function eventDateParts(iso: string): { month: string; day: string } {
  const date = parseISO(iso);
  if (!isValid(date)) return { month: '—', day: '—' };
  return {
    month: format(date, 'MMM').toUpperCase(),
    day: format(date, 'd'),
  };
}

export function EventRow({ event, className }: EventRowProps) {
  const { month, day } = eventDateParts(event.startAt);

  return (
    <article
      className={cn(
        'grid grid-cols-[4.5rem_1fr] gap-5 border-b border-border py-6 md:grid-cols-[5.5rem_1fr] md:gap-8',
        className,
      )}
    >
      <div className="text-center" aria-hidden>
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {month}
        </p>
        <p className="mt-1 font-display text-3xl leading-none text-ink md:text-4xl">
          {day}
        </p>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl leading-snug text-ink md:text-2xl">
          <Link
            href={`/events/${event.slug}`}
            className="transition-colors hover:text-accent"
          >
            {event.title}
          </Link>
        </h3>
        <MetaLine
          className="mt-2"
          items={[
            event.isOnline ? 'Online' : event.location,
            event.eventStatus,
          ]}
        />
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted md:text-base">
          {event.summary}
        </p>
      </div>
    </article>
  );
}
