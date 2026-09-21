import { getResearchProjectCoverUrl } from '@/lib/content/prototype-media';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

type ResearchProjectMediaProps = {
  project: ResearchProject;
  className?: string;
  /** Larger featured treatment */
  size?: 'list' | 'feature';
  framed?: boolean;
};

/**
 * Portrait media slot for research rows.
 * Real cover when set; otherwise a typographic year/status plate (no fake stock photo).
 */
export function ResearchProjectMedia({
  project,
  className,
  size = 'list',
  framed = false,
}: ResearchProjectMediaProps) {
  const cover = getResearchProjectCoverUrl(project);
  const statusLabel = RESEARCH_STATUS_LABELS[project.researchStatus];
  const yearLabel = project.year ? String(project.year) : null;
  const isOngoing = project.researchStatus === 'ongoing';
  const isFeature = size === 'feature';

  return (
    <span
      className={cn(
        'relative block overflow-hidden bg-surface',
        isFeature
          ? 'mx-auto aspect-3/4 w-full max-w-[11rem] rounded-[0.65rem] border border-ink/8 lg:mx-0 lg:max-w-none'
          : 'aspect-3/4 rounded-[0.65rem] border border-ink/8 sm:rounded-none sm:border-border',
        framed && 'ring-1 ring-ink/10',
        className,
      )}
      aria-hidden
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      ) : (
        <span
          className={cn(
            'absolute inset-0 flex flex-col justify-between',
            isFeature ? 'bg-ink p-4 sm:p-5' : 'bg-surface-subtle p-2 sm:p-2.5',
          )}
        >
          <span
            className={cn(
              'font-sans font-semibold uppercase tracking-[0.14em]',
              isFeature
                ? 'text-[0.625rem] text-paper/55'
                : 'text-[0.6rem] text-muted',
            )}
          >
            {statusLabel}
          </span>
          <span
            className={cn(
              'font-display leading-none tabular-nums',
              isFeature
                ? 'text-3xl text-paper/35 sm:text-4xl'
                : 'text-base text-ink/30 sm:text-lg',
            )}
          >
            {yearLabel ?? statusLabel.slice(0, 2)}
          </span>
        </span>
      )}

      {/* Status strip on list thumbs with a photo */}
      {cover && size === 'list' ? (
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 px-1.5 py-1.5 text-center',
            isOngoing ? 'bg-ink text-paper' : 'bg-ink/88 text-paper',
          )}
        >
          <span className="font-sans text-[0.5rem] font-semibold uppercase leading-none tracking-[0.12em] sm:text-[0.5625rem]">
            {statusLabel}
          </span>
          {yearLabel ? (
            <span className="font-sans text-[0.625rem] font-semibold tabular-nums leading-none tracking-[0.04em] text-paper/80 sm:text-[0.6875rem]">
              {yearLabel}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
