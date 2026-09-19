import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PublicationFilters } from '@/components/public/PublicationFilters';
import { getPublications, getResearchAreas } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Opinions',
  'Opinions from BK School of Research.',
  '/publications/opinions',
);

export default async function Page() {
  return (
    <>
      <PageHero
        title="Opinions"
        description="Filtered view of the publication library."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: 'Opinions' },
        ]}
      />
      <Section>
        <Container>
          <PublicationFilters
            publications={await getPublications()}
            areas={await getResearchAreas()}
            initialType="opinion"
          />
        </Container>
      </Section>
    </>
  );
}

