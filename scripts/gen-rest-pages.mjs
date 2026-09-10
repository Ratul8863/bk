import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/app/(public)');
function w(rel, c) {
  const f = path.join(root, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, c.trimStart() + '\n');
  console.log('✓', rel);
}

function listPage({ dir, title, eyebrow, description, pathName, getter, hrefBase, dateField, excerptField }) {
  w(
    `${dir}/page.tsx`,
    `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { ${getter} } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata('${title}', '${description}', '${pathName}');

export default function Page() {
  const items = ${getter}();
  return (
    <>
      <PageHero
        eyebrow="${eyebrow}"
        title="${title}"
        description="${description}"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: '${title}' }]}
      />
      <Section>
        <Container>
          {items.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <li key={item.id} className="py-6">
                  {item.${dateField} ? (
                    <time className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {formatDate(item.${dateField})}
                    </time>
                  ) : null}
                  <Link
                    href={\`${hrefBase}/\${item.slug}\`}
                    className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  {item.${excerptField} ? (
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
                      {item.${excerptField}}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Nothing published yet" description="Entries will appear here when available in the archive." />
          )}
        </Container>
      </Section>
    </>
  );
}
`,
  );
}

function detailPage({ dir, getterBySlug, getterAll, titleLabel, dateField, bodyField, excerptField }) {
  w(
    `${dir}/[slug]/page.tsx`,
    `import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { RichText } from '@/components/ui/RichText';
import { ${getterBySlug}, ${getterAll} } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ${getterAll}({ includeDrafts: true }).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = ${getterBySlug}(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(item.title, item.${excerptField} ?? item.title, \`/${dir}/\${item.slug}\`);
}

export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const item = ${getterBySlug}(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow={item.${dateField} ? formatDate(item.${dateField}) : '${titleLabel}'}
        title={item.title}
        description={item.${excerptField}}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: '${titleLabel}', href: '/${dir}' },
          { label: item.title },
        ]}
      />
      <Section>
        <Container narrow>
          <RichText content={item.${bodyField}} />
        </Container>
      </Section>
    </>
  );
}
`,
  );
}

listPage({
  dir: 'news',
  title: 'News',
  eyebrow: 'Updates',
  description: 'Notes and commentary from the BKSR community.',
  pathName: '/news',
  getter: 'getNews',
  hrefBase: '/news',
  dateField: 'publishedAt',
  excerptField: 'excerpt',
});
detailPage({
  dir: 'news',
  getterBySlug: 'getNewsBySlug',
  getterAll: 'getNews',
  titleLabel: 'News',
  dateField: 'publishedAt',
  bodyField: 'body',
  excerptField: 'excerpt',
});

w(
  'events/page.tsx',
  `import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'Events',
  'Upcoming and past events from BK School of Research.',
  '/events',
);

export default function EventsPage() {
  const upcoming = getEvents({ eventStatus: 'upcoming' });
  const past = getEvents({ eventStatus: 'past' });

  return (
    <>
      <PageHero
        eyebrow="Calendar"
        title="Events"
        description="Webinars, workshops, and gatherings associated with BKSR."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
      />
      <Section>
        <Container>
          <h2 className="font-display text-3xl text-ink">Upcoming</h2>
          {upcoming.length ? (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {upcoming.map((event) => (
                <li key={event.id} className="flex gap-5 py-6">
                  <div className="min-w-[4.5rem]">
                    <p className="font-display text-3xl text-ink">{formatDate(event.startAt, 'd')}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      {formatDate(event.startAt, 'MMM yyyy')}
                    </p>
                  </div>
                  <div>
                    <Link href={\`/events/\${event.slug}\`} className="font-display text-2xl text-ink hover:text-accent">
                      {event.title}
                    </Link>
                    {event.location ? <p className="mt-1 text-sm text-muted">{event.location}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-6" title="No upcoming events" description="Past events are listed below." />
          )}

          <h2 className="mt-16 font-display text-3xl text-ink">Past</h2>
          {past.length ? (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {past.map((event) => (
                <li key={event.id} className="flex gap-5 py-6">
                  <div className="min-w-[4.5rem]">
                    <p className="font-display text-3xl text-ink">{formatDate(event.startAt, 'd')}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      {formatDate(event.startAt, 'MMM yyyy')}
                    </p>
                  </div>
                  <div>
                    <Link href={\`/events/\${event.slug}\`} className="font-display text-2xl text-ink hover:text-accent">
                      {event.title}
                    </Link>
                    <p className="mt-2 max-w-3xl text-sm text-muted">{event.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-6" title="No past events listed" />
          )}
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  'events/[slug]/page.tsx',
  `import { notFound } from 'next/navigation';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MetaLine } from '@/components/ui/MetaLine';
