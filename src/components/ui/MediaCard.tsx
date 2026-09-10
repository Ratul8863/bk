import Link from 'next/link';
import { cn } from '@/lib/utils';

type MediaCardProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Quiet media tile — image + type, no SaaS shadow chrome. */
export function MediaCard({ href, children, className }: MediaCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/card relative flex h-full flex-col overflow-hidden bg-white',
        'border border-border',
        'transition-[border-color] duration-200 hover:border-ink/35',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
    >
      {children}
    </Link>
  );
}

type SlotProps = {
  children: React.ReactNode;
  className?: string;
};

export function MediaCardMedia({ children, className }: SlotProps) {
  return (
    <div className={cn('relative overflow-hidden bg-surface', className)}>
      {children}
    </div>
  );
}

export function MediaCardBody({ children, className }: SlotProps) {
  return (
    <div
      className={cn(
        'relative flex flex-1 flex-col gap-2 border-t border-border bg-white p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MediaCardMeta({ children, className }: SlotProps) {
  return (
    <p
      className={cn(
        'font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function MediaCardTitle({ children, className }: SlotProps) {
  return (
    <h3
      className={cn(
        'font-display text-lg leading-snug text-ink transition-colors duration-200 group-hover/card:text-accent sm:text-xl',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function MediaCardAction({ children, className }: SlotProps) {
  return (
    <span
      className={cn(
        'mt-auto inline-flex items-center gap-1.5 pt-3 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent',
        className,
      )}
    >
      {children}
      <span aria-hidden>→</span>
    </span>
  );
}
