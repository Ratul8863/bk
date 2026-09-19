'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { cn, formatDate } from '@/lib/utils';
import type { Notice, NoticeType } from '@/types/content';

const NOTICE_TYPE_LABELS: Record<NoticeType, string> = {
  vacancy: 'Vacancy',
  announcement: 'Announcement',
  deadline: 'Deadline',
  general: 'Notice',
};

type FilterKey = 'all' | NoticeType;

type NoticesIndexProps = {
  items: Notice[];
  fallbackImage: string;
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All notices' },
  { key: 'vacancy', label: 'Vacancies' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'deadline', label: 'Deadlines' },
  { key: 'general', label: 'General' },
];

const chipScroll =
  'flex w-max max-w-none gap-2 sm:w-auto sm:flex-wrap sm:justify-end sm:gap-2.5';
const chipScroller =
  '-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden';

function NoticeTypeBadge({
  type,
  onInk = false,
}: {
  type: NoticeType;
  onInk?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] sm:px-3 sm:py-1 sm:text-[0.65rem] sm:tracking-[0.14em]',
        onInk
          ? 'border-paper/30 text-paper/85'
          : 'border-ink/15 text-ink/70',
      )}
    >
      {NOTICE_TYPE_LABELS[type]}
    </span>
  );
}

function FeaturedNotice({
  item,
  imageSrc,
}: {
  item: Notice;
  imageSrc: string;
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-[1.35rem] bg-ink p-2.5 sm:rounded-[2.5rem] sm:p-4 lg:p-5">
      <div className="grid gap-3 sm:gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6">
        <Link
          href={`/notices/${item.slug}`}
          className="relative block min-w-0 overflow-hidden rounded-[1.1rem] lg:col-span-5 sm:rounded-[1.75rem]"
          aria-hidden
        >
          <ImageFrame
            src={imageSrc}
            alt=""
            aspect="video"
            sizes="(max-width: 1024px) 100vw, 42vw"
            frameClassName="border-0 bg-[#d9d9d9] rounded-[1.1rem] sm:rounded-[1.75rem]"
            className="object-cover"
          />
        </Link>

        <div className="flex min-w-0 flex-col justify-center px-1 pb-1 pt-0.5 text-paper sm:px-3 lg:col-span-7 lg:px-4 lg:py-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <NoticeTypeBadge type={item.noticeType} onInk />
            {item.publishedAt ? (
              <time className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-paper/55 sm:text-[0.6875rem] sm:tracking-[0.16em]">
                <span className="sm:hidden">
                  {formatDate(item.publishedAt, 'd MMM yyyy')}
                </span>
                <span className="hidden sm:inline">
                  {formatDate(item.publishedAt, 'd MMMM yyyy')}
                </span>
              </time>
            ) : null}
          </div>

          <h2 className="mt-2.5 text-balance font-instrument text-[1.35rem] font-medium leading-snug text-paper sm:mt-4 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            <Link
              href={`/notices/${item.slug}`}
              className="break-words transition-colors hover:text-white"
            >
              {item.title}
            </Link>
          </h2>

          {item.summary ? (
            <p className="mt-2.5 line-clamp-3 max-w-2xl font-instrument text-sm leading-relaxed text-paper/80 sm:mt-4 sm:line-clamp-none sm:text-lg">
              {item.summary}
            </p>
          ) : null}

          <div className="mt-5 sm:mt-8">
            <Button
              href={`/notices/${item.slug}`}
              variant="onInk"
              size="md"
              className="w-full font-normal tracking-normal sm:w-auto sm:h-[3.25rem] sm:px-8 sm:text-[0.9375rem]"
            >
              Read notice
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function NoticeCard({
  item,
  imageSrc,
}: {
  item: Notice;
  imageSrc: string;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col gap-3 rounded-[1.35rem] bg-ink p-3 sm:gap-5 sm:rounded-[2.125rem] sm:p-5">
      <Link
        href={`/notices/${item.slug}`}
        className="block min-w-0 shrink-0"
        aria-hidden
      >
        <ImageFrame
          src={imageSrc}
          alt=""
          aspect="video"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          frameClassName="border-0 bg-[#d9d9d9] rounded-[1.05rem] sm:rounded-[1.5625rem]"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 px-0.5 text-paper sm:gap-3.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <NoticeTypeBadge type={item.noticeType} onInk />
          {item.publishedAt ? (
            <time className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-paper/50 sm:text-[0.65rem] sm:tracking-[0.14em]">
              {formatDate(item.publishedAt, 'd MMM yyyy')}
            </time>
          ) : null}
        </div>

        <h3 className="text-balance font-instrument text-base font-medium leading-snug sm:text-2xl">
          <Link
            href={`/notices/${item.slug}`}
            className="break-words transition-colors hover:text-white"
          >
            {item.title}
          </Link>
        </h3>

        {item.summary ? (
          <p className="line-clamp-2 font-instrument text-sm leading-normal text-paper/85 sm:line-clamp-3 sm:text-base">
            {item.summary}
          </p>
        ) : null}
      </div>

      <Button
        href={`/notices/${item.slug}`}
        variant="onInk"
        size="md"
        className="mt-auto w-full font-normal tracking-normal sm:w-fit"
      >
        Learn more
      </Button>
    </article>
  );
}

export function NoticesIndex({ items, fallbackImage }: NoticesIndexProps) {
  const [filter, setFilter] = useState<FilterKey>('all');

  const availableFilters = useMemo(() => {
    const present = new Set(items.map((item) => item.noticeType));
    return FILTERS.filter(
      (entry) => entry.key === 'all' || present.has(entry.key),
    );
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.noticeType === filter);
  }, [filter, items]);

  const [featured, ...rest] = filtered;

  if (!items.length) {
    return (
      <EmptyState
        title="Nothing published yet"
        description="Vacancies and institutional notices will appear here when available."
      />
    );
  }

  return (
    <div className="min-w-0 space-y-7 sm:space-y-12">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 max-w-xl">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Bulletin board
          </p>
          <p className="mt-1.5 text-sm text-muted sm:mt-2 sm:text-base">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'notice' : 'notices'}
            {filter !== 'all'
              ? ` Â· ${FILTERS.find((f) => f.key === filter)?.label}`
              : ' in the archive'}
          </p>
        </div>

        {availableFilters.length > 2 ? (
          <div className={chipScroller}>
            <div
              className={chipScroll}
              role="tablist"
              aria-label="Filter notices by type"
            >
              {availableFilters.map((entry) => {
                const active = filter === entry.key;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(entry.key)}
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center rounded-full border px-3.5 py-2 font-sans text-xs transition-[background-color,border-color,color,box-shadow] duration-200 sm:rounded-3xl sm:px-5 sm:py-3 sm:text-sm',
                      active
                        ? 'border-ink bg-ink text-paper shadow-[0_10px_28px_-18px_rgba(13,39,69,0.55)]'
                        : 'border-ink/15 bg-white text-ink/75 hover:border-ink/35 hover:text-ink',
                    )}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {!filtered.length ? (
        <EmptyState
          title="No notices in this category"
          description="Try another filter to browse the bulletin."
        />
      ) : (
        <div className="space-y-6 sm:space-y-10">
          {featured ? (
            <FeaturedNotice
              item={featured}
              imageSrc={featured.featuredImageUrl || fallbackImage}
            />
          ) : null}

          {rest.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {rest.map((item) => (
                <li key={item.id} className="min-w-0">
                  <NoticeCard
                    item={item}
                    imageSrc={item.featuredImageUrl || fallbackImage}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  );
}
