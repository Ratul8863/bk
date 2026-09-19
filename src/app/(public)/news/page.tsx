import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import {
  MediaCard,
  MediaCardBody,
  MediaCardMedia,
  MediaCardMeta,
  MediaCardTitle,
} from '@/components/ui/MediaCard';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getNews } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'News',
  'Notes and commentary from the BKSR community.',
  '/news',
);

export default async function Page() {
  const items = await getNews();
  const [featured, ...rest] = items;

  return (
    <>
      <PageHero
        eyebrow="Updates"
        title="News"
        description="Editorial notes, essays, and commentary from the BKSR community — migrated from the legacy archive."
        imageSrc={pageHeroMedia.news}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />
      <Section tone="white">
        <Container>
          {!items.length ? (
            <EmptyState
              title="Nothing published yet"
              description="Entries will appear here when available in the archive."
            />
          ) : (
            <div className="space-y-12">
              {featured ? (
                <article className="grid gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:gap-12">
                  {featured.featuredImageUrl ? (
                    <Link
                      href={`/news/${featured.slug}`}
                      className="lg:col-span-5"
                    >
                      <ImageFrame
                        src={featured.featuredImageUrl}
                        alt=""
                        aspect="video"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        framed
                      />
                    </Link>
                  ) : null}
                  <div
                    className={
                      featured.featuredImageUrl
                        ? 'lg:col-span-7'
                        : 'lg:col-span-12 lg:max-w-3xl'
                    }
                  >
                    {featured.publishedAt ? (
                      <time className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        {formatDate(featured.publishedAt)}
                      </time>
                    ) : null}
                    <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                      <Link
                        href={`/news/${featured.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {featured.title}
                      </Link>
                    </h2>
                    {featured.excerpt ? (
                      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                        {featured.excerpt}
                      </p>
                    ) : null}
                    {featured.categoryLabels?.length ? (
                      <p className="mt-4 text-sm text-muted">
                        {featured.categoryLabels.join(' · ')}
                      </p>
                    ) : null}
                  </div>
                </article>
              ) : null}

              {rest.length ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item) => (
                    <li key={item.id}>
                      <MediaCard href={`/news/${item.slug}`}>
                        {item.featuredImageUrl ? (
                          <MediaCardMedia>
                            <ImageFrame
                              src={item.featuredImageUrl}
                              alt=""
                              aspect="video"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </MediaCardMedia>
                        ) : null}
                        <MediaCardBody>
                          {item.publishedAt ? (
                            <MediaCardMeta>
                              {formatDate(item.publishedAt)}
                            </MediaCardMeta>
                          ) : null}
                          <MediaCardTitle>{item.title}</MediaCardTitle>
                          {item.excerpt ? (
                            <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                              {item.excerpt}
                            </p>
                          ) : null}
                        </MediaCardBody>
                      </MediaCard>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
