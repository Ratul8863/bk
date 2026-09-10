import fs from "node:fs";
import path from "node:path";
const root = path.resolve("src/app/(public)");
const w = (rel, c) => { const f=path.join(root,rel); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f, c.trimStart()+"\n"); console.log("✓", rel); };

// Fix research status pages
for (const [seg, status, title] of [["ongoing","ongoing","Ongoing projects"],["previous","completed","Previous projects"]]) {
w(`research/${seg}/page.tsx`, `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { EmptyState } from '@/components/ui/EmptyState';
import { getResearchProjects } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';

export const metadata = buildPageMetadata('${title}', '${title} at BK School of Research.', '/research/${seg}');

export default function Page() {
  const projects = getResearchProjects({ researchStatus: '${status}' });
  return (
    <>
      <PageHero title="${title}" description="Projects with status “${status}” in the BKSR archive." breadcrumbs={[{label:'Home',href:'/'},{label:'Research',href:'/research'},{label:'${title}'}]} />
      <Section>
        <Container>
          {projects.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {projects.map((project) => (
                <li key={project.id} className="py-6">
                  <MetaLine items={[RESEARCH_STATUS_LABELS[project.researchStatus], project.year ? String(project.year) : null]} />
                  <Link href={\`/research/\${project.slug}\`} className="mt-2 block font-display text-2xl text-ink hover:text-accent">{project.title}</Link>
                  <p className="mt-2 max-w-3xl text-sm text-muted">{project.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No projects in this list" description="No ${status} projects are present in the current seed data." />
          )}
        </Container>
      </Section>
    </>
  );
}
`);
}

console.log("fixed status pages");
