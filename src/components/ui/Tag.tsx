import { cn } from '@/lib/utils';

type TagProps = React.ComponentProps<'span'> & {
  tone?: 'sage' | 'accent' | 'bronze' | 'muted' | 'red';
};

const tones = {
  sage: 'bg-surface text-ink',
  accent: 'bg-accent/8 text-accent',
  bronze: 'bg-brand-red/10 text-brand-red',
  red: 'bg-brand-red/10 text-brand-red',
  muted: 'bg-border/60 text-muted',
};

export function Tag({ className, tone = 'sage', children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] px-2.5 py-1 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
