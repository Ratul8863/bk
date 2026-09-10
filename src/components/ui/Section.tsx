import { cn } from '@/lib/utils';

type SectionProps = React.ComponentProps<'section'> & {
  tone?: 'paper' | 'sage' | 'ink' | 'surface' | 'white';
  spaced?: boolean;
};

export function Section({
  className,
  tone = 'paper',
  spaced = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        tone === 'paper' && 'bg-paper text-body',
        tone === 'sage' && 'bg-sage text-body',
        tone === 'surface' && 'bg-surface text-body',
        tone === 'white' && 'bg-white text-body',
        tone === 'ink' && 'bg-ink text-paper',
        spaced && 'py-12 sm:py-16 md:py-24',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
