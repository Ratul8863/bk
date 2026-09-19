import { notFound } from 'next/navigation';
import { AboutSubpageView } from '@/components/public/AboutSubpageView';
import { getPageBySlug } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

const SLUG = 'who-we-are';

export async function generateMetadata() {
  const page = await getPageBySlug(SLUG, { includeDrafts: true });
  if (!page) return {};
  return buildPageMetadata(page.title, page.excerpt ?? page.title, `/about/${SLUG}`);
}

export default async function AboutSubpage() {
  const page = await getPageBySlug(SLUG, { includeDrafts: true });
  if (!page) notFound();
  return <AboutSubpageView page={page} slug={SLUG} />;
}
