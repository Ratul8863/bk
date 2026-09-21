import Link from 'next/link';
import {
  ResearchProjectAnchor,
  researchProjectHref,
} from '@/components/editorial/ResearchFeature';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type Props = {
  projects: ResearchProject[];
};

/** Dedicated ongoing list — never mixed with completed outputs. */
export function ResearchOngoingSection({ projects }: Props) {
  if (!projects.length) return null;

  return (
    <Section tone="white" className="border-b border-border">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <Eyebrow>In progress</Eyebrow>
            <EditorialHeading as="h2" size="md" className="mt-3">
              Ongoing research
            </EditorialHeading>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Active projects currently underway at BK School of Research.
            </p>
          </div>
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        <ul className="divide-y divide-border/80 border-y border-border/80">
          {projects.map((project, index) => {
            const href = researchProjectHref(project);
            return (
              <li key={project.id}>
                <ResearchProjectAnchor
                  project={project}
                  className="group block py-5 sm:py-6"
                >
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-accent sm:text-[0.6875rem]">
                      Ongoing
                    </span>
                    {project.year ? (
                      <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[0.6875rem]">
                        {project.year}
                      </span>
                    ) : null}
                    <span className="font-sans text-[0.625rem] font-semibold tracking-[0.14em] text-muted/50 sm:text-[0.6875rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      'mt-2 font-display text-[1.25rem] leading-[1.35] text-ink sm:text-xl md:text-2xl',
                      href && 'transition-colors group-hover:text-accent',
                    )}
                  >
                    {project.title}
                  </h3>
                  {href ? (
                    <span className="mt-3 inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                      Open source
                      <span aria-hidden>→</span>
                    </span>
                  ) : null}
                </ResearchProjectAnchor>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-muted">
          Browse focus fields in{' '}
          <Link href="/research/areas" className="text-accent hover:underline">
            Research areas
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
