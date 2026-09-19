import { ArrowRight } from 'lucide-react';
import {
  ResearchProjectAnchor,
  researchProjectHref,
} from '@/components/editorial/ResearchFeature';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type ResearchRowProps = {
  project: ResearchProject;
  className?: string;
};

export function ResearchRow({ project, className }: ResearchRowProps) {
  const href = researchProjectHref(project);

  return (
    <article
      className={cn(
        'grid gap-4 border-b border-border py-8 md:grid-cols-[8rem_1fr_auto] md:items-start md:gap-8',
        className,
      )}
    >
      <div>
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
          {project.researchStatus}
        </p>
        {project.year ? (
          <p className="mt-1 font-display text-3xl text-ink/20">{project.year}</p>
        ) : null}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl text-ink md:text-2xl">
          {href ? (
            <ResearchProjectAnchor
              project={project}
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </ResearchProjectAnchor>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
          {project.summary}
        </p>
        {project.leadAuthorNames.length ? (
          <p className="mt-3 font-instrument text-sm text-body">
            {project.leadAuthorNames.join(', ')}
          </p>
        ) : null}
      </div>
      {href ? (
        <ResearchProjectAnchor
          project={project}
          className="inline-flex shrink-0 items-center gap-2 border-b border-ink pb-0.5 font-instrument text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Open
          <ArrowRight className="size-5" strokeWidth={1.5} aria-hidden />
        </ResearchProjectAnchor>
      ) : (
        <span className="hidden md:block" aria-hidden />
      )}
    </article>
  );
}
