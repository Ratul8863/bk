import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { getPublications } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Annual reports',
  'Annual reports from BK School of Research.',
  '/publications/annual-reports',
);

export default function Page() {
  const items = getPublications().filter((item) => item.type === 'annual-report');

  return (
    <>
      <PageHero
        title="Annual reports"
        description="Institutional year-in-review documents from BK School of Research."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: 'Annual reports' },
        ]}
      />
      <Section>
        <Container narrow>
          {items.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="py-6">
                  <a
                    href={`/publications/${item.slug}`}
                    className="font-display text-2xl text-ink hover:text-accent"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 text-sm text-muted">{item.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <EmptyState
                title="No annual reports published yet"
                description="The legacy Completed archive listed journal articles, chapters, conference papers, and newspaper opinions — but not annual reports. This section is reserved for future institutional reports."
              />
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/publications">Browse all publications</ArrowLink>
                <ArrowLink href="/publications/journals">Journal articles</ArrowLink>
                <ArrowLink href="/publications/opinions">Opinions</ArrowLink>
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
