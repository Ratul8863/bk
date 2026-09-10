import { Container } from '@/components/ui/Container';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { RichText } from '@/components/ui/RichText';
import { Section } from '@/components/ui/Section';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { cn } from '@/lib/utils';

type ArticleReadingProps = {
  body: string;
  imageUrl?: string | null;
  imageAlt?: string;
  imageAspect?: 'square' | 'video' | 'portrait' | 'wide';
  meta?: React.ReactNode;
  aside?: React.ReactNode;
  legacyUrl?: string | null;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

/**
 * Narrow reading column for notices, news, and long-form public copy.
 * Image sits above the text — never competing in a wide two-column squeeze.
 */
export function ArticleReading({
  body,
  imageUrl,
  imageAlt = '',
  imageAspect = 'video',
  meta,
  aside,
  legacyUrl,
  backHref,
  backLabel = 'Back',
  className,
}: ArticleReadingProps) {
  return (
    <Section className={cn('py-12 md:py-16', className)}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="min-w-0 lg:col-span-8">
            {imageUrl ? (
              <figure className="mb-10 max-w-xl">
                <ImageFrame
                  src={imageUrl}
                  alt={imageAlt}
                  aspect={imageAspect}
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  framed
                />
              </figure>
            ) : null}

            {meta ? <div className="mb-8">{meta}</div> : null}

            <RichText content={body} />

            {(legacyUrl || backHref) && (
              <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-8">
                {backHref ? (
                  <ArrowLink href={backHref}>{backLabel}</ArrowLink>
                ) : null}
                {legacyUrl ? (
                  <a
                    href={legacyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted transition-colors hover:text-accent"
                  >
                    Legacy archive →
                  </a>
                ) : null}
              </footer>
            )}
          </article>

          {aside ? (
            <aside className="lg:col-span-4">
              <div className="border border-border bg-white p-6 lg:sticky lg:top-28">
                {aside}
              </div>
            </aside>
          ) : (
            <aside className="hidden lg:col-span-4 lg:block" aria-hidden>
              <div className="h-px w-16 bg-border lg:mt-2" />
            </aside>
          )}
        </div>
      </Container>
    </Section>
  );
}

type VacancyAsideProps = {
  applyHref?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  deadline?: string | null;
};

export function VacancyAside({
  applyHref,
  email,
  whatsapp,
  deadline,
}: VacancyAsideProps) {
  return (
    <div className="space-y-5">
      <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
        Apply
      </p>
      {deadline ? (
        <p className="text-sm leading-relaxed text-body">
          <span className="font-semibold text-ink">Deadline</span>
          <br />
          {deadline}
        </p>
      ) : null}
      {applyHref ? (
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center bg-accent px-6 font-sans text-sm font-semibold tracking-[0.04em] text-white transition-colors hover:bg-ink"
        >
          Apply online
        </a>
      ) : null}
      {(email || whatsapp) && (
        <div className="space-y-2 border-t border-border pt-5 text-sm text-muted">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Contact
          </p>
          {email ? (
            <p>
              <a
                href={`mailto:${email}`}
                className="font-medium text-accent hover:underline"
              >
                {email}
              </a>
            </p>
          ) : null}
          {whatsapp ? <p>WhatsApp: {whatsapp}</p> : null}
        </div>
      )}
    </div>
  );
}

type EventAsideProps = {
  when: string;
  where?: string | null;
  isOnline?: boolean;
  speakers?: string[];
  status?: 'upcoming' | 'past' | 'cancelled';
  registerHref?: string | null;
  watchHref?: string | null;
};

export function EventAside({
  when,
  where,
  isOnline,
  speakers,
  status = 'past',
  registerHref,
  watchHref,
}: EventAsideProps) {
  const primaryHref = watchHref || (status === 'upcoming' ? registerHref : null);
  const primaryLabel = watchHref
    ? 'Watch recording'
    : status === 'upcoming'
      ? 'Register'
      : null;

  return (
    <div className="space-y-5">
      <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
        Event details
      </p>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            When
          </dt>
          <dd className="mt-1 font-medium text-ink">{when}</dd>
        </div>
        {where || isOnline ? (
          <div>
            <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Where
            </dt>
            <dd className="mt-1 text-body">
              {where || (isOnline ? 'Online' : null)}
            </dd>
          </div>
        ) : null}
        {speakers && speakers.length > 0 ? (
          <div>
            <dt className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Speakers
            </dt>
            <dd className="mt-1 space-y-1 text-body">
              {speakers.map((speaker) => (
                <p key={speaker}>{speaker}</p>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>

      {primaryHref && primaryLabel ? (
        <a
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center bg-accent px-6 font-sans text-sm font-semibold tracking-[0.04em] text-white transition-colors hover:bg-ink"
        >
          {primaryLabel}
        </a>
      ) : null}

      {watchHref && registerHref && status === 'past' ? (
        <a
          href={registerHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
        >
          Registration form →
        </a>
      ) : null}

      {!watchHref && registerHref && status === 'past' ? (
        <p className="text-sm text-muted">
          This session has ended. Registration is closed.
        </p>
      ) : null}
    </div>
  );
}
