import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RichText } from '@/components/ui/RichText';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getActivities, getEvents, getLinkedPeopleForEntity } from '@/lib/content/queries';
import { InvolvedPeople } from '@/components/editorial/InvolvedPeople';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ACTIVITY_ROUTE_META } from '@/lib/public/labels';
import { formatDate } from '@/lib/utils';

type Props = {
  routeSlug: string;
};

export async function ActivityProgrammePage({ routeSlug }: Props) {
  const meta = ACTIVITY_ROUTE_META.find((item) => item.routeSlug === routeSlug);
  if (!meta) notFound();

  const activity = (await getActivities()).find((item) => item.type === meta.type);
  if (!activity) notFound();

  const allEvents = await getEvents();
  const events = (activity.relatedEventIds ?? [])
    .map((id) => allEvents.find((event) => event.id === id))
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Activities"
        title={activity.title}
        description={activity.summary}
        imageSrc={activity.imageUrl ?? pageHeroMedia.activities}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Activities', href: '/activities' },
          { label: activity.title },
        ]}
      />
      <Section tone="white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {activity.imageUrl ? (
              <div className="lg:col-span-5">
                <ImageFrame
                  src={activity.imageUrl}
                  alt=""
                  aspect="video"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  framed
                />
              </div>
            ) : null}
            <div
              className={
                activity.imageUrl
                  ? 'lg:col-span-7'
                  : 'lg:col-span-12 lg:max-w-3xl'
              }
            >
              <RichText content={activity.description} />
              {events.length ? (
                <div className="mt-12 border-t border-border pt-10">
                  <h2 className="font-display text-2xl text-ink">
                    Related events
                  </h2>
                  <ul className="mt-6 space-y-5">
                    {events.map((event) =>
                      event ? (
                        <li key={event.id} className="flex gap-4">
                          {event.featuredImageUrl ? (
                            <Link
                              href={`/events/${event.slug}`}
                              className="hidden w-28 shrink-0 sm:block"
                            >
                              <ImageFrame
                                src={event.featuredImageUrl}
                                alt=""
                                aspect="video"
                                sizes="112px"
                                framed
                              />
                            </Link>
                          ) : null}
                          <div>
                            <Link
                              href={`/events/${event.slug}`}
                              className="font-display text-xl text-ink hover:text-accent"
                            >
                              {event.title}
                            </Link>
                            <p className="mt-1 text-sm text-muted">
                              {formatDate(event.startAt)}
                              {event.location ? ` · ${event.location}` : ''}
                            </p>
                            {event.summary ? (
                              <p className="mt-2 text-sm leading-relaxed text-muted">
                                {event.summary}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
              <div className="mt-10">
                <InvolvedPeople
                  entityType="activity"
                  entityId={activity.id}
                  initialPeople={await getLinkedPeopleForEntity('activity', activity.id)}
                  title="People involved"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export async function activityMetadata(routeSlug: string) {
  const meta = ACTIVITY_ROUTE_META.find((item) => item.routeSlug === routeSlug);
  const activity = (await getActivities()).find((item) => item.type === meta?.type);
  return buildPageMetadata(
    activity?.title ?? meta?.label ?? 'Activity',
    activity?.summary ??
      `${meta?.label ?? 'Activity'} programmes at BK School of Research.`,
    `/activities/${routeSlug}`,
  );
}
