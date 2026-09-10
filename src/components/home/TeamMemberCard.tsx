'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type TeamMemberCardProps = {
  href: string;
  name: string;
  role: string;
  imageSrc: string;
  imageAlt?: string;
  /** Flip-face bio — long-form professional paragraph (Figma 168:94). */
  description: string;
  ctaLabel?: string;
  className?: string;
};

export function TeamMemberCard({
  href,
  name,
  role,
  imageSrc,
  imageAlt,
  description,
  ctaLabel = 'View Profile',
  className,
}: TeamMemberCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={cn(
        'relative aspect-[412/593] w-full [perspective:1400px]',
        className,
      )}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none',
          flipped && '[transform:rotateY(180deg)]',
          'motion-reduce:transform-none',
        )}
      >
        {/* Front — portrait + name / role */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col rounded-[1.75rem] bg-ink p-1.5 sm:rounded-[2.625rem] sm:p-2',
            '[backface-visibility:hidden]',
            'motion-reduce:static motion-reduce:h-full',
            flipped && 'motion-reduce:hidden',
          )}
        >
          <button
            type="button"
            className="flex h-full min-h-0 w-full flex-col gap-1.5 text-left sm:gap-2"
            onClick={() => setFlipped(true)}
            aria-expanded={flipped}
            aria-label={`Show details for ${name}`}
          >
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] bg-surface sm:rounded-[2rem]">
              <Image
                src={imageSrc}
                alt={imageAlt ?? `Portrait of ${name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top"
              />
            </div>
            <div className="relative shrink-0 overflow-hidden rounded-[1.25rem] bg-white px-4 pb-4 pt-4 sm:rounded-[2rem] sm:px-6 sm:pb-6 sm:pt-6">
              <p className="font-sans text-lg leading-snug text-ink sm:text-2xl">
                {name}
              </p>
              <p className="mt-1 font-sans text-sm font-light leading-snug text-muted sm:text-base">
                {role}
              </p>
            </div>
          </button>
        </div>

        {/* Back — bio paragraph + View Profile (Figma flip) */}
        <div
          className={cn(
            'absolute inset-0 flex flex-col justify-between rounded-[1.75rem] bg-ink p-5 sm:rounded-[2.625rem] sm:p-6',
            '[backface-visibility:hidden] [transform:rotateY(180deg)]',
            'motion-reduce:static motion-reduce:mt-0 motion-reduce:h-full motion-reduce:transform-none',
            !flipped && 'motion-reduce:hidden',
          )}
        >
          <p className="line-clamp-[12] font-sans text-sm leading-relaxed text-paper sm:text-[0.9375rem] sm:leading-[1.55]">
            {description}
          </p>
          <div className="flex justify-end pt-4">
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-[0.6rem] bg-white px-3 py-1.5 font-sans text-xs font-medium text-ink transition-colors hover:bg-paper sm:text-sm"
              onClick={(event) => event.stopPropagation()}
            >
              {ctaLabel}
              <ArrowRight className="size-3 sm:size-3.5" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
