'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { cn } from '@/lib/utils';

export type NoticesNewsSlide = {
  id: string;
  href: string;
  title: string;
  imageUrl?: string | null;
  kind: 'notice' | 'news';
};

type FilterTab = 'notice' | 'news';

type NoticesNewsCarouselProps = {
  slides: NoticesNewsSlide[];
  fallbackImage?: string;
};

export function NoticesNewsCarousel({
  slides,
  fallbackImage,
}: NoticesNewsCarouselProps) {
  const [tab, setTab] = useState<FilterTab>('notice');
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    const next = slides.filter((slide) => slide.kind === tab);
    return next.length ? next : slides;
  }, [slides, tab]);

  if (!slides.length) return null;

  const count = filtered.length;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));
  const active = filtered[safeIndex]!;
  const prev = filtered[(safeIndex - 1 + count) % count]!;
  const next = filtered[(safeIndex + 1) % count]!;

  const go = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + count) % count);
  };

  const switchTab = (nextTab: FilterTab) => {
    setTab(nextTab);
    setIndex(0);
  };

  const imageFor = (slide: NoticesNewsSlide) =>
    slide.imageUrl ||
    fallbackImage ||
    '/media/prototype/bksr-hero-seminar.jpg';

  return (
    <div className="relative min-w-0">
      <div className="relative overflow-x-clip py-2 lg:left-1/2 lg:w-screen lg:max-w-[100vw] lg:-translate-x-1/2 lg:overflow-hidden">
        <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-10 xl:gap-14">
          {count > 1 ? (
            <div className="hidden shrink-0 lg:block">
              <NoticeCard
                title={prev.title}
                imageSrc={imageFor(prev)}
                sizes="46rem"
                variant="peek"
                onClick={() => go(-1)}
                ariaLabel={`Show: ${prev.title}`}
              />
            </div>
          ) : null}

          <div className="relative z-10 flex min-w-0 max-w-full items-center gap-2 px-1 sm:gap-4 sm:px-4">
            {count > 1 ? (
              <NavButton label="Previous slide" onClick={() => go(-1)} mirrored />
            ) : null}

            <NoticeCard
              title={active.title}
              imageSrc={imageFor(active)}
              href={active.href}
              sizes="(max-width: 1024px) 90vw, 53rem"
              variant="featured"
            />

            {count > 1 ? (
              <NavButton label="Next slide" onClick={() => go(1)} />
            ) : null}
          </div>

          {count > 1 ? (
            <div className="hidden shrink-0 lg:block">
              <NoticeCard
                title={next.title}
                imageSrc={imageFor(next)}
                sizes="46rem"
                variant="peek"
                onClick={() => go(1)}
                ariaLabel={`Show: ${next.title}`}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3 sm:mt-12">
        <Button
          type="button"
          variant={tab === 'notice' ? 'ink' : 'secondary'}
          size="lg"
          onClick={() => switchTab('notice')}
          aria-pressed={tab === 'notice'}
        >
          Notices
        </Button>
        <Button
          type="button"
          variant={tab === 'news' ? 'ink' : 'secondary'}
          size="lg"
          onClick={() => switchTab('news')}
          aria-pressed={tab === 'news'}
        >
          Blogs
        </Button>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href={tab === 'notice' ? '/notices' : '/publications/blogs'}
          className="font-sans text-sm font-semibold tracking-[0.04em] text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {tab === 'notice' ? 'View all notices' : 'View all blogs'}
        </Link>
      </div>
    </div>
  );
}

type NoticeCardProps = {
  title: string;
  imageSrc: string;
  sizes: string;
  variant: 'featured' | 'peek';
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

function NoticeCard({
  title,
  imageSrc,
  sizes,
  variant,
  href,
  onClick,
  ariaLabel,
}: NoticeCardProps) {
  const featured = variant === 'featured';

  const className = cn(
    'group flex min-w-0 flex-col gap-3 rounded-[1.25rem] bg-white p-1.5 text-left transition-[box-shadow,opacity,transform] duration-300 sm:gap-3.5 sm:rounded-[1.5rem] sm:p-2',
    featured
      ? 'w-[min(100%,calc(100vw-6rem))] shadow-[0_22px_48px_-30px_rgba(13,39,69,0.55)] ring-1 ring-ink/12 sm:w-[min(100vw-9rem,42rem)] lg:w-[min(48vw,53rem)]'
      : 'w-[min(36vw,42rem)] opacity-55 ring-1 ring-ink/10 hover:opacity-80 hover:ring-ink/20',
  );

  const body = (
    <>
      <div className="overflow-hidden rounded-[1.15rem]">
        <ImageFrame
          src={imageSrc}
          alt=""
          aspect="video"
          sizes={sizes}
          frameClassName="border-0"
          className={cn(
            'object-cover transition-transform duration-500 ease-out',
            featured && 'group-hover:scale-[1.02]',
          )}
        />
      </div>
      <p
        className={cn(
          'line-clamp-2 px-3 pb-3 text-center font-sans font-semibold leading-snug text-ink sm:px-4 sm:pb-3.5',
          featured
            ? 'min-h-14 text-base sm:min-h-18 sm:text-2xl lg:min-h-20 lg:text-[2rem] lg:leading-tight'
            : 'min-h-14 text-base sm:min-h-16 sm:text-xl lg:text-[1.65rem] lg:leading-tight',
          featured && 'transition-colors group-hover:text-accent',
        )}
      >
        {title}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {body}
    </button>
  );
}

function NavButton({
  label,
  onClick,
  mirrored,
}: {
  label: string;
  onClick: () => void;
  mirrored?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex shrink-0 self-center rounded-[1.25rem] bg-ink p-2.5 text-paper transition-colors hover:bg-accent sm:p-3"
    >
      {mirrored ? (
        <ArrowLeft className="size-5 sm:size-6" strokeWidth={1.75} aria-hidden />
      ) : (
        <ArrowRight className="size-5 sm:size-6" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
