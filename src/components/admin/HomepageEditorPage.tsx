'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { HomepageConfig, HomepageStat } from '@/types/content';
import {
  AdminLockedState,
  AdminPageHeader,
  AdminPrimaryButton,
} from './AdminUI';
import { useCms } from './CmsProvider';

type Tab = 'banner' | 'featured' | 'director' | 'stats' | 'map';

const LIVE_HOMEPAGE_MAP: { title: string; note: string; editable: string }[] = [
  {
    title: 'Welcome banner',
    note: 'Brand name stays “BK School of Research”. You edit the short line and button labels/links.',
    editable: 'Supporting line, button text & links, banner image',
  },
  {
    title: 'Scrolling stats strip',
    note: 'Numbers that scroll under the banner.',
    editable: 'Add / edit / remove verified figures',
  },
  {
    title: 'Who we are + How we work',
    note: 'Section titles and layout are fixed in the design.',
    editable: 'Organisation profile (mission/vision) & founder card from Team',
  },
  {
    title: 'At a glance (3 cards)',
    note: 'Research / Publication / Events cards — labels fixed.',
    editable: 'Not CMS titles — links go to those library sections',
  },
  {
    title: 'Focus areas',
    note: 'Carousel of research areas.',
    editable: 'Manage under Focus areas',
  },
  {
    title: 'Programmes',
    note: 'Activities stack.',
    editable: 'Manage under Programmes & activities',
  },
  {
    title: 'Director’s message',
    note: 'Photo + excerpt on the homepage.',
    editable: 'Person + message excerpt (this page)',
  },
  {
    title: 'Team',
    note: 'Featured team cards.',
    editable: 'Manage under Team directory',
  },
  {
    title: 'Featured research / library / media / notices',
    note: 'Pulled from library records you mark as featured here.',
    editable: 'Featured picks (this page) + library CRUD',
  },
];

