import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { RichText } from '@/components/ui/RichText';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { PrototypeMediaNote } from '@/components/ui/PrototypeMediaNote';
import {
  getPublicationById,
  getResearchAreas,
  getResearchProjectBySlug,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getResearchProjects({ includeDrafts: true }).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getResearchProjectBySlug(slug, { includeDrafts: true });
  if (!project) return {};
  return buildPageMetadata(
    project.title,
    project.summary,
    `/research/${project.slug}`,
  );
}

export default async function ResearchProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getResearchProjectBySlug(slug);
  if (!project) notFound();

  const areas = getResearchAreas().filter((area) =>
    project.areaIds.includes(area.id),
  );
  const publications = (project.publicationIds ?? [])
    .map((id) => getPublicationById(id))
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={RESEARCH_STATUS_LABELS[project.researchStatus]}
        title={project.title}
        description={project.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: project.title },
        ]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {project.featuredImageUrl ? (
              <div className="lg:col-span-5">
                <ImageFrame
                  src={project.featuredImageUrl}
                  alt=""
                  aspect="video"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  framed
                />
                <PrototypeMediaNote className="mt-3" />
              </div>
            ) : null}

            <div
              className={
                project.featuredImageUrl
                  ? 'lg:col-span-7'
                  : 'lg:col-span-8'
              }
            >
              <MetaLine
                items={[
                  project.year ? String(project.year) : null,
                  project.leadAuthorNames.join(', ') || null,
                ]}
              />

              <div className="mt-8 space-y-6">
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    Overview
                  </h2>
                  {project.description ? (
                    <div className="mt-3">
                      <RichText content={project.description} />
                    </div>
                  ) : (
                    <p className="mt-3 text-base leading-relaxed text-body md:text-lg">
                      {project.summary}
                    </p>
                  )}
                </div>

                {publications.length ? (
                  <div className="border-t border-border pt-8">
                    <h2 className="font-display text-2xl text-ink">
                      Related publications
                    </h2>
                    <ul className="mt-6 divide-y divide-border border-y border-border">
                      {publications.map((pub) =>
                        pub ? (
                          <li key={pub.id} className="py-5">
                            <Link
                              href={`/publications/${pub.slug}`}
                              className="font-display text-lg text-ink hover:text-accent"
                            >
                              {pub.title}
                            </Link>
                            <p className="mt-2 text-sm leading-relaxed text-muted">
                              {pub.citation}
                            </p>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </div>
                ) : null}

                {project.originalLegacyUrl ? (
                  <p className="text-sm text-muted">
                    <a
                      href={project.originalLegacyUrl}
                      className="hover:text-accent hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Legacy archive record
                    </a>
                  </p>
                ) : null}
              </div>
            </div>

            <aside
              className={
                project.featuredImageUrl
                  ? 'space-y-6 border-t border-border pt-6 lg:col-span-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:border-t lg:pt-8'
                  : 'space-y-6 border-t border-border pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0'
              }
            >
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Status
                </p>
                <p className="mt-2 text-sm text-ink">
                  {RESEARCH_STATUS_LABELS[project.researchStatus]}
                </p>
              </div>
              {project.year ? (
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Year
                  </p>
                  <p className="mt-2 font-display text-3xl text-ink">
                    {project.year}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Research areas
                </p>
                <ul className="mt-3 space-y-2">
                  {areas.map((area) => (
                    <li key={area.id}>
                      <Link
                        href={`/research/areas#${area.slug}`}
                        className="text-sm text-ink hover:text-accent"
                      >
                        {area.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
