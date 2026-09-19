'use client';

import { cn } from '@/lib/utils';

export type FilterOption = {
  label: string;
  value: string;
};

type FilterBarProps = {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  /** `stack` = sidebar list; `wrap` = horizontal chip row */
  layout?: 'stack' | 'wrap';
};

export function FilterBar({
  options,
  value,
  onChange,
  label = 'Filter',
  className,
  layout = 'stack',
}: FilterBarProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <div
        role="group"
        aria-label={label}
        className={cn(
          layout === 'stack' &&
            'flex flex-col border-y border-border divide-y divide-border',
          layout === 'wrap' && 'flex flex-wrap gap-2',
        )}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={cn(
                'font-sans text-left transition-colors duration-200',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                layout === 'stack' &&
                  cn(
                    'relative w-full py-2.5 pl-3 text-sm',
                    selected
                      ? 'font-semibold text-accent before:absolute before:inset-y-2 before:left-0 before:w-px before:bg-accent'
                      : 'pl-3 font-medium text-muted hover:text-ink',
                  ),
                layout === 'wrap' &&
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium',
                    selected
                      ? 'bg-accent text-white'
                      : 'border border-transparent text-muted hover:border-border hover:bg-white hover:text-ink',
                  ),
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
