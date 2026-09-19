import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchPanel } from '@/components/search/SearchPanel';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Search',
  'Search publications, research, people, news, events, notices, and resources.',
  '/search',
);

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Find"
        title="Search"
        description="Look across the public BKSR archive — publications, research, people, news, events, notices, and resources."
        imageSrc={pageHeroMedia.default}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
      />
      <Section tone="white">
        <Container>
          <div className="border border-border bg-paper p-5 md:p-8">
            <SearchPanel
              initialQuery={params.q ?? ''}
              initialCategory={params.category ?? 'all'}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
