import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RichText } from '@/components/ui/RichText';
import { Tag } from '@/components/ui/Tag';
import { getResourceBySlug, getResources } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getResources({ includeDrafts: true }).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getResourceBySlug(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(item.title, item.summary, `/resources/${item.slug}`);
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const item = getResourceBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        title={item.title}
        description={item.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Resources', href: '/resources' },
          { label: item.title },
        ]}
      />
      <Section>
        <Container narrow>
          {item.topics?.length ? (
            <div className="mb-6 flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <Tag key={topic}>{topic}</Tag>
              ))}
            </div>
          ) : null}
          <RichText content={item.description} />
          {item.externalUrl ? (
            <p className="mt-8 text-sm">
              <a href={item.externalUrl} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                Open external resource
              </a>
            </p>
          ) : null}
          {item.notes ? <p className="mt-6 text-sm text-muted">{item.notes}</p> : null}
        </Container>
      </Section>
    </>
  );
}

