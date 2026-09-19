import { ResearchStatusList } from '@/components/public/ResearchStatusList';
import { withResearchExternalUrls } from '@/lib/content/research-links';
import {
  getPublications,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Completed research',
  'Completed journal-linked research projects in the BKSR archive.',
  '/research/previous',
);

export default async function Page() {
  const [rawProjects, publications] = await Promise.all([
    getResearchProjects({ researchStatus: 'completed' }),
    getPublications(),
  ]);
  const projects = withResearchExternalUrls(rawProjects, publications);
  return (
    <ResearchStatusList
      title="Completed"
      description="Completed research mapped from peer-reviewed journal articles across health, remittances, climate, education, and related fields."
      breadcrumbLabel="Completed"
      projects={projects}
      emptyTitle="No projects in this list"
      emptyDescription="No completed projects are present in the current portfolio."
      peerHref="/research/ongoing"
      peerLabel="Ongoing"
    />
  );
}
