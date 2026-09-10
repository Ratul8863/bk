import { cn } from '@/lib/utils';

const STEPS = [
  {
    title: 'Evidence',
    description: 'Rigorous data collection and peer-reviewed inquiry.',
  },
  {
    title: 'Insight',
    description: 'Synthesis that clarifies what the evidence means.',
  },
  {
    title: 'Collaboration',
    description: 'Working with scholars, practitioners, and communities.',
  },
  {
    title: 'Policy',
    description: 'Translating findings into actionable recommendations.',
  },
  {
    title: 'Impact',
    description: 'Measurable change in people, systems, and places.',
  },
] as const;

type ImpactPathwayProps = {
  className?: string;
};

export function ImpactPathway({ className }: ImpactPathwayProps) {
  return (
    <ol
      className={cn(
        'grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4',
        className,
      )}
    >
      {STEPS.map((step, index) => (
        <li key={step.title} className="relative min-w-0">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-bronze">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {step.description}
          </p>
          {index < STEPS.length - 1 ? (
            <span
              className="pointer-events-none absolute top-3 right-0 hidden h-px w-8 bg-border lg:block"
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
