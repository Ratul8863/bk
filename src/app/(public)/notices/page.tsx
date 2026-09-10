import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { getNotices } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'Notices',
  'Vacancies, announcements, and institutional notices.',
  '/notices',
);

export default function Page() {
  const items = getNotices();
  return (
    <>
      <PageHero
        eyebrow="Bulletin"
        title="Notices"
        description="Vacancies, announcements, and institutional notices."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Notices' }]}
      />
      <Section>
        <Container>
          {items.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-5 py-6">
                  {item.featuredImageUrl ? (
                    <Link
                      href={`/notices/${item.slug}`}
                      className="hidden w-20 shrink-0 sm:block md:w-24"
                      aria-hidden
                    >
                      <ImageFrame
                        src={item.featuredImageUrl}
                        alt=""
                        aspect="square"
                        sizes="96px"
                        framed
                      />
                    </Link>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    {item.publishedAt ? (
                      <time className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        {formatDate(item.publishedAt)}
                      </time>
                    ) : null}
                    <Link
                      href={`/notices/${item.slug}`}
                      className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    {item.summary ? (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted line-clamp-2">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
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
