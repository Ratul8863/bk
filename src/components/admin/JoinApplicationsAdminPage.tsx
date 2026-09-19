'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCms } from '@/components/admin/CmsProvider';
import { reviewJoinApplication } from '@/lib/cms/client-ops';
import { formatDateShort, humanizeLabel } from '@/lib/utils';

export function JoinApplicationsAdminPage() {
  const { database, ready, refresh } = useCms();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending',
  );
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!database) return [];
    return [...database.joinApplications]
      .filter((row) => filter === 'all' || row.status === filter)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [database, filter]);

  if (!ready || !database) {
    return <p className="text-sm text-[#5B6B7C]">Loading…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0B1F36]">
            Join applications
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#5B6B7C]">
            Full applications from /join. Approving creates a draft team record
            and sends an invite so they can create an account.
          </p>
          <Link
            href="/admin/join-form"
            className="mt-3 inline-flex text-sm font-medium text-[#173B6C] hover:underline"
          >
            Edit application form fields →
          </Link>
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as typeof filter)
          }
          className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {error ? (
        <p className="rounded-xl border border-[#F0D4D4] bg-[#FFF8F8] px-3 py-2 text-sm text-[#8A3B3B]">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-10 text-center text-sm text-[#5B6B7C]">
            No applications in this filter.
          </p>
        ) : (
          rows.map((app) => (
            <article
              key={app.id}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(11,31,54,0.04)] sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0B1F36]">{app.name}</p>
                  <p className="mt-0.5 text-xs text-[#5B6B7C]">
                    {app.email}
                    {app.phone ? ` · ${app.phone}` : ''} ·{' '}
                    {formatDateShort(app.createdAt)} · {app.status}
                  </p>
                  <p className="mt-2 text-sm text-[#173B6C]">
                    Applying for:{' '}
                    <span className="font-medium">
                      {app.interestTrack
                        ? humanizeLabel(app.interestTrack)
                        : 'Research team'}
                    </span>
                    {app.currentRole ? ` · ${app.currentRole}` : ''}
                  </p>
                  {app.answers && Object.keys(app.answers).length ? (
                    <dl className="mt-3 grid gap-1.5 text-xs text-[#5B6B7C] sm:grid-cols-2">
                      {Object.entries(app.answers)
                        .filter(
                          ([key]) =>
                            ![
                              'name',
                              'email',
                              'message',
                              'interestTrack',
                            ].includes(key),
                        )
                        .slice(0, 8)
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt className="font-medium text-[#0B1F36]">
                              {humanizeLabel(key)}
                            </dt>
                            <dd className="mt-0.5 break-words">
                              {String(value)}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  ) : null}
                </div>
                {app.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        void (async () => {
                          const result = await reviewJoinApplication(
                            app.id,
                            'approved',
                          );
                          if ('error' in result) setError(result.error);
                          await refresh();
                        })();
                      }}
                      className="rounded-xl bg-[#0B1F36] px-3 py-2 text-xs font-semibold text-white"
                    >
                      Approve & invite
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        void (async () => {
                          const result = await reviewJoinApplication(
                            app.id,
                            'rejected',
                          );
                          if ('error' in result) setError(result.error);
                          await refresh();
                        })();
                      }}
                      className="rounded-xl border border-[#F0D4D4] bg-[#FFF8F8] px-3 py-2 text-xs font-semibold text-[#8A3B3B]"
                    >
                      Reject
                    </button>
                  </div>
                ) : app.personId ? (
                  <Link
                    href={`/admin/people/${app.personId}`}
                    className="text-xs font-semibold text-[#173B6C] hover:underline"
                  >
                    Open person
                  </Link>
                ) : null}
              </div>

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {app.affiliation ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[#7A90A8]">
                      Affiliation
                    </dt>
                    <dd className="text-[#0B1F36]">{app.affiliation}</dd>
                  </div>
                ) : null}
                {app.city ? (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[#7A90A8]">
                      Location
                    </dt>
                    <dd className="text-[#0B1F36]">{app.city}</dd>
                  </div>
                ) : null}
                {app.researchInterests ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide text-[#7A90A8]">
                      Research interests
                    </dt>
                    <dd className="text-[#0B1F36]">{app.researchInterests}</dd>
                  </div>
                ) : null}
                {app.portfolioUrl ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide text-[#7A90A8]">
                      Portfolio / CV
                    </dt>
                    <dd>
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-[#173B6C] underline"
                      >
                        {app.portfolioUrl}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#17212B]">
                {app.message}
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
