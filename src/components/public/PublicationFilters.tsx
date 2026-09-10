'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPublicationCoverUrl } from '@/lib/content/prototype-media';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import type { Publication, PublicationType, ResearchArea } from '@/types/content';
import { cn } from '@/lib/utils';

type Props = {
  publications: Publication[];
  areas: ResearchArea[];
  initialType?: PublicationType | 'all';
  /** When true, type cannot change (used on /publications/journals etc.) */
  lockType?: boolean;
};

export function PublicationFilters({
  publications,
  areas,
  initialType = 'all',
  lockType = false,
}: Props) {
  const [type, setType] = useState(initialType);
  const [area, setArea] = useState('all');
  const [year, setYear] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const scoped = useMemo(
    () =>
      lockType && initialType !== 'all'
        ? publications.filter((item) => item.type === initialType)
        : publications,
    [publications, lockType, initialType],
  );

  const years = useMemo(
    () =>
      Array.from(new Set(scoped.map((item) => item.year))).sort((a, b) => b - a),
    [scoped],
  );

  const areaOptions = useMemo(() => {
    const used = new Set(scoped.flatMap((item) => item.areaIds ?? []));
    return areas.filter((item) => used.has(item.id));
  }, [areas, scoped]);

  const filtered = scoped
    .filter((item) => {
      if (!lockType && type !== 'all' && item.type !== type) return false;
      if (area !== 'all' && !(item.areaIds ?? []).includes(area)) return false;
      if (year !== 'all' && String(item.year) !== year) return false;
      if (query.trim()) {
        const hay = [item.title, item.citation, ...item.authors]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(query.trim().toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) =>
      sort === 'newest' ? b.year - a.year : a.year - b.year,
    );

  const countLabel =
    lockType && initialType !== 'all'
      ? `${filtered.length} ${PUBLICATION_TYPE_LABELS[initialType].toLowerCase()}${filtered.length === 1 ? '' : 's'}`
      : `${filtered.length} publication${filtered.length === 1 ? '' : 's'}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-16">
      <aside
        data-lenis-prevent
        className="space-y-8 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1 [scrollbar-gutter:stable]"
      >
        <label className="block">
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Keyword
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, author, citation"
            className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus-visible:border-accent"
          />
        </label>

        {!lockType ? (
          <FilterBar
            label="Type"
            layout="stack"
            value={type}
            onChange={(value) => setType(value as PublicationType | 'all')}
            options={[
              { label: 'All types', value: 'all' },
              ...Object.entries(PUBLICATION_TYPE_LABELS).map(
                ([value, label]) => ({
                  label,
                  value,
                }),
              ),
            ]}
          />
        ) : null}

        <FilterBar
          label="Area"
          layout="stack"
          value={area}
          onChange={setArea}
          options={[
            { label: 'All areas', value: 'all' },
            ...areaOptions.map((item) => ({
              label: item.title,
              value: item.id,
            })),
          ]}
        />

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-8">
          <label className="block">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Year
            </span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="mt-3 w-full appearance-none border-0 border-b border-border bg-transparent py-2.5 font-sans text-sm font-medium text-ink outline-none focus-visible:border-accent"
            >
              <option value="all">All years</option>
              {years.map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="block lg:hidden">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as 'newest' | 'oldest')
              }
              className="mt-3 w-full appearance-none border-0 border-b border-border bg-transparent py-2.5 font-sans text-sm font-medium text-ink outline-none focus-visible:border-accent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {countLabel}
          </p>
          <label className="hidden items-center gap-3 lg:inline-flex">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as 'newest' | 'oldest')
              }
              className="appearance-none border-0 bg-transparent py-0 font-sans text-sm font-semibold text-accent outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        {filtered.length ? (
          <ul className="divide-y divide-border">
            {filtered.map((item) => {
              const cover = getPublicationCoverUrl(item);
              return (
                <li key={item.id}>
                  <Link
                    href={`/publications/${item.slug}`}
                    className="group grid gap-5 py-7 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-7 sm:py-8"
                  >
                    <span
                      className={cn(
                        'relative hidden aspect-3/4 overflow-hidden border border-border bg-surface sm:block',
                      )}
                      aria-hidden
                    >
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                        />
                      ) : (
                        <span className="flex h-full flex-col justify-between p-2.5">
                          <span className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">
                            {item.year}
                          </span>
                          <span className="font-display text-lg leading-none text-ink/30">
                            {String(item.year).slice(2)}
                          </span>
                        </span>
                      )}
                    </span>

                    <span className="min-w-0">
                      <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                        {lockType
                          ? item.venue || PUBLICATION_TYPE_LABELS[item.type]
                          : PUBLICATION_TYPE_LABELS[item.type]}
                        <span className="mx-2 text-border" aria-hidden>
                          ·
                        </span>
                        {item.year}
                      </span>
                      <span className="mt-2.5 block font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-[1.35rem] md:text-2xl">
                        {item.title}
                      </span>
                      <span className="mt-2.5 block text-sm leading-relaxed text-muted">
                        {item.authors.join(', ')}
                      </span>
                      {item.venue && !lockType ? (
                        <span className="mt-1.5 block font-serif text-sm italic leading-snug text-body/80">
                          {item.venue}
                        </span>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:opacity-100">
                        View publication
                        <span aria-hidden>→</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title="No matching publications"
            description="Try a different year, area, or keyword."
          />
        )}
      </div>
    </div>
  );
}
