'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  getSearchIndex,
  searchContent,
  type SearchCategory,
  type SearchResult,
} from '@/lib/cms/search';
import { cn } from '@/lib/utils';

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

const CATEGORIES: { label: string; value: SearchCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Publications', value: 'publications' },
  { label: 'Research', value: 'research' },
  { label: 'People', value: 'people' },
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'events' },
  { label: 'Notices', value: 'notices' },
  { label: 'Resources', value: 'resources' },
];

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');

  const searchIndex = useMemo(
    () => getSearchIndex({ useSeed: true }),
    [],
  );

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) {
      return searchIndex
        .filter((item) => category === 'all' || item.category === category)
        .slice(0, 8);
    }
    return searchContent(query, category, { useSeed: true }).slice(0, 24);
  }, [category, query, searchIndex]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setCategory('all');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/45 px-4 pt-[10vh] backdrop-blur-[6px] sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-3xl flex-col overflow-hidden border border-border bg-white shadow-[0_28px_90px_rgba(13,39,69,0.22)]">
        <div className="flex items-center gap-3 border-b border-border px-4 transition-[border-color] focus-within:border-accent sm:px-5">
          <Search className="size-[1.125rem] shrink-0 text-muted" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search research, people, publications…"
            className="h-14 w-full bg-transparent font-sans text-base text-ink placeholder:text-muted !outline-none focus-visible:!outline-none"
            style={{ outline: 'none', boxShadow: 'none' }}
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center text-muted transition-colors hover:bg-sage hover:text-ink focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-accent"
            aria-label="Close search"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-3 [scrollbar-width:none] sm:gap-2 sm:px-5 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Search categories"
        >
          {CATEGORIES.map((item) => {
            const selected = category === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(item.value)}
                className={cn(
                  'shrink-0 rounded-sm px-3 py-1.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.06em] transition-colors focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-accent',
                  selected
                    ? 'bg-ink text-paper'
                    : 'bg-surface-subtle text-ink/70 hover:bg-sage hover:text-ink',
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <ul
          data-lenis-prevent
          className="max-h-[min(28rem,52vh)] overflow-y-auto overscroll-contain py-1 [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/25 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {results.length === 0 ? (
            <li className="px-5 py-12 text-center font-sans text-sm text-muted">
              No results for “{query}”.
            </li>
          ) : (
            results.map((result, index) => (
              <li
                key={`${result.category}-${result.id}`}
                className={cn(index > 0 && 'border-t border-border/80')}
              >
                <Link
                  href={result.href}
                  onClick={onClose}
                  className="block px-5 py-[1.125rem] transition-colors hover:bg-sage/55 focus-visible:bg-sage/55 focus-visible:!outline-none"
                >
                  <span className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-brand-blue">
                    {result.category}
                  </span>
                  <span className="mt-1.5 block font-sans text-[0.9375rem] font-semibold leading-snug text-ink">
                    {result.title}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[0.8125rem] leading-relaxed text-muted">
                    {result.excerpt}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-subtle px-5 py-3">
          <p className="font-sans text-xs text-muted">
            Press{' '}
            <kbd className="mx-0.5 inline-flex min-w-[1.6rem] items-center justify-center border border-border bg-white px-1.5 py-0.5 font-sans text-[0.6875rem] font-semibold text-ink shadow-[0_1px_0_var(--color-border)]">
              Esc
            </kbd>{' '}
            to close
          </p>
          {results.length > 0 ? (
            <p className="font-sans text-xs tabular-nums text-muted">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
