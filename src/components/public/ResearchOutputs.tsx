'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicationExternalUrl } from '@/lib/content/research-links';
import type { Publication, ResearchArea } from '@/types/content';
import { cn } from '@/lib/utils';

type OutputTab = 'journal' | 'book-chapter' | 'conference';

type Props = {
  publications: Publication[];
  areas: ResearchArea[];
};

const TABS: { key: OutputTab; label: string; short: string }[] = [
  { key: 'journal', label: 'Journal articles', short: 'Journals' },
  { key: 'book-chapter', label: 'Book chapters', short: 'Chapters' },
  { key: 'conference', label: 'Conference papers', short: 'Conference' },
];

const TYPE_META: Record<OutputTab, string> = {
  journal: 'Journal',
  'book-chapter': 'Book chapter',
  conference: 'Conference',
};

const PAGE_SIZE = 12;

function formatAuthors(authors: string[], max = 3) {
  if (!authors.length) return null;
  if (authors.length <= max) return authors.join(', ');
  return `${authors.slice(0, max).join(', ')}, and others`;
}

function SoftSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <span className="relative mt-2.5 block">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-full border border-ink/10 bg-white py-2.5 pl-4 pr-9 font-sans text-sm font-medium text-ink outline-none transition-colors focus-visible:border-ink/35"
        >
          {children}
        </select>
        <span
          className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-muted"
          aria-hidden
        >
          ▾
        </span>
      </span>
    </label>
  );
}

