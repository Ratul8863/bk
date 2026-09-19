'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/components/admin/CmsProvider';
import {
  countEntriesForForm,
  formPurposeLabel,
  getEntityTitle,
  isSharedForm,
} from '@/lib/content/registration-forms';
import { deleteRegistrationForm } from '@/lib/cms/client-ops';

type Filter = 'all' | 'event' | 'vacancy' | 'join';

export function RegistrationFormsListPage() {
  const { database, ready, refresh } = useCms();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    if (!database) return [];
    return [...database.registrationForms]
      .filter((form) => {
        if (filter === 'all') return true;
        return form.entityType === filter;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((form) => ({
        form,
        entityTitle: getEntityTitle(database, form) ?? '—',
        purpose: formPurposeLabel(form),
        entries: countEntriesForForm(database, form.id),
        full:
          form.maxSubmissions != null &&
          form.maxSubmissions > 0 &&
          countEntriesForForm(database, form.id) >= form.maxSubmissions,
      }));
  }, [database, filter]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  const chips: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'event', label: 'Events' },
    { id: 'vacancy', label: 'Career' },
    { id: 'join', label: 'Join BKSR' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            Forms
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#68727D]">
            Build forms for events and Career vacancies — dedicated to one item,
            or shared and attached from Events / Notices. Sitewide Apply to join
            is also here (or under Join applications). Public path:{' '}
            <code className="text-[#0D2745]">/forms/[slug]</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/registration-forms/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173B6C] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
          >
            <Plus className="h-4 w-4" />
            Event form
          </Link>
          <Link
            href="/admin/registration-forms/new?type=vacancy"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#173B6C] px-3.5 py-2 text-sm font-medium text-[#173B6C] hover:bg-[#E4F0EB]"
          >
            <Plus className="h-4 w-4" />
            Career form
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={
              filter === chip.id
                ? 'rounded-full bg-[#173B6C] px-3 py-1 text-xs font-semibold text-white'
                : 'rounded-full border border-[#D9DEE5] bg-white px-3 py-1 text-xs font-medium text-[#68727D] hover:border-[#173B6C] hover:text-[#173B6C]'
            }
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden border border-[#D9DEE5] bg-[#F8F7F3]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#D9DEE5] bg-[#F6F4EE] text-xs uppercase tracking-wide text-[#68727D]">
            <tr>
              <th className="px-4 py-3 font-semibold">Form</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Linked to</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Entries</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[#68727D]"
                >
                  No forms in this view yet.
                </td>
              </tr>
            ) : (
              rows.map(({ form, entityTitle, purpose, entries, full }) => (
                <tr
                  key={form.id}
                  className="border-b border-[#E8ECE8] last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={
                        form.entityType === 'join'
                          ? '/admin/join-form'
                          : `/admin/registration-forms/${form.id}`
                      }
                      className="font-medium text-[#0D2745] hover:text-[#173B6C]"
                    >
                      {form.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#68727D]">
                      /forms/{form.slug}
                      {isSharedForm(form) ? ' · shared' : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#68727D]">{purpose}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-[#68727D]">
                    {entityTitle}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        form.isOpen && !full
                          ? 'inline-flex rounded-full bg-[#E4F0EB] px-2 py-0.5 text-xs font-medium text-[#173B6C]'
                          : 'inline-flex rounded-full bg-[#F6F0E4] px-2 py-0.5 text-xs font-medium text-[#8A6B2F]'
                      }
                    >
                      {!form.isOpen ? 'Closed' : full ? 'Full' : 'Open'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {entries}
                    {form.maxSubmissions
                      ? ` / ${form.maxSubmissions}`
                      : ''}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/registration-forms/${form.id}/entries`}
                        className="rounded-md px-2 py-1 text-xs font-medium text-[#173B6C] hover:bg-[#E4F0EB]"
                      >
                        Entries
                      </Link>
                      <Link
                        href={
                          form.entityType === 'join'
                            ? '/admin/join-form'
                            : `/admin/registration-forms/${form.id}`
                        }
                        className="rounded-md px-2 py-1 text-xs font-medium text-[#173B6C] hover:bg-[#E4F0EB]"
                      >
                        Edit
                      </Link>
                      {form.entityType !== 'join' ? (
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setDeleteId(form.id)}
                          className="rounded-md p-1.5 text-[#68727D] hover:bg-[#FBF0F0] hover:text-[#8A3B3B]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#D9DEE5] bg-white p-5 shadow-lg">
            <p className="font-medium text-[#0D2745]">Delete this form?</p>
            <p className="mt-2 text-sm text-[#68727D]">
              All entries for this form will also be removed. Events or vacancies
              that pointed at it will need a new form attached.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-[#D9DEE5] px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void (async () => {
                    await deleteRegistrationForm(deleteId);
                    await refresh();
                    setDeleteId(null);
                  })();
                }}
                className="rounded-lg bg-[#8A3B3B] px-3 py-1.5 text-sm text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
