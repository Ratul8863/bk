'use client';

import { useState } from 'react';
import { contentRepository } from '@/lib/cms/repository';
import { ConfirmDialog } from './ConfirmDialog';
import { useCms } from './CmsProvider';

export function SystemPage() {
  const { resetDemoData, ready, database } = useCms();
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!ready) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
          CMS Settings
        </h1>
        <p className="mt-1 text-sm text-[#68727D]">
          Demo persistence and reset controls. No authentication is enforced —
          this is a layout-only editor experience.
        </p>
      </div>

      <section className="max-w-2xl space-y-4 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-5">
        <h2 className="text-sm font-semibold text-[#0D2745]">Persistence</h2>
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#68727D]">Storage key</dt>
            <dd className="font-mono text-xs text-[#0D2745]">
              {contentRepository.STORAGE_KEY}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#68727D]">Schema version</dt>
            <dd className="text-[#0D2745]">{database?.version ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#68727D]">Backend</dt>
            <dd className="text-[#0D2745]">Browser localStorage (demo)</dd>
          </div>
        </dl>
        <p className="text-xs text-[#68727D]">
          All admin writes go through <code>contentRepository</code>. Replace
          that adapter with MongoDB API calls when the backend ships — see{' '}
          <code>docs/backend-integration-plan.md</code>.
        </p>
      </section>

      <section className="max-w-2xl space-y-3 rounded-xl border border-[#E8C4C4] bg-[#F8F7F3] p-5">
        <h2 className="text-sm font-semibold text-[#8A3B3B]">Reset demo data</h2>
        <p className="text-sm text-[#68727D]">
          Clears local overrides and restores the seed database shipped with the
          site.
        </p>
        {message ? (
          <p className="text-sm font-medium text-[#173B6C]">{message}</p>
        ) : null}
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="rounded-lg border border-[#E8C4C4] bg-white px-3.5 py-2 text-sm font-medium text-[#8A3B3B] hover:bg-[#FBF0F0]"
        >
          Reset to seed data
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all CMS changes?"
        description="This removes localStorage overrides for BKSR content. Seed content will load again."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          setConfirmReset(false);
          setMessage('Demo data restored');
          window.setTimeout(() => setMessage(null), 2500);
        }}
      />
    </div>
  );
}
