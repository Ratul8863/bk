import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className={cn('mt-12 flex items-center justify-between gap-4', className)}
    >
      {currentPage > 1 ? (
        <Link
          href={hrefForPage(currentPage - 1)}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent hover:text-ink"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 font-sans text-sm text-muted/50">
          <ChevronLeft className="size-4" aria-hidden />
          Previous
        </span>
      )}

      <ul className="flex items-center gap-1">
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={hrefForPage(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-sm font-sans text-sm transition-colors',
                page === currentPage
                  ? 'bg-ink text-paper'
                  : 'text-muted hover:bg-sage hover:text-ink',
              )}
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>

      {currentPage < totalPages ? (
        <Link
          href={hrefForPage(currentPage + 1)}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent hover:text-ink"
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 font-sans text-sm text-muted/50">
          Next
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
