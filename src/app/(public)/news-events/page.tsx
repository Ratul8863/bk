import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { NewsEventsHub } from '@/components/public/NewsEventsHub';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getEvents, getNotices } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'News and Events',
  'Notices, announcements, and events from BK School of Research.',
  '/news-events',
);

export default async function NewsEventsHubPage() {
  const notices = await getNotices();
  const events = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Updates"
        title="News and Events"
        description="Institutional notices and the research programme calendar — bulletin and gatherings in one place."
        imageSrc={pageHeroMedia.newsEvents}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News and Events' },
        ]}
      />

      <Section
        tone="white"
        spaced={false}
        className="py-10 sm:py-16 md:py-24"
      >
        <Container>
          <NewsEventsHub
            notices={notices}
            events={events}
            noticesImage={pageHeroMedia.notices}
            eventsImage={pageHeroMedia.events}
            fallbackImage={pageHeroMedia.newsEvents}
          />
        </Container>
      </Section>
    </>
  );
}
