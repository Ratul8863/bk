import { ArrowLink } from '@/components/ui/ArrowLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { asExternalHttpUrl } from '@/lib/content/research-links';
import { getResearchProjectCoverUrl } from '@/lib/content/prototype-media';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

/** External journal/DOI/source only — never an internal detail route. */
export function researchProjectHref(project: ResearchProject): string | null {
  return asExternalHttpUrl(project.url);
}

export function researchProjectIsExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

type ResearchProjectAnchorProps = {
  project: ResearchProject;
  className?: string;
  children: React.ReactNode;
};

/** Opens attached external journal/source; non-link when none is set. */
export function ResearchProjectAnchor({
  project,
  className,
  children,
}: ResearchProjectAnchorProps) {
  const href = researchProjectHref(project);
  if (!href) {
    return <div className={className}>{children}</div>;
  }
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

type ResearchFeatureProps = {
  project: ResearchProject;
  imageIndex?: number;
  className?: string;
};

/**
 * Featured strip — same composition as `/publications` featured:
 * portrait (or year plate) left; Featured + meta + title + CTA right.
 */
export function ResearchFeature({
  project,
  className,
}: ResearchFeatureProps) {
  const href = researchProjectHref(project);
  const cover = getResearchProjectCoverUrl(project);
  const statusLabel = RESEARCH_STATUS_LABELS[project.researchStatus];
  const yearLabel = project.year ? String(project.year) : null;
  const meta = [statusLabel, yearLabel].filter(Boolean).join(' · ');

  return (
    <article
      className={cn(
        'grid items-start gap-8 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-14',
        className,
      )}
    >
      <div className="lg:col-span-3">
        {cover ? (
          <ImageFrame
            src={cover}
            alt=""
            aspect="portrait"
            sizes="(max-width: 1024px) 40vw, 18vw"
            framed
            frameClassName="mx-auto max-w-[11rem] lg:mx-0 lg:max-w-none"
          />
        ) : (
          <div
            className="mx-auto flex aspect-3/4 w-full max-w-[11rem] flex-col justify-between rounded-[0.65rem] border border-ink/8 bg-surface-subtle p-4 lg:mx-0 lg:max-w-none"
            aria-hidden
          >
            <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">
              {statusLabel}
            </span>
            <span className="font-display text-3xl leading-none tabular-nums text-ink/25 sm:text-4xl">
              {yearLabel ?? statusLabel.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0 self-center lg:col-span-9">
        <Eyebrow>Featured</Eyebrow>
        {meta ? (
          <p className="mt-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {meta}
          </p>
        ) : null}
        <h2 className="mt-3 max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">
          {href ? (
            <a
              href={href}
              className="transition-colors hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h2>
        {project.leadAuthorNames.length ? (
          <p className="mt-3 text-sm text-muted">
            {project.leadAuthorNames.join(', ')}
          </p>
        ) : null}
        {href ? (
          <ArrowLink href={href} className="mt-6" external>
            Open publication
          </ArrowLink>
        ) : null}
      </div>
    </article>
  );
}
