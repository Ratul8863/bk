import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export function ArrowLink({ href, children, className, external }: ArrowLinkProps) {
  const classes = cn(
    'group inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink',
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <ArrowRight
        className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
        strokeWidth={2.25}
      />
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
