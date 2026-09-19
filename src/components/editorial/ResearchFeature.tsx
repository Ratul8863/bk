import Link from 'next/link';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Tag } from '@/components/ui/Tag';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

/** External journal/DOI/source only — no internal detail route. */
export function researchProjectHref(project: ResearchProject): string | null {
  const href = project.url?.trim();
  return href || null;
}

export function researchProjectIsExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

type ResearchProjectAnchorProps = {
  project: ResearchProject;
  className?: string;
  children: React.ReactNode;
};

/** Opens attached external link; renders a non-link wrapper when none is set. */
export function ResearchProjectAnchor({
  project,
  className,
  children,
}: ResearchProjectAnchorProps) {
  const href = researchProjectHref(project);
  if (!href) {
    return <div className={className}>{children}</div>;
  }
  if (researchProjectIsExternal(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

type ResearchFeatureProps = {
  project: ResearchProject;
  className?: string;
};

export function ResearchFeature({ project, className }: ResearchFeatureProps) {
  const href = researchProjectHref(project);

  return (
    <article className={cn('grid gap-6 lg:grid-cols-12 lg:gap-10', className)}>
      <div className="lg:col-span-4">
        <Tag tone="sage">{project.researchStatus}</Tag>
        {project.year ? (
          <p className="mt-4 font-display text-5xl text-ink/15">{project.year}</p>
        ) : null}
      </div>
      <div className="lg:col-span-8">
        <h3 className="font-display text-3xl leading-tight text-ink md:text-4xl">
          {href ? (
            <a
              href={href}
              className="transition-colors hover:text-accent"
              {...(researchProjectIsExternal(href)
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {project.summary}
        </p>
        {project.leadAuthorNames.length ? (
          <p className="mt-4 font-sans text-sm text-body">
            {project.leadAuthorNames.join(', ')}
          </p>
        ) : null}
        {href ? (
          <ArrowLink
            href={href}
            className="mt-6"
            external={researchProjectIsExternal(href)}
          >
            Open publication
          </ArrowLink>
        ) : null}
      </div>
    </article>
  );
}
