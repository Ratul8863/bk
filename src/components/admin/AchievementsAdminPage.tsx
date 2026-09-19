'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { useCms } from '@/components/admin/CmsProvider';
import {
  assignAchievement,
  deleteAchievementAssignment,
  saveAchievement,
} from '@/lib/cms/client-ops';

export function AchievementsAdminPage() {
  const { database, ready, refresh } = useCms();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [achievementId, setAchievementId] = useState('');
  const [personId, setPersonId] = useState('');
  const [withCert, setWithCert] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const achievements = database?.achievements ?? [];
  const people = database?.people ?? [];

  const assignments = useMemo(() => {
    if (!database) return [];
    return [...database.achievementAssignments]
      .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt))
      .map((row) => ({
        ...row,
        achievementTitle:
          achievements.find((a) => a.id === row.achievementId)?.title ??
          'Unknown',
        personName:
          people.find((p) => p.id === row.personId)?.name ?? 'Unknown',
        personHref: people.find((p) => p.id === row.personId)
          ? `/people/${people.find((p) => p.id === row.personId)!.slug}`
          : null,
      }));
  }, [database, achievements, people]);

  if (!ready || !database) {
    return <p className="text-sm text-[#68727D]">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0B1F36]">
          Achievements
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-[#5B6B7C]">
          Create achievement types, then assign them to people. Optional
          certificate codes verify at /verify (BKSR-#####C).
        </p>
      </div>

      {error ? (
        <p className="rounded-xl border border-[#F0D4D4] bg-[#FFF8F8] px-3 py-2 text-sm text-[#8A3B3B]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(11,31,54,0.04)]"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!title.trim()) {
              setError('Achievement title is required.');
              return;
            }
            void (async () => {
              await saveAchievement({
                title: title.trim(),
                description: description.trim() || undefined,
                slug: '',
                status: 'published',
              });
              setTitle('');
              setDescription('');
              await refresh();
            })().catch((err) =>
              setError(err instanceof Error ? err.message : 'Save failed'),
            );
          }}
        >
          <p className="text-sm font-medium text-[#0D2745]">New achievement type</p>
          <input
            className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
            rows={3}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
          <ul className="mt-3 space-y-1 text-sm text-[#68727D]">
            {achievements.map((item) => (
              <li key={item.id}>• {item.title}</li>
            ))}
          </ul>
        </form>

        <form
          className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(11,31,54,0.04)]"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (!achievementId || !personId) {
              setError('Select achievement and person.');
              return;
            }
            void (async () => {
              await assignAchievement({
                achievementId,
                personId,
                withCertificate: withCert,
              });
              await refresh();
            })().catch((err) =>
              setError(err instanceof Error ? err.message : 'Assign failed'),
            );
          }}
        >
          <p className="text-sm font-medium text-[#0D2745]">Assign to person</p>
          <select
            className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
            value={achievementId}
            onChange={(e) => setAchievementId(e.target.value)}
          >
            <option value="">Achievement…</option>
            {achievements.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
          >
            <option value="">Person…</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-[#0D2745]">
            <input
              type="checkbox"
              checked={withCert}
              onChange={(e) => setWithCert(e.target.checked)}
            />
            Issue certificate verification code
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#173B6C] px-3 py-2 text-sm font-medium text-white"
          >
            Assign
          </button>
        </form>
      </div>

      <div className="overflow-hidden border border-[#D9DEE5] bg-[#F8F7F3]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#D9DEE5] bg-[#F6F4EE] text-xs uppercase tracking-wide text-[#68727D]">
            <tr>
              <th className="px-4 py-3 font-semibold">Person</th>
              <th className="px-4 py-3 font-semibold">Achievement</th>
              <th className="px-4 py-3 font-semibold">Certificate</th>
              <th className="px-4 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[#68727D]">
                  No assignments yet.
                </td>
              </tr>
            ) : (
              assignments.map((row) => (
                <tr key={row.id} className="border-b border-[#E8ECE8] last:border-0">
                  <td className="px-4 py-3">
                    {row.personHref ? (
                      <Link
                        href={row.personHref}
                        className="font-medium text-[#173B6C] hover:underline"
                      >
                        {row.personName}
                      </Link>
                    ) : (
                      row.personName
                    )}
                  </td>
                  <td className="px-4 py-3">{row.achievementTitle}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.certificateCode ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          await deleteAchievementAssignment(row.id);
                          await refresh();
                        })().catch((err) =>
                          setError(
                            err instanceof Error ? err.message : 'Delete failed',
                          ),
                        );
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
