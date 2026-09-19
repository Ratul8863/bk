import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { NoticesIndex } from '@/components/public/NoticesIndex';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getNotices } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Notices',
  'Vacancies, announcements, and institutional notices from BK School of Research.',
  '/notices',
);

export default async function Page() {
  const items = await getNotices();

  return (
    <>
      <PageHero
        eyebrow="Bulletin"
        title="Notices"
        description="Vacancies, announcements, and institutional updates from BK School of Research."
        imageSrc={pageHeroMedia.notices}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News and Events', href: '/news-events' },
          { label: 'Notices' },
        ]}
      />
      <Section
        tone="white"
        spaced={false}
        className="py-10 sm:py-16 md:py-24"
      >
        <Container>
          <NoticesIndex
            items={items}
            fallbackImage={pageHeroMedia.notices}
          />
        </Container>
      </Section>
    </>
  );
}
