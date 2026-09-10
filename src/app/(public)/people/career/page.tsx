import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { getNotices } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'Career at BKSR',
  'Vacancies and opportunities to work with BK School of Research.',
  '/people/career',
);

export default function CareerPage() {
  const vacancies = getNotices().filter(
    (item) => item.noticeType === 'vacancy',
  );

  return (
    <>
      <PageHero
        eyebrow="People"
        title="Career at BKSR"
        description="Open calls and vacancy notices for research and programme roles at BK School of Research."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'People', href: '/people' },
          { label: 'Career at BKSR' },
        ]}
        actions={
          <>
            <ArrowLink href="/notices">All notices</ArrowLink>
            <ArrowLink href="/contact">Contact</ArrowLink>
          </>
        }
      />
      <Section>
        <Container narrow>
          {vacancies.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {vacancies.map((item) => (
                <li key={item.id} className="py-7">
                  <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    {[
                      'Vacancy',
                      item.publishedAt
                        ? formatDate(item.publishedAt, 'd MMM yyyy')
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <Link
                    href={`/notices/${item.slug}`}
                    className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  {item.summary ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <EmptyState
                title="No open vacancies"
                description="When BKSR publishes career calls, they will be listed here."
              />
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/notices">Browse notices</ArrowLink>
                <ArrowLink href="/contact">Contact BKSR</ArrowLink>
              </div>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
