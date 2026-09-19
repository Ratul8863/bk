import { ResearchStatusList } from '@/components/public/ResearchStatusList';
import { withResearchExternalUrls } from '@/lib/content/research-links';
import {
  getPublications,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Ongoing research',
  'Ongoing research projects at BK School of Research.',
  '/research/ongoing',
);

export default async function Page() {
  const [rawProjects, publications] = await Promise.all([
    getResearchProjects({ researchStatus: 'ongoing' }),
    getPublications(),
  ]);
  const projects = withResearchExternalUrls(rawProjects, publications);
  return (
    <ResearchStatusList
      title="Ongoing"
      description="Active projects on climate displacement, livelihood coping, and student migration — bridging inquiry with public value."
      breadcrumbLabel="Ongoing"
      projects={projects}
      emptyTitle="No projects in this list"
      emptyDescription="No ongoing projects are present in the current portfolio."
      peerHref="/research/previous"
      peerLabel="Completed"
    />
  );
}
