import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Gallery',
  'Visual archive of BK School of Research.',
  '/gallery',
);

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Gallery"
        description="Photographs and visual records from BKSR programmes and community life."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />
      <Section>
        <Container narrow>
          <EmptyState
            title="Coming soon"
            description="The legacy gallery page was marked “Coming soon” and contained no published images. Authentic event photography will appear here as it is catalogued — we are not inventing a stock gallery."
          />
          <p className="mt-10 text-base leading-relaxed text-muted">
            Meanwhile, programme visuals live with their source records on Events
            and Activities pages, and leadership photography appears on People.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <ArrowLink href="/events">Browse events</ArrowLink>
            <ArrowLink href="/activities">View activities</ArrowLink>
            <ArrowLink href="/people">Meet people</ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
