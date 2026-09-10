import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/app/(public)');
function w(rel, c) {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c.trimStart() + '\n');
  console.log('✓', rel);
}

w(
  'publications/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { PublicationFilters } from '@/components/public/PublicationFilters';
import { getPublications, getResearchAreas } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Publications',
  'Journal articles, chapters, reports, and other outputs from BK School of Research.',
  '/publications',
);

export default function PublicationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Publications"
        description="Browse and filter the BKSR publication archive by type, area, year, or keyword."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Publications' }]}
        actions={
          <>
            <ArrowLink href="/publications/annual-reports">Annual reports</ArrowLink>
            <ArrowLink href="/publications/newsletters">Newsletters</ArrowLink>
            <ArrowLink href="/publications/journals">Journals</ArrowLink>
            <ArrowLink href="/publications/opinions">Opinions</ArrowLink>
          </>
        }
      />
      <Section>
        <Container>
          <PublicationFilters publications={getPublications()} areas={getResearchAreas()} />
        </Container>
      </Section>
    </>
  );
}
`,
);

const filters = [
  ['annual-reports', 'annual-report', 'Annual reports'],
  ['newsletters', 'newsletter', 'Newsletters'],
  ['journals', 'journal', 'Journals'],
  ['opinions', 'opinion', 'Opinions'],
];

for (const [seg, type, title] of filters) {
  w(
    `publications/${seg}/page.tsx`,
    `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PublicationFilters } from '@/components/public/PublicationFilters';
import { getPublications, getResearchAreas } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  '${title}',
  '${title} from BK School of Research.',
  '/publications/${seg}',
);

export default function Page() {
  return (
    <>
      <PageHero
        title="${title}"
        description="Filtered view of the publication library."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: '${title}' },
        ]}
      />
      <Section>
        <Container>
          <PublicationFilters
            publications={getPublications()}
            areas={getResearchAreas()}
            initialType="${type}"
          />
        </Container>
      </Section>
    </>
  );
}
`,
  );
}

w(
  'publications/[slug]/page.tsx',
  `import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { RichText } from '@/components/ui/RichText';
import {
  getPublicationBySlug,
  getPublications,
  getResearchAreas,
  getResearchProjectById,
} from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublications({ includeDrafts: true }).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getPublicationBySlug(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(item.title, item.citation, \`/publications/\${item.slug}\`);
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const item = getPublicationBySlug(slug);
  if (!item) notFound();

  const areas = getResearchAreas().filter((area) =>
    (item.areaIds ?? []).includes(area.id),
  );
  const project = item.projectId ? getResearchProjectById(item.projectId) : null;

  return (
    <>
      <PageHero
        eyebrow={PUBLICATION_TYPE_LABELS[item.type]}
        title={item.title}
        description={item.authors.join(', ')}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Publications', href: '/publications' },
          { label: item.title },
        ]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <article>
              <MetaLine items={[String(item.year), item.venue ?? null]} />
              <p className="mt-6 text-base leading-relaxed text-body">{item.citation}</p>
              {item.abstract ? (
                <div className="mt-8">
                  <h2 className="font-display text-2xl text-ink">Abstract</h2>
                  <div className="mt-3">
                    <RichText content={item.abstract} />
                  </div>
                </div>
              ) : null}
              {item.doi ? <p className="mt-8 text-sm text-muted">DOI: {item.doi}</p> : null}
              {item.url ? (
                <p className="mt-2 text-sm">
                  <a href={item.url} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                    External link
                  </a>
                </p>
              ) : null}
            </article>
            <aside className="space-y-6 border-t border-border pt-6 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:self-start lg:pt-0 lg:pl-6">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">Type</p>
                <p className="mt-2 text-sm text-ink">{PUBLICATION_TYPE_LABELS[item.type]}</p>
              </div>
              {areas.length ? (
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">Areas</p>
                  <ul className="mt-2 space-y-1">
                    {areas.map((area) => (
                      <li key={area.id}>
                        <Link href={\`/research/areas#\${area.slug}\`} className="text-sm text-accent hover:underline">
                          {area.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project ? (
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted">Project</p>
                  <Link href={\`/research/\${project.slug}\`} className="mt-2 block text-sm text-accent hover:underline">
                    {project.title}
                  </Link>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  'activities/page.tsx',
  `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getActivities } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ACTIVITY_ROUTE_META } from '@/lib/public/labels';

export const metadata = buildPageMetadata(
  'Activities',
  'Capacity building, awareness campaigns, research talks, and innovation showcasing at BKSR.',
  '/activities',
);

const routes = ACTIVITY_ROUTE_META.filter((item) =>
  ['capacity-building', 'awareness-campaigns', 'research-talks', 'innovation-showcasing'].includes(
    item.routeSlug,
  ),
);

export default function ActivitiesPage() {
  const activities = getActivities();
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Activities"
        description="Public programmes that extend BKSR research into training, dialogue, and creative practice."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Activities' }]}
      />
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {routes.map((route) => {
              const activity = activities.find((item) => item.type === route.type);
              return (
                <Link
                  key={route.routeSlug}
                  href={\`/activities/\${route.routeSlug}\`}
                  className="border-t border-border pt-6 transition-colors hover:border-accent"
                >
                  <h2 className="font-display text-2xl text-ink">{route.label}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {activity?.summary ?? 'Programme details forthcoming.'}
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

for (const route of [
  'capacity-building',
  'awareness-campaigns',
  'awareness-campaign',
  'research-talks',
  'research-talk',
  'innovation-showcasing',
]) {
  w(
    `activities/${route}/page.tsx`,
    `import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RichText } from '@/components/ui/RichText';
import { getActivities, getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ACTIVITY_ROUTE_META } from '@/lib/public/labels';
import { formatDate } from '@/lib/utils';

const meta = ACTIVITY_ROUTE_META.find((item) => item.routeSlug === '${route}');

export const metadata = buildPageMetadata(
  meta?.label ?? 'Activity',
  \`\${meta?.label ?? 'Activity'} programmes at BK School of Research.\`,
  '/activities/${route}',
);

export default function ActivityTypePage() {
  if (!meta) notFound();
  const activity = getActivities().find((item) => item.type === meta.type);
  if (!activity) notFound();
  const events = (activity.relatedEventIds ?? [])
    .map((id) => getEvents().find((event) => event.id === id))
    .filter(Boolean);

  return (
    <>
      <PageHero
        title={activity.title}
        description={activity.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Activities', href: '/activities' },
          { label: activity.title },
        ]}
      />
      <Section>
        <Container narrow>
          <RichText content={activity.description} />
          {events.length ? (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-ink">Related events</h2>
              <ul className="mt-4 space-y-3">
                {events.map((event) =>
                  event ? (
                    <li key={event.id}>
                      <Link href={\`/events/\${event.slug}\`} className="text-accent hover:underline">
                        {event.title}
                      </Link>
                      <span className="text-sm text-muted"> · {formatDate(event.startAt)}</span>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
`,
  );
}

console.log('publications + activities complete');
