import { cn } from '@/lib/utils';
import { EditorialHeading } from '@/components/ui/EditorialHeading';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border border-border bg-white px-8 py-16 text-center md:px-12 md:py-20',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(23,59,108,0.06),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgba(184,58,58,0.04),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] bg-brand-red"
        aria-hidden
      />
      <div className="relative">
        <EditorialHeading as="h3" size="sm" className="text-ink">
          {title}
        </EditorialHeading>
        {description ? (
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        {action ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  );
}
