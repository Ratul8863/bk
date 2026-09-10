import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { AtAGlance } from '@/components/home/AtAGlance';
import { CollaborationOnRecord } from '@/components/home/CollaborationOnRecord';
import { FocusAreasCarousel } from '@/components/home/FocusAreasCarousel';
import { HeroSlideshow } from '@/components/home/HeroSlideshow';
import { MessageFromExecutive } from '@/components/home/MessageFromExecutive';
import { NoticesNewsCarousel } from '@/components/home/NoticesNewsCarousel';
import { OurPrograms } from '@/components/home/OurPrograms';
import { ResearcherSay } from '@/components/home/ResearcherSay';
import { StatsMarquee } from '@/components/home/StatsMarquee';
import { TeamMemberCard } from '@/components/home/TeamMemberCard';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { Section } from '@/components/ui/Section';
import {
  getActivities,
  getEvents,
  getHomepageConfig,
  getNews,
  getNotices,
  getPeople,
  getPersonById,
  getPublicationById,
  getPublications,
  getResearchAreas,
  getResearchProjectById,
  getResearchProjects,
  getSiteSettings,
} from '@/lib/content/queries';
import {
  getPublicationCoverUrl,
  heroSlides,
  prototypeMedia,
} from '@/lib/content/prototype-media';
import { peopleDemoRoster } from '@/content/seed/people-demo';
import {
  ACTIVITY_ROUTE_META,
  PUBLICATION_TYPE_LABELS,
} from '@/lib/public/labels';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils';

export const metadata = buildPageMetadata(
  'BK School of Research',
  'Interdisciplinary research shaping evidence-based policy across education, public policy, social development, and related fields.',
  '/',
);

function publicationBlurb(publication: {
  abstract?: string | null;
  citation: string;
}) {
  const text = publication.abstract?.trim() || publication.citation;
  return text.length > 160 ? `${text.slice(0, 157).trim()}…` : text;
}

function HomeSectionIntro({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <EditorialHeading as="h2" size="xl" className="text-balance">
        {title}
      </EditorialHeading>
      {children ? (
        <p className="mt-4 text-sm leading-relaxed text-muted sm:mt-4 sm:text-lg md:text-xl">
          {children}
        </p>
      ) : null}
    </Reveal>
  );
}

