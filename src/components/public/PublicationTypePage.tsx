import { PageHero } from '@/components/layout/PageHero';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { PublicationFilters } from '@/components/public/PublicationFilters';
import {
  getPublications,
  getResearchAreas,
} from '@/lib/content/queries';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import { buildPageMetadata } from '@/lib/seo/metadata';
import type { PublicationType } from '@/types/content';

type Props = {
  type: PublicationType;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  path: string;
};

export function publicationTypeMetadata(
  title: string,
  description: string,
  path: string,
) {
  return buildPageMetadata(title, description, path);
}

/** Locked-type publication library page used by diagram-aligned routes. */
export function PublicationTypePage({
  type,
  title,
  description,
  emptyTitle,
  emptyDescription,
  path,
}: Props) {
  const publications = getPublications().filter((item) => item.type === type);
  const label = PUBLICATION_TYPE_LABELS[type];

  return (
    <>
      <PageHero
        eyebrow="Library"
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: title },
        ]}
        actions={
          <>
            <ArrowLink href="/publications">All publications</ArrowLink>
            <ArrowLink href="/publications/journals">Journals</ArrowLink>
          </>
        }
      />
      <Section>
        <Container>
          {publications.length ? (
            <PublicationFilters
              publications={getPublications()}
              areas={getResearchAreas()}
              initialType={type}
              lockType
            />
          ) : (
            <>
              <EmptyState title={emptyTitle} description={emptyDescription} />
              <div className="mt-10 flex flex-wrap gap-6">
                <ArrowLink href="/publications">Browse all publications</ArrowLink>
                <ArrowLink href="/publications/journals">
                  Journal articles
                </ArrowLink>
                <ArrowLink href="/publications/blogs">Blogs</ArrowLink>
              </div>
              <p className="mt-8 text-sm text-muted">
                CMS type ready: <span className="text-ink">{label}</span>. Items
                appear here when published.
              </p>
              <p className="sr-only">{path}</p>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
