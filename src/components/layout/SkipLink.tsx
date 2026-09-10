import { cn } from '@/lib/utils';

type SkipLinkProps = {
  href?: string;
  className?: string;
};

export function SkipLink({ href = '#main-content', className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]',
        'focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-semibold focus:text-paper',
        className,
      )}
    >
      Skip to main content
    </a>
  );
}
