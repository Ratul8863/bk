import { PeopleDirectory } from '@/components/home/PeopleDirectory';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Section } from '@/components/ui/Section';
import {
  PEOPLE_DEMO_SECTION_COPY,
  PEOPLE_DEMO_SECTION_ORDER,
  peopleDemoRoster,
} from '@/content/seed/people-demo';
import { prototypeMedia } from '@/lib/content/prototype-media';
import { getPeople } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'People',
  'Leadership and associates of BK School of Research.',
  '/people',
);

const SECTION_IDS: Record<string, string> = {
  'executive-director': 'executive-director',
  'distinguished-fellow': 'distinguished-fellows',
  'research-team': 'research-team',
  'administrative-team': 'administrative-team',
  alumni: 'alumni',
};

export default async function PeoplePage() {
  const people = await getPeople();
  const director =
    people.find((person) => person.category === 'executive-director') ??
    people[0];
  const directorPhoto =
    director?.photoUrl && !director.photoUrl.includes('/prototype/')
      ? director.photoUrl
      : (director?.photoUrl ?? prototypeMedia.directorPortrait.url);

  const directorDescription =
    director?.shortBio?.trim() ||
    director?.bio?.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ||
    `${director?.name ?? 'Leadership'} serves BK School of Research.`;

  const publishedOthers = people
    .filter((person) => person.id !== director?.id)
    .map((person) => ({
      id: person.id,
      href: `/people/${person.slug}`,
      name: person.name,
      role: person.role,
      category: person.category,
      imageSrc:
        person.photoUrl && !person.photoUrl.includes('/prototype/')
          ? person.photoUrl
          : (person.photoUrl ?? prototypeMedia.directorPortrait.url),
      description:
        person.shortBio?.trim() ||
        person.bio?.split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ||
        `${person.name} serves as ${person.role} at BK School of Research.`,
    }));

  const demoMembers = peopleDemoRoster
    .filter(
      (demo) =>
        !publishedOthers.some(
          (person) => person.name.toLowerCase() === demo.name.toLowerCase(),
        ),
    )
    .map((demo) => ({
      id: demo.id,
      href: `/people/${demo.slug}`,
      name: demo.name,
      role: demo.role,
      category: demo.category,
      imageSrc: demo.imageSrc,
      description: demo.description,
    }));

  const roster = [...publishedOthers, ...demoMembers];

  const jumpLinks = [
    ...(director
      ? [
          {
            href: `#${SECTION_IDS['executive-director']}`,
            label: 'Executive Director',
          },
        ]
      : []),
    ...PEOPLE_DEMO_SECTION_ORDER.filter((category) =>
      roster.some((member) => member.category === category),
    ).map((category) => ({
      href: `#${SECTION_IDS[category]}`,
      label: PEOPLE_DEMO_SECTION_COPY[category].label,
    })),
  ];

  return (
    <>
      <PeopleDirectory
        director={
          director
            ? {
                href: `/people/${director.slug}`,
                name: director.name,
                role: director.role,
                imageSrc: directorPhoto,
                description: directorDescription,
              }
            : null
        }
        roster={roster}
        jumpLinks={jumpLinks}
        sectionIds={SECTION_IDS}
      />

      <Section tone="white" spaced={false} className="pb-16 md:pb-24">
        <Container>
          <div className="border border-ink bg-ink px-6 py-10 text-center text-paper sm:px-10 sm:py-12">
            <EditorialHeading
              as="h2"
              className="text-3xl text-paper sm:text-4xl"
            >
              Apply to join the committee
            </EditorialHeading>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-paper/75 sm:text-base">
              Want to join BK School of Research as a researcher or
              organisational collaborator? Submit a full application — no
              account needed until you are approved.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/join" variant="onInk" size="lg">
                Apply to this organisation
              </Button>
              <Button href="/join#join-application-form" variant="onInkSecondary" size="lg">
                Apply as a researcher
              </Button>
            </div>
            <ArrowLink
              href="/people/career"
              className="mt-6 justify-center text-paper/80 hover:text-paper"
            >
              Career at BKSR
            </ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
