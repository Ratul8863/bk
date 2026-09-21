import { cn } from '@/lib/utils';

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer' | 'nav';
  narrow?: boolean;
};

export function Container({
  as: Comp = 'div',
  className,
  narrow = false,
  children,
  ...props
}: ContainerProps) {
  return (
    <Comp
      className={cn(
        'mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-[1520px]',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
