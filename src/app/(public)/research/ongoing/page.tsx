import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { getResearchProjects } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';

export const metadata = buildPageMetadata(
  'Ongoing research',
  'Ongoing research projects at BK School of Research.',
  '/research/ongoing',
);

export default function Page() {
  const projects = getResearchProjects({ researchStatus: 'ongoing' });
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Ongoing"
        description="Projects currently marked ongoing in the BKSR archive."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: 'Ongoing' },
        ]}
        actions={
          <>
            <ArrowLink href="/research/previous">Completed</ArrowLink>
            <ArrowLink href="/research/areas">Research areas</ArrowLink>
          </>
        }
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
                    href={`/research/${project.slug}`}
                    className="mt-2 block font-display text-2xl text-ink hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-2 max-w-3xl text-sm text-muted">
                    {project.summary}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No projects in this list"
              description="No ongoing projects are present in the current seed data."
            />
          )}
        </Container>
      </Section>
    </>
  );
}
