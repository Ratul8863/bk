import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-accent text-white hover:bg-ink',
  secondary:
    'border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white',
  ghost: 'bg-transparent text-accent hover:bg-surface',
  ink: 'bg-ink text-white hover:bg-accent',
  onInk: 'bg-paper text-ink hover:bg-white',
  onInkSecondary:
    'border border-paper/45 bg-transparent text-paper hover:border-paper hover:bg-paper/10',
  tertiary:
    'bg-transparent px-0 text-accent underline-offset-4 hover:underline',
  destructive: 'bg-brand-red text-white hover:bg-brand-red/90',
} as const;

const sizes = {
  sm: 'h-10 gap-2 px-4 text-[0.8125rem]',
  md: 'h-11 gap-2 px-6 text-sm',
  lg: 'h-[3.25rem] gap-2.5 px-8 text-[0.9375rem]',
} as const;

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
  /** Trailing arrow — opt-in for research-firm restraint */
  withArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof CommonProps | 'href'
  > & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClasses(
  variant: keyof typeof variants,
  size: keyof typeof sizes,
  className?: string,
) {
  return cn(
    'group/btn inline-flex items-center justify-center font-sans font-semibold tracking-[0.04em]',
    'rounded-none transition-[color,background-color,border-color] duration-200',
    'disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    variants[variant],
    variant !== 'tertiary' && sizes[size],
    variant === 'tertiary' && 'h-auto py-1 text-sm tracking-[0.02em]',
    className,
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    withArrow = false,
  } = props;
  const classes = buttonClasses(variant, size, className);

  const content = (
    <>
      <span>{children}</span>
      {withArrow && variant !== 'tertiary' && variant !== 'destructive' ? (
        <ArrowRight
          className="size-3.5 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden
          strokeWidth={2.25}
        />
      ) : null}
    </>
  );

  if ('href' in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  const {
    type = 'button',
    disabled,
    onClick,
    onBlur,
    onFocus,
    id,
    name,
    form,
    value,
    'aria-label': ariaLabel,
    'aria-busy': ariaBusy,
    'aria-pressed': ariaPressed,
  } = buttonProps;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      id={id}
      name={name}
      form={form}
      value={value}
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      aria-pressed={ariaPressed}
    >
      {content}
    </button>
  );
}
