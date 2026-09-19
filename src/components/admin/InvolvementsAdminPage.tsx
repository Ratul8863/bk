'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/components/admin/CmsProvider';
import {
  PERSON_LINK_ROLE_OPTIONS,
  PERSON_LINK_TYPE_LABEL,
  getEntitiesForPicker,
  humanizeLinkRole,
  resolveEntityMeta,
} from '@/lib/content/person-links';
import {
  addPersonContentLink,
  removePersonContentLink,
} from '@/lib/cms/client-ops';
import type { PersonLinkEntityType } from '@/types/content';

const TYPES: PersonLinkEntityType[] = [
  'event',
  'research',
  'publication',
  'activity',
];

export function InvolvementsAdminPage() {
  const { database, ready, refresh } = useCms();
  const [personId, setPersonId] = useState('');
  const [entityType, setEntityType] = useState<PersonLinkEntityType>('event');
  const [entityId, setEntityId] = useState('');
  const [role, setRole] = useState('speaker');
  const [error, setError] = useState<string | null>(null);

  const people = database?.people ?? [];
  const entities = useMemo(
    () => (database ? getEntitiesForPicker(database, entityType) : []),
    [database, entityType],
  );

  const rows = useMemo(() => {
    if (!database) return [];
    return [...database.personContentLinks]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map((link) => {
        const person = people.find((p) => p.id === link.personId);
        const meta = resolveEntityMeta(database, link.entityType, link.entityId);
        return {
          ...link,
          personName: person?.name ?? 'Unknown person',
          personHref: person ? `/people/${person.slug}` : null,
          entityTitle: meta?.title ?? link.entityId,
          entityHref: meta?.href ?? null,
        };
      });
  }, [database, people]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
          People involvements
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[#68727D]">
          Link roster people to events, research, publications, or activities.
          Links show on both the content page and the person profile. You can
          also attach people from each content editor (Relations tab).
        </p>
      </div>

      <form
        className="grid gap-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (!personId || !entityId) {
            setError('Select a person and a content item.');
            return;
          }
          void (async () => {
            const result = await addPersonContentLink({
              personId,
              entityType,
              entityId,
              role,
            });
            if ('error' in result) {
              setError(result.error);
              return;
            }
            await refresh();
          })();
        }}
      >
        <label className="block text-xs font-medium text-[#0D2745]">
          Person
          <select
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
          >
            <option value="">Select…</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-[#0D2745]">
          Type
          <select
            value={entityType}
            onChange={(e) => {
              const next = e.target.value as PersonLinkEntityType;
              setEntityType(next);
              setEntityId('');
              setRole(PERSON_LINK_ROLE_OPTIONS[next][0]?.value ?? 'contributor');
            }}
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
          >
            {TYPES.map((type) => (
              <option key={type} value={type}>
                {PERSON_LINK_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-[#0D2745]">
          Content
          <select
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
          >
            <option value="">Select…</option>
            {entities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-[#0D2745]">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
          >
            {PERSON_LINK_ROLE_OPTIONS[entityType].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
          >
            <Plus className="h-4 w-4" />
            Add link
          </button>
        </div>
        {error ? (
          <p className="sm:col-span-2 lg:col-span-5 text-xs text-[#8A3B3B]">
            {error}
          </p>
        ) : null}
      </form>

      <div className="overflow-hidden border border-[#D9DEE5] bg-[#F8F7F3]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#D9DEE5] bg-[#F6F4EE] text-xs uppercase tracking-wide text-[#68727D]">
            <tr>
              <th className="px-4 py-3 font-semibold">Person</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Content</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[#68727D]">
                  No involvements yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E8ECE8] last:border-0"
                >
                  <td className="px-4 py-3">
                    {row.personHref ? (
                      <Link
                        href={row.personHref}
                        className="font-medium text-[#0D2745] hover:text-[#173B6C]"
                      >
                        {row.personName}
                      </Link>
                    ) : (
                      row.personName
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#68727D]">
                    {PERSON_LINK_TYPE_LABEL[row.entityType]}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3">
                    {row.entityHref ? (
                      <Link
                        href={row.entityHref}
                        className="text-[#173B6C] hover:underline"
                      >
                        {row.entityTitle}
                      </Link>
                    ) : (
                      row.entityTitle
                    )}
                  </td>
                  <td className="px-4 py-3">{humanizeLinkRole(row.role)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      title="Delete link"
                      onClick={() => {
                        void (async () => {
                          await removePersonContentLink(row.id);
                          await refresh();
                        })();
                      }}
                      className="rounded-md p-1.5 text-[#68727D] hover:bg-[#FFF8F8] hover:text-[#8A3B3B]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
