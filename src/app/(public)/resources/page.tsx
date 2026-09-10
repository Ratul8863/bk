import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tag } from '@/components/ui/Tag';
import { getResources } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Resources',
  'Guides, tutorials, and archives from the BKSR knowledge hub.',
  '/resources',
);

export default function Page() {
  const items = getResources();
  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        title="Resources"
        description="Statistical software guides and archive notes from the BKSR Knowledge Hub — carried forward from the legacy site."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />
      <Section>
        <Container>
          {items.length ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/resources/${item.slug}`}
                    className="group flex h-full flex-col border border-border bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-[0_20px_44px_-30px_rgba(13,39,69,0.35)]"
                  >
                    {item.software?.length ? (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {item.software.map((soft) => (
                          <Tag key={soft}>{soft}</Tag>
                        ))}
                      </div>
                    ) : null}
                    <h2 className="font-display text-2xl text-ink transition-colors group-hover:text-accent">
                      {item.title}
                    </h2>
                    {item.summary ? (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                        {item.summary}
                      </p>
                    ) : null}
                    <span className="mt-5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      Open resource →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Nothing published yet"
              description="Entries will appear here when available in the archive."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