export function HomepageEditorPage() {
  const { database, ready, saveHomepage, apiAuthenticated } = useCms();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'banner';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [form, setForm] = useState<HomepageConfig | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (database) setForm(structuredClone(database.homepage));
  }, [database]);

  useEffect(() => {
    const allowed: Tab[] = ['banner', 'featured', 'director', 'stats', 'map'];
    setTab(allowed.includes(initialTab) ? initialTab : 'banner');
  }, [initialTab]);

  const publishedPeople = useMemo(
    () => (database?.people ?? []).filter((p) => p.status === 'published'),
    [database],
  );
  const publishedResearch = useMemo(
    () =>
      (database?.researchProjects ?? []).filter((p) => p.status === 'published'),
    [database],
  );
  const publishedPublications = useMemo(
    () =>
      (database?.publications ?? []).filter((p) => p.status === 'published'),
    [database],
  );
  const publishedEvents = useMemo(
    () => (database?.events ?? []).filter((p) => p.status === 'published'),
    [database],
  );

  if (!ready) {
    return <p className="text-sm text-[#5B6B7C]">Loading homepage…</p>;
  }

  if (!apiAuthenticated || !database || !form) {
    return <AdminLockedState noun="homepage content" />;
  }

  const tabs: { id: Tab; label: string; hint: string }[] = [
    {
      id: 'banner',
      label: 'Welcome banner',
      hint: 'Short line and button links under the brand name (name itself is fixed).',
    },
    {
      id: 'featured',
      label: 'Featured picks',
      hint: 'Which library items appear in homepage highlight areas.',
    },
    {
      id: 'director',
      label: 'Director’s message',
      hint: 'Who appears and what excerpt is shown.',
    },
    {
      id: 'stats',
      label: 'Scrolling stats',
      hint: 'Numbers in the strip under the banner — not the At a glance cards.',
    },
    {
      id: 'map',
      label: 'What appears on the live site',
      hint: 'Section titles stay in the design; you manage content behind them.',
    },
  ];

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const heroCtas = form.heroCtas.map((cta, index) => ({
        ...cta,
        variant: (index === 0 ? 'primary' : 'secondary') as
          | 'primary'
          | 'secondary',
      }));
      await saveHomepage({ ...form, heroCtas });
      setForm({ ...form, heroCtas });
      setMessage('Saved — public homepage will refresh shortly');
      window.setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleId = (
    key:
      | 'featuredResearchProjectIds'
      | 'featuredPublicationIds'
      | 'featuredEventIds',
    id: string,
  ) => {
    const current = form[key];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setForm({ ...form, [key]: next });
  };

  const updateStat = (id: string, patch: Partial<HomepageStat>) => {
    setForm({
      ...form,
      stats: form.stats.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const addStat = () => {
    const id = `stat-${Date.now()}`;
    setForm({
      ...form,
      stats: [
        ...form.stats,
        {
          id,
          label: 'New figure',
          value: '0',
          verified: false,
          order: form.stats.length + 1,
        },
      ],
    });
  };

  const removeStat = (id: string) => {
    setForm({
      ...form,
      stats: form.stats
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 })),
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Homepage"
        title="Homepage content"
        description="Edit only what the live homepage actually uses. Section headings like “Who we are” or “At a glance” stay in the design — manage cards and library items instead."
        action={
          <>
            {message ? (
              <span className="text-xs font-semibold text-[#173B6C]">
                {message}
              </span>
            ) : null}
            {tab !== 'map' ? (
              <AdminPrimaryButton
                onClick={() => void save()}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save homepage'}
              </AdminPrimaryButton>
            ) : null}
          </>
        }
      />

      <div className="flex flex-wrap gap-1 border-b border-[#E2E8F0]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.hint}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${
              tab === t.id
                ? 'border-[#173B6C] text-[#173B6C]'
                : 'border-transparent text-[#68727D]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-[#68727D]">
        {tabs.find((t) => t.id === tab)?.hint}
      </p>

      <div className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:p-5">
        {tab === 'banner' ? (
          <div className="grid max-w-3xl gap-4">
            <p className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm text-[#68727D]">
              On the site, the large title is always{' '}
              <strong className="text-[#0D2745]">BK School of Research</strong>.
              That cannot be changed here (brand rule).
            </p>
            <Field
              label="Supporting line under the brand"
              help="Shown under the brand name on the welcome banner"
              value={form.heroSubtitle}
              onChange={(v) => setForm({ ...form, heroSubtitle: v })}
            />
            <Field
              label="Banner image URL"
              help="From Photo & file library, or a site path"
              value={form.heroImageUrl ?? ''}
              onChange={(v) =>
                setForm({ ...form, heroImageUrl: v || null })
              }
            />
            <div className="space-y-3 border-t border-[#E8ECE8] pt-4">
              <p className="text-sm font-medium text-[#0B1F36]">Banner buttons</p>
              <p className="text-xs text-[#5B6B7C]">
                Edit the button text and where it goes. Look and colour stay
                fixed in the website design.
              </p>
              {form.heroCtas.map((cta, index) => (
                <div
                  key={`cta-${index}`}
                  className="grid gap-3 rounded-lg border border-[#E8ECE8] bg-white p-3 sm:grid-cols-2"
                >
                  <Field
                    label="Button text"
                    value={cta.label}
                    onChange={(v) => {
                      const heroCtas = [...form.heroCtas];
                      heroCtas[index] = { ...cta, label: v };
                      setForm({ ...form, heroCtas });
                    }}
                  />
                  <Field
                    label="Goes to"
                    help="e.g. /research"
                    value={cta.href}
                    onChange={(v) => {
                      const heroCtas = [...form.heroCtas];
                      heroCtas[index] = { ...cta, href: v };
                      setForm({ ...form, heroCtas });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === 'featured' ? (
          <div className="grid max-w-3xl gap-6">
            <Picker
              title="Featured research projects"
              help="Used where the homepage highlights research"
              items={publishedResearch.map((p) => ({
                id: p.id,
                label: p.title,
              }))}
              selected={form.featuredResearchProjectIds}
              onToggle={(id) => toggleId('featuredResearchProjectIds', id)}
              manageHref="/admin/research"
            />
            <Picker
              title="Featured publications"
              help="Used in From the library / featured rows"
              items={publishedPublications.map((p) => ({
                id: p.id,
                label: `${p.title} (${p.year})`,
              }))}
              selected={form.featuredPublicationIds}
              onToggle={(id) => toggleId('featuredPublicationIds', id)}
              manageHref="/admin/publications"
            />
            <Picker
              title="Featured events"
              help="Preferred events in Notices & Events"
              items={publishedEvents.map((p) => ({
                id: p.id,
                label: p.title,
              }))}
              selected={form.featuredEventIds}
              onToggle={(id) => toggleId('featuredEventIds', id)}
              manageHref="/admin/events"
            />
          </div>
        ) : null}

        {tab === 'director' ? (
          <div className="grid max-w-3xl gap-4">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-[#0D2745]">
                Whose message is shown
              </span>
              <select
                value={form.directorPersonId}
                onChange={(e) =>
                  setForm({ ...form, directorPersonId: e.target.value })
                }
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              >
                {publishedPeople.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.role}
                  </option>
                ))}
              </select>
            </label>
            <TextArea
              label="Message excerpt on the homepage"
              help="Short paragraph visitors read — not the full profile bio"
              value={form.directorMessageExcerpt}
              onChange={(v) =>
                setForm({ ...form, directorMessageExcerpt: v })
              }
              rows={6}
            />
          </div>
        ) : null}

        {tab === 'stats' ? (
          <div className="space-y-3">
            <p className="text-sm text-[#68727D]">
              These power the scrolling strip under the banner. The separate “At
              a glance” photo cards are fixed links to Research, Publications,
              and Events.
            </p>
            {form.stats
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((stat) => (
                <div
                  key={stat.id}
                  className="grid gap-3 rounded-lg border border-[#E8ECE8] bg-white p-3 sm:grid-cols-[1fr_1fr_auto_1fr_auto]"
                >
                  <Field
                    label="Number / value"
                    value={stat.value}
                    onChange={(v) => updateStat(stat.id, { value: v })}
                  />
                  <Field
                    label="Label"
                    value={stat.label}
                    onChange={(v) => updateStat(stat.id, { label: v })}
                  />
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={stat.verified}
                      onChange={(e) =>
                        updateStat(stat.id, { verified: e.target.checked })
                      }
                    />
                    Show on site
                  </label>
                  <Field
                    label="Internal note"
                    value={stat.note ?? ''}
                    onChange={(v) => updateStat(stat.id, { note: v })}
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(stat.id)}
                    className="self-end rounded-lg border border-[#E8C4C4] px-2 py-2 text-xs text-[#8A3B3B]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            <button
              type="button"
              onClick={addStat}
              className="rounded-lg border border-dashed border-[#C5DCD4] px-3 py-2 text-sm font-medium text-[#173B6C]"
            >
              Add figure
            </button>
          </div>
        ) : null}

        {tab === 'map' ? (
          <ul className="space-y-3">
            {LIVE_HOMEPAGE_MAP.map((row) => (
              <li
                key={row.title}
                className="rounded-lg border border-[#E8ECE8] bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-[#0D2745]">
                  {row.title}
                </p>
                <p className="mt-1 text-sm text-[#68727D]">{row.note}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#173B6C]">
                  Edit: {row.editable}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function Picker({
  title,
  help,
  items,
  selected,
  onToggle,
  manageHref,
}: {
  title: string;
  help: string;
  items: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  manageHref: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[#0D2745]">{title}</p>
          <p className="text-xs text-[#68727D]">{help}</p>
        </div>
        <Link
          href={manageHref}
          className="text-xs font-medium text-[#173B6C] underline"
        >
          Manage library
        </Link>
      </div>
      <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-[#E8ECE8] bg-white p-2">
        {items.length === 0 ? (
          <p className="px-2 py-3 text-sm text-[#68727D]">
            No published items yet.
          </p>
        ) : (
          items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#F6F4EE]"
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={selected.includes(item.id)}
                onChange={() => onToggle(item.id)}
              />
              <span className="text-[#0D2745]">{item.label}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[#0D2745]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 outline-none focus:border-[#173B6C]"
      />
      {help ? <span className="text-xs text-[#68727D]">{help}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  help?: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[#0D2745]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 outline-none focus:border-[#173B6C]"
      />
      {help ? <span className="text-xs text-[#68727D]">{help}</span> : null}
    </label>
  );
}
