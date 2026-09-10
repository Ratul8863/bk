import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const files = {};

function put(rel, content) {
  files[rel] = content.replace(/^\n/, '');
}

put(
  'src/components/public/PublicationsLibrary.tsx',
  `'use client';

import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { PublicationRow } from '@/components/editorial/PublicationRow';
import { PUBLICATION_TYPE_LABELS } from '@/lib/public/labels';
import type { Publication, PublicationType, ResearchArea } from '@/types/content';

type Props = {
  publications: Publication[];
  areas: ResearchArea[];
  initialType?: PublicationType | 'all';
};

type SortKey = 'newest' | 'oldest';

export function PublicationsLibrary({
  publications,
  areas,
  initialType = 'all',
}: Props) {
  const [type, setType] = useState<string>(initialType);
  const [areaId, setAreaId] = useState('all');
  const [year, setYear] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [publications],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const list = publications.filter((pub) => {
      if (type !== 'all' && pub.type !== type) return false;
      if (areaId !== 'all' && !(pub.areaIds ?? []).includes(areaId)) return false;
      if (year !== 'all' && pub.year !== Number(year)) return false;
      if (q) {
        const blob = [pub.title, pub.citation, ...pub.authors, pub.venue ?? '']
          .join(' ')
          .toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) =>
      sort === 'newest' ? b.year - a.year : a.year - b.year,
    );
  }, [publications, type, areaId, year, keyword, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="space-y-6 lg:col-span-4">
        <FilterBar
          label="Type"
          value={type}
          onChange={setType}
          options={[
            { label: 'All', value: 'all' },
            ...Object.entries(PUBLICATION_TYPE_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <FilterBar
          label="Research area"
          value={areaId}
          onChange={setAreaId}
          options={[
            { label: 'All areas', value: 'all' },
            ...areas.map((area) => ({ label: area.title, value: area.id })),
          ]}
        />
        <FilterBar
          label="Year"
          value={year}
          onChange={setYear}
          options={[
            { label: 'All years', value: 'all' },
            ...years.map((y) => ({ label: String(y), value: String(y) })),
          ]}
        />
        <FilterBar
          label="Sort"
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={[
            { label: 'Newest', value: 'newest' },
            { label: 'Oldest', value: 'oldest' },
          ]}
        />
        <label className="block">
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Keyword
          </span>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search title, author, venue…"
            className="mt-3 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none focus:border-accent"
          />
        </label>
      </aside>
      <div className="lg:col-span-8">
        <p className="mb-4 font-sans text-sm text-muted">
          {filtered.length} publication{filtered.length === 1 ? '' : 's'}
        </p>
        {filtered.length === 0 ? (
          <EmptyState
            title="No publications match"
            description="Try clearing filters or using a broader keyword."
          />
        ) : (
          filtered.map((publication) => (
            <PublicationRow key={publication.id} publication={publication} />
          ))
        )}
      </div>
    </div>
  );
}
`,
);

put(
  'src/components/public/ResearchLibrary.tsx',
  `'use client';

import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResearchRow } from '@/components/editorial/ResearchRow';
import { RESEARCH_STATUS_LABELS } from '@/lib/public/labels';
import type { ResearchArea, ResearchProject, ResearchStatus } from '@/types/content';

type Props = {
  projects: ResearchProject[];
  areas: ResearchArea[];
  initialStatus?: ResearchStatus | 'all';
};

export function ResearchLibrary({
  projects,
  areas,
  initialStatus = 'all',
}: Props) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [areaId, setAreaId] = useState('all');
  const [year, setYear] = useState('all');
  const [keyword, setKeyword] = useState('');

  const years = useMemo(
    () =>
      Array.from(
        new Set(projects.map((p) => p.year).filter((y): y is number => y != null)),
      ).sort((a, b) => b - a),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return projects.filter((project) => {
      if (status !== 'all' && project.researchStatus !== status) return false;
      if (areaId !== 'all' && !project.areaIds.includes(areaId)) return false;
      if (year !== 'all' && project.year !== Number(year)) return false;
      if (q) {
        const blob = [project.title, project.summary, ...project.leadAuthorNames]
          .join(' ')
          .toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [projects, status, areaId, year, keyword]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="space-y-6 lg:col-span-4">
        <FilterBar
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: 'All', value: 'all' },
            ...Object.entries(RESEARCH_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <FilterBar
          label="Area"
          value={areaId}
          onChange={setAreaId}
          options={[
            { label: 'All areas', value: 'all' },
            ...areas.map((area) => ({ label: area.title, value: area.id })),
          ]}
        />
        <FilterBar
          label="Year"
          value={year}
          onChange={setYear}
          options={[
            { label: 'All years', value: 'all' },
            ...years.map((y) => ({ label: String(y), value: String(y) })),
          ]}
        />
        <label className="block">
          <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Keyword
          </span>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search projects…"
            className="mt-3 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm text-ink outline-none focus:border-accent"
          />
        </label>
      </aside>
      <div className="lg:col-span-8">
        <p className="mb-4 font-sans text-sm text-muted">
          {filtered.length} project{filtered.length === 1 ? '' : 's'}
        </p>
        {filtered.length === 0 ? (
          <EmptyState
            title="No projects match"
            description="Adjust filters to see BKSR research projects."
          />
        ) : (
          filtered.map((project) => (
            <ResearchRow key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
`,
);

