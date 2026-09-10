'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import type { MediaAsset, MediaKind } from '@/types/content';
import { ConfirmDialog } from './ConfirmDialog';
import { StatusBadge } from './StatusBadge';
import { useCms } from './CmsProvider';

const PLACEHOLDER =
  'https://placehold.co/800x600/E7ECE7/1C6257?text=BKSR+Media';

export function MediaLibraryPage() {
  const { database, ready, createItem, updateItem, deleteItem } = useCms();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    url: PLACEHOLDER,
    alt: '',
    kind: 'image' as MediaKind,
  });

  const items = useMemo(() => {
    if (!database) return [];
    return database.media.filter((item) => {
      if (kind && item.kind !== kind) return false;
      if (!query.trim()) return true;
      const blob = [item.title, item.alt, item.url, item.credit]
        .join(' ')
        .toLowerCase();
      return blob.includes(query.trim().toLowerCase());
    });
  }, [database, query, kind]);

  const selected = items.find((i) => i.id === selectedId) ?? items[0] ?? null;

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading media…</p>;
  }

  const saveSelected = (patch: Partial<MediaAsset>) => {
    if (!selected) return;
    updateItem('media', selected.id, patch);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            Media Library
          </h1>
          <p className="mt-1 text-sm text-[#68727D]">
            Browse assets, edit titles and alt text, and add URLs. Ready for
            Cloudinary or S3 later.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#173B6C] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
        >
          <Plus className="h-4 w-4" />
          Add media
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3A5]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media…"
            className="w-full rounded-lg border border-[#D9DEE5] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#173B6C]"
          />
        </div>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="audio">Audio</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`overflow-hidden rounded-xl border text-left transition-colors ${
                selected?.id === item.id
                  ? 'border-[#173B6C] ring-2 ring-[#173B6C]/20'
                  : 'border-[#D9DEE5] hover:border-[#173B6C]/50'
              } bg-[#F8F7F3]`}
            >
              <div className="aspect-[4/3] bg-[#EAF0F6]">
                {item.kind === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt ?? item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-[#68727D]">
                    {item.kind}
                  </div>
                )}
              </div>
              <div className="space-y-1 p-2.5">
                <p className="truncate text-sm font-medium text-[#0D2745]">
                  {item.title}
                </p>
                <StatusBadge status={item.status} />
              </div>
            </button>
          ))}
          {items.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-[#68727D]">
              No media matches your filters.
            </p>
          ) : null}
        </div>

        <aside className="h-fit space-y-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4">
          {selected ? (
            <>
              <h2 className="text-sm font-semibold text-[#0D2745]">Details</h2>
              {selected.kind === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.url}
                  alt={selected.alt ?? selected.title}
                  className="w-full rounded-lg border border-[#D9DEE5] object-cover"
                />
              ) : null}
              <label className="block space-y-1 text-sm">
                <span className="font-medium">Title</span>
                <input
                  value={selected.title}
                  onChange={(e) => saveSelected({ title: e.target.value })}
                  className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium">Alt text</span>
                <input
                  value={selected.alt ?? ''}
                  onChange={(e) => saveSelected({ alt: e.target.value })}
                  className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium">Caption / credit</span>
                <input
                  value={selected.credit ?? ''}
                  onChange={(e) => saveSelected({ credit: e.target.value })}
                  className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="font-medium">URL</span>
                <input
                  value={selected.url}
                  onChange={(e) => saveSelected({ url: e.target.value })}
                  className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2 font-mono text-xs"
                />
              </label>
              <button
                type="button"
                onClick={() => setDeleteId(selected.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8C4C4] px-3 py-2 text-sm text-[#8A3B3B]"
              >
                <Trash2 className="h-4 w-4" />
                Delete asset
              </button>
            </>
          ) : (
            <p className="text-sm text-[#68727D]">Select an asset</p>
          )}
        </aside>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#0D2745]/40"
            onClick={() => setShowAdd(false)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md space-y-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-5 shadow-xl">
            <h2 className="font-[family-name:var(--font-admin-display)] text-lg text-[#0D2745]">
              Add media
            </h2>
            <p className="text-xs text-[#68727D]">
              Mock upload — paste a URL or use the placeholder asset. Swap this
              dialog for Cloudinary/S3 upload later.
            </p>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Title</span>
              <input
                value={addForm.title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, title: e.target.value }))
                }
                className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">URL</span>
              <input
                value={addForm.url}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, url: e.target.value }))
                }
                className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Alt</span>
              <input
                value={addForm.alt}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, alt: e.target.value }))
                }
                className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Type</span>
              <select
                value={addForm.kind}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    kind: e.target.value as MediaKind,
                  }))
                }
                className="w-full rounded-lg border border-[#D9DEE5] px-3 py-2"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="audio">Audio</option>
                <option value="other">Other</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-lg border border-[#D9DEE5] px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const created = createItem('media', {
                    title: addForm.title || 'Untitled asset',
                    url: addForm.url || PLACEHOLDER,
                    alt: addForm.alt,
                    kind: addForm.kind,
                    status: 'published',
                    source: 'manual-url',
                  });
                  setSelectedId(created.id);
                  setShowAdd(false);
                  setAddForm({
                    title: '',
                    url: PLACEHOLDER,
                    alt: '',
                    kind: 'image',
                  });
                }}
                className="rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white"
              >
                Add to library
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete media asset?"
        description="References in content will not be auto-cleaned in this demo."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteItem('media', deleteId);
            setSelectedId(null);
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
