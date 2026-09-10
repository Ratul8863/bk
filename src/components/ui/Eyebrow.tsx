import { cn } from '@/lib/utils';

type EyebrowProps = React.ComponentProps<'p'> & {
  as?: 'p' | 'span' | 'div';
  /** @deprecated Kept for call-site compatibility */
  marker?: boolean;
};

export function Eyebrow({
  as: Comp = 'p',
  className,
  children,
  marker: _marker,
  ...props
}: EyebrowProps) {
  return (
    <Comp
      className={cn(
        'font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
