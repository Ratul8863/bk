import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import {
  MediaCard,
  MediaCardAction,
  MediaCardBody,
  MediaCardMedia,
  MediaCardMeta,
  MediaCardTitle,
} from '@/components/ui/MediaCard';
import { Section } from '@/components/ui/Section';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getNews } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'Blogs',
  'Essays, commentary, and public writing from BK School of Research.',
  '/publications/blogs',
);

export default async function Page() {
  const items = await getNews();
  const [featured, ...rest] = items;

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Blogs"
        description="Public essays and commentary from the BKSR archive — the same writing stream previously listed as news."
        imageSrc={pageHeroMedia.publications}
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
      <Section tone="white">
        <Container>
          {!items.length ? (
            <EmptyState
              title="No blog posts yet"
              description="Blog essays will appear here when published."
              action={
                <ArrowLink href="/publications">Browse publications</ArrowLink>
              }
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
                      <p className="mt-4 max-w-2xl font-instrument text-base leading-relaxed text-muted md:text-lg">
                        {featured.excerpt}
                      </p>
                    ) : null}
                    <ArrowLink
                      href={`/news/${featured.slug}`}
                      className="mt-6"
                    >
                      Read essay
                    </ArrowLink>
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
                          <MediaCardMeta>
                            {[
                              item.publishedAt
                                ? formatDate(item.publishedAt, 'd MMM yyyy')
                                : null,
                              item.categoryLabels?.[0],
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </MediaCardMeta>
                          <MediaCardTitle>{item.title}</MediaCardTitle>
                          <MediaCardAction>Read</MediaCardAction>
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