export default function HomePage() {
  const settings = getSiteSettings();
  const homepage = getHomepageConfig();
  const areas = getResearchAreas();
  const activities = getActivities();
  const events = getEvents();
  const researchProjects = getResearchProjects();
  const allPublications = getPublications();
  const archiveNews = getNews();
  const notices = getNotices();

  const archiveVisuals = [
    ...archiveNews
      .map((item) => item.featuredImageUrl)
      .filter((url): url is string => Boolean(url)),
    prototypeMedia.researchField.url,
    prototypeMedia.activityWorkshop.url,
    prototypeMedia.eventSeminar.url,
    prototypeMedia.knowledgeArchive.url,
    prototypeMedia.heroSlideField.url,
    prototypeMedia.heroSlideArchive.url,
    prototypeMedia.heroSlideWebinar.url,
  ];

  const verifiedStats = [...homepage.stats]
    .filter((stat) => stat.verified)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const featuredPublications = homepage.featuredPublicationIds
    .map((id) => getPublicationById(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const libraryFeatured = featuredPublications[0] ?? allPublications[0];
  const librarySidebar = (
    libraryFeatured
      ? allPublications.filter((item) => item.id !== libraryFeatured.id)
      : allPublications
  ).slice(0, 4);

  const featuredProject =
    homepage.featuredResearchProjectIds
      .map((id) => getResearchProjectById(id))
      .find((item): item is NonNullable<typeof item> => Boolean(item)) ??
    researchProjects[0];

  const mediaCoverage = getPublications({ type: 'opinion' });
  const featuredMedia = mediaCoverage[0];
  const moreMediaCoverage = mediaCoverage.slice(1, 4);

  const people = getPeople();
  const director =
    getPersonById(homepage.directorPersonId) ??
    people.find((person) => person.category === 'executive-director');
  const directorPhoto =
    director?.photoUrl && !director.photoUrl.includes('/prototype/')
      ? director.photoUrl
      : (director?.photoUrl ?? prototypeMedia.directorPortrait.url);

  /** Flip-face copy: Figma-style narrative bio paragraph. */
  const teamFlipDescription = (person: {
    name: string;
    role: string;
    shortBio?: string | null;
    bio?: string | null;
    affiliation?: string | null;
  }) => {
    const short = person.shortBio?.trim();
    if (short) return short;

    const firstParagraph = person.bio
      ?.split(/\n\s*\n/)[0]
      ?.replace(/\s+/g, ' ')
      .trim();
    if (firstParagraph) return firstParagraph;

    if (person.affiliation) {
      return `${person.name} serves as ${person.role} at BK School of Research. ${person.affiliation}.`;
    }

    return `${person.name} serves as ${person.role} at BK School of Research.`;
  };

  /**
   * Homepage row demo members (presentation placeholders — replace with CMS people).
   * Published people beyond the director take priority when available.
   */
  const homepageDemoSlugs = [
    'carlos-ramirez',
    'daniel-wong',
    'aisha-patel',
    'sofia-chen',
  ];
  const teamDemoMembers = homepageDemoSlugs
    .map((slug) => peopleDemoRoster.find((person) => person.slug === slug))
    .filter((person): person is NonNullable<typeof person> => Boolean(person))
    .map((person) => ({
      href: `/people/${person.slug}`,
      name: person.name,
      role: person.role,
      image: person.imageSrc,
      description: person.description,
    }));

  const publishedTeamMembers = people
    .filter((person) => person.id !== director?.id)
    .map((person) => ({
      href: `/people/${person.slug}`,
      name: person.name,
      role: person.role,
      image:
        person.photoUrl && !person.photoUrl.includes('/prototype/')
          ? person.photoUrl
          : (person.photoUrl ?? prototypeMedia.directorPortrait.url),
      description: teamFlipDescription(person),
    }));

  const teamMembers = [
    ...publishedTeamMembers,
    ...teamDemoMembers.slice(publishedTeamMembers.length),
  ].slice(0, 4);

  const eventItems = (
    homepage.featuredEventIds.length
      ? homepage.featuredEventIds.map((id) =>
          events.find((item) => item.id === id),
        )
      : events
  )
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);

  const collaborationEvent = events.find(
    (item) => item.id === 'event-spss-beginners',
  );

  const serviceRoutes = ACTIVITY_ROUTE_META.filter((item) =>
    [
      'capacity-building',
      'awareness-campaigns',
      'research-talks',
      'innovation-showcasing',
    ].includes(item.routeSlug),
  );

  const glanceCards = [
    {
      href: '/research',
      label: 'Research',
      imageSrc: prototypeMedia.researchField.url,
      imageAlt: prototypeMedia.researchField.alt,
    },
    {
      href: '/publications',
      label: 'Publication',
      imageSrc: prototypeMedia.knowledgeArchive.url,
      imageAlt: prototypeMedia.knowledgeArchive.alt,
    },
    {
      href: '/events',
      label: 'Events',
      imageSrc: prototypeMedia.eventSeminar.url,
      imageAlt: prototypeMedia.eventSeminar.alt,
    },
  ];

  const noticesNewsSlides = [
    ...notices.slice(0, 5).map((item, index) => ({
      id: item.id,
      href: `/notices/${item.slug}`,
      title: item.title,
      kind: 'notice' as const,
      imageUrl: archiveVisuals[index] ?? archiveVisuals[0],
    })),
    ...archiveNews.slice(0, 5).map((item, index) => ({
      id: item.id,
      href: `/news/${item.slug}`,
      title: item.title,
      kind: 'news' as const,
      imageUrl:
        item.featuredImageUrl ??
        archiveVisuals[index + 2] ??
        archiveVisuals[0],
    })),
  ];

  const primaryCta =
    homepage.heroCtas.find((cta) => cta.variant === 'primary') ??
    homepage.heroCtas[0];
  const secondaryCta =
    homepage.heroCtas.find((cta) => cta.variant === 'secondary') ??
    homepage.heroCtas[1];

  const heroImage = homepage.heroImageUrl ?? prototypeMedia.heroSeminar.url;
  const slides = [
    { src: heroImage, alt: prototypeMedia.heroSeminar.alt },
    ...heroSlides.filter((slide) => slide.src !== heroImage),
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <HeroSlideshow slides={slides} />
        <Container className="relative flex min-h-[72svh] max-h-208 flex-col justify-end pb-10 pt-24 sm:min-h-[78vh] sm:pb-16 sm:pt-32 lg:min-h-[85vh] lg:pb-20">
          <Reveal className="max-w-4xl min-w-0">
            <h1 className="max-w-full font-display text-[clamp(1.15rem,0.55rem+4.8vw,3.5rem)] font-normal leading-[1.05] tracking-normal text-paper whitespace-nowrap">
              BK School of Research
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-paper/80 sm:mt-6 sm:text-lg md:text-xl">
              Evidence for policy. Reform for progress.
            </p>
            <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row">
              {primaryCta ? (
                <Button
                  href={primaryCta.href}
                  variant="ink"
                  size="lg"
                  className="w-full border border-paper/25 sm:w-auto"
                >
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  href={secondaryCta.href}
                  variant="onInk"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>

      <StatsMarquee items={verifiedStats} />

      {director ? (
        <Section tone="white">
          <Container>
            <HomeSectionIntro title="Message From Executive">
              Meet the researchers and contributors behind BKSR’s work.
            </HomeSectionIntro>
            <Reveal className="mt-12 sm:mt-14">
              <MessageFromExecutive
                name={director.name}
                role={director.role}
                message={homepage.directorMessageExcerpt}
                photoSrc={directorPhoto}
                profileHref={`/people/${director.slug}`}
              />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <AtAGlance items={glanceCards} />

      {/* Temporarily hidden — mission / About BKSR strip */}
      {false && (
      <Section tone="white" className="border-t border-border">
        <Container>
          <Reveal className="mx-auto max-w-4xl text-center">
            <EditorialHeading
              as="h2"
              size="xl"
              className="mx-auto max-w-[18ch] text-balance sm:max-w-none"
            >
              <span className="block">A research organisation for</span>
              <span className="block">evidence-based policy</span>
            </EditorialHeading>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted sm:mt-5 sm:text-lg md:text-xl">
              {settings.mission}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {[
              {
                src: archiveVisuals[0] ?? prototypeMedia.researchField.url,
                alt: 'BKSR research in the field',
              },
              {
                src: archiveVisuals[1] ?? prototypeMedia.activityWorkshop.url,
                alt: 'BKSR training and capacity building',
              },
              {
                src: archiveVisuals[2] ?? prototypeMedia.knowledgeArchive.url,
                alt: 'BKSR publications and knowledge archive',
              },
            ].map((visual) => (
              <ImageFrame
                key={visual.src}
                src={visual.src}
                alt={visual.alt}
                aspect="video"
                sizes="(max-width: 640px) 100vw, 33vw"
                frameClassName="border-0 !aspect-[557/397] max-w-full bg-surface"
                className="object-cover"
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:mt-12">
            <Button href="/about" variant="ink" size="lg">
              About BKSR
            </Button>
          </div>
        </Container>
      </Section>
      )}

      {libraryFeatured ? (
        <Section tone="white" className="border-t border-border">
          <Container>
            <HomeSectionIntro title="From the library">
              Selected publications and related work from the BKSR archive.
            </HomeSectionIntro>

            <div className="mt-10 grid min-w-0 gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,22rem)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,24rem)] xl:gap-10">
              <Link
                href={`/publications/${libraryFeatured.slug}`}
                className="group flex min-w-0 flex-col"
              >
                <ImageFrame
                  src={
                    getPublicationCoverUrl(libraryFeatured) ??
                    archiveVisuals[0] ??
                    prototypeMedia.publicationCoverRemittances.url
                  }
                  alt=""
                  aspect="video"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  frameClassName="border-0 max-w-full rounded-[1.5rem]"
                  className="object-cover object-top"
                />
                <p className="mt-5 font-sans text-sm text-muted">
                  {[
                    PUBLICATION_TYPE_LABELS[libraryFeatured.type],
                    libraryFeatured.year,
                    libraryFeatured.venue,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <h3 className="mt-2 text-balance font-sans text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl md:text-[1.75rem] md:leading-snug">
                  {libraryFeatured.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/75 sm:text-base">
                  {publicationBlurb(libraryFeatured)}
                </p>
                <p className="mt-3 text-sm text-ink/70">
                  <span className="font-semibold text-ink">Author:</span>{' '}
                  {libraryFeatured.authors.join(', ')}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                  Read more
                  <ArrowUpRight
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </Link>

              <aside className="flex min-w-0 flex-col overflow-hidden rounded-[1.875rem] bg-[#e5ebf3] p-5 sm:p-6">
                <div className="min-w-0">
                  <h3 className="font-sans text-xl font-semibold text-ink sm:text-2xl">
                    In case you missed it
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    More selected work from the BKSR publication archive.
                  </p>
                </div>
                <div className="mt-5 border-t border-ink/10" aria-hidden />
                <ul className="mt-1 flex min-w-0 flex-1 flex-col">
                  {librarySidebar.map((publication, index) => (
                    <li
                      key={publication.id}
                      className="min-w-0 border-b border-ink/10 py-5 last:border-0 last:pb-0"
                    >
                      <Link
                        href={`/publications/${publication.slug}`}
                        className="group grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-3.5"
                      >
                        <ImageFrame
                          src={
                            getPublicationCoverUrl(publication) ??
                            archiveVisuals[index + 1] ??
                            prototypeMedia.publicationCoverRemittances.url
                          }
                          alt=""
                          aspect="square"
                          sizes="5rem"
                          frameClassName="border-0 w-full rounded-[0.875rem]"
                          className="object-cover"
                        />
                        <div className="flex min-w-0 flex-col justify-center gap-1.5">
                          <p className="truncate font-sans text-[0.75rem] text-ink/60">
                            {[
                              PUBLICATION_TYPE_LABELS[publication.type],
                              publication.year,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          <p className="line-clamp-2 break-words font-sans text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                            {publication.title}
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 font-sans text-sm font-medium text-ink transition-colors group-hover:text-accent">
                            Read more
                            <ArrowUpRight
                              className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              strokeWidth={2}
                              aria-hidden
                            />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="mt-12 flex justify-center">
              <Button
                href="/publications"
                variant="ink"
                size="lg"
                className="rounded-[1.875rem] px-6 font-medium tracking-normal"
                withArrow
              >
                Read publications
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      <FocusAreasCarousel
        areas={areas.map((area) => ({
          id: area.id,
          slug: area.slug,
          title: area.title,
          description: area.shortDescription ?? area.description,
        }))}
      />

      {/* Temporarily hidden — featured Focus project strip */}
      {false && featuredProject ? (
        <Section tone="white" className="border-t border-border">
          <Container>
            <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
              <ImageFrame
                src={
                  featuredProject.featuredImageUrl ??
                  archiveVisuals[1] ??
                  prototypeMedia.researchField.url
                }
                alt=""
                aspect="video"
                sizes="(max-width: 1024px) 100vw, 50vw"
                frameClassName="border-0"
                className="object-cover"
              />
              <div className="flex min-h-0 flex-col justify-between gap-10 lg:min-h-full">
                <div>
                  <p className="font-sans text-base text-muted">Focus</p>
                  <EditorialHeading as="h2" size="md" className="mt-1">
                    {featuredProject.title}
                  </EditorialHeading>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                    {featuredProject.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <p className="text-base text-ink">
                    {featuredProject.researchStatus === 'completed'
                      ? 'Completed'
                      : 'Ongoing'}
                    {featuredProject.year ? ` · ${featuredProject.year}` : null}
                  </p>
                  <Button
                    href={`/research/${featuredProject.slug}`}
                    variant="ink"
                    size="md"
                  >
                    Read publications
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="white" className="border-t border-border">
        <Container>
          <HomeSectionIntro title="Meet our team">
            Meet the researchers and contributors behind BKSR’s work.
          </HomeSectionIntro>

          <div className="mt-10 flex flex-col items-center gap-6 sm:mt-14 sm:gap-10">
            {director ? (
              <Reveal className="w-full max-w-[18.5rem] sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none lg:w-[calc((100%-4.5rem)/4)]">
                <TeamMemberCard
                  href={`/people/${director.slug}`}
                  name={director.name}
                  role={director.role}
                  imageSrc={directorPhoto}
                  description={teamFlipDescription(director)}
                />
              </Reveal>
            ) : null}

            {teamMembers.length ? (
              <ul className="mx-auto grid w-full max-w-[18.5rem] gap-5 sm:max-w-none sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {teamMembers.map((item) => (
                  <li key={item.href} className="min-w-0">
                    <TeamMemberCard
                      href={item.href}
                      name={item.name}
                      role={item.role}
                      imageSrc={item.image}
                      description={item.description}
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mt-10 flex justify-center sm:mt-12">
            <Button href="/people" variant="ink" size="lg">
              View full team
            </Button>
          </div>
        </Container>
      </Section>

      <OurPrograms
        items={serviceRoutes.map((route, index) => {
          const activity = activities.find((item) => item.type === route.type);
          return {
            href: `/activities/${route.routeSlug}`,
            title: activity?.title ?? route.label,
            summary: activity?.summary ?? 'Programme details forthcoming.',
            imageSrc:
              activity?.imageUrl ??
              archiveVisuals[index] ??
              prototypeMedia.activityWorkshop.url,
          };
        })}
      />

      <Section
        tone="white"
        className="relative isolate z-10 border-t border-border"
      >
        <Container>
          <HomeSectionIntro title="Collaboration on record">
            Institutional partners appear here only when documented in the BKSR
            archive — no invented logos or affiliations.
          </HomeSectionIntro>
          <CollaborationOnRecord
            defaultActiveIndex={1}
            items={[
              {
                id: 'forthcoming-psychology',
                shortLabel: 'Department of Psychology',
                title: 'Department of Psychology',
                description:
                  'Partnership details will appear here when documented in the BKSR archive.',
                imageSrc: prototypeMedia.collabPsychology.url,
              },
              {
                id: 'economics-rabindra',
                shortLabel: 'Department of Economics',
                title:
                  'Department of Economics, Rabindra University, Bangladesh',
                description:
                  'Joint webinar host for “SPSS for the Beginners” (27 June 2020), with BK School of Research.',
                imageSrc: prototypeMedia.collabEconomics.url,
                href: collaborationEvent
                  ? `/events/${collaborationEvent.slug}`
                  : undefined,
              },
              {
                id: 'forthcoming-cs',
                shortLabel: 'Department of Computer Science',
                title: 'Department of Computer Science',
                description:
                  'Partnership details will appear here when documented in the BKSR archive.',
                imageSrc: prototypeMedia.collabComputerScience.url,
              },
              {
                id: 'forthcoming-env',
                shortLabel: 'Department of Environmental',
                title: 'Department of Environmental',
                description:
                  'Partnership details will appear here when documented in the BKSR archive.',
                imageSrc: prototypeMedia.collabEnvironmental.url,
              },
            ]}
          />
        </Container>
      </Section>

      <ResearcherSay
        title="What our researcher say"
        subtitle="Named testimonials will appear here once BKSR publishes attributed researcher statements — we do not invent quotes."
        items={[
          {
            imageSrc: prototypeMedia.researcherSayPortrait1.url,
            quote:
              '“Statement forthcoming — attributed researcher quotes will appear here when published.”',
            name: 'Attribution pending',
            role: 'Researcher',
          },
          {
            imageSrc: prototypeMedia.researcherSayPortrait2.url,
            quote:
              '“Statement forthcoming — attributed researcher quotes will appear here when published.”',
            name: 'Attribution pending',
            role: 'Researcher',
          },
          {
            imageSrc: prototypeMedia.teamDemoAisha.url,
            quote:
              '“Statement forthcoming — attributed researcher quotes will appear here when published.”',
            name: 'Attribution pending',
            role: 'Researcher',
          },
          {
            imageSrc: prototypeMedia.teamDemoDaniel.url,
            quote:
              '“Statement forthcoming — attributed researcher quotes will appear here when published.”',
            name: 'Attribution pending',
            role: 'Researcher',
          },
          {
            imageSrc: prototypeMedia.teamDemoSofia.url,
            quote:
              '“Statement forthcoming — attributed researcher quotes will appear here when published.”',
            name: 'Attribution pending',
            role: 'Researcher',
          },
        ]}
      />

      {/* Temporarily hidden — Talks & webinars */}
      {false && (
      <Section tone="white" className="border-t border-border">
        <Container>
          <HomeSectionIntro title="Talks & webinars">
            Documented webinars and public conversations from the BKSR archive.
          </HomeSectionIntro>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {eventItems.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`/events/${item.slug}`}
                  className="group flex h-full flex-col border border-ink p-4 transition-colors hover:border-accent"
                >
                  <h3 className="min-h-16 font-sans text-lg leading-snug text-ink transition-colors group-hover:text-accent sm:text-xl">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex-1">
                    <ImageFrame
                      src={
                        item.featuredImageUrl?.startsWith('http') ||
                        item.featuredImageUrl?.startsWith('/')
                          ? item.featuredImageUrl
                          : (archiveVisuals[index] ??
                            prototypeMedia.activityWorkshop.url)
                      }
                      alt=""
                      aspect="video"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      frameClassName="border-0"
                      className="object-cover"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Button href="/events" variant="ink" size="lg">
              View all talks
            </Button>
          </div>
        </Container>
      </Section>
      )}

      <Section tone="white" className="border-t border-border">
        <Container>
          <HomeSectionIntro title="Notices & news">
            Institutional notices and selected updates from the BKSR archive.
          </HomeSectionIntro>
          <div className="mt-12">
            <NoticesNewsCarousel
              slides={noticesNewsSlides}
              fallbackImage={prototypeMedia.heroSeminar.url}
            />
          </div>
        </Container>
      </Section>

      <Section tone="white" className="border-t border-border">
        <Container>
          <HomeSectionIntro title="BKSR in media">
            Press and newspaper commentary from the BKSR archive. Additional
            clippings will be added when rights-cleared assets are available.
          </HomeSectionIntro>

          <div className="mt-10 grid min-w-0 gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,1fr)] lg:items-start lg:gap-10 xl:gap-14">
            {featuredMedia ? (
              <Link
                href={`/publications/${featuredMedia.slug}`}
                className="group flex min-w-0 flex-col"
              >
                <ImageFrame
                  src={archiveVisuals[0] ?? prototypeMedia.researchField.url}
                  alt=""
                  aspect="video"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  frameClassName="border-0 rounded-[1.5rem]"
                  className="object-cover"
                />
                <p className="mt-5 font-sans text-sm text-muted">
                  {[
                    featuredMedia.venue,
                    featuredMedia.publishedAt
                      ? formatDate(featuredMedia.publishedAt, 'd MMM yyyy')
                      : featuredMedia.year,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <h3 className="mt-2 font-sans text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl md:text-[1.75rem] md:leading-snug">
                  {featuredMedia.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/75 sm:text-base">
                  {publicationBlurb(featuredMedia)}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                  Read more
                  <ArrowUpRight
                    className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </Link>
            ) : (
              <ImageFrame
                src={prototypeMedia.researchField.url}
                alt=""
                aspect="video"
                sizes="55vw"
                frameClassName="border-0 rounded-[1.5rem]"
              />
            )}

            <aside className="flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-[#e5ebf3] p-4 sm:rounded-[1.875rem] sm:p-6 lg:p-7">
              <div className="min-w-0">
                <h3 className="font-sans text-xl font-semibold text-ink sm:text-2xl">
                  Latest coverage
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  Recent press mentions and commentary from the archive.
                </p>
              </div>
              <div className="mt-5 border-t border-ink/10" aria-hidden />
              <ul className="mt-1 flex min-w-0 flex-1 flex-col">
                {moreMediaCoverage.map((item, index) => (
                  <li
                    key={item.id}
                    className="min-w-0 border-b border-ink/10 py-5 last:border-0 last:pb-0"
                  >
                    <Link
                      href={`/publications/${item.slug}`}
                      className="group grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] gap-3 sm:grid-cols-[5.25rem_minmax(0,1fr)] sm:gap-4"
                    >
                      <ImageFrame
                        src={
                          archiveVisuals[index + 1] ??
                          archiveVisuals[0] ??
                          prototypeMedia.researchField.url
                        }
                        alt=""
                        aspect="square"
                        sizes="5.25rem"
                        frameClassName="border-0 rounded-[0.875rem]"
                        className="object-cover"
                      />
                      <div className="flex min-w-0 flex-col justify-center gap-1.5">
                        <p className="line-clamp-1 font-sans text-[0.75rem] text-ink/60">
                          {[item.venue, item.year].filter(Boolean).join(' · ')}
                        </p>
                        <p className="line-clamp-2 font-sans text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent sm:text-[0.9375rem]">
                          {item.title}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 font-sans text-sm font-medium text-ink transition-colors group-hover:text-accent">
                          Read more
                          <ArrowUpRight
                            className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              href="/publications/opinions"
              variant="ink"
              size="lg"
              className="rounded-[1.875rem] px-6 font-medium tracking-normal"
              withArrow
            >
              View all coverage
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="white" className="border-t border-border pb-16 md:pb-24">
        <Container>
          <div className="overflow-hidden bg-ink px-5 py-12 text-center text-paper sm:px-10 sm:py-20 md:py-24">
            <EditorialHeading
              as="h2"
              size="xl"
              className="text-paper text-balance"
            >
              Start a conversation
            </EditorialHeading>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
              For collaboration, enquiry, and evidence-led dialogue across
              education, policy, and society.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact" variant="onInk" size="lg" className="w-full max-w-xs sm:w-auto">
                Contact BKSR
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
