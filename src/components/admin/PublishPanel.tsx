'use client';

import Link from 'next/link';
import { ExternalLink, Trash2 } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { ContentStatus } from '@/types/content';

export function PublishPanel({
  status,
  updatedAt,
  createdAt,
  previewHref,
  onStatusChange,
  onSave,
  onDelete,
  saving,
  singularLabel = 'item',
}: {
  status: ContentStatus | string;
  updatedAt?: string;
  createdAt?: string;
  previewHref?: string | null;
  onStatusChange: (status: ContentStatus) => void;
  onSave: (statusOverride?: ContentStatus) => void;
  onDelete?: () => void;
  saving?: boolean;
  singularLabel?: string;
}) {
  return (
    <aside className="space-y-4 rounded-2xl border border-[#D9DEE5] bg-white p-4 shadow-sm lg:sticky lg:top-20">
      <div>
        <h3 className="text-sm font-semibold text-[#0D2745]">
          Save &amp; publish
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-[#68727D]">
          Drafts stay private. Publish makes this {singularLabel.toLowerCase()}{' '}
          visible on the website.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-[#F8F7F3] px-3 py-2">
        <span className="text-sm text-[#68727D]">Now</span>
        <StatusBadge status={status} />
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            onStatusChange('published');
            onSave('published');
          }}
          className="rounded-xl bg-[#173B6C] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#0D2745] disabled:opacity-60"
        >
          {saving ? 'Working…' : 'Publish to website'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            onStatusChange('draft');
            onSave('draft');
          }}
          className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] px-3 py-2.5 text-sm font-medium text-[#0D2745] hover:bg-white disabled:opacity-60"
        >
          Save as draft
        </button>
        <button
          type="button"
          onClick={() => onSave()}
          disabled={saving}
          className="rounded-xl border border-[#173B6C]/25 bg-[#E4F0EB] px-3 py-2.5 text-sm font-medium text-[#173B6C] hover:bg-[#D5E8E1] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {previewHref ? (
        <Link
          href={previewHref}
          target="_blank"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9DEE5] px-3 py-2.5 text-sm font-medium text-[#0D2745] hover:bg-[#F6F4EE]"
        >
          <ExternalLink className="h-4 w-4" />
          Open on website
        </Link>
      ) : (
        <p className="text-xs text-[#9AA3A5]">
          Add a title (and URL name) to enable preview.
        </p>
      )}

      <div className="space-y-1 border-t border-[#D9DEE5] pt-3 text-xs text-[#68727D]">
        {updatedAt ? <p>Last saved {formatDateShort(updatedAt)}</p> : null}
        {createdAt ? <p>Created {formatDateShort(createdAt)}</p> : null}
      </div>

      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8C4C4] px-3 py-2.5 text-sm text-[#8A3B3B] hover:bg-[#FBF0F0]"
        >
          <Trash2 className="h-4 w-4" />
          Delete {singularLabel.toLowerCase()}
        </button>
      ) : null}
    </aside>
  );
}
