import Link from 'next/link';
import { ArticleReading } from '@/components/editorial/ArticleReading';
import { PageHero } from '@/components/layout/PageHero';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import type { Page } from '@/types/content';

const ABOUT_LINKS = [
  { href: '/about/who-we-are', label: 'Who We Are', slug: 'who-we-are' },
  { href: '/about/what-we-do', label: 'What We Do', slug: 'what-we-do' },
  { href: '/about/governance', label: 'Governance', slug: 'governance' },
  { href: '/about/policies', label: 'Our Policies', slug: 'policies' },
] as const;

type AboutSubpageViewProps = {
  page: Page;
  slug: (typeof ABOUT_LINKS)[number]['slug'];
};

export function AboutSubpageView({ page, slug }: AboutSubpageViewProps) {
  const siblings = ABOUT_LINKS.filter((item) => item.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow="Institution"
        title={page.title}
        description={page.excerpt}
        imageSrc={pageHeroMedia.about}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: page.title },
        ]}
        actions={<ArrowLink href="/about">About overview</ArrowLink>}
      />
      <ArticleReading
        body={page.body}
        backHref="/about"
        backLabel="Back to About"
        aside={
          <div className="space-y-6">
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
              In this section
            </p>
            <ul className="space-y-4">
              {siblings.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 border-b border-ink pb-0.5 font-instrument text-base font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-5">
              <ArrowLink href="/people">Meet our people</ArrowLink>
            </div>
          </div>
        }
      />
    </>
  );
}
