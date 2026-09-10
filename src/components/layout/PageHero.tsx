import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { cn } from '@/lib/utils';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeroProps) {
  return (
    <header
      className={cn(
        'relative overflow-hidden border-b border-border bg-surface-subtle pt-28 pb-12 md:pt-32 md:pb-16',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(23,59,108,0.07),transparent_50%),radial-gradient(ellipse_at_100%_100%,rgba(184,58,58,0.04),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] bg-brand-red"
        aria-hidden
      />
      <Container className="relative">
        {breadcrumbs ? <Breadcrumb items={breadcrumbs} /> : null}
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <EditorialHeading as="h1" size="xl" className="max-w-4xl">
          {title}
        </EditorialHeading>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </header>
  );
}
