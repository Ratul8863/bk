'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/ui/FilterBar';
import { MetaLine } from '@/components/ui/MetaLine';
import { EmptyState } from '@/components/ui/EmptyState';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';
import type { ResearchArea, ResearchProject, ResearchStatus } from '@/types/content';

type Props = {
  projects: ResearchProject[];
  areas: ResearchArea[];
};

export function ResearchFilters({ projects, areas }: Props) {
  const [area, setArea] = useState('all');
  const [status, setStatus] = useState('all');
  const [year, setYear] = useState('all');
  const [query, setQuery] = useState('');

  const years = useMemo(
    () =>
      Array.from(
        new Set(projects.map((project) => project.year).filter(Boolean) as number[]),
      ).sort((a, b) => b - a),
    [projects],
  );

  const filtered = projects.filter((project) => {
    if (area !== 'all' && !project.areaIds.includes(area)) return false;
    if (status !== 'all' && project.researchStatus !== status) return false;
    if (year !== 'all' && String(project.year) !== year) return false;
    if (query.trim()) {
      const hay = [
        project.title,
        project.summary,
        ...project.leadAuthorNames,
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(query.trim().toLowerCase())) return false;
    }
    return true;
  });

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
            placeholder="Search projects"
            className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus-visible:border-accent"
          />
        </label>
        <FilterBar
          label="Area"
          layout="stack"
          value={area}
          onChange={setArea}
          options={[
            { label: 'All areas', value: 'all' },
            ...areas.map((item) => ({ label: item.title, value: item.id })),
          ]}
        />
        <FilterBar
          label="Status"
          layout="stack"
          value={status}
          onChange={setStatus}
          options={[
            { label: 'All statuses', value: 'all' },
            ...(
              ['ongoing', 'completed', 'planned', 'archived'] as ResearchStatus[]
            ).map((value) => ({
              label: RESEARCH_STATUS_LABELS[value],
              value,
            })),
          ]}
        />
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
      </aside>
      <div>
        <p className="border-b border-border pb-4 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
          {filtered.length} project{filtered.length === 1 ? '' : 's'}
        </p>
        {filtered.length ? (
          <ul className="divide-y divide-border">
            {filtered.map((project) => (
              <li key={project.id} className="py-7 sm:py-8">
                <MetaLine
                  items={[
                    RESEARCH_STATUS_LABELS[project.researchStatus],
                    project.year ? String(project.year) : null,
                  ]}
                />
                <Link
                  href={`/research/${project.slug}`}
                  className="mt-2.5 block font-display text-xl text-ink transition-colors hover:text-accent sm:text-2xl"
                >
                  {project.title}
                </Link>
                <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-muted">
                  {project.summary}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No matching projects"
            description="Try adjusting filters or clearing the keyword search."
          />
        )}
      </div>
    </div>
  );
}

