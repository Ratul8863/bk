import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PersonProfile } from '@/components/editorial/PersonProfile';
import { PersonPortrait } from '@/components/editorial/PersonPortrait';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import {
  getDemoPeopleSlugs,
  getDemoPersonBySlug,
  peopleDemoRoster,
  PEOPLE_DEMO_SECTION_COPY,
} from '@/content/seed/people-demo';
import { RESERVED_PEOPLE_CATEGORY_SLUGS } from '@/lib/content/people-slugs';
import {
  getPeople,
  getPersonBySlug,
  getPublications,
} from '@/lib/content/queries';
import { PERSON_CATEGORY_META } from '@/lib/public/labels';
import { buildPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ slug: string }> };

function researchItemsFromInterests(interests?: string[]) {
  return (interests ?? []).map((title) => ({
    title,
    summary: `Focus area within ${title.toLowerCase()} and related evidence work at BKSR.`,
  }));
}

function publicationsForPerson(name: string) {
  const needle = name.split(/\s+/).filter(Boolean).at(-1)?.toLowerCase();
  if (!needle) return [];
  return getPublications()
    .filter((pub) =>
      pub.authors.some((author) => author.toLowerCase().includes(needle)),
    )
    .slice(0, 5)
    .map((pub) => ({
      title: pub.title,
      summary:
        pub.abstract?.trim() ||
        pub.citation.replace(/\s+/g, ' ').trim(),
      href: `/publications/${pub.slug}`,
    }));
}

export async function generateStaticParams() {
  const people = getPeople({ includeDrafts: true }).filter(
    (person) => !RESERVED_PEOPLE_CATEGORY_SLUGS[person.slug],
  );
  return [
    ...Object.keys(RESERVED_PEOPLE_CATEGORY_SLUGS).map((slug) => ({ slug })),
    ...people.map((person) => ({ slug: person.slug })),
    ...getDemoPeopleSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = RESERVED_PEOPLE_CATEGORY_SLUGS[slug];
  if (category) {
    const meta = PERSON_CATEGORY_META[category];
    return buildPageMetadata(meta.label, meta.description, `/people/${slug}`);
  }

  const person = getPersonBySlug(slug, { includeDrafts: true });
  if (person) {
    return buildPageMetadata(
      person.name,
      person.shortBio ?? person.bio.slice(0, 160),
      `/people/${person.slug}`,
    );
  }

  const demo = getDemoPersonBySlug(slug);
  if (demo) {
    return buildPageMetadata(
      demo.name,
      demo.description.slice(0, 160),
      `/people/${demo.slug}`,
    );
  }

  return {};
}

export default async function PeopleSlugPage({ params }: Props) {
  const { slug } = await params;

  const category = RESERVED_PEOPLE_CATEGORY_SLUGS[slug];
  if (category) {
    const members = getPeople({ category });
    const demoMembers = peopleDemoRoster.filter(
      (person) => person.category === category,
    );
    const meta = PERSON_CATEGORY_META[category];
    const hasMembers = members.length > 0 || demoMembers.length > 0;

    return (
      <>
        <PageHero
          title={meta.label}
          description={meta.description}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'People', href: '/people' },
            { label: meta.label },
          ]}
        />
        <Section>
          <Container>
            {hasMembers ? (
              <ul className="divide-y divide-border border-y border-border">
                {members.map((member) => (
                  <li key={member.id} className="flex gap-5 py-6">
                    {member.photoUrl ? (
                      <Link
                        href={`/people/${member.slug}`}
                        className="w-16 shrink-0 sm:w-20"
                      >
                        <PersonPortrait
                          name={member.name}
                          src={member.photoUrl}
                          aspect="square"
                          framed
                        />
                      </Link>
                    ) : null}
                    <div className="min-w-0">
                      <Link
                        href={`/people/${member.slug}`}
                        className="font-display text-2xl text-ink hover:text-accent"
                      >
                        {member.name}
                      </Link>
                      <p className="mt-1 text-sm text-accent">{member.role}</p>
                    </div>
                  </li>
                ))}
                {demoMembers.map((member) => (
                  <li key={member.id} className="flex gap-5 py-6">
                    <Link
                      href={`/people/${member.slug}`}
                      className="w-16 shrink-0 sm:w-20"
                    >
                      <PersonPortrait
                        name={member.name}
                        src={member.imageSrc}
                        aspect="square"
                        framed
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/people/${member.slug}`}
                        className="font-display text-2xl text-ink hover:text-accent"
                      >
                        {member.name}
                      </Link>
                      <p className="mt-1 text-sm text-accent">{member.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No profiles published yet"
                description="This category is reserved for future listings."
              />
            )}
          </Container>
        </Section>
      </>
    );
  }

  const person = getPersonBySlug(slug);
  if (person) {
    const related = [
      ...getPeople()
        .filter((item) => item.id !== person.id)
        .slice(0, 2)
        .map((item) => ({
          href: `/people/${item.slug}`,
          name: item.name,
          role: item.role,
          imageSrc: item.photoUrl ?? '/media/prototype/bksr-portrait-director.jpg',
        })),
      ...peopleDemoRoster
        .filter((item) => item.category === person.category)
        .slice(0, 3)
        .map((item) => ({
          href: `/people/${item.slug}`,
          name: item.name,
          role: item.role,
          imageSrc: item.imageSrc,
        })),
    ].slice(0, 3);

    const personPubs = publicationsForPerson(person.name);
    return (
      <PersonProfile
        person={{
          name: person.name,
          role: person.role,
          categoryLabel: PERSON_CATEGORY_META[person.category]?.label,
          affiliation: person.affiliation,
          photoUrl: person.photoUrl,
          bio: person.bio,
          shortBio: person.shortBio,
          skills: person.researchInterests,
          researchItems:
            personPubs.length > 0
              ? personPubs
              : researchItemsFromInterests(person.researchInterests),
        }}
        related={related}
      />
    );
  }

  const demo = getDemoPersonBySlug(slug);
  if (!demo) notFound();

  const related = peopleDemoRoster
    .filter((item) => item.slug !== demo.slug && item.category === demo.category)
    .slice(0, 3)
    .map((item) => ({
      href: `/people/${item.slug}`,
      name: item.name,
      role: item.role,
      imageSrc: item.imageSrc,
    }));

  return (
    <PersonProfile
      person={{
        name: demo.name,
        role: demo.role,
        categoryLabel: PEOPLE_DEMO_SECTION_COPY[demo.category].label,
        affiliation: demo.affiliation,
        photoUrl: demo.imageSrc,
        bio: demo.bio,
        shortBio: demo.description,
        skills: demo.researchInterests,
        researchItems: researchItemsFromInterests(demo.researchInterests),
        backHref: PEOPLE_DEMO_SECTION_COPY[demo.category].href,
        backLabel: `Back to ${PEOPLE_DEMO_SECTION_COPY[demo.category].label}`,
      }}
      related={related}
    />
  );
}
