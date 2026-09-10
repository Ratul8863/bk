import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import {
  ArticleReading,
  EventAside,
} from '@/components/editorial/ArticleReading';
import { getEventBySlug, getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getEvents({ includeDrafts: true }).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getEventBySlug(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(item.title, item.summary, `/events/${item.slug}`);
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const item = getEventBySlug(slug);
  if (!item) notFound();

  const when = formatDate(item.startAt, "d MMMM yyyy · h:mm a");

  return (
    <>
      <PageHero
        eyebrow={item.eventStatus === 'upcoming' ? 'Upcoming' : 'Past event'}
        title={item.title}
        description={item.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          { label: item.title },
        ]}
      />
      <ArticleReading
        body={item.description}
        imageUrl={item.featuredImageUrl}
        imageAlt={`Poster for ${item.title}`}
        imageAspect="video"
        meta={
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {[
              when,
              item.isOnline ? 'Online webinar' : item.location,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        }
        aside={
          <EventAside
            when={when}
            where={item.location}
            isOnline={item.isOnline}
            speakers={item.speakers}
            status={item.eventStatus}
            registerHref={item.registrationUrl}
            watchHref={item.recordingUrl}
          />
        }
        legacyUrl={item.originalLegacyUrl}
        backHref="/events"
        backLabel="All events"
      />
    </>
  );
}
