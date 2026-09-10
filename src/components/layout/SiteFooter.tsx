import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import type { NavigationItem, SiteSettings } from '@/types/content';
import { cn } from '@/lib/utils';

type SiteFooterProps = {
  settings: SiteSettings;
  footerNav: NavigationItem[];
  knowledgeHub: NavigationItem[];
  className?: string;
};

const policyLinks: NavigationItem[] = [
  { id: 'policy-privacy', label: 'Privacy Policy', href: '/about/policies', order: 1 },
  { id: 'policy-terms', label: 'Terms of Use', href: '/about/policies', order: 2 },
  { id: 'policy-governance', label: 'Governance', href: '/about/governance', order: 3 },
];

function SocialGlyph({ name }: { name: 'facebook' | 'youtube' | 'linkedin' }) {
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
      </svg>
    );
  }
  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
        <path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.5 5.2 12 5.2 12 5.2s-6.5 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 2.3.5 8.8.5 8.8.5s6.5 0 8.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l6.3 3.3-6.3 3.3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M6.9 8.7H3.6V20h3.3V8.7zM5.2 4C4 4 3 5 3 6.2S4 8.4 5.2 8.4 7.5 7.4 7.5 6.2 6.5 4 5.2 4zM20.4 20h-3.3v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H9.9V8.7h3.2v1.5h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.2V20z" />
    </svg>
  );
}

export function SiteFooter({
  settings,
  footerNav,
  knowledgeHub,
  className,
}: SiteFooterProps) {
  const hubChildren = (knowledgeHub[0]?.children ?? []).filter(
    (item) => item.visible !== false,
  );
  const visibleFooterNav = footerNav.filter((item) => item.visible !== false);
  const social = [
    { label: 'Facebook', href: settings.social.facebook, name: 'facebook' as const },
    { label: 'YouTube', href: settings.social.youtube, name: 'youtube' as const },
    { label: 'LinkedIn', href: settings.social.linkedin, name: 'linkedin' as const },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className={cn('border-t border-border bg-ink text-paper', className)}>
      <Container className="py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <p className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/bksr-logo-light.png"
                alt=""
                width={280}
                height={90}
                className="h-10 w-auto max-w-full object-contain object-left sm:h-12 sm:max-w-[16rem]"
              />
              <span className="sr-only">{settings.organizationShortName}</span>
            </p>
            <p className="mt-3 font-sans text-sm text-paper/70">
              {settings.organizationName}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">
              {settings.positioningStatement}
            </p>
            <address className="mt-8 space-y-2 font-sans text-sm not-italic text-paper/70">
              <p>{settings.address.full}</p>
              <p>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-paper"
                >
                  {settings.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${settings.emails.general}`}
                  className="transition-colors hover:text-paper"
                >
                  {settings.emails.general}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${settings.emails.executiveDirector}`}
                  className="transition-colors hover:text-paper"
                >
                  {settings.emails.executiveDirector}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${settings.emails.researchDirector}`}
                  className="transition-colors hover:text-paper"
                >
                  {settings.emails.researchDirector}
                </a>
              </p>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            <FooterColumn title="Important links" items={visibleFooterNav} />
            <FooterColumn
              title="Knowledge hub"
              items={hubChildren.slice(0, 6)}
              moreHref="/resources"
              moreLabel="All resources"
            />
            <div>
              <FooterColumn title="Policies" items={policyLinks} />
              <div className="mt-8">
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
                  Gallery
                </p>
                <Link
                  href="/gallery"
                  className="mt-3 inline-block font-sans text-sm text-paper/75 transition-colors hover:text-paper"
                >
                  Coming soon
                </Link>
              </div>
              {social.length ? (
                <div className="mt-8">
                  <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
                    Follow
                  </p>
                  <ul className="mt-3 flex gap-3">
                    {social.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex size-9 items-center justify-center rounded-sm border border-paper/20 text-paper/80 transition-colors hover:border-paper/50 hover:text-paper"
                          aria-label={item.label}
                        >
                          <SocialGlyph name={item.name} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-paper/55">{settings.copyright}</p>
          <p className="font-sans text-sm text-paper/45">
            Founded {settings.foundedYear}
            {settings.motto ? ` · ${settings.motto}` : null}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  moreHref,
  moreLabel,
}: {
  title: string;
  items: NavigationItem[];
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div>
      <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="font-sans text-sm text-paper/75 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {moreHref && moreLabel ? (
          <li>
            <Link
              href={moreHref}
              className="font-sans text-sm font-semibold text-paper transition-colors hover:text-paper/80"
            >
              {moreLabel}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
