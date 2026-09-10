import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { getPublications } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Newsletters',
  'Newsletters from BK School of Research.',
  '/publications/newsletters',
);

export default function Page() {
  const items = getPublications().filter((item) => item.type === 'newsletter');

  return (
    <>
      <PageHero
        title="Newsletters"
        description="Periodic institutional updates from BK School of Research."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: 'Newsletters' },
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
                title="No newsletters published yet"
                description="Newsletter issues were not part of the migrated legacy archive. When BKSR issues newsletters, they will be listed here."
              />
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/news">Read news</ArrowLink>
                <ArrowLink href="/publications">Browse publications</ArrowLink>
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
