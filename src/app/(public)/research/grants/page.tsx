import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Research Grants',
  'Overview of the BKSR research grants programme structure.',
  '/research/grants',
);

export default function ResearchGrantsPage() {
  return (
    <>
      <PageHero
        title="Research grants"
        description="Programme architecture for future grant opportunities."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: 'Grants' },
        ]}
      />
      <Section>
        <Container narrow>
          <EmptyState
            title="No active grant calls published"
            description="BKSR anticipates structuring research grants around open calls, thematic priorities aligned with our areas, and transparent review. Individual grant awards are not listed here because none are present in the verified seed archive."
          />
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="font-display text-2xl text-ink">Programme outline</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted">
                <li>Open calls tied to education, policy, social development, and related themes.</li>
                <li>Eligibility oriented to early-career researchers and collaborative teams.</li>
                <li>Review criteria emphasising research design, ethics, and public value.</li>
                <li>Reporting expectations that feed the publication and knowledge-hub pipelines.</li>
              </ul>
            </div>
            <p className="text-sm text-muted">
              When grant opportunities are formally announced, they will appear on this page and in Notices.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

