'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/components/admin/CmsProvider';
import {
  deleteRoleAssignment,
  syncPersonRoleSnapshot,
  upsertRoleAssignment,
} from '@/lib/cms/client-ops';

export function RoleHistoryAdminPage() {
  const { database, ready, refresh } = useCms();
  const [personId, setPersonId] = useState('');
  const [role, setRole] = useState('');
  const [year, setYear] = useState('2025-2026');
  const [yearFilter, setYearFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const people = database?.people ?? [];
  const years = useMemo(() => {
    if (!database) return [];
    return Array.from(
      new Set(database.roleAssignments.map((row) => row.year)),
    ).sort((a, b) => b.localeCompare(a));
  }, [database]);

  const rows = useMemo(() => {
    if (!database) return [];
    return [...database.roleAssignments]
      .filter((row) => !yearFilter || row.year === yearFilter)
      .sort(
        (a, b) =>
          b.year.localeCompare(a.year) || (a.order ?? 0) - (b.order ?? 0),
      )
      .map((row) => ({
        ...row,
        personName:
          people.find((p) => p.id === row.personId)?.name ?? 'Unknown',
        personHref: people.find((p) => p.id === row.personId)
          ? `/people/${people.find((p) => p.id === row.personId)!.slug}`
          : null,
      }));
  }, [database, people, yearFilter]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
          Role history
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[#68727D]">
          Year-based appointments (BKSR-adapted committee history). Old seasons
          stay as history; add a new year row for promotions. Members cannot edit
          these.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (!personId || !role.trim() || !year.trim()) {
            setError('Person, role, and year are required.');
            return;
          }
          try {
            void (async () => {
              await upsertRoleAssignment({ personId, role, year });
              await refresh();
              setRole('');
            })();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save.');
          }
        }}
      >
        <label className="block text-xs font-medium text-[#0D2745]">
          Person
          <select
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
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
          Role
          <input
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Executive Director"
          />
        </label>
        <label className="block text-xs font-medium text-[#0D2745]">
          Year / season
          <input
            className="mt-1 w-full rounded-lg border border-[#D9DEE5] bg-white px-2 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2025-2026"
          />
        </label>
        <div className="flex items-end gap-2 lg:col-span-2">
          <button
            type="submit"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white hover:bg-[#0D2745]"
          >
            <Plus className="h-4 w-4" />
            Add assignment
          </button>
          <button
            type="button"
            disabled={!personId}
            onClick={() => {
              if (!personId) return;
              void (async () => {
                await syncPersonRoleSnapshot(personId);
                await refresh();
              })();
            }}
            className="rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-xs font-medium text-[#173B6C] disabled:opacity-40"
            title="Create history row from Person role + appointment year"
          >
            Sync snapshot
          </button>
        </div>
        {error ? (
          <p className="text-xs text-[#8A3B3B] sm:col-span-2 lg:col-span-5">
            {error}
          </p>
        ) : null}
      </form>

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-[#68727D]">
          Filter year
          <select
            className="ml-2 rounded-lg border border-[#D9DEE5] bg-white px-2 py-1.5 text-sm"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All seasons</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden border border-[#D9DEE5] bg-[#F8F7F3]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#D9DEE5] bg-[#F6F4EE] text-xs uppercase tracking-wide text-[#68727D]">
            <tr>
              <th className="px-4 py-3 font-semibold">Year</th>
              <th className="px-4 py-3 font-semibold">Person</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[#68727D]">
                  No role assignments yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#E8ECE8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0D2745]">
                    {row.year}
                  </td>
                  <td className="px-4 py-3">
                    {row.personHref ? (
                      <Link
                        href={row.personHref}
                        className="text-[#173B6C] hover:underline"
                      >
                        {row.personName}
                      </Link>
                    ) : (
                      row.personName
                    )}
                  </td>
                  <td className="px-4 py-3">{row.role}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await deleteRoleAssignment(row.id);
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
