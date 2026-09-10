import { cn } from '@/lib/utils';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Eyebrow } from '@/components/ui/Eyebrow';

type SectionHeaderProps = {
  eyebrow?: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  headingAs?: 'h1' | 'h2' | 'h3';
  headingSize?: 'sm' | 'md' | 'lg' | 'xl';
};

export function SectionHeader({
  eyebrow,
  heading,
  description,
  action,
  align = 'left',
  className,
  headingAs = 'h2',
  headingSize = 'lg',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' && 'mx-auto max-w-3xl text-center',
        action && 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn(align === 'center' && 'mx-auto', action && 'max-w-3xl')}>
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <EditorialHeading as={headingAs} size={headingSize}>
          {heading}
        </EditorialHeading>
        {description ? (
          <p
            className={cn(
              'mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
