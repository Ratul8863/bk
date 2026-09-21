import { ResearchFeature } from '@/components/editorial/ResearchFeature';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ResearchFilters } from '@/components/public/ResearchFilters';
import { ResearchIntro } from '@/components/public/ResearchIntro';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { withResearchExternalUrls } from '@/lib/content/research-links';
import {
  getPublications,
  getResearchAreas,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research',
  'Evidence-based research across disciplines, shaping policy and building resilient societies.',
  '/research',
);

export default async function ResearchPage() {
  const [rawProjects, areas, publications] = await Promise.all([
    getResearchProjects(),
    getResearchAreas(),
    getPublications(),
  ]);
  const projects = withResearchExternalUrls(rawProjects, publications);
  const featured =
    projects.find((project) => project.researchStatus === 'ongoing') ??
    projects[0];

  return (
    <>
      <PageHero
        eyebrow="Inquiry"
        title="Research"
        description="Evidence-based research across disciplines, shaping policy and building resilient societies."
        imageSrc={pageHeroMedia.research}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }]}
      />

      <ResearchIntro />

      {featured ? (
        <Section tone="white" className="border-b border-border">
          <Container>
            <ResearchFeature project={featured} />
          </Container>
        </Section>
      ) : null}

      <Section className="bg-[#F7F1E6]">
        <Container>
          <ResearchFilters projects={projects} areas={areas} />
        </Container>
      </Section>
    </>
  );
}
