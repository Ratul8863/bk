import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const root = 'src/app/(public)';

function write(rel, content) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log('wrote', path);
}

function writeSrc(rel, content) {
  const path = join('src', rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.trimStart());
  console.log('wrote', path);
}

// Fix research href helper
writeSrc('components/editorial/ResearchFeature.tsx', `
import Link from 'next/link';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Tag } from '@/components/ui/Tag';
import type { ResearchProject } from '@/types/content';
import { cn } from '@/lib/utils';

export function researchProjectHref(project: ResearchProject): string {
  return \`/research/\${project.slug}\`;
}

type ResearchFeatureProps = {
  project: ResearchProject;
  className?: string;
};

export function ResearchFeature({ project, className }: ResearchFeatureProps) {
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
          <Link
            href={researchProjectHref(project)}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {project.summary}
        </p>
        {project.leadAuthorNames.length ? (
          <p className="mt-4 font-sans text-sm text-body">
            {project.leadAuthorNames.join(' · ')}
          </p>
        ) : null}
        <ArrowLink href={researchProjectHref(project)} className="mt-6">
          Explore project
        </ArrowLink>
      </div>
    </article>
  );
}
`);

console.log('base helpers next...');
