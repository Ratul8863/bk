'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { HomepageConfig, HomepageSection } from '@/types/content';
import { useCms } from './CmsProvider';

type Tab = 'hero' | 'featured' | 'sections' | 'director' | 'stats' | 'ctas';

export function HomepageEditorPage() {
  const { database, ready, saveHomepage } = useCms();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'hero';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [form, setForm] = useState<HomepageConfig | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (database) setForm(structuredClone(database.homepage));
  }, [database]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const peopleOptions = useMemo(
    () => database?.people ?? [],
    [database],
  );

  if (!ready || !form) {
    return <p className="text-sm text-[#68727D]">Loading homepage…</p>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'featured', label: 'Featured' },
    { id: 'sections', label: 'Sections' },
    { id: 'director', label: 'Director' },
    { id: 'stats', label: 'Stats' },
    { id: 'ctas', label: 'CTAs' },
  ];

  const save = () => {
    saveHomepage(form);
    setMessage('Homepage saved');
    window.setTimeout(() => setMessage(null), 2000);
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const next = [...form.sections].sort((a, b) => a.order - b.order);
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setForm({
      ...form,
      sections: next.map((section, i) => ({ ...section, order: i + 1 })),
    });
  };

  const toggleSection = (id: string) => {
    setForm({
      ...form,
      sections: form.sections.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s,
      ),
    });
  };

  const sortedSections = [...form.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            Homepage
          </h1>
          <p className="mt-1 text-sm text-[#68727D]">
            Edit hero, featured content, section order, director message, and
            stats.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {message ? (
            <span className="text-xs font-medium text-[#173B6C]">{message}</span>
          ) : null}
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[#173B6C] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
          >
            Save homepage
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[#D9DEE5]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
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

      <div className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:p-5">
        {tab === 'hero' ? (
          <div className="grid max-w-3xl gap-4">
            <Field
              label="Eyebrow"
              value={form.heroEyebrow ?? ''}
              onChange={(v) => setForm({ ...form, heroEyebrow: v })}
            />
            <Field
              label="Hero title"
              value={form.heroTitle}
              onChange={(v) => setForm({ ...form, heroTitle: v })}
            />
            <TextArea
              label="Hero subtitle"
              value={form.heroSubtitle}
              onChange={(v) => setForm({ ...form, heroSubtitle: v })}
            />
            <Field
              label="Hero image URL"
              help="Path or URL (prototype or authentic media)"
              value={form.heroImageUrl ?? ''}
              onChange={(v) =>
                setForm({ ...form, heroImageUrl: v || null })
              }
            />
          </div>
        ) : null}

        {tab === 'featured' ? (
          <div className="grid max-w-3xl gap-4">
            <TextArea
              label="Featured research project IDs"
              help="Comma-separated IDs"
              value={form.featuredResearchProjectIds.join(', ')}
              onChange={(v) =>
                setForm({
                  ...form,
                  featuredResearchProjectIds: splitIds(v),
                })
              }
            />
            <TextArea
              label="Featured publication IDs"
              value={form.featuredPublicationIds.join(', ')}
              onChange={(v) =>
                setForm({
                  ...form,
                  featuredPublicationIds: splitIds(v),
                })
              }
            />
            <TextArea
              label="Featured news IDs"
              value={form.featuredNewsIds.join(', ')}
              onChange={(v) =>
                setForm({ ...form, featuredNewsIds: splitIds(v) })
              }
            />
            <TextArea
              label="Featured event IDs"
              value={form.featuredEventIds.join(', ')}
              onChange={(v) =>
                setForm({ ...form, featuredEventIds: splitIds(v) })
              }
            />
          </div>
        ) : null}

        {tab === 'sections' ? (
          <div className="space-y-2">
            {sortedSections.map((section, index) => (
              <SectionRow
                key={section.id}
                section={section}
                onToggle={() => toggleSection(section.id)}
                onUp={() => moveSection(index, -1)}
                onDown={() => moveSection(index, 1)}
                onTitle={(title) =>
                  setForm({
                    ...form,
                    sections: form.sections.map((s) =>
                      s.id === section.id ? { ...s, title } : s,
                    ),
                  })
                }
              />
            ))}
          </div>
        ) : null}

        {tab === 'director' ? (
          <div className="grid max-w-3xl gap-4">
            <label className="space-y-1.5 text-sm">
              <span className="font-medium text-[#0D2745]">Director</span>
              <select
                value={form.directorPersonId}
                onChange={(e) =>
                  setForm({ ...form, directorPersonId: e.target.value })
                }
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              >
                {peopleOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.role}
                  </option>
                ))}
              </select>
            </label>
            <TextArea
              label="Director message excerpt"
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
            {form.stats
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((stat) => (
                <div
                  key={stat.id}
                  className="grid gap-3 rounded-lg border border-[#E8ECE8] p-3 sm:grid-cols-4"
                >
                  <Field
                    label="Value"
                    value={stat.value}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        stats: form.stats.map((s) =>
                          s.id === stat.id ? { ...s, value: v } : s,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Label"
                    value={stat.label}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        stats: form.stats.map((s) =>
                          s.id === stat.id ? { ...s, label: v } : s,
                        ),
                      })
                    }
                  />
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={stat.verified}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stats: form.stats.map((s) =>
                            s.id === stat.id
                              ? { ...s, verified: e.target.checked }
                              : s,
                          ),
                        })
                      }
                    />
                    Verified
                  </label>
                  <Field
                    label="Note"
                    value={stat.note ?? ''}
                    onChange={(v) =>
                      setForm({
                        ...form,
                        stats: form.stats.map((s) =>
                          s.id === stat.id ? { ...s, note: v } : s,
                        ),
                      })
                    }
                  />
                </div>
              ))}
          </div>
        ) : null}

        {tab === 'ctas' ? (
          <div className="space-y-3">
            {form.heroCtas.map((cta, index) => (
              <div
                key={`${cta.label}-${index}`}
                className="grid gap-3 rounded-lg border border-[#E8ECE8] p-3 sm:grid-cols-3"
              >
                <Field
                  label="Label"
                  value={cta.label}
                  onChange={(v) => {
                    const heroCtas = [...form.heroCtas];
                    heroCtas[index] = { ...cta, label: v };
                    setForm({ ...form, heroCtas });
                  }}
                />
                <Field
                  label="URL"
                  value={cta.href}
                  onChange={(v) => {
                    const heroCtas = [...form.heroCtas];
                    heroCtas[index] = { ...cta, href: v };
                    setForm({ ...form, heroCtas });
                  }}
                />
                <label className="space-y-1.5 text-sm">
                  <span className="font-medium text-[#0D2745]">Variant</span>
                  <select
                    value={cta.variant ?? 'primary'}
                    onChange={(e) => {
                      const heroCtas = [...form.heroCtas];
                      heroCtas[index] = {
                        ...cta,
                        variant: e.target.value as 'primary' | 'secondary',
                      };
                      setForm({ ...form, heroCtas });
                    }}
                    className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function splitIds(value: string) {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
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

function SectionRow({
  section,
  onToggle,
  onUp,
  onDown,
  onTitle,
}: {
  section: HomepageSection;
  onToggle: () => void;
  onUp: () => void;
  onDown: () => void;
  onTitle: (title: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E8ECE8] px-3 py-2.5">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={section.enabled} onChange={onToggle} />
        Enabled
      </label>
      <span className="rounded bg-[#F6F4EE] px-2 py-0.5 text-xs text-[#68727D]">
        {section.type}
      </span>
      <input
        value={section.title ?? ''}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Section title"
        className="min-w-[12rem] flex-1 rounded-md border border-[#D9DEE5] bg-white px-2 py-1.5 text-sm"
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onUp}
          className="rounded border border-[#D9DEE5] px-2 py-1 text-xs"
        >
          Up
        </button>
        <button
          type="button"
          onClick={onDown}
          className="rounded border border-[#D9DEE5] px-2 py-1 text-xs"
        >
          Down
        </button>
      </div>
    </div>
  );
}
