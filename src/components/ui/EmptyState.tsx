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
        'border border-dashed border-border px-8 py-16 text-center',
        className,
      )}
    >
      <EditorialHeading as="h3" size="sm" className="text-ink">
        {title}
      </EditorialHeading>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-base text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
