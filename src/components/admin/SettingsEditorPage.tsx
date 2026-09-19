'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { SiteSettings } from '@/types/content';
import {
  AdminPageHeader,
  AdminPanel,
  AdminPrimaryButton,
} from './AdminUI';
import { useCms } from './CmsProvider';

type SettingsMode = 'all' | 'contact' | 'social';

export function SettingsEditorPage({
  mode = 'all',
  title = 'Organisation profile',
  description = 'Organisation name, mission, vision, and contact details shown on the public site.',
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
    return <p className="text-sm text-[#5B6B7C]">Loading settings…</p>;
  }

  const save = async () => {
    await saveSiteSettings(form);
    setMessage('Settings saved');
    window.setTimeout(() => setMessage(null), 2000);
  };

  const showOrg = mode === 'all';
  const showContact = mode === 'all' || mode === 'contact';
  const showSocial = mode === 'all' || mode === 'social';

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Organisation"
        title={title}
        description={description}
        action={
          <>
            {message ? (
              <span className="text-xs font-semibold text-[#173B6C]">
                {message}
              </span>
            ) : null}
            <AdminPrimaryButton onClick={() => void save()}>
              Save settings
            </AdminPrimaryButton>
          </>
        }
      />

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
    <AdminPanel className="space-y-3 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-[#0B1F36]">{title}</h2>
      <div className="grid gap-3">{children}</div>
    </AdminPanel>
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
      <span className="font-medium text-[#0B1F36]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 outline-none focus:border-[#0B1F36] focus:bg-white"
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
      <span className="font-medium text-[#0B1F36]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 outline-none focus:border-[#0B1F36] focus:bg-white"
      />
    </label>
  );
}
