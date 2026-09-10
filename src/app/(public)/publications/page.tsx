import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { PrototypeMediaNote } from '@/components/ui/PrototypeMediaNote';
import { PublicationFilters } from '@/components/public/PublicationFilters';
import {
  getPublicationById,
  getPublications,
  getResearchAreas,
} from '@/lib/content/queries';
import { getPublicationCoverUrl } from '@/lib/content/prototype-media';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Publications',
  'Journal articles, chapters, reports, and other outputs from BK School of Research.',
  '/publications',
);

export default function PublicationsPage() {
  const publications = getPublications();
  const featured =
    getPublicationById('pub-kumar-remittances-poverty-alleviation-2019') ??
    publications[0];
  const featuredCover = featured ? getPublicationCoverUrl(featured) : null;

  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Publications"
        description="Evidence from BKSR — journals, chapters, reports, and commentary."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Publications' }]}
        actions={
          <>
            <ArrowLink href="/publications/policy-briefs">Policy Briefs</ArrowLink>
            <ArrowLink href="/publications/working-papers">
              Working Papers
            </ArrowLink>
            <ArrowLink href="/publications/journals">Journals</ArrowLink>
            <ArrowLink href="/publications/blogs">Blogs</ArrowLink>
            <ArrowLink href="/publications/annual-reports">
              Annual reports
            </ArrowLink>
          </>
        }
      />

      {featured && featuredCover ? (
        <Section
          tone="white"
          spaced={false}
          className="border-b border-border py-12 md:py-16"
        >
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-3">
                <ImageFrame
                  src={featuredCover}
                  alt={`Cover visual for ${featured.title}`}
                  aspect="portrait"
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  framed
                  frameClassName="mx-auto max-w-[11rem] lg:mx-0 lg:max-w-none"
                />
                <PrototypeMediaNote className="mt-3 text-center lg:text-left" />
              </div>
              <div className="lg:col-span-9">
                <Eyebrow>Featured</Eyebrow>
                <p className="mt-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {PUBLICATION_TYPE_LABELS[featured.type]} · {featured.year}
                  {featured.venue ? ` · ${featured.venue}` : ''}
                </p>
                <h2 className="mt-3 max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">
                  <Link
                    href={`/publications/${featured.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-3 text-sm text-muted">
                  {featured.authors.join(', ')}
                </p>
                <ArrowLink
                  href={`/publications/${featured.slug}`}
                  className="mt-6"
                >
                  Read publication
                </ArrowLink>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="py-14 md:py-20">
        <Container>
          <PublicationFilters
            publications={publications}
            areas={getResearchAreas()}
          />
        </Container>
      </Section>
    </>
  );
}
