import Link from 'next/link';
import {
  ResearchProjectAnchor,
  researchProjectHref,
} from '@/components/editorial/ResearchFeature';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getResearchAreas } from '@/lib/content/queries';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type ResearchStatusListProps = {
  title: string;
  description: string;
  eyebrow?: string;
  projects: ResearchProject[];
  breadcrumbLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  peerHref: string;
  peerLabel: string;
};

function displayTitle(title: string) {
  return title
    .replace(/\s*\((Ongoing|Completed)\s+Theme\)\s*$/i, '')
    .trim();
}

export async function ResearchStatusList({
  title,
  description,
  eyebrow = 'Research',
  projects,
  breadcrumbLabel,
  emptyTitle,
  emptyDescription,
  peerHref,
  peerLabel,
}: ResearchStatusListProps) {
  const areas = await getResearchAreas();
  const areaTitleById = new Map(areas.map((area) => [area.id, area.title]));
  const labelsFor = (project: ResearchProject) =>
    project.areaIds
      .map((id) => areaTitleById.get(id))
      .filter((label): label is string => Boolean(label));

  const [featured, ...rest] = projects;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        imageSrc={pageHeroMedia.research}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: breadcrumbLabel },
        ]}
        actions={
          <>
            <ArrowLink href={peerHref}>{peerLabel}</ArrowLink>
            <ArrowLink href="/research/areas">Research areas</ArrowLink>
            <ArrowLink href="/research">All research</ArrowLink>
          </>
        }
      />

      <Section className="py-14 md:py-20">
        <Container>
          {!projects.length ? (
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              action={
                <ArrowLink href="/research">Browse all research</ArrowLink>
              }
            />
          ) : (
            <>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
                <div>
                  <Eyebrow>
                    {RESEARCH_STATUS_LABELS[projects[0].researchStatus]}
                  </Eyebrow>
                  <EditorialHeading as="h2" size="md" className="mt-3">
                    {breadcrumbLabel === 'Ongoing'
                      ? 'Themes in progress'
                      : 'Archive of completed work'}
                  </EditorialHeading>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-muted">
                  {projects.length}{' '}
                  {projects.length === 1 ? 'project' : 'projects'} in this
                  list
                  {projects.some((project) => researchProjectHref(project))
                    ? ' — linked items open the journal or source.'
                    : '.'}
                </p>
              </div>

              {featured ? (
                <Reveal>
                  <article className="border border-border bg-white">
                    <ResearchProjectAnchor
                      project={featured}
                      className="group grid gap-0 lg:grid-cols-12"
                    >
                      <div className="flex flex-col justify-between border-b border-border bg-ink px-6 py-8 sm:px-8 sm:py-10 lg:col-span-4 lg:border-b-0 lg:border-r">
                        <div>
                          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-paper/45">
                            Featured
                          </p>
                          <p className="mt-6 font-display text-5xl font-medium leading-none tracking-[-0.04em] text-paper/25 md:text-6xl">
                            01
                          </p>
                        </div>
                        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/55">
                          <span>
                            {RESEARCH_STATUS_LABELS[featured.researchStatus]}
                          </span>
                          {featured.year ? (
                            <span>{featured.year}</span>
                          ) : null}
                          {labelsFor(featured)[0] ? (
                            <span>{labelsFor(featured)[0]}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:col-span-8 lg:px-10">
                        <h3
                          className={cn(
                            'font-display text-3xl leading-snug text-ink md:text-4xl',
                            researchProjectHref(featured) &&
                              'transition-colors group-hover:text-accent',
                          )}
                        >
                          {displayTitle(featured.title)}
                        </h3>
                        <p className="mt-4 max-w-2xl text-[0.975rem] leading-[1.75] text-muted">
                          {featured.summary}
                        </p>
                        {featured.leadAuthorNames.length ? (
                          <p className="mt-4 font-instrument text-sm text-body">
                            {featured.leadAuthorNames.join(', ')}
                          </p>
                        ) : null}
                        {researchProjectHref(featured) ? (
                          <span className="mt-8 inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent">
                            Open publication
                            <span
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden
                            >
                              →
                            </span>
                          </span>
                        ) : null}
                      </div>
                    </ResearchProjectAnchor>
                  </article>
                </Reveal>
              ) : null}

              {rest.length ? (
                <ul className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {rest.map((project, i) => {
                    const areaLabels = labelsFor(project);
                    const href = researchProjectHref(project);
                    return (
                      <li key={project.id}>
                        <Reveal
                          delay={Math.min(i * 0.03, 0.12)}
                          className="h-full"
                        >
                          <ResearchProjectAnchor
                            project={project}
                            className={cn(
                              'group/card relative flex h-full flex-col border border-border bg-white p-6 sm:p-7',
                              href &&
                                'transition-[border-color,background-color] duration-200 hover:border-ink/30 hover:bg-paper',
                              href &&
                                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                            )}
                          >
                            {href ? (
                              <span
                                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover/card:scale-x-100"
                                aria-hidden
                              />
                            ) : null}
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.16em] text-brand-red">
                                {String(i + 2).padStart(2, '0')}
                              </span>
                              <span className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                                {[
                                  RESEARCH_STATUS_LABELS[
                                    project.researchStatus
                                  ],
                                  project.year
                                    ? String(project.year)
                                    : null,
                                ]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </span>
                            </div>
                            <h3
                              className={cn(
                                'mt-5 font-display text-2xl leading-snug text-ink',
                                href &&
                                  'transition-colors group-hover/card:text-accent',
                              )}
                            >
                              {displayTitle(project.title)}
                            </h3>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                              {project.summary}
                            </p>
                            {areaLabels.length ? (
                              <p className="mt-4 font-instrument text-xs text-body">
                                {areaLabels.slice(0, 2).join(' · ')}
                              </p>
                            ) : null}
                            {href ? (
                              <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                                Open publication
                                <span
                                  className="transition-transform duration-300 group-hover/card:translate-x-0.5"
                                  aria-hidden
                                >
                                  →
                                </span>
                              </span>
                            ) : null}
                          </ResearchProjectAnchor>
                        </Reveal>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </>
          )}
        </Container>
      </Section>

      <Section tone="ink" className="py-16 md:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="text-paper/45">Next</Eyebrow>
              <EditorialHeading as="h2" size="md" className="mt-3 text-paper">
                Follow a theme into fields and publications
              </EditorialHeading>
              <p className="mt-4 max-w-lg text-[0.975rem] leading-[1.7] text-paper/65">
                Move from active projects to focus areas, or into the evidence
                already published in the library.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
              <Link
                href="/research/areas"
                className="inline-flex h-11 items-center justify-center bg-paper px-6 font-sans text-sm font-semibold tracking-[0.04em] text-ink transition-colors hover:bg-white"
              >
                Research areas
              </Link>
              <Link
                href="/publications"
                className="inline-flex h-11 items-center justify-center border border-paper/45 px-6 font-sans text-sm font-semibold tracking-[0.04em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                Publications
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
