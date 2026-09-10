'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { SiteSettings } from '@/types/content';
import { useCms } from './CmsProvider';

type SettingsMode = 'all' | 'contact' | 'social' | 'seo';

export function SettingsEditorPage({
  mode = 'all',
  title = 'Site Settings',
  description = 'Organization identity, contact details, social links, and default SEO.',
}: {
  mode?: SettingsMode;
  title?: string;
  description?: string;
}) {
  const { database, ready, saveSiteSettings } = useCms();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (database) setForm(structuredClone(database.siteSettings));
  }, [database]);

  if (!ready || !form) {
    return <p className="text-sm text-[#68727D]">Loading settings…</p>;
  }

  const save = () => {
    saveSiteSettings(form);
    setMessage('Settings saved');
    window.setTimeout(() => setMessage(null), 2000);
  };

  const showOrg = mode === 'all';
  const showContact = mode === 'all' || mode === 'contact';
  const showSocial = mode === 'all' || mode === 'social';
  const showSeo = mode === 'all' || mode === 'seo';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-[#68727D]">{description}</p>
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
            Save settings
          </button>
        </div>
      </div>

      <div className="grid max-w-3xl gap-6">
        {showOrg ? (
          <Section title="Organization">
            <Field
              label="Organization name"
              value={form.organizationName}
              onChange={(v) => setForm({ ...form, organizationName: v })}
            />
            <Field
              label="Short name"
              value={form.organizationShortName}
              onChange={(v) => setForm({ ...form, organizationShortName: v })}
            />
            <Field
              label="Tagline"
              value={form.tagline}
              onChange={(v) => setForm({ ...form, tagline: v })}
            />
            <Field
              label="Positioning statement"
              value={form.positioningStatement}
              onChange={(v) => setForm({ ...form, positioningStatement: v })}
            />
            <Field
              label="Motto"
              value={form.motto ?? ''}
              onChange={(v) => setForm({ ...form, motto: v })}
            />
            <TextArea
              label="Mission"
              value={form.mission}
              onChange={(v) => setForm({ ...form, mission: v })}
            />
            <TextArea
              label="Vision"
              value={form.vision}
              onChange={(v) => setForm({ ...form, vision: v })}
            />
            <Field
              label="Copyright"
              value={form.copyright}
              onChange={(v) => setForm({ ...form, copyright: v })}
            />
            <Field
              label="Founded year"
              value={String(form.foundedYear)}
              onChange={(v) =>
                setForm({ ...form, foundedYear: Number(v) || form.foundedYear })
              }
            />
          </Section>
        ) : null}

        {showContact ? (
          <Section title="Contact">
            <Field
              label="Address line 1"
              value={form.address.line1}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, line1: v },
                })
              }
            />
            <Field
              label="City"
              value={form.address.city}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, city: v },
                })
              }
            />
            <Field
              label="District"
              value={form.address.district}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, district: v },
                })
              }
            />
            <Field
              label="Postal code"
              value={form.address.postalCode}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, postalCode: v },
                })
              }
            />
            <Field
              label="Country"
              value={form.address.country}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, country: v },
                })
              }
            />
            <Field
              label="Full address"
              value={form.address.full}
              onChange={(v) =>
                setForm({
                  ...form,
                  address: { ...form.address, full: v },
                })
              }
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              label="General email"
              value={form.emails.general}
              onChange={(v) =>
                setForm({
                  ...form,
                  emails: { ...form.emails, general: v },
                })
              }
            />
            <Field
              label="Executive Director email"
              value={form.emails.executiveDirector}
              onChange={(v) =>
                setForm({
                  ...form,
                  emails: { ...form.emails, executiveDirector: v },
                })
              }
            />
            <Field
              label="Research Director email"
              value={form.emails.researchDirector}
              onChange={(v) =>
                setForm({
                  ...form,
                  emails: { ...form.emails, researchDirector: v },
                })
              }
            />
          </Section>
        ) : null}

        {showSocial ? (
          <Section title="Social">
            {(
              [
                ['facebook', 'Facebook'],
                ['youtube', 'YouTube'],
                ['twitter', 'Twitter / X'],
                ['linkedin', 'LinkedIn'],
                ['instagram', 'Instagram'],
              ] as const
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={form.social[key] ?? ''}
                onChange={(v) =>
                  setForm({
                    ...form,
                    social: { ...form.social, [key]: v },
                  })
                }
              />
            ))}
          </Section>
        ) : null}

        {showSeo ? (
          <Section title="Default SEO">
            <Field
              label="Default title"
              value={form.defaultSeo.title}
              onChange={(v) =>
                setForm({
                  ...form,
                  defaultSeo: { ...form.defaultSeo, title: v },
                })
              }
            />
            <TextArea
              label="Default description"
              value={form.defaultSeo.description}
              onChange={(v) =>
                setForm({
                  ...form,
                  defaultSeo: { ...form.defaultSeo, description: v },
                })
              }
            />
            <Field
              label="Keywords"
              value={(form.defaultSeo.keywords ?? []).join(', ')}
              onChange={(v) =>
                setForm({
                  ...form,
                  defaultSeo: {
                    ...form.defaultSeo,
                    keywords: v
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
            <Field
              label="OG image URL"
              value={form.defaultSeo.ogImage ?? ''}
              onChange={(v) =>
                setForm({
                  ...form,
                  defaultSeo: { ...form.defaultSeo, ogImage: v },
                })
              }
            />
            <Field
              label="Canonical path"
              value={form.defaultSeo.canonicalPath ?? ''}
              onChange={(v) =>
                setForm({
                  ...form,
                  defaultSeo: { ...form.defaultSeo, canonicalPath: v },
                })
              }
            />
          </Section>
        ) : null}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-[#0D2745]">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[#0D2745]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 outline-none focus:border-[#173B6C]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[#0D2745]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 outline-none focus:border-[#173B6C]"
      />
    </label>
  );
}
