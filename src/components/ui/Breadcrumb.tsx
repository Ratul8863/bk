import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  tone?: 'default' | 'onDark';
};

export function Breadcrumb({
  items,
  className,
  tone = 'default',
}: BreadcrumbProps) {
  if (!items.length) return null;

  const onDark = tone === 'onDark';

  return (
    <nav aria-label="Breadcrumb" className={cn('mb-6', className)}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-1.5 font-sans text-sm',
          onDark ? 'text-paper/55' : 'text-muted',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-1.5"
            >
              {index > 0 ? (
                <ChevronRight
                  className={cn(
                    'size-3.5 shrink-0',
                    onDark ? 'text-paper/35' : 'text-border',
                  )}
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'transition-colors',
                    onDark ? 'hover:text-paper' : 'hover:text-accent',
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast &&
                      (onDark ? 'font-medium text-paper/90' : 'font-medium text-ink'),
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
