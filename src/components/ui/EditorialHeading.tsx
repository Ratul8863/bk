import { cn } from '@/lib/utils';

type EditorialHeadingProps = React.ComponentProps<'h1'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const sizeClasses = {
  sm: 'text-[1.45rem] leading-[1.15] sm:text-[1.65rem] md:text-[1.85rem]',
  md: 'text-[1.55rem] leading-[1.12] sm:text-[1.85rem] md:text-[2.35rem]',
  lg: 'text-[1.75rem] leading-[1.1] sm:text-[2.15rem] md:text-[2.75rem] lg:text-[3.1rem]',
  xl: 'text-[1.85rem] leading-[1.1] sm:text-[2.4rem] md:text-[3.25rem] lg:text-[3.75rem]',
};

export function EditorialHeading({
  as: Comp = 'h2',
  size = 'lg',
  className,
  children,
  ...props
}: EditorialHeadingProps) {
  return (
    <Comp
      className={cn(
        'font-display font-normal tracking-normal text-ink text-balance',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
