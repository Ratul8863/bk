import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  MediaCard,
  MediaCardAction,
  MediaCardBody,
  MediaCardMedia,
  MediaCardMeta,
  MediaCardTitle,
} from '@/components/ui/MediaCard';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getResources } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Resources',
  'Guides, tutorials, and archives from the BKSR knowledge hub.',
  '/resources',
);

export default async function Page() {
  const items = await getResources();
  return (
    <>
      <PageHero
        eyebrow="Knowledge hub"
        title="Resources"
        description="Statistical software guides and archive notes from the BKSR Knowledge Hub — carried forward from the legacy site."
        imageSrc={pageHeroMedia.resources}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resources' }]}
      />
      <Section tone="white">
        <Container>
          {items.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <MediaCard href={`/resources/${item.slug}`}>
                    <MediaCardMedia className="bg-sage/50">
                      <div className="flex aspect-video items-end p-5">
                        <span className="font-display text-4xl text-ink/15">
                          {(item.software?.[0] ?? item.title).slice(0, 2)}
                        </span>
                      </div>
                    </MediaCardMedia>
                    <MediaCardBody>
                      <MediaCardMeta>
                        {item.software?.length
                          ? item.software.join(' · ')
                          : 'Guide'}
                      </MediaCardMeta>
                      <MediaCardTitle>{item.title}</MediaCardTitle>
                      {item.summary ? (
                        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">
                          {item.summary}
                        </p>
                      ) : null}
                      <MediaCardAction>Open resource</MediaCardAction>
                    </MediaCardBody>
                  </MediaCard>
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
