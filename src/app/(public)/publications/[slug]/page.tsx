import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { RichText } from '@/components/ui/RichText';
import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { PrototypeMediaNote } from '@/components/ui/PrototypeMediaNote';
import {
  getPublicationBySlug,
  getPublications,
  getResearchAreas,
  getResearchProjectById,
} from '@/lib/content/queries';
import { getPublicationCoverUrl } from '@/lib/content/prototype-media';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublications({ includeDrafts: true }).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getPublicationBySlug(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(
    item.title,
    item.abstract ?? item.citation,
    `/publications/${item.slug}`,
  );
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const item = getPublicationBySlug(slug);
  if (!item) notFound();

  const areas = getResearchAreas().filter((area) =>
    (item.areaIds ?? []).includes(area.id),
  );
  const project = item.projectId
    ? getResearchProjectById(item.projectId)
    : null;
  const related = getPublications()
    .filter(
      (pub) =>
        pub.id !== item.id &&
        (pub.areaIds ?? []).some((id) => (item.areaIds ?? []).includes(id)),
    )
    .slice(0, 3);
  const cover = getPublicationCoverUrl(item);

  return (
    <>
      <PageHero
        eyebrow={PUBLICATION_TYPE_LABELS[item.type]}
        title={item.title}
        description={item.authors.join(', ')}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: item.title },
        ]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
            <article className="min-w-0">
              <MetaLine
                items={[
                  String(item.year),
                  item.venue ?? null,
                  item.publisher ?? null,
                ]}
              />

              <div className="mt-8">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  {item.abstract ? 'Abstract' : 'Overview'}
                </h2>
                <div className="mt-3 max-w-prose text-base leading-relaxed text-body md:text-lg">
                  {item.abstract ? (
                    <RichText content={item.abstract} />
                  ) : project?.summary ? (
                    <p>{project.summary}</p>
                  ) : (
                    <p>
                      {item.type === 'opinion'
                        ? `Opinion / commentary published in ${item.venue ?? 'the press'} (${item.year}).`
                        : `Scholarly output recorded in the BKSR completed-research archive (${item.year}${item.venue ? ` · ${item.venue}` : ''}).`}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 max-w-prose border-t border-border pt-8">
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Citation
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-body">
                  {item.citation}
                </p>
              </div>

              {item.doi ? (
                <p className="mt-6 text-sm text-muted">DOI: {item.doi}</p>
              ) : null}

              {related.length > 0 ? (
                <div className="mt-14 border-t border-border pt-10">
                  <h2 className="font-display text-2xl text-ink">Related work</h2>
                  <ul className="mt-6 divide-y divide-border border-y border-border">
                    {related.map((pub) => (
                      <li key={pub.id} className="py-4">
                        <Link
                          href={`/publications/${pub.slug}`}
                          className="font-display text-lg text-ink hover:text-accent"
                        >
                          {pub.title}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          {pub.year}
                          {pub.venue ? ` · ${pub.venue}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>

            <aside className="space-y-7 border-t border-border pt-6 lg:sticky lg:top-28 lg:self-start lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {cover ? (
                <div>
                  <ImageFrame
                    src={cover}
                    alt={`Cover visual for ${item.title}`}
                    aspect="portrait"
                    sizes="220px"
                    framed
                    frameClassName="max-w-[11rem]"
                  />
                  <PrototypeMediaNote className="mt-2" />
                </div>
              ) : null}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Type
                </p>
                <p className="mt-2 text-sm text-ink">
                  {PUBLICATION_TYPE_LABELS[item.type]}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Year
                </p>
                <p className="mt-2 font-display text-3xl text-ink">{item.year}</p>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Authors
                </p>
                <ul className="mt-2 space-y-1">
                  {item.authors.map((author) => (
                    <li key={author} className="text-sm text-ink">
                      {author}
                    </li>
                  ))}
                </ul>
              </div>
              {areas.length ? (
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Research areas
                  </p>
                  <ul className="mt-2 space-y-1">
                    {areas.map((area) => (
                      <li key={area.id}>
                        <Link
                          href={`/research/areas#${area.slug}`}
                          className="text-sm text-accent hover:underline"
                        >
                          {area.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project ? (
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Related research
                  </p>
                  <Link
                    href={`/research/${project.slug}`}
                    className="mt-2 block text-sm text-accent hover:underline"
                  >
                    {project.title}
                  </Link>
                </div>
              ) : null}
              {item.url ? (
                <Button href={item.url} external variant="secondary" size="sm">
                  View external source
                </Button>
              ) : null}
              {item.originalLegacyUrl ? (
                <p className="text-xs text-muted">
                  <a
                    href={item.originalLegacyUrl}
                    className="hover:text-accent hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Legacy archive record
                  </a>
                </p>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
