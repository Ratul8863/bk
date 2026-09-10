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
}: {
  status: ContentStatus | string;
  updatedAt?: string;
  createdAt?: string;
  previewHref?: string | null;
  onStatusChange: (status: ContentStatus) => void;
  onSave: (statusOverride?: ContentStatus) => void;
  onDelete?: () => void;
  saving?: boolean;
}) {
  return (
    <aside className="space-y-4 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4">
      <div>
        <h3 className="text-sm font-semibold text-[#0D2745]">Publish</h3>
        <p className="mt-1 text-xs text-[#68727D]">
          Save changes and control visibility on the public site.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-[#68727D]">Status</span>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            onStatusChange('draft');
            onSave('draft');
          }}
          className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm text-[#0D2745] hover:bg-[#F6F4EE]"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => {
            onStatusChange('published');
            onSave('published');
          }}
          className="rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
        >
          Publish
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSave()}
        disabled={saving}
        className="w-full rounded-lg border border-[#173B6C]/30 bg-[#E4F0EB] px-3 py-2 text-sm font-medium text-[#173B6C] hover:bg-[#D5E8E1] disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>

      {previewHref ? (
        <Link
          href={previewHref}
          target="_blank"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9DEE5] px-3 py-2 text-sm text-[#0D2745] hover:bg-[#F6F4EE]"
        >
          <ExternalLink className="h-4 w-4" />
          Preview
        </Link>
      ) : null}

      <div className="space-y-1 border-t border-[#D9DEE5] pt-3 text-xs text-[#68727D]">
        {updatedAt ? <p>Updated {formatDateShort(updatedAt)}</p> : null}
        {createdAt ? <p>Created {formatDateShort(createdAt)}</p> : null}
      </div>

      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8C4C4] px-3 py-2 text-sm text-[#8A3B3B] hover:bg-[#FBF0F0]"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      ) : null}
    </aside>
  );
}
