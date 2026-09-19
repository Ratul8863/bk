'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useCms } from '@/components/admin/CmsProvider';
import {
  getEntriesForForm,
  getFormById,
} from '@/lib/content/registration-forms';
import {
  deleteRegistrationEntry,
  updateEntryStatus,
} from '@/lib/cms/client-ops';
import type { RegistrationEntryStatus } from '@/types/content';
import { formatDateShort } from '@/lib/utils';

export function RegistrationEntriesInboxPage({ formId }: { formId: string }) {
  const { database, ready, refresh } = useCms();
  const [filter, setFilter] = useState<RegistrationEntryStatus | 'all'>('all');

  const form = useMemo(
    () => (database ? getFormById(database, formId) : undefined),
    [database, formId],
  );

  const entries = useMemo(() => {
    if (!database) return [];
    let list = getEntriesForForm(database, formId);
    if (filter !== 'all') {
      list = list.filter((entry) => entry.status === filter);
    }
    return list;
  }, [database, formId, filter]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  if (!form) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#8A3B3B]">Form not found.</p>
        <Link href="/admin/registration-forms" className="text-sm text-[#173B6C]">
          Back to forms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/registration-forms/${form.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#68727D] hover:text-[#0D2745]"
        >
          <ArrowLeft className="h-4 w-4" />
          {form.title}
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            Entries
          </h1>
          <p className="mt-1 text-sm text-[#68727D]">
            {entries.length} shown
            {form.requiresApproval
              ? ' · approval workflow enabled'
              : ''}
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as RegistrationEntryStatus | 'all')
          }
          className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] px-4 py-10 text-center text-sm text-[#68727D]">
            No entries yet. Share /forms/{form.slug} when the form is open.
          </p>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#0D2745]">
                    {String(entry.data.name ?? entry.email ?? 'Untitled entry')}
                  </p>
                  <p className="mt-0.5 text-xs text-[#68727D]">
                    {formatDateShort(entry.createdAt)} · {entry.status}
                    {entry.email ? ` · ${entry.email}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {form.requiresApproval ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          void (async () => {
                            await updateEntryStatus(entry.id, 'approved');
                            await refresh();
                          })();
                        }}
                        className="rounded-md bg-[#EEF2F6] px-2 py-1 text-xs font-medium text-[#173B6C]"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void (async () => {
                            await updateEntryStatus(entry.id, 'rejected');
                            await refresh();
                          })();
                        }}
                        className="rounded-md bg-[#FFF8F8] px-2 py-1 text-xs font-medium text-[#8A3B3B]"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => {
                      void (async () => {
                        await deleteRegistrationEntry(entry.id);
                        await refresh();
                      })();
                    }}
                    className="rounded-md p-1.5 text-[#68727D] hover:bg-[#FFF8F8] hover:text-[#8A3B3B]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {Object.entries(entry.data).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-white px-3 py-2">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#68727D]">
                      {key}
                    </dt>
                    <dd className="mt-0.5 text-sm text-[#0D2745]">
                      {typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
