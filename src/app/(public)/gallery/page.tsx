import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { pageHeroMedia } from '@/lib/content/page-heroes';
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
        imageSrc={pageHeroMedia.gallery}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        actions={
          <>
            <ArrowLink href="/events">Browse events</ArrowLink>
            <ArrowLink href="/activities">View activities</ArrowLink>
          </>
        }
      />
      <Section tone="white">
        <Container>
          <EmptyState
            title="Coming soon"
            description="The legacy gallery page was marked Coming soon and contained no published images. Authentic event photography will appear here as it is catalogued — we are not inventing a stock gallery."
            action={
              <>
                <ArrowLink href="/events">Browse events</ArrowLink>
                <ArrowLink href="/activities">View activities</ArrowLink>
                <ArrowLink href="/people">Meet people</ArrowLink>
              </>
            }
          />
          <p className="mx-auto mt-10 max-w-2xl text-center font-instrument text-base leading-relaxed text-muted md:text-lg">
            Meanwhile, programme visuals live with their source records on Events and Activities pages, and leadership photography appears on People.
          </p>
        </Container>
      </Section>
    </>
  );
}
