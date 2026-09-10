import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/app/(public)');
const components = path.resolve('src/components/public');

function write(rel, content, base = root) {
  const full = path.join(base, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trimStart() + '\n');
  console.log('✓', path.relative(process.cwd(), full));
}

// Shared client filters
write(
  'ResearchFilters.tsx',
  `'use client';

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
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="space-y-6">
          <label className="block">
            <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Keyword
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              className="mt-2 w-full border border-border bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
            />
          </label>
          <FilterBar
            label="Area"
            value={area}
            onChange={setArea}
            options={[
              { label: 'All areas', value: 'all' },
              ...areas.map((item) => ({ label: item.title, value: item.id })),
            ]}
          />
          <FilterBar
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: 'All statuses', value: 'all' },
              ...(['ongoing', 'completed', 'planned', 'archived'] as ResearchStatus[]).map(
                (value) => ({ label: RESEARCH_STATUS_LABELS[value], value }),
              ),
            ]}
          />
          <FilterBar
            label="Year"
            value={year}
            onChange={setYear}
            options={[
              { label: 'All years', value: 'all' },
              ...years.map((value) => ({ label: String(value), value: String(value) })),
            ]}
          />
        </aside>
        <div>
          {filtered.length ? (
            <ul className="divide-y divide-border border-y border-border">
              {filtered.map((project) => (
                <li key={project.id} className="py-6">
                  <MetaLine
                    items={[
                      RESEARCH_STATUS_LABELS[project.researchStatus],
                      project.year ? String(project.year) : null,
                    ]}
                  />
                  <Link
                    href={\`/research/\${project.slug}\`}
                    className="mt-2 block font-display text-2xl text-ink transition-colors hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
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
    </div>
  );
}
`,
  components,
);

write(
  'PublicationFilters.tsx',
  `'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FilterBar } from '@/components/ui/FilterBar';
import { MetaLine } from '@/components/ui/MetaLine';
import { EmptyState } from '@/components/ui/EmptyState';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import type { Publication, PublicationType, ResearchArea } from '@/types/content';

type Props = {
  publications: Publication[];
  areas: ResearchArea[];
  initialType?: PublicationType | 'all';
};

export function PublicationFilters({
  publications,
  areas,
  initialType = 'all',
}: Props) {
  const [type, setType] = useState(initialType);
  const [area, setArea] = useState('all');
  const [year, setYear] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const years = useMemo(
    () =>
      Array.from(new Set(publications.map((item) => item.year))).sort(
        (a, b) => b - a,
      ),
    [publications],
  );

  const filtered = publications
    .filter((item) => {
      if (type !== 'all' && item.type !== type) return false;
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

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-6">
        <label className="block">
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Keyword
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search publications"
            className="mt-2 w-full border border-border bg-paper px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
          />
        </label>
        <FilterBar
          label="Type"
          value={type}
          onChange={(value) => setType(value as PublicationType | 'all')}
          options={[
            { label: 'All types', value: 'all' },
            ...Object.entries(PUBLICATION_TYPE_LABELS).map(([value, label]) => ({
              label,
              value,
            })),
          ]}
        />
        <FilterBar
          label="Area"
          value={area}
          onChange={setArea}
          options={[
            { label: 'All areas', value: 'all' },
            ...areas.map((item) => ({ label: item.title, value: item.id })),
          ]}
        />
        <FilterBar
          label="Year"
          value={year}
          onChange={setYear}
          options={[
            { label: 'All years', value: 'all' },
            ...years.map((value) => ({ label: String(value), value: String(value) })),
          ]}
        />
        <FilterBar
          label="Sort"
          value={sort}
          onChange={(value) => setSort(value as 'newest' | 'oldest')}
          options={[
            { label: 'Newest first', value: 'newest' },
            { label: 'Oldest first', value: 'oldest' },
          ]}
        />
      </aside>
      <div>
        {filtered.length ? (
          <ul className="divide-y divide-border border-y border-border">
            {filtered.map((item) => (
              <li key={item.id} className="py-6">
                <MetaLine
                  items={[PUBLICATION_TYPE_LABELS[item.type], String(item.year)]}
                />
                <Link
                  href={\`/publications/\${item.slug}\`}
                  className="mt-2 block font-display text-xl text-ink transition-colors hover:text-accent md:text-2xl"
                >
                  {item.title}
                </Link>
                <p className="mt-2 text-sm text-muted">{item.authors.join(', ')}</p>
                {item.venue ? (
                  <p className="mt-1 text-sm text-body">{item.venue}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No matching publications"
            description="Try a different type, year, area, or keyword."
          />
        )}
      </div>
    </div>
  );
}
`,
  components,
);

write(
  'ContactForm.tsx',
  `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border border-border bg-sage/40 px-6 py-10">
        <h2 className="font-display text-2xl text-ink">Message recorded</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          This is a front-end demonstration only. No message was sent. Please
          email BKSR directly for formal correspondence.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Name</span>
        <input
          required
          name="name"
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Email</span>
        <input
          required
          type="email"
          name="email"
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Subject</span>
        <input
          required
          name="subject"
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Message</span>
        <textarea
          required
          name="message"
          rows={6}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <Button type="submit" variant="primary" size="lg">
        Send message
      </Button>
      <p className="text-xs text-muted">
        Frontend-only form. Submissions are not delivered to a server.
      </p>
    </form>
  );
}
`,
  components,
);

console.log('Client components written');
