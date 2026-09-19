'use client';

import { useRef } from 'react';
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Megaphone,
  Newspaper,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { EditorialHeading } from '@/components/ui/EditorialHeading';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import { useSiteCtaPit } from '@/components/layout/useSiteCtaPit';

const BADGES = [
  { id: 'research', label: 'Research', tone: 'navy', Icon: BookOpen },
  { id: 'educate', label: 'Educate', tone: 'blue', Icon: GraduationCap },
  { id: 'people', label: 'People', tone: 'slate', Icon: Users },
  { id: 'ideas', label: 'Ideas', tone: 'coral', Icon: Lightbulb },
  { id: 'press', label: 'Media', tone: 'ink', Icon: Newspaper },
  { id: 'campaigns', label: 'Campaigns', tone: 'royal', Icon: Megaphone },
  { id: 'research-2', label: 'Evidence', tone: 'blue', Icon: BookOpen },
  { id: 'people-2', label: 'Team', tone: 'navy', Icon: Users },
  { id: 'ideas-2', label: 'Dialogue', tone: 'coral', Icon: Lightbulb },
  { id: 'press-2', label: 'Publish', tone: 'slate', Icon: Newspaper },
] as const;

const toneClass: Record<(typeof BADGES)[number]['tone'], string> = {
  navy: 'bg-[#173B6C]',
  blue: 'bg-[#2A5A9E]',
  slate: 'bg-[#4A6278]',
  coral: 'bg-[#B83A3A]',
  ink: 'bg-[#0b233f]',
  royal: 'bg-[#1E4D8C]',
};

/**
 * Sitewide closing CTA — Matter.js ball-pit badges over navy card.
 * Same block on every public page, just above the footer.
 */
export function SiteCta() {
  const pitRef = useRef<HTMLDivElement>(null);
  useSiteCtaPit(pitRef);

  return (
    <Section
      tone="white"
      spaced={false}
      className="border-t border-border pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-14 md:pb-14"
    >
      <Container>
        <div
          ref={pitRef}
          className={cn(
            /* Mobile: hug content + short ball floor (no empty navy void). */
            'relative flex flex-col overflow-hidden rounded-[1.75rem]',
            'bg-[#0b233f] px-5 pb-24 pt-10 text-paper',
            'sm:min-h-[28rem] sm:rounded-[2rem] sm:px-10 sm:pb-24 sm:pt-16',
            'md:min-h-[30rem] md:px-14 md:pb-28 md:pt-20',
            'lg:min-h-[32rem]',
          )}
        >
          <div className="relative z-[2] mx-auto flex w-full max-w-3xl flex-col items-center gap-5 text-center pointer-events-none sm:gap-8">
            <div>
              <EditorialHeading
                as="h2"
                size="xl"
                className="text-balance text-paper"
              >
                Start a Conversation
              </EditorialHeading>
              <p className="mx-auto mt-3 max-w-xl font-instrument text-base leading-relaxed text-paper/75 sm:mt-4 sm:text-lg">
                For collaboration, enquiry, and evidence-led dialogue across
                education, policy, and society. Researchers and collaborators
                can also apply to join BKSR.
              </p>
            </div>
            <div
              className={cn(
                'flex w-full flex-col gap-3',
                'sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center',
              )}
            >
              <Button
                href="/contact"
                variant="onInk"
                size="lg"
                className="pointer-events-auto w-full sm:w-auto"
              >
                Contact BKSR
              </Button>
              <Button
                href="/join"
                variant="onInkSecondary"
                size="lg"
                className="pointer-events-auto w-full border-paper/55 !bg-[#163355] hover:!bg-[#1a3c63] sm:w-auto"
              >
                Apply to join
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-[1] overflow-hidden',
              'motion-reduce:pointer-events-none motion-reduce:inset-x-0 motion-reduce:bottom-0 motion-reduce:top-auto',
              'motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-0',
            )}
            aria-hidden
          >
            {BADGES.map((badge, index) => {
              /* Fewer balls on narrow screens → less pile-up under CTAs. */
              const mobileOnlyExtras = index >= 6;
              return (
              <div
                key={badge.id}
                data-pit-badge
                className={cn(
                  'pointer-events-auto absolute top-0 left-0 flex size-14 items-center justify-center rounded-full p-1 opacity-0',
                  'touch-none select-none will-change-transform sm:size-[4.25rem] md:size-[6.25rem] lg:size-[7.5rem]',
                  'cursor-grab active:cursor-grabbing',
                  mobileOnlyExtras && 'max-sm:hidden',
                  'motion-reduce:relative motion-reduce:opacity-100 motion-reduce:will-change-auto',
                  'motion-reduce:translate-none',
                  index % 2 === 0
                    ? 'motion-reduce:mt-4'
                    : 'motion-reduce:mt-8',
                  '[&.is-active]:opacity-100',
                  '[&.is-dragging]:z-10',
                )}
              >
                <span
                  className={cn(
                    'flex size-full items-center justify-center rounded-full border-[3px] border-[#F7F1E6]/90 text-white sm:border-4',
                    toneClass[badge.tone],
                  )}
                  title={badge.label}
                >
                  <badge.Icon
                    className="size-[42%] stroke-[1.75]"
                    aria-hidden
                  />
                  <span className="sr-only">{badge.label}</span>
                </span>
              </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
