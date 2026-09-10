'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Copy, Plus, Search, Trash2 } from 'lucide-react';
import { formatDateShort, humanizeLabel } from '@/lib/utils';
import { ConfirmDialog } from './ConfirmDialog';
import { StatusBadge } from './StatusBadge';
import { useCms } from './CmsProvider';
import {
  collectionConfigs,
  type AdminCollectionSlug,
} from './collections';

export function CollectionListPage({
  collectionSlug,
}: {
  collectionSlug: AdminCollectionSlug;
}) {
  const config = collectionConfigs[collectionSlug];
  const router = useRouter();
  const { database, ready, deleteItem, duplicateItem } = useCms();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const items = useMemo(() => {
    if (!database) return [];
    const list = database[config.key] as unknown as Record<string, unknown>[];
    return list.filter((item) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (String(item[key] ?? '') !== value) return false;
      }
      if (!query.trim()) return true;
      const blob = config.searchFields
        .map((field) => {
          const v = item[field];
          return Array.isArray(v) ? v.join(' ') : String(v ?? '');
        })
        .join(' ')
        .toLowerCase();
      return blob.includes(query.trim().toLowerCase());
    });
  }, [database, config, query, filters]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading content…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
            {config.plural}
          </h1>
          <p className="mt-1 text-sm text-[#68727D]">
            {items.length} item{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href={`/admin/${config.slug}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#173B6C] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
        >
          <Plus className="h-4 w-4" />
          {config.addLabel}
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA3A5]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            className="w-full rounded-lg border border-[#D9DEE5] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/15"
          />
        </div>
        {config.filters?.map((filter) => (
          <select
            key={filter.name}
            value={filters[filter.name] ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [filter.name]: e.target.value }))
            }
            className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm outline-none focus:border-[#173B6C]"
          >
            <option value="">All {filter.label.toLowerCase()}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      <div className="overflow-hidden border border-[#D9DEE5] bg-[#F8F7F3]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[#D9DEE5] bg-[#F6F4EE] text-xs uppercase tracking-wide text-[#68727D]">
              <tr>
                {config.listColumns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-semibold">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.listColumns.length + 1}
                    className="px-4 py-10 text-center text-[#68727D]"
                  >
                    No items match your filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const id = String(item.id);
                  return (
                    <tr
                      key={id}
                      className="border-b border-[#E8ECE8] last:border-0 hover:bg-[#FBF9F4]"
                    >
                      {config.listColumns.map((col) => {
                        const value = item[col.key];
                        let cell: ReactNode = String(value ?? '—');
                        if (col.render === 'status') {
                          cell = <StatusBadge status={String(value ?? 'draft')} />;
                        } else if (col.render === 'date' && value) {
                          cell = formatDateShort(String(value));
                        } else if (typeof value === 'boolean') {
                          cell = value ? 'Yes' : 'No';
                        } else if (
                          typeof value === 'string' &&
                          (col.key === 'type' ||
                            col.key === 'researchStatus' ||
                            col.key === 'category' ||
                            col.key === 'eventStatus' ||
                            col.key === 'noticeType')
                        ) {
                          cell = humanizeLabel(value);
                        } else if (col.key === 'title' || col.key === 'name') {
                          cell = (
                            <Link
                              href={`/admin/${config.slug}/${id}`}
                              className="font-medium text-[#0D2745] hover:text-[#173B6C]"
                            >
                              {config.getTitle(item)}
                            </Link>
                          );
                        }
                        return (
                          <td key={col.key} className="max-w-xs truncate px-4 py-3">
                            {cell}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/${config.slug}/${id}`}
                            className="rounded-md px-2 py-1 text-xs font-medium text-[#173B6C] hover:bg-[#E4F0EB]"
                          >
                            Edit
                          </Link>
                          {config.canDuplicate ? (
                            <button
                              type="button"
                              title="Duplicate"
                              onClick={() => {
                                const copy = duplicateItem(config.key, id);
                                if (copy) {
                                  router.push(`/admin/${config.slug}/${copy.id}`);
                                }
                              }}
                              className="rounded-md p-1.5 text-[#68727D] hover:bg-[#F6F4EE] hover:text-[#0D2745]"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => setDeleteId(id)}
                            className="rounded-md p-1.5 text-[#68727D] hover:bg-[#FBF0F0] hover:text-[#8A3B3B]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={`Delete ${config.singular.toLowerCase()}?`}
        description="This removes the item from the demo CMS stored in this browser. You can restore seed data from System settings."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteItem(config.key, deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
