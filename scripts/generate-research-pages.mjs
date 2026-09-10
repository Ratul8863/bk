import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/app/(public)');

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n');
  console.log('✓', rel);
}

write(
  'research/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { ResearchFilters } from '@/components/public/ResearchFilters';
import {
  getResearchAreas,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research',
  'Ongoing and completed research projects at BK School of Research.',
  '/research',
);

export default function ResearchPage() {
  const projects = getResearchProjects();
  const areas = getResearchAreas();

  return (
    <>
      <PageHero
        eyebrow="Inquiry"
        title="Research"
        description="Filter projects by area, status, year, or keyword. Listings reflect seed records migrated from the legacy site."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }]}
        actions={
          <>
            <ArrowLink href="/research/areas">Research areas</ArrowLink>
            <ArrowLink href="/research/ongoing">Ongoing</ArrowLink>
            <ArrowLink href="/research/previous">Previous</ArrowLink>
            <ArrowLink href="/research/grants">Grants</ArrowLink>
          </>
        }
      />
      <Section>
        <Container>
          <ResearchFilters projects={projects} areas={areas} />
        </Container>
      </Section>
    </>
  );
}
`,
);

write(
  'research/areas/page.tsx',
  `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getResearchAreas, getResearchProjects } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research Areas',
  'Thematic research areas at BK School of Research.',
  '/research/areas',
);

export default function ResearchAreasPage() {
  const areas = getResearchAreas();
  const projects = getResearchProjects();

  return (
    <>
      <PageHero
        title="Research areas"
        description="Disciplines and themes that organise BKSR’s research portfolio."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: 'Areas' },
        ]}
      />
      <Section>
        <Container>
          <ol className="divide-y divide-border border-y border-border">
            {areas.map((area, index) => {
              const count = projects.filter((project) =>
                project.areaIds.includes(area.id),
              ).length;
              return (
                <li key={area.id} id={area.slug} className="scroll-mt-28 py-10">
                  <p className="font-sans text-sm font-semibold tracking-[0.14em] text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-3 font-display text-3xl text-ink">{area.title}</h2>
                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
                    {area.description}
                  </p>
                  {count > 0 ? (
                    <p className="mt-4 text-sm text-body">
                      {count} linked project{count === 1 ? '' : 's'} ·{' '}
                      <Link href="/research" className="text-accent hover:underline">
                        Browse research
                      </Link>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>
    </>
  );
}
`,
);

write(
  'research/grants/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research Grants',
  'Overview of the BKSR research grants programme structure.',
  '/research/grants',
);

export default function ResearchGrantsPage() {
  return (
    <>
      <PageHero
        title="Research grants"
        description="Programme architecture for future grant opportunities."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: 'Grants' },
        ]}
      />
      <Section>
        <Container narrow>
          <EmptyState
            title="No active grant calls published"
            description="BKSR anticipates structuring research grants around open calls, thematic priorities aligned with our areas, and transparent review. Individual grant awards are not listed here because none are present in the verified seed archive."
          />
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-display text-2xl text-ink">Programme outline</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
                <li>Open calls tied to education, policy, social development, and related themes.</li>
                <li>Eligibility oriented to early-career researchers and collaborative teams.</li>
                <li>Review criteria emphasising research design, ethics, and public value.</li>
                <li>Reporting expectations that feed the publication and knowledge-hub pipelines.</li>
              </ul>
            </div>
            <p className="text-sm text-muted">
              When grant opportunities are formally announced, they will appear on this page and in Notices.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

for (const [segment, status, title] of [
  ['ongoing', 'ongoing', 'Ongoing projects'],
  ['previous', 'completed', 'Previous projects'],
]) {
  write(
    `research/${segment}/page.tsx`,
    `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { EmptyState } from '@/components/ui/EmptyState';
import { getResearchProjects } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';

export const metadata = buildPageMetadata(
  '${title}',
  '${title} at BK School of Research.',
  '/research/${segment}',
);

export default function ResearchStatusPage() {
  const projects = getResearchProjects({ researchStatus: '${status}' });

  return (
    <>
      <PageHero
        title="${title}"
        description="Projects marked ${status} in the BKSR research archive."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: '${title}' },
        ]}
      />
      <Section>
        <Container>
          {projects.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {projects.map((project) => (
                <li key={project.id} className="py-6">
                  <MetaLine
                    items={[
                      RESEARCH_STATUS_LABELS[project.researchStatus],
                      project.year ? String(project.year) : null,
                    ]}
                  />
                  <Link
                    href={\`/research/\${project.slug}\`}
                    className="mt-2 block font-display text-2xl text-ink hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-2 max-w-3xl text-sm text-muted">{project.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No projects in this list"
              description="No ${status} projects are present in the current seed data."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
`,
  );
}

write(
  'research/[slug]/page.tsx',
  `import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { RichText } from '@/components/ui/RichText';
import {
  getPublicationById,
  getResearchAreaBySlug,
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
    \`/research/\${project.slug}\`,
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
          <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
            <div>
              <MetaLine
                items={[
                  project.year ? String(project.year) : null,
                  project.leadAuthorNames.join(', ') || null,
                ]}
              />
              {project.description ? (
                <div className="mt-8">
                  <RichText content={project.description} />
                </div>
              ) : (
                <p className="mt-8 text-base leading-relaxed text-muted">
                  {project.summary}
                </p>
              )}
              {publications.length ? (
                <div className="mt-12">
                  <h2 className="font-display text-2xl text-ink">Related publications</h2>
                  <ul className="mt-4 space-y-3">
                    {publications.map((pub) =>
                      pub ? (
                        <li key={pub.id}>
                          <Link
                            href={\`/publications/\${pub.slug}\`}
                            className="text-accent hover:underline"
                          >
                            {pub.title}
                          </Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
            <aside className="space-y-6 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Areas
                </p>
                <ul className="mt-3 space-y-2">
                  {areas.map((area) => (
                    <li key={area.id}>
                      <Link
                        href={\`/research/areas#\${area.slug}\`}
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
`,
);

console.log('Research routes written');
