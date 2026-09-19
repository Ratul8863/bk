'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  HowWeWorkTimeline,
  type HowWeWorkStep,
} from '@/components/home/HowWeWorkTimeline';
import { cn } from '@/lib/utils';

/** Keep the sticky card near its previous short-copy height. */
const PREVIEW_CHARS = 220;

export type WhoWeArePillar = HowWeWorkStep & {
  imageSrc?: string;
  imageAlt?: string;
};

type WhoWeAreProps = {
  foundedYear: number;
  motto: string;
  tagline: string;
  identity: string;
  featureImageSrc: string;
  featureImageAlt: string;
  pillars: WhoWeArePillar[];
  className?: string;
};

function identityParagraphs(identity: string) {
  return identity
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function previewText(paragraphs: string[]) {
  if (!paragraphs.length) return '';
  const first = paragraphs[0];
  if (first.length <= PREVIEW_CHARS && paragraphs.length === 1) return first;
  const source = first.length >= 120 ? first : paragraphs.join(' ');
  if (source.length <= PREVIEW_CHARS) return source;
  const cut = source.slice(0, PREVIEW_CHARS);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function WhoWeAre({
  foundedYear,
  motto,
  tagline,
  identity,
  featureImageSrc,
  featureImageAlt,
  pillars,
  className,
}: WhoWeAreProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const paragraphs = identityParagraphs(identity);
  const preview = previewText(paragraphs);
  const needsMore = paragraphs.join(' ').length > PREVIEW_CHARS;

  const steps: HowWeWorkStep[] = pillars.map(
    ({ id, title, description, href }) => ({
      id,
      title,
      description,
      href,
    }),
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          'mt-10 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-start lg:gap-9 xl:gap-11',
          className,
        )}
      >
        {/* Who we are — sticky card */}
        <aside className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <article className="flex flex-col gap-2 rounded-[1.35rem] bg-ink p-1.5 sm:rounded-[2rem] sm:p-2 md:flex-row md:items-stretch lg:flex-col">
            <div className="relative mx-auto aspect-[16/10] w-full max-h-48 shrink-0 overflow-hidden rounded-[1.1rem] bg-surface sm:max-h-52 sm:rounded-[1.5rem] md:mx-0 md:aspect-auto md:h-auto md:max-h-none md:w-[10.5rem] md:self-stretch lg:aspect-[16/10] lg:h-auto lg:max-h-48 lg:w-full">
              <Image
                src={featureImageSrc}
                alt={featureImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 11rem, 32vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 rounded-[1.1rem] bg-white p-5 sm:gap-5 sm:rounded-[1.5rem] sm:p-6">
              <div className="space-y-2.5 sm:space-y-3">
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Who we are · Founded {foundedYear}
                </p>
                <h3 className="font-display text-[1.35rem] leading-tight tracking-[-0.02em] text-ink sm:text-[1.65rem]">
                  {motto}
                </h3>
                {tagline ? (
                  <p className="text-sm font-medium leading-snug text-accent sm:text-base">
                    {tagline}
                  </p>
                ) : null}
                <p className="text-sm leading-relaxed text-body sm:text-[0.9375rem] sm:leading-7">
                  {preview}
                  {needsMore ? (
                    <>
                      {' '}
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="inline font-sans text-sm font-medium text-ink underline decoration-ink/35 underline-offset-[0.2em] transition-colors hover:text-accent hover:decoration-accent sm:text-[0.9375rem]"
                      >
                        Read more
                      </button>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <Button href="/about" variant="ink" size="md">
                  About BKSR
                </Button>
                <Button href="/about/what-we-do" variant="secondary" size="md">
                  What we do
                </Button>
              </div>
            </div>
          </article>
        </aside>

        <div className="min-w-0 lg:col-span-7">
          <HowWeWorkTimeline steps={steps} />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-[#0b233f]/55 backdrop-blur-[2px]"
            aria-label="Close who we are"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              'relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden',
              'rounded-t-[1.75rem] bg-paper shadow-2xl sm:max-w-2xl sm:rounded-[2rem]',
              'md:max-w-3xl',
            )}
          >
            <div className="flex items-start gap-4 border-b border-border px-5 py-4 sm:px-7 sm:py-5">
              <div className="relative hidden aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-2xl bg-surface sm:block">
                <Image
                  src={featureImageSrc}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  Who we are · Founded {foundedYear}
                </p>
                <h3
                  id={titleId}
                  className="mt-1 font-display text-xl leading-tight text-ink sm:text-2xl"
                >
                  {motto}
                </h3>
                {tagline ? (
                  <p className="mt-1 text-sm font-medium text-accent">{tagline}</p>
                ) : null}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                aria-label="Close"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <div className="space-y-4 text-sm leading-7 text-body sm:text-base sm:leading-8">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-5 py-4 sm:px-7">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button href="/about" variant="ink" size="md">
                About BKSR
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
