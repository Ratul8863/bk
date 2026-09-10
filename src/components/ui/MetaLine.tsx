import { cn } from '@/lib/utils';

type MetaLineProps = {
  items: React.ReactNode[];
  className?: string;
  separator?: string;
};

export function MetaLine({ items, className, separator = '·' }: MetaLineProps) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return null;

  return (
    <p
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-sm text-muted',
        className,
      )}
    >
      {filtered.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden className="text-border">
              {separator}
            </span>
          ) : null}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}
