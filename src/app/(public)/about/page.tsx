import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatItem } from '@/components/ui/StatItem';
import { PersonPortrait } from '@/components/editorial/PersonPortrait';
import { Reveal } from '@/components/motion/Reveal';
import {
  getHomepageConfig,
  getPageBySlug,
  getPersonById,
  getSiteSettings,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'About',
  'Mission, vision, and institutional overview of BK School of Research.',
  '/about',
);

const links = [
  { href: '/about/who-we-are', label: 'Who We Are', slug: 'who-we-are' },
  { href: '/about/what-we-do', label: 'What We Do', slug: 'what-we-do' },
  { href: '/about/governance', label: 'Governance', slug: 'governance' },
  { href: '/about/policies', label: 'Our Policies', slug: 'policies' },
];

export default function AboutPage() {
  const settings = getSiteSettings();
  const homepage = getHomepageConfig();
  const whoWeAre = getPageBySlug('who-we-are');
  const director = getPersonById(homepage.directorPersonId);
  const stats = [...homepage.stats]
    .filter((stat) => stat.verified)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow="Institution"
        title="About BKSR"
        description={settings.positioningStatement}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-7">
              <Eyebrow>Mission & vision</Eyebrow>
              <div className="mt-8 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 className="font-display text-2xl text-ink">Mission</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {settings.mission}
                  </p>
                </div>
                <div>
                  <h2 className="font-display text-2xl text-ink">Vision</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {settings.vision}
                  </p>
                </div>
              </div>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-body">
                Motto: <span className="text-ink">{settings.motto}</span>
                {' — '}
                {settings.tagline}.
              </p>
            </Reveal>

            {director?.photoUrl ? (
              <Reveal className="lg:col-span-5" delay={0.08}>
                <div className="border border-border bg-surface-subtle p-6 md:p-8">
                  <PersonPortrait
                    name={director.name}
                    src={director.photoUrl}
                    framed
                    className="mx-auto max-w-56"
                  />
                  <p className="mt-6 font-display text-xl text-ink">{director.name}</p>
                  <p className="mt-1 text-sm text-accent">{director.role}</p>
                  {director.shortBio ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {director.shortBio}
                    </p>
                  ) : null}
                  <ArrowLink href={`/people/${director.slug}`} className="mt-5">
                    View profile
                  </ArrowLink>
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      {whoWeAre ? (
        <Section tone="sage" className="border-y border-border">
          <Container narrow>
            <Reveal>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
                Research, reformation, and development
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-body">
                {whoWeAre.excerpt}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                BK School of Research was founded by Bezon Kumar in October 2015
                and began its official journey in December 2016. The organisation
                works with young students, researchers, and university teachers
                across business, economics, social sciences, and the humanities.
              </p>
              <ArrowLink href="/about/who-we-are" className="mt-8">
                Read Who We Are
              </ArrowLink>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {stats.length ? (
        <Section>
          <Container>
            <Eyebrow>At a glance</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ink">
              Verified institutional markers
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Reveal key={stat.id} delay={index * 0.05}>
                  <StatItem
                    value={stat.value}
                    label={stat.label}
                    note={stat.note}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border">
        <Container>
          <Eyebrow>Explore</Eyebrow>
          <h2 className="mt-3 font-display text-3xl text-ink">Inside BKSR</h2>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {links.map((item) => {
              const page = getPageBySlug(item.slug, { includeDrafts: true });
              return (
                <li key={item.href} className="py-7">
                  <Link href={item.href} className="group block">
                    <span className="font-display text-2xl text-ink transition-colors group-hover:text-accent md:text-3xl">
                      {item.label}
                    </span>
                    {page?.excerpt ? (
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                        {page.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 flex flex-wrap gap-6">
            <ArrowLink href="/people">Meet our people</ArrowLink>
            <ArrowLink href="/research">Explore research</ArrowLink>
            <ArrowLink href="/contact">Contact BKSR</ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
