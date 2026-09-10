import Link from 'next/link';
import { researchProjectHref } from '@/components/editorial/ResearchFeature';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type ResearchRowProps = {
  project: ResearchProject;
  className?: string;
};

export function ResearchRow({ project, className }: ResearchRowProps) {
  return (
    <article
      className={cn(
        'grid gap-2 border-b border-border py-6 md:grid-cols-[8rem_1fr] md:gap-8',
        className,
      )}
    >
      <div>
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
          {project.researchStatus}
        </p>
        {project.year ? (
          <p className="mt-1 font-sans text-sm text-muted">{project.year}</p>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-xl text-ink md:text-2xl">
          <Link
            href={researchProjectHref(project)}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
          {project.summary}
        </p>
      </div>
    </article>
  );
}
