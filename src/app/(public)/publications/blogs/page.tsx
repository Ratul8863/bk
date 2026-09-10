import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { getNews } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'Blogs',
  'Essays, commentary, and public writing from BK School of Research.',
  '/publications/blogs',
);

export default function Page() {
  const items = getNews();

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Blogs"
        description="Public essays and commentary from the BKSR archive — the same writing stream previously listed as news."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: 'Blogs' },
        ]}
        actions={
          <>
            <ArrowLink href="/publications">All publications</ArrowLink>
            <ArrowLink href="/news">News index</ArrowLink>
          </>
        }
      />
      <Section>
        <Container narrow>
          {items.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="py-7">
                  <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    {[
                      item.publishedAt
                        ? formatDate(item.publishedAt, 'd MMM yyyy')
                        : null,
                      item.categoryLabels?.[0],
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <Link
                    href={`/news/${item.slug}`}
                    className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  {item.excerpt ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.excerpt}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <EmptyState
                title="No blog posts yet"
                description="Blog essays will appear here when published."
              />
              <div className="mt-10">
                <ArrowLink href="/publications">Browse publications</ArrowLink>
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
