import { ArrowRight } from 'lucide-react';
import {
  ResearchProjectAnchor,
  researchProjectHref,
} from '@/components/editorial/ResearchFeature';
import { ResearchProjectMedia } from '@/components/editorial/ResearchProjectMedia';
import { Button } from '@/components/ui/Button';
import { researchProjectVenueLine } from '@/lib/content/research-links';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type OurResearchProps = {
  featured: ResearchProject[];
  sidebar: ResearchProject[];
};

function formatAuthors(names: string[], max = 3): string | null {
  const cleaned = names.map((n) => n.trim()).filter(Boolean);
  if (!cleaned.length) return null;
  if (cleaned.length <= max) return cleaned.join(', ');
  return `${cleaned.slice(0, max).join(', ')} +${cleaned.length - max}`;
}

/** Short supporting line when authors are missing (e.g. ongoing work). */
function fallbackBlurb(project: ResearchProject): string | null {
  const title = project.title.trim();
  const summary = project.summary?.trim() ?? '';
  if (
    summary &&
    summary !== title &&
    summary !== `${title}.` &&
    !summary.includes(title)
  ) {
    return summary.length > 120 ? `${summary.slice(0, 117).trim()}…` : summary;
  }
  if (project.researchStatus === 'ongoing') {
    return 'Ongoing research';
  }
  return null;
}

function ViewCue({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent',
        className,
      )}
    >
      View
      <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden />
    </span>
  );
}

function FeaturedRow({ project }: { project: ResearchProject }) {
  const href = researchProjectHref(project);
  const venueLine = researchProjectVenueLine(project);
  const authors = formatAuthors(project.leadAuthorNames ?? [], 4);
  const blurb = authors ? null : fallbackBlurb(project);

  return (
    <ResearchProjectAnchor
      project={project}
      className={cn(
        'group flex min-w-0 flex-row items-start gap-3.5 sm:gap-5 md:gap-6',
        !href && 'cursor-default',
      )}
    >
      <span className="w-[5.5rem] shrink-0 sm:w-[7.5rem] md:w-[9rem] lg:w-[10.5rem]">
        <ResearchProjectMedia project={project} size="list" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-3.5">
        <span className="min-w-0">
          <span
            className={cn(
              'block font-display text-lg leading-[1.2] text-ink sm:text-[1.35rem] sm:leading-[1.22] md:text-2xl',
              href && 'transition-colors group-hover:text-accent',
            )}
          >
            {project.title}
          </span>
          {authors ? (
            <span className="mt-2 block text-sm leading-relaxed text-muted sm:mt-2.5">
              {authors}
            </span>
          ) : blurb ? (
            <span className="mt-2 block text-sm leading-relaxed text-muted sm:mt-2.5">
              {blurb}
            </span>
          ) : null}
          {venueLine ? (
            <span className="mt-1 block font-serif text-sm italic leading-snug text-body/80 sm:mt-1.5">
              {venueLine}
            </span>
          ) : null}
        </span>

        {href ? (
          <ViewCue className="mt-0.5 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100 motion-reduce:opacity-100" />
        ) : null}
      </span>
    </ResearchProjectAnchor>
  );
}

function SidebarRow({ project }: { project: ResearchProject }) {
  const href = researchProjectHref(project);
  const venueLine = researchProjectVenueLine(project);
  const authors = formatAuthors(project.leadAuthorNames ?? [], 2);
  const blurb = authors ? null : fallbackBlurb(project);

  return (
    <ResearchProjectAnchor
      project={project}
      className={cn(
        'group flex min-w-0 items-start gap-3',
        !href && 'cursor-default',
      )}
    >
      <span className="w-[4.25rem] shrink-0 sm:w-[5rem]">
        <ResearchProjectMedia project={project} size="list" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'line-clamp-3 block font-display text-[0.95rem] leading-snug text-ink sm:text-base sm:leading-[1.3]',
            href && 'transition-colors group-hover:text-accent',
          )}
          title={project.title}
        >
          {project.title}
        </span>
        {authors ? (
          <span className="mt-1.5 block truncate text-xs leading-relaxed text-muted">
            {authors}
          </span>
        ) : blurb ? (
          <span className="mt-1.5 block truncate text-xs leading-relaxed text-muted">
            {blurb}
          </span>
        ) : null}
        {venueLine ? (
          <span className="mt-0.5 line-clamp-1 block font-serif text-xs italic leading-snug text-body/80">
            {venueLine}
          </span>
        ) : null}
        {href ? (
          <ViewCue className="mt-2 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100 motion-reduce:opacity-100" />
        ) : null}
      </span>
    </ResearchProjectAnchor>
  );
}

/**
 * Homepage “Our Research” — library-section composition with Research page
 * card language (status on media, display title, authors, italic venue).
 */
export function OurResearch({ featured, sidebar }: OurResearchProps) {
  if (!featured.length) return null;

  return (
    <div className="mt-8 grid min-w-0 items-start gap-7 md:mt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-5 lg:mt-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,26rem)] lg:gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,28rem)] xl:gap-7">
      <ul className="flex min-w-0 flex-col">
        {featured.map((project, index) => (
          <li key={project.id} className="min-w-0">
            {index > 0 ? (
              <div
                className="my-5 h-px w-full bg-border sm:my-6 lg:my-7"
                aria-hidden
              />
            ) : null}
            <FeaturedRow project={project} />
          </li>
        ))}
      </ul>

      <aside className="flex min-w-0 flex-col self-start border-t border-border pt-7 md:border-t-0 md:pt-0">
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
          More research
        </p>

        <ul className="mt-4 flex flex-col sm:mt-5">
          {sidebar.map((project, index) => (
            <li key={project.id} className="min-w-0">
              {index > 0 ? (
                <div className="my-3 h-px w-full bg-border" aria-hidden />
              ) : null}
              <SidebarRow project={project} />
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-stretch sm:mt-7 md:justify-start">
          <Button
            href="/research"
            variant="ink"
            size="md"
            className="w-full px-4 py-2.5 font-normal tracking-normal sm:w-auto"
          >
            View all research
          </Button>
        </div>
      </aside>
    </div>
  );
}
