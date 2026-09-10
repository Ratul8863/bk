'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ContentStatus } from '@/types/content';
import { ConfirmDialog } from './ConfirmDialog';
import { EditorTabs, type EditorTabId } from './EditorTabs';
import { FieldRenderer } from './FormFields';
import { PublishPanel } from './PublishPanel';
import { useCms } from './CmsProvider';
import {
  collectionConfigs,
  type AdminCollectionSlug,
} from './collections';
import { isReservedPeopleSlug } from '@/lib/content/people-slugs';

export function CollectionEditorPage({
  collectionSlug,
  mode,
  id,
}: {
  collectionSlug: AdminCollectionSlug;
  mode: 'new' | 'edit';
  id?: string;
}) {
  const config = collectionConfigs[collectionSlug];
  const router = useRouter();
  const { database, ready, createItem, updateItem, deleteItem } = useCms();
  const [tab, setTab] = useState<EditorTabId>('content');
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const existing = useMemo(() => {
    if (!database || mode !== 'edit' || !id) return null;
    const list = database[config.key] as unknown as Record<string, unknown>[];
    return list.find((item) => item.id === id) ?? null;
  }, [database, config.key, mode, id]);

  useEffect(() => {
    if (!ready) return;
    if (mode === 'new') {
      setValues(config.defaults());
      return;
    }
    if (existing) {
      setValues({ ...existing });
    }
  }, [ready, mode, existing, config]);

  const availableTabs = useMemo(() => {
    const tabs = new Set<EditorTabId>();
    for (const field of config.fields) {
      tabs.add(field.tab ?? 'content');
    }
    return Array.from(tabs);
  }, [config.fields]);

  if (!ready || !values) {
    return <p className="text-sm text-[#68727D]">Loading editor…</p>;
  }

  if (mode === 'edit' && !existing) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-[#8A3B3B]">Item not found.</p>
        <Link href={`/admin/${config.slug}`} className="text-sm text-[#173B6C]">
          Back to {config.plural}
        </Link>
      </div>
    );
  }

  const autoSlugFrom = config.fields.some((f) => f.name === 'name')
    ? 'name'
    : 'title';

  const visibleFields = config.fields.filter(
    (field) => (field.tab ?? 'content') === tab,
  );

  const previewHref =
    config.previewPath?.(
      values as {
        slug?: string;
        status?: ContentStatus;
        researchStatus?: string;
      },
    ) ?? null;

  const save = (statusOverride?: ContentStatus) => {
    setSaving(true);
    const payload = {
      ...values,
      ...(statusOverride ? { status: statusOverride } : {}),
    } as Record<string, unknown>;

    if (statusOverride === 'published' && !payload.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }

    if (
      collectionSlug === 'people' &&
      typeof payload.slug === 'string' &&
      isReservedPeopleSlug(payload.slug)
    ) {
      setSaving(false);
      setMessage(
        'That URL slug is reserved for a People category page. Choose another slug.',
      );
      window.setTimeout(() => setMessage(null), 4000);
      return;
    }

    try {
      if (mode === 'new') {
        const created = createItem(config.key, payload as never);
        setMessage('Created');
        router.replace(`/admin/${config.slug}/${created.id}`);
      } else if (id) {
        updateItem(config.key, id, payload as never);
        setValues({ ...payload, id, updatedAt: new Date().toISOString() });
        setMessage('Saved');
      }
    } finally {
      setSaving(false);
      window.setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admin/${config.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#68727D] hover:text-[#0D2745]"
        >
          <ArrowLeft className="h-4 w-4" />
          {config.plural}
        </Link>
        {message ? (
          <span className="rounded-md bg-[#E4F0EB] px-2 py-1 text-xs font-medium text-[#173B6C]">
            {message}
          </span>
        ) : null}
      </div>

      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
          {mode === 'new'
            ? config.addLabel
            : `Edit ${config.singular}`}
        </h1>
        <p className="mt-1 text-sm text-[#68727D]">
          {config.getTitle(values)}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:p-5">
          <EditorTabs
            active={tab}
            onChange={setTab}
            available={availableTabs}
          />
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            {visibleFields.map((field) => (
              <div
                key={field.name}
                className={
                  field.type === 'body' ||
                  field.type === 'textarea' ||
                  field.name === 'title' ||
                  field.name === 'name' ||
                  field.name === 'citation' ||
                  field.name.startsWith('seo.')
                    ? 'sm:col-span-2'
                    : undefined
                }
              >
                <FieldRenderer
                  field={field}
                  values={values}
                  onChange={setValues}
                  autoSlugFrom={autoSlugFrom}
                />
              </div>
            ))}
            {visibleFields.length === 0 ? (
              <p className="sm:col-span-2 text-sm text-[#68727D]">
                No fields on this tab.
              </p>
            ) : null}
          </div>
        </div>

        <PublishPanel
          status={String(values.status ?? 'draft')}
          updatedAt={
            typeof values.updatedAt === 'string' ? values.updatedAt : undefined
          }
          createdAt={
            typeof values.createdAt === 'string' ? values.createdAt : undefined
          }
          previewHref={previewHref}
          saving={saving}
          onStatusChange={(status) => setValues((v) => ({ ...v!, status }))}
          onSave={(statusOverride) => save(statusOverride)}
          onDelete={mode === 'edit' ? () => setConfirmDelete(true) : undefined}
        />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        description="This cannot be undone unless you reset demo data."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (id) {
            deleteItem(config.key, id);
            router.push(`/admin/${config.slug}`);
          }
        }}
      />
    </div>
  );
}