function OutputRow({ item }: { item: Publication }) {
  const href = `/publications/${item.slug}`;
  const external = publicationExternalUrl(item);
  const venue = item.venue || item.publisher || null;
  const authors = formatAuthors(item.authors);

  return (
    <li className="border-b border-border/80 last:border-b-0">
      <div className="py-4 sm:py-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-accent sm:text-[0.8125rem] sm:tracking-[0.14em]">
            {TYPE_META[item.type as OutputTab] ?? item.type}
          </span>
          <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted sm:text-[0.8125rem]">
            {item.year}
          </span>
        </div>

        <h3 className="mt-1.5">
          <Link
            href={href}
            className="font-display text-[1.25rem] leading-[1.35] text-ink transition-colors hover:text-accent sm:text-[1.35rem] md:text-xl"
          >
            {item.title}
          </Link>
        </h3>

        {authors ? (
          <p className="mt-1.5 line-clamp-2 font-instrument text-[0.8125rem] leading-snug text-muted sm:text-sm">
            {authors}
          </p>
        ) : null}

        {venue ? (
          <p className="mt-1 line-clamp-1 text-[0.8125rem] leading-snug text-body/80 sm:text-sm">
            {venue}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent"
          >
            View record
            <span aria-hidden>→</span>
          </Link>
          {external ? (
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ink/55 transition-colors hover:text-ink"
            >
              {item.doi ? 'Open DOI' : 'Open source'}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function ResearchOutputs({ publications, areas }: Props) {
  const baseId = useId();
  const [tab, setTab] = useState<OutputTab>('journal');
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [year, setYear] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState({
    query: '',
    status: 'completed',
    area: 'all',
    year: 'all',
    tab: 'journal' as OutputTab,
  });
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const pool = useMemo(
    () =>
      publications.filter((item) =>
        ['journal', 'book-chapter', 'conference'].includes(item.type),
      ),
    [publications],
  );

  const years = useMemo(() => {
    const set = new Set(
      pool.filter((item) => item.type === tab).map((item) => item.year),
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [pool, tab]);

  const areaOptions = useMemo(() => {
    const used = new Set(
      pool.flatMap((item) => item.areaIds ?? []),
    );
    return areas.filter((item) => used.has(item.id));
  }, [areas, pool]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pool
      .filter((item) => {
        if (item.type !== tab) return false;
        if (area !== 'all' && !(item.areaIds ?? []).includes(area)) return false;
        if (year !== 'all' && item.year !== Number(year)) return false;
        if (!needle) return true;
        const blob = [
          item.title,
          item.authors.join(' '),
          item.venue,
          item.publisher,
          item.citation,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return blob.includes(needle);
      })
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }, [pool, tab, area, year, query]);

  const yearGroups = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const item of filtered) {
      const list = map.get(item.year) ?? [];
      list.push(item);
      map.set(item.year, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  // Flatten for load-more, then rebuild visible year groups
  const visibleItems = filtered.slice(0, visible);
  const visibleYearGroups = useMemo(() => {
    const map = new Map<number, Publication[]>();
    for (const item of visibleItems) {
      const list = map.get(item.year) ?? [];
      list.push(item);
      map.set(item.year, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [visibleItems]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
    if (yearGroups[0]) {
      setOpenYears(new Set([yearGroups[0][0]]));
    }
  }, [tab, area, year, query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const hasFilters = query.trim() !== '' || area !== 'all' || year !== 'all';
  const counts = TABS.map((entry) => ({
    ...entry,
    count: pool.filter((item) => item.type === entry.key).length,
  }));

  const openSheet = () => {
    setDraft({ query, status: 'completed', area, year, tab });
    setSheetOpen(true);
  };

  const applySheet = () => {
    setQuery(draft.query);
    setArea(draft.area);
    setYear(draft.year);
    setTab(draft.tab);
    setSheetOpen(false);
    if (draft.status === 'ongoing') {
      document.getElementById('ongoing-research')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const clearAll = () => {
    setQuery('');
    setArea('all');
    setYear('all');
    setDraft({
      query: '',
      status: 'completed',
      area: 'all',
      year: 'all',
      tab,
    });
  };

  const toggleYear = (y: number) => {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  };

  const chipScroll =
    'flex w-max max-w-none gap-2 sm:w-auto sm:flex-wrap';
  const chipScroller =
    '-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden';

  return (
    <div className="grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-14 xl:gap-16">
      {/* Desktop sidebar */}
      <aside
        data-lenis-prevent
        className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
      >
        <div className="space-y-7 rounded-3xl border border-ink/8 bg-white/70 p-5 xl:p-6">
          <div>
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
              Search
            </p>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, author, venue…"
                className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-10 pr-4 font-sans text-sm outline-none focus-visible:border-ink/35"
              />
            </div>
          </div>

          <SoftSelect
            id={`${baseId}-area`}
            label="Research area"
            value={area}
            onChange={setArea}
          >
            <option value="all">All areas</option>
            {areaOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </SoftSelect>

          <SoftSelect
            id={`${baseId}-year`}
            label="Year"
            value={year}
            onChange={setYear}
          >
            <option value="all">All years</option>
            {years.map((value) => (
              <option key={value} value={String(value)}>
                {value}
              </option>
            ))}
          </SoftSelect>

          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-ink"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Mobile toolbar */}
        <div className="mb-5 space-y-3.5 lg:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search outputs…"
              className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-10 pr-4 font-sans text-sm outline-none focus-visible:border-ink/35"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'result' : 'results'}
            </p>
            <button
              type="button"
              onClick={openSheet}
              className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-3.5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink"
            >
              <SlidersHorizontal className="size-3.5" aria-hidden />
              Refine
            </button>
          </div>
        </div>

        {/* Segmented tabs */}
        <div className={chipScroller}>
          <div
            className={cn(chipScroll, 'lg:flex-wrap')}
            role="tablist"
            aria-label="Output type"
          >
            {counts.map((entry) => {
              const active = tab === entry.key;
              return (
                <button
                  key={entry.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(entry.key)}
                  className={cn(
                    'rounded-full px-3.5 py-2 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-[0.7rem]',
                    active
                      ? 'bg-ink text-paper'
                      : 'bg-ink/5 text-ink/70 hover:bg-ink/10 hover:text-ink',
                  )}
                >
                  <span className="sm:hidden">{entry.short}</span>
                  <span className="hidden sm:inline">{entry.label}</span>
                  <span
                    className={cn(
                      'ml-1.5',
                      active ? 'text-paper/60' : 'text-muted',
                    )}
                  >
                    {entry.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between border-b border-border pb-4 lg:flex">
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'result' : 'results'}
            {hasFilters ? ' · filtered' : ''}
          </p>
        </div>

        {!filtered.length ? (
          <div className="mt-8">
            <EmptyState
              title="No matching outputs"
              description="Try another type, year, area, or keyword."
              action={
                hasFilters ? (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="font-sans text-sm font-semibold text-accent"
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="mt-2 sm:mt-4">
            {visibleYearGroups.map(([groupYear, items]) => {
              const showAccordion = tab === 'journal' && year === 'all' && !isDesktop;
              const isOpen =
                !showAccordion ||
                openYears.has(groupYear) ||
                visibleYearGroups.length === 1;

              return (
                <section key={groupYear} className="border-b border-border/60 last:border-b-0">
                  {showAccordion ? (
                    <button
                      type="button"
                      onClick={() => toggleYear(groupYear)}
                      className="flex w-full items-baseline justify-between gap-3 py-4 text-left sm:py-5"
                      aria-expanded={isOpen}
                    >
                      <span className="font-display text-2xl text-ink sm:text-3xl">
                        {groupYear}
                      </span>
                      <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                        {items.length}{' '}
                        {items.length === 1 ? 'article' : 'articles'}
                        <span className="ml-2 text-accent" aria-hidden>
                          {isOpen ? '−' : '+'}
                        </span>
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-baseline justify-between gap-3 py-4 sm:py-5">
                      <span className="font-display text-2xl text-ink sm:text-3xl">
                        {groupYear}
                      </span>
                      <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
                        {items.length}{' '}
                        {items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  )}

                  {isOpen || !showAccordion ? (
                    <ul className="pb-2 sm:pb-3">
                      {items.map((item) => (
                        <OutputRow key={item.id} item={item} />
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            {visible < filtered.length ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                  className="rounded-full bg-ink px-6 py-2.5 font-sans text-sm font-semibold tracking-[0.04em] text-paper transition-colors hover:bg-accent"
                >
                  Load more
                  <span className="ml-2 text-paper/55">
                    {filtered.length - visible} left
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Mobile refine bottom sheet */}
      {sheetOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal>
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="Close refine"
            onClick={() => setSheetOpen(false)}
          />
          <div
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[1.75rem] bg-paper px-5 pb-8 pt-4 shadow-[0_-12px_40px_rgba(13,39,69,0.18)]"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15" aria-hidden />
            <div className="mb-5 flex items-center justify-between">
              <p className="font-sans text-sm font-semibold text-ink">
                Refine results
              </p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  Search
                </p>
                <div className="relative mt-2.5">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={draft.query}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, query: e.target.value }))
                    }
                    placeholder="Title, author, venue…"
                    className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-10 pr-4 font-sans text-sm outline-none focus-visible:border-ink/35"
                  />
                </div>
              </div>

              <SoftSelect
                id={`${baseId}-sheet-status`}
                label="Status"
                value={draft.status}
                onChange={(value) => setDraft((d) => ({ ...d, status: value }))}
              >
                <option value="all">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </SoftSelect>

              <SoftSelect
                id={`${baseId}-sheet-type`}
                label="Output type"
                value={draft.tab}
                onChange={(value) =>
                  setDraft((d) => ({ ...d, tab: value as OutputTab }))
                }
              >
                {TABS.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.label}
                  </option>
                ))}
              </SoftSelect>

              <SoftSelect
                id={`${baseId}-sheet-area`}
                label="Research area"
                value={draft.area}
                onChange={(value) => setDraft((d) => ({ ...d, area: value }))}
              >
                <option value="all">All areas</option>
                {areaOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </SoftSelect>

              <SoftSelect
                id={`${baseId}-sheet-year`}
                label="Year"
                value={draft.year}
                onChange={(value) => setDraft((d) => ({ ...d, year: value }))}
              >
                <option value="all">All years</option>
                {Array.from(
                  new Set(
                    pool
                      .filter((item) => item.type === draft.tab)
                      .map((item) => item.year),
                  ),
                )
                  .sort((a, b) => b - a)
                  .map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
              </SoftSelect>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    query: '',
                    status: 'completed',
                    area: 'all',
                    year: 'all',
                    tab: draft.tab,
                  });
                }}
                className="flex-1 rounded-full border border-ink/15 py-3 font-sans text-sm font-semibold text-ink"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={applySheet}
                className="flex-[1.4] rounded-full bg-ink py-3 font-sans text-sm font-semibold text-paper"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