put(
  'src/components/public/ContactForm.tsx',
  `'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (submitted) {
    return (
      <div className="border border-accent/30 bg-sage/40 px-6 py-10 md:px-8">
        <p className="font-display text-2xl text-ink">Thank you</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Your message has been recorded in this preview. For a live enquiry,
          please email BKSR using the addresses listed on this page.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Subject</span>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">Message</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-2 w-full border border-border bg-paper px-3 py-2.5 font-sans text-sm outline-none focus:border-accent"
        />
      </label>
      <Button type="submit" variant="primary">
        Send message
      </Button>
    </form>
  );
}
`,
);

put(
  'src/components/public/SearchPageClient.tsx',
  `'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  searchContent,
  type SearchCategory,
  type SearchResult,
} from '@/lib/cms/search';

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

type Props = { initialQuery?: string };

export function SearchPageClient({ initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<SearchCategory>('all');

  const results: SearchResult[] = useMemo(
    () => searchContent(query, category, { useSeed: true }),
    [query, category],
  );

  return (
    <div className="space-y-8">
      <label className="block">
        <span className="sr-only">Search</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search publications, research, people, news…"
          className="w-full border border-border bg-paper px-4 py-3 font-sans text-base text-ink outline-none focus:border-accent"
          autoFocus
        />
      </label>
      <FilterBar
        label="Category"
        value={category}
        onChange={(v) => setCategory(v as SearchCategory)}
        options={CATEGORIES}
      />
      <p className="font-sans text-sm text-muted">
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>
      {results.length === 0 ? (
        <EmptyState
          title="No matches"
          description={
            query.trim()
              ? 'Try a different keyword or category.'
              : 'Enter a keyword to search the BKSR library.'
          }
        />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {results.map((item) => (
            <li key={\`\${item.category}-\${item.id}\`} className="py-5">
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent">
                {item.category}
              </p>
              <Link
                href={item.href}
                className="mt-1 block font-display text-xl text-ink transition-colors hover:text-accent"
              >
                {item.title}
              </Link>
              {item.excerpt ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                  {item.excerpt}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
);

// Helper for CMS page renderer
put(
  'src/components/public/CmsPageView.tsx',
  `import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { RichText } from '@/components/ui/RichText';
import { Section } from '@/components/ui/Section';
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb';
import type { Page } from '@/types/content';

type Props = {
  page: Page;
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
};

export function CmsPageView({ page, breadcrumbs, eyebrow }: Props) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={page.title}
        description={page.excerpt}
        breadcrumbs={breadcrumbs}
      />
      <Section>
        <Container narrow>
          <RichText content={page.bodyHtml ?? page.body} asHtml={Boolean(page.bodyHtml)} />
        </Container>
      </Section>
    </>
  );
}
`,
);

for (const [rel, content] of Object.entries(files)) {
  mkdirSync(dirname(rel), { recursive: true });
  writeFileSync(rel, content);
  console.log('wrote', rel);
}
console.log('clients done', Object.keys(files).length);
