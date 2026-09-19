import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ActivitiesHub } from '@/components/public/ActivitiesHub';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getActivities, getEvents } from '@/lib/content/queries';
import { ACTIVITY_ROUTE_META } from '@/lib/public/labels';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Activities',
  'Capacity building, awareness campaigns, research talks, and innovation showcasing at BKSR.',
  '/activities',
);

const ROUTE_ORDER = [
  'capacity-building',
  'awareness-campaigns',
  'research-talks',
  'innovation-showcasing',
] as const;

export default async function ActivitiesPage() {
  const activities = await getActivities();
  const events = await getEvents();

  const programmes = ROUTE_ORDER.map((routeSlug) => {
    const meta = ACTIVITY_ROUTE_META.find(
      (item) => item.routeSlug === routeSlug,
    );
    if (!meta) return null;
    const activity = activities.find((item) => item.type === meta.type);
    if (!activity) return null;
    return {
      routeSlug,
      label: meta.label,
      activity,
      href: `/activities/${routeSlug}`,
    };
  }).filter((item): item is NonNullable<typeof item> => Boolean(item));

  const relatedEventIds = [
    ...new Set(
      programmes.flatMap((item) => item.activity.relatedEventIds ?? []),
    ),
  ];
  const relatedEvents = relatedEventIds
    .map((id) => events.find((event) => event.id === id))
    .filter((event): event is NonNullable<typeof event> => Boolean(event))
    .sort((a, b) => b.startAt.localeCompare(a.startAt));

  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Activities"
        description="Public programmes that extend BKSR research into training, dialogue, campaigns, and creative practice."
        imageSrc={pageHeroMedia.activities}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Activities' }]}
      />
      <Section
        tone="white"
        spaced={false}
        className="py-10 sm:py-16 md:py-24"
      >
        <Container>
          <ActivitiesHub
            programmes={programmes}
            relatedEvents={relatedEvents}
            fallbackImage={pageHeroMedia.activities}
          />
        </Container>
      </Section>
    </>
  );
}
