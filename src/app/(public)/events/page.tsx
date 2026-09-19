import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EventsIndex } from '@/components/public/EventsIndex';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getContentDatabase } from '@/lib/cms/get-content-database';
import { resolveFormForEvent } from '@/lib/content/registration-forms';
import { getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Events',
  'Webinars, workshops, and research gatherings from BK School of Research.',
  '/events',
);

export default async function EventsPage() {
  const [upcoming, past, db] = await Promise.all([
    getEvents({ eventStatus: 'upcoming' }),
    getEvents({ eventStatus: 'past' }),
    getContentDatabase(),
  ]);

  const registrationByEventId: Record<string, string> = {};
  for (const event of [...upcoming, ...past]) {
    const form = resolveFormForEvent(db, event);
    if (form && form.status === 'published' && form.isOpen) {
      registrationByEventId[event.id] = form.slug;
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Calendar"
        title="Events"
        description="Webinars, workshops, and research conversations — live sessions and the programme archive."
        imageSrc={pageHeroMedia.events}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News and Events', href: '/news-events' },
          { label: 'Events' },
        ]}
      />
      <Section
        tone="white"
        spaced={false}
        className="py-10 sm:py-16 md:py-24"
      >
        <Container>
          <EventsIndex
            upcoming={upcoming}
            past={past}
            fallbackImage={pageHeroMedia.events}
            registrationByEventId={registrationByEventId}
          />
        </Container>
      </Section>
    </>
  );
}
