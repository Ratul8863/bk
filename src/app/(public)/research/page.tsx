import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { ResearchFilters } from '@/components/public/ResearchFilters';
import {
  getResearchAreas,
  getResearchProjects,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research',
  'Ongoing and completed research projects at BK School of Research.',
  '/research',
);

export default function ResearchPage() {
  const projects = getResearchProjects();
  const areas = getResearchAreas();

  return (
    <>
      <PageHero
        eyebrow="Inquiry"
        title="Research"
        description="Filter projects by area, status, year, or keyword. Listings reflect seed records migrated from the legacy site."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }]}
        actions={
          <>
            <ArrowLink href="/research/ongoing">Ongoing</ArrowLink>
            <ArrowLink href="/research/previous">Completed</ArrowLink>
            <ArrowLink href="/research/areas">Research areas</ArrowLink>
            <ArrowLink href="/research/grants">Grants</ArrowLink>
          </>
        }
      />
      <Section>
        <Container>
          <ResearchFilters projects={projects} areas={areas} />
        </Container>
      </Section>
    </>
  );
}