import { RichText } from '@/components/ui/RichText';
import { getEventBySlug, getEvents } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getEvents({ includeDrafts: true }).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getEventBySlug(slug, { includeDrafts: true });
  if (!item) return {};
  return buildPageMetadata(item.title, item.summary, \`/events/\${item.slug}\`);
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const item = getEventBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <PageHero
        eyebrow={item.eventStatus === 'upcoming' ? 'Upcoming' : 'Past event'}
        title={item.title}
        description={item.summary}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Events', href: '/events' },
          { label: item.title },
        ]}
      />
      <Section>
        <Container narrow>
          <MetaLine
            items={[
              formatDate(item.startAt),
              item.location ?? null,
              item.isOnline ? 'Online' : null,
            ]}
          />
          {item.speakers?.length ? (
            <p className="mt-4 text-sm text-body">Speakers: {item.speakers.join(', ')}</p>
          ) : null}
          <div className="mt-8">
            <RichText content={item.description} />
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

listPage({
  dir: 'notices',
  title: 'Notices',
  eyebrow: 'Bulletin',
  description: 'Vacancies, announcements, and institutional notices.',
  pathName: '/notices',
  getter: 'getNotices',
  hrefBase: '/notices',
  dateField: 'publishedAt',
  excerptField: 'summary',
});
detailPage({
  dir: 'notices',
  getterBySlug: 'getNoticeBySlug',
  getterAll: 'getNotices',
  titleLabel: 'Notices',
  dateField: 'publishedAt',
  bodyField: 'body',
  excerptField: 'summary',
});

listPage({
  dir: 'resources',
  title: 'Resources',
  eyebrow: 'Knowledge hub',
  description: 'Guides, tutorials, and archives from the BKSR knowledge hub.',
  pathName: '/resources',
  getter: 'getResources',
  hrefBase: '/resources',
  dateField: 'publishedAt',
  excerptField: 'summary',
});

w(
  'resources/[slug]/page.tsx',
  `import { notFound } from 'next/navigation';
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
  return buildPageMetadata(item.title, item.summary, \`/resources/\${item.slug}\`);
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
`,
);

w(
  'gallery/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/EmptyState';
import { getGalleryAlbums, getGalleryImages } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Gallery',
  'Visual archive of BK School of Research.',
  '/gallery',
);

export default function GalleryPage() {
  const albums = getGalleryAlbums({ includeDrafts: true });
  const images = getGalleryImages({ includeDrafts: true });
  const hasMedia = images.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Gallery"
        description="Photographs and visual records. The legacy gallery page was marked coming soon; no invented images are shown."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
      />
      <Section>
        <Container>
          {hasMedia ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <figure key={image.id} className="border border-border bg-sage/30 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
                  {image.caption || image.title ? (
                    <figcaption className="mt-3 text-sm text-muted">
                      {image.caption ?? image.title}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <EmptyState
              title={albums[0]?.title ?? 'Coming soon'}
              description={
                albums[0]?.description ??
                'No gallery images are published in the current archive.'
              }
            />
          )}
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  'contact/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/public/ContactForm';
import { getSiteSettings } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Contact',
  'Contact BK School of Research in Shahjadpur, Sirajganj, Bangladesh.',
  '/contact',
);

export default function ContactPage() {
  const settings = getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Contact"
        description="Reach BKSR by email, phone, or the form below."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-ink">Institutional details</h2>
              <address className="mt-6 space-y-3 text-base not-italic leading-relaxed text-body">
                <p>{settings.organizationName}</p>
                <p>{settings.address.full}</p>
                <p>
                  <a href={\`tel:\${settings.phone.replace(/\\s/g, '')}\`} className="text-accent hover:underline">
                    {settings.phone}
                  </a>
                </p>
                <p>
                  General:{' '}
                  <a href={\`mailto:\${settings.emails.general}\`} className="text-accent hover:underline">
                    {settings.emails.general}
                  </a>
                </p>
                <p>
                  Executive Director:{' '}
                  <a href={\`mailto:\${settings.emails.executiveDirector}\`} className="text-accent hover:underline">
                    {settings.emails.executiveDirector}
                  </a>
                </p>
                <p>
                  Research Director:{' '}
                  <a href={\`mailto:\${settings.emails.researchDirector}\`} className="text-accent hover:underline">
                    {settings.emails.researchDirector}
                  </a>
                </p>
              </address>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  'search/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SearchPanel } from '@/components/search/SearchPanel';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Search',
  'Search publications, research, people, news, events, notices, and resources.',
  '/search',
);

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <>
      <PageHero
        eyebrow="Find"
        title="Search"
        description="Look across the public BKSR archive."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
      />
      <Section>
        <Container>
          <SearchPanel initialQuery={params.q ?? ''} initialCategory={params.category ?? 'all'} />
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  'privacy/page.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getSiteSettings } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Privacy',
  'Privacy information for the BK School of Research website.',
  '/privacy',
);

export default function PrivacyPage() {
  const settings = getSiteSettings();
  return (
    <>
      <PageHero
        title="Privacy"
        description="How this website handles information."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]}
      />
      <Section>
        <Container narrow>
          <div className="space-y-6 text-base leading-relaxed text-body">
            <p>
              {settings.organizationName} ({settings.organizationShortName}) publishes this website
              to share research, publications, and institutional information.
            </p>
            <p>
              Contact forms on this site are demonstration interfaces only and do not transmit data
              to a server. For formal correspondence, use the email addresses listed on the Contact page.
            </p>
            <p>
              Server logs for hosting and analytics, if enabled by the deployment platform, may
              include standard technical data such as IP address, browser type, and requested URLs.
              No personal profiles are sold or shared for advertising.
            </p>
            <p>
              Questions about privacy may be sent to{' '}
              <a href={\`mailto:\${settings.emails.general}\`} className="text-accent hover:underline">
                {settings.emails.general}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
`,
);

w(
  '../not-found.tsx',
  `import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center border-b border-border bg-paper pt-28 pb-20">
      <Container>
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent">404</p>
        <EditorialHeading as="h1" size="xl" className="mt-4 max-w-3xl">
          This page is not in the archive.
        </EditorialHeading>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          The address may be mistyped, or the content may not have been published on the new BKSR site.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/" variant="primary">
            Return home
          </Button>
          <Button href="/search" variant="secondary">
            Search the site
          </Button>
          <Link href="/contact" className="inline-flex items-center px-2 text-sm font-semibold text-accent hover:text-ink">
            Contact BKSR
          </Link>
        </div>
      </Container>
    </div>
  );
}
`,
);

console.log('news/events/notices/resources/gallery/contact/search/privacy/404 done');
