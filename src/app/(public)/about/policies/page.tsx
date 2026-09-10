import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RichText } from '@/components/ui/RichText';
import { getPageBySlug } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

const SLUG = 'policies';

export function generateMetadata() {
  const page = getPageBySlug(SLUG, { includeDrafts: true });
  if (!page) return {};
  return buildPageMetadata(page.title, page.excerpt ?? page.title, `/about/${SLUG}`);
}

export default function AboutSubpage() {
  const page = getPageBySlug(SLUG, { includeDrafts: true });
  if (!page) notFound();
  return (
    <>
      <PageHero
        title={page.title}
        description={page.excerpt}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: page.title },
        ]}
      />
      <Section>
        <Container narrow>
          <RichText content={page.body} />
        </Container>
      </Section>
    </>
  );
}
