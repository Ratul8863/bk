'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { NavigationItem } from '@/types/content';
import {
  AdminPageHeader,
  AdminPrimaryButton,
} from './AdminUI';
import { useCms } from './CmsProvider';

type NavTab = 'main' | 'footer' | 'knowledgeHub';

type FlatNavRow = {
  id: string;
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  visible: boolean;
  order: number;
  parentId: string | null;
};

function flattenNav(items: NavigationItem[]): FlatNavRow[] {
  const rows: FlatNavRow[] = [];
  for (const item of items) {
    rows.push({
      id: item.id,
      label: item.label,
      href: item.href,
      description: item.description,
      external: item.external,
      visible: item.visible !== false,
      order: item.order,
      parentId: null,
    });
    for (const child of item.children ?? []) {
      rows.push({
        id: child.id,
        label: child.label,
        href: child.href,
        description: child.description,
        external: child.external,
        visible: child.visible !== false,
        order: child.order,
        parentId: item.id,
      });
    }
  }
  return rows;
}

function nestNav(rows: FlatNavRow[]): NavigationItem[] {
  const tops = rows
    .filter((r) => !r.parentId || !rows.some((p) => p.id === r.parentId))
    .sort((a, b) => a.order - b.order);

  return tops.map((top, index) => {
    const children = rows
      .filter((r) => r.parentId === top.id)
      .sort((a, b) => a.order - b.order)
      .map((child, childIndex) => ({
        id: child.id,
        label: child.label,
        href: child.href,
        description: child.description,
        external: child.external,
        visible: child.visible,
        order: childIndex + 1,
      }));

    return {
      id: top.id,
      label: top.label,
      href: top.href,
      description: top.description,
      external: top.external,
      visible: top.visible,
      order: index + 1,
      ...(children.length ? { children } : {}),
    };
  });
}

export function NavigationEditorPage() {
  const { database, ready, saveNavigation } = useCms();
  const searchParams = useSearchParams();
  const initial = (searchParams.get('tab') as NavTab) || 'main';
  const [tab, setTab] = useState<NavTab>(
    initial === 'footer'
      ? 'footer'
      : initial === 'knowledgeHub'
        ? 'knowledgeHub'
        : 'main',
  );
  const [rows, setRows] = useState<FlatNavRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!database) return;
    setRows(flattenNav(structuredClone(database.navigation[tab])));
  }, [database, tab]);

  useEffect(() => {
    if (initial === 'footer') setTab('footer');
    else if (initial === 'knowledgeHub') setTab('knowledgeHub');
    else if (initial === 'main') setTab('main');
  }, [initial]);

  const parentOptions = useMemo(
    () => rows.filter((r) => !r.parentId),
    [rows],
  );

  if (!ready) {
    return <p className="text-sm text-[#68727D]">Loading navigation…</p>;
  }

  const save = async () => {
    await saveNavigation({ [tab]: nestNav(rows) });
    setMessage('Navigation saved');
    window.setTimeout(() => setMessage(null), 2000);
  };

  const updateRow = (index: number, patch: Partial<FlatNavRow>) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, ...patch };
        // Prevent nesting under self or under a child
        if (patch.parentId === row.id) next.parentId = null;
        return next;
      }),
    );
  };

  const addItem = () => {
    setRows((prev) => [
      ...prev,
      {
        id: uuidv4(),
        label: 'New item',
        href: '/',
        order: prev.length + 1,
        parentId: null,
        visible: true,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const id = rows[index]?.id;
    setRows((prev) =>
      prev
        .filter((row, i) => i !== index && row.parentId !== id)
        .map((row, i) => ({ ...row, order: i + 1 })),
    );
  };

  const move = (index: number, dir: -1 | 1) => {
    setRows((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[index];
      next[index] = next[target];
      next[target] = tmp;
      return next.map((item, i) => ({ ...item, order: i + 1 }));
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Site"
        title="Navigation"
        description="Edit main, footer, and knowledge hub menus — label, URL, order, parent, and visibility."
        action={
          <>
            {message ? (
              <span className="text-xs font-semibold text-[#173B6C]">
                {message}
              </span>
            ) : null}
            <AdminPrimaryButton onClick={() => void save()}>
              Save navigation
            </AdminPrimaryButton>
          </>
        }
      />

      <div className="flex flex-wrap gap-1 border-b border-[#E2E8F0]">
        {(
          [
            ['main', 'Main'],
            ['footer', 'Footer'],
            ['knowledgeHub', 'Knowledge hub'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${
              tab === id
                ? 'border-[#173B6C] text-[#173B6C]'
                : 'border-transparent text-[#68727D]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[#0D2745]">Label</span>
              <input
                value={item.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[#0D2745]">URL</span>
              <input
                value={item.href}
                onChange={(e) => updateRow(index, { href: e.target.value })}
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              />
            </label>
            <div className="flex items-end gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                className="rounded-lg border border-[#D9DEE5] px-2 py-2 text-xs"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                className="rounded-lg border border-[#D9DEE5] px-2 py-2 text-xs"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-[#E8C4C4] p-2 text-[#8A3B3B]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <label className="space-y-1 text-sm">
              <span className="font-medium text-[#0D2745]">Parent</span>
              <select
                value={item.parentId ?? ''}
                onChange={(e) =>
                  updateRow(index, {
                    parentId: e.target.value || null,
                  })
                }
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              >
                <option value="">Top level</option>
                {parentOptions
                  .filter((p) => p.id !== item.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
              </select>
            </label>
            <label className="space-y-1 text-sm sm:col-span-1">
              <span className="font-medium text-[#0D2745]">Description</span>
              <input
                value={item.description ?? ''}
                onChange={(e) =>
                  updateRow(index, { description: e.target.value })
                }
                className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2"
              />
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(item.external)}
                  onChange={(e) =>
                    updateRow(index, { external: e.target.checked })
                  }
                />
                External link
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) =>
                    updateRow(index, { visible: e.target.checked })
                  }
                />
                Visible on site
              </label>
              {item.parentId ? (
                <span className="text-xs text-[#68727D]">Child item</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#C5DCD4] px-3 py-2 text-sm text-[#173B6C] hover:bg-[#E4F0EB]"
      >
        <Plus className="h-4 w-4" />
        Add menu item
      </button>
    </div>
  );
}
