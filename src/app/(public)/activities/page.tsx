import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ImageFrame } from '@/components/ui/ImageFrame';
import {
  MediaCard,
  MediaCardAction,
  MediaCardBody,
  MediaCardMedia,
  MediaCardTitle,
} from '@/components/ui/MediaCard';
import { getActivities } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ACTIVITY_ROUTE_META } from '@/lib/public/labels';

export const metadata = buildPageMetadata(
  'Activities',
  'Capacity building, awareness campaigns, research talks, and innovation showcasing at BKSR.',
  '/activities',
);

const routes = ACTIVITY_ROUTE_META.filter((item) =>
  [
    'capacity-building',
    'awareness-campaigns',
    'research-talks',
    'innovation-showcasing',
  ].includes(item.routeSlug),
);

export default function ActivitiesPage() {
  const activities = getActivities();
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Activities"
        description="Public programmes that extend BKSR research into training, dialogue, and creative practice."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Activities' }]}
      />
      <Section>
        <Container>
          <ul className="grid gap-6 md:grid-cols-2">
            {routes.map((route) => {
              const activity = activities.find((item) => item.type === route.type);
              return (
                <li key={route.routeSlug}>
                  <MediaCard href={`/activities/${route.routeSlug}`}>
                    {activity?.imageUrl ? (
                      <MediaCardMedia>
                        <ImageFrame
                          src={activity.imageUrl}
                          alt=""
                          aspect="video"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </MediaCardMedia>
                    ) : null}
                    <MediaCardBody>
                      <MediaCardTitle>{route.label}</MediaCardTitle>
                      <p className="text-sm leading-relaxed text-muted">
                        {activity?.summary ?? 'Programme details forthcoming.'}
                      </p>
                      <MediaCardAction>View programme</MediaCardAction>
                    </MediaCardBody>
                  </MediaCard>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-sm text-muted">
            Looking for webinars? See also{' '}
            <Link href="/events" className="text-accent hover:underline">
              Events
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
