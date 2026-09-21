import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { pageHeroMedia } from '@/lib/content/page-heroes';
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
        eyebrow="Research"
        title="Research grants"
        description="Programme architecture for future grant opportunities."
        imageSrc={pageHeroMedia.research}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: 'Grants' },
        ]}
      />
      <Section tone="white">
        <Container>
          <EmptyState
            title="No active grant calls published"
            description="BKSR anticipates structuring research grants around open calls, thematic priorities aligned with our areas, and transparent review. Individual grant awards are not listed here because none are present in the verified seed archive."
            action={
              <>
                <ArrowLink href="/research/areas">Explore research areas</ArrowLink>
                <ArrowLink href="/notices">Check notices</ArrowLink>
              </>
            }
          />
          <div className="mt-14 grid gap-8 border border-border bg-paper p-6 md:grid-cols-2 md:p-10 lg:grid-cols-4">
            {[
              { title: 'Open calls', body: 'Tied to education, policy, social development, and related themes.' },
              { title: 'Eligibility', body: 'Oriented to early-career researchers and collaborative teams.' },
              { title: 'Review', body: 'Criteria emphasising research design, ethics, and public value.' },
              { title: 'Reporting', body: 'Expectations that feed publication and knowledge-hub pipelines.' },
            ].map((item) => (
              <div key={item.title}>
                <Eyebrow>{item.title}</Eyebrow>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            When grant opportunities are formally announced, they will appear on this page and in Notices.
          </p>
        </Container>
      </Section>
    </>
  );
}
