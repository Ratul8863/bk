import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import {
  SocialGlyph,
  type SocialNetwork,
} from '@/components/ui/SocialGlyph';
import { ContactForm } from '@/components/public/ContactForm';
import { pageHeroMedia } from '@/lib/content/page-heroes';
import { getSiteSettings } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Contact',
  'Contact BK School of Research in Shahjadpur, Sirajganj, Bangladesh.',
  '/contact',
);

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phoneHref = `tel:${settings.phone.replace(/\s/g, '')}`;
  const socialEntries = (
    [
      { label: 'Facebook', href: settings.social.facebook, name: 'facebook' },
      { label: 'YouTube', href: settings.social.youtube, name: 'youtube' },
      { label: 'LinkedIn', href: settings.social.linkedin, name: 'linkedin' },
      { label: 'X', href: settings.social.twitter, name: 'twitter' },
      { label: 'Instagram', href: settings.social.instagram, name: 'instagram' },
    ] satisfies ReadonlyArray<{
      label: string;
      href?: string;
      name: SocialNetwork;
    }>
  ).filter(
    (entry): entry is { label: string; href: string; name: SocialNetwork } =>
      Boolean(entry.href),
  );

  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Contact"
        description="Write to the general desk, call the school, or send a message — we are based in Shahjadpur, Sirajganj."
        imageSrc={pageHeroMedia.contact}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        actions={
          <>
            <Button
              href={`mailto:${settings.emails.general}`}
              external
              variant="onInk"
              withArrow
            >
              Email general desk
            </Button>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/88 transition-colors hover:text-white"
            >
              Call {settings.phone}
            </a>
          </>
        }
      />

      <Section
        tone="white"
        spaced={false}
        className="py-10 sm:py-14 md:py-20"
      >
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href={`mailto:${settings.emails.general}`}
              className="group rounded-[1.35rem] bg-ink p-5 text-paper transition hover:bg-ink/95 sm:p-6"
            >
              <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
                Email
              </p>
              <p className="mt-3 font-display text-xl text-paper sm:text-2xl">
                General desk
              </p>
              <p className="mt-2 break-all text-sm leading-relaxed text-paper/65 transition group-hover:text-paper/85">
                {settings.emails.general}
              </p>
            </a>
            <a
              href={phoneHref}
              className="rounded-[1.35rem] border border-border bg-surface-subtle p-5 transition hover:border-ink/25 sm:p-6"
            >
              <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Phone
              </p>
              <p className="mt-3 font-display text-xl text-ink sm:text-2xl">
                Call BKSR
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {settings.phone}
              </p>
            </a>
            <div className="rounded-[1.35rem] border border-border bg-paper p-5 sm:p-6">
              <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Visit
              </p>
              <p className="mt-3 font-display text-xl text-ink sm:text-2xl">
                Campus
              </p>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {settings.address.full}
              </p>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-paper shadow-[0_18px_50px_-36px_rgba(13,39,69,0.45)]">
                <div className="border-b border-border bg-surface-subtle px-6 py-6 sm:px-8 sm:py-7">
                  <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Write to us
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
                    Send a message
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    General enquiries, programme questions, and institutional
                    correspondence. For vacancies, also check Notices.
                  </p>
                </div>
                <div className="px-6 py-7 sm:px-8 sm:py-8">
                  <ContactForm />
                </div>
              </div>
            </div>

            <aside className="space-y-5 lg:col-span-5 xl:col-span-4">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-ink p-6 text-paper sm:p-7">
                <div
                  className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-blue/35 blur-2xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-16 left-6 h-40 w-40 rounded-full bg-brand-red/20 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
                    Join BKSR
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-tight text-paper sm:text-[1.75rem]">
                    Apply to join our research organisation
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-paper/70">
                    Want a place on the committee or research community? Submit
                    a full application — no account needed until you are
                    approved.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <Button href="/join" variant="onInk" size="md" withArrow>
                      Apply to this organisation
                    </Button>
                    <Link
                      href="/join#join-application-form"
                      className="inline-flex items-center font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper/70 transition hover:text-paper"
                    >
                      Open application form →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-surface-subtle p-6 sm:p-7">
                <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  Direct desks
                </p>
                <h2 className="mt-2 font-display text-2xl text-ink">
                  Email directories
                </h2>
                <dl className="mt-6 space-y-5">
                  <div>
                    <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      General
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${settings.emails.general}`}
                        className="break-all text-sm font-medium text-accent transition hover:text-ink"
                      >
                        {settings.emails.general}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      Executive Director
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${settings.emails.executiveDirector}`}
                        className="break-all text-sm font-medium text-accent transition hover:text-ink"
                      >
                        {settings.emails.executiveDirector}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      Research Director
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${settings.emails.researchDirector}`}
                        className="break-all text-sm font-medium text-accent transition hover:text-ink"
                      >
                        {settings.emails.researchDirector}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              {socialEntries.length > 0 ? (
                <div className="rounded-[1.5rem] border border-border bg-paper p-6 sm:p-7">
                  <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Elsewhere
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-ink">
                    Follow BKSR
                  </h2>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {socialEntries.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={item.label}
                          title={item.label}
                          className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-surface-subtle text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
                        >
                          <SocialGlyph name={item.name} className="size-4" />
                          <span className="sr-only">{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
