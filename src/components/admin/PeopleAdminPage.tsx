'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Mail, Pencil, Plus, Search, UserPlus } from 'lucide-react';
import { getPersonClaimStatus } from '@/lib/auth/permissions';
import { PERSON_CATEGORY_META } from '@/lib/public/labels';
import type { Person, PersonCategory } from '@/types/content';
import {
  AdminLockedState,
  AdminPageHeader,
  AdminPanel,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from './AdminUI';
import { StatusBadge } from './StatusBadge';
import { useCms } from './CmsProvider';

const CATEGORY_ORDER: PersonCategory[] = [
  'executive-director',
  'distinguished-fellow',
  'research-team',
  'administrative-team',
  'alumni',
  'other',
];

export function PeopleAdminPage() {
  const { database, ready, apiAuthenticated, refresh } = useCms();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);

  const people = useMemo(() => {
    if (!database) return [];
    return [...database.people]
      .filter((person) => {
        if (category && person.category !== category) return false;
        if (!query.trim()) return true;
        const blob = [
          person.name,
          person.role,
          person.email,
          person.category,
        ]
          .join(' ')
          .toLowerCase();
        return blob.includes(query.trim().toLowerCase());
      })
      .sort((a, b) => {
        const cat =
          CATEGORY_ORDER.indexOf(a.category) -
          CATEGORY_ORDER.indexOf(b.category);
        if (cat !== 0) return cat;
        return (a.order ?? 999) - (b.order ?? 999);
      });
  }, [database, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<PersonCategory, Person[]>();
    for (const person of people) {
      const list = map.get(person.category) ?? [];
      list.push(person);
      map.set(person.category, list);
    }
    return CATEGORY_ORDER.map((key) => ({
      key,
      label: PERSON_CATEGORY_META[key].label,
      items: map.get(key) ?? [],
    })).filter((group) => group.items.length > 0);
  }, [people]);

  if (!ready) {
    return <p className="text-sm text-[#5B6B7C]">Loading team…</p>;
  }

  if (!apiAuthenticated || !database) {
    return <AdminLockedState noun="the team directory" />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Team"
        title="Team & people"
        description="Invite members by email and position. They complete their own profile after verifying the invite. New people always appear at the end of their section."
        action={
          <AdminPrimaryButton onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite person
          </AdminPrimaryButton>
        }
      />

      {inviteMessage ? (
        <AdminPanel className="space-y-2 border-[#C5D4E8] bg-[#F4F8FC] p-4 text-sm text-[#0B1F36]">
          <p className="font-semibold">{inviteMessage}</p>
          {lastInviteUrl ? (
            <p className="break-all text-xs text-[#5B6B7C]">
              Invite link (also emailed when mail is configured):{' '}
              <a href={lastInviteUrl} className="font-medium text-[#173B6C] underline">
                {lastInviteUrl}
              </a>
            </p>
          ) : null}
        </AdminPanel>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-[0_1px_2px_rgba(11,31,54,0.04)] sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A90A8]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, role…"
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0B1F36] focus:bg-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 text-sm"
        >
          <option value="">All sections</option>
          {CATEGORY_ORDER.map((key) => (
            <option key={key} value={key}>
              {PERSON_CATEGORY_META[key].label}
            </option>
          ))}
        </select>
      </div>

      {people.length === 0 ? (
        <AdminPanel className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-[#0B1F36]">No people yet</p>
          <p className="mt-1 text-sm text-[#5B6B7C]">
            Invite someone with their email and committee position.
          </p>
          <div className="mt-4 flex justify-center">
            <AdminPrimaryButton onClick={() => setInviteOpen(true)}>
              <Plus className="h-4 w-4" />
              Invite person
            </AdminPrimaryButton>
          </div>
        </AdminPanel>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.key} className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-[family-name:var(--font-admin-display)] text-xl text-[#0B1F36]">
                  {group.label}
                </h2>
                <p className="text-xs text-[#7A90A8]">
                  {group.items.length}{' '}
                  {group.items.length === 1 ? 'person' : 'people'}
                </p>
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(11,31,54,0.04)] md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] uppercase tracking-[0.12em] text-[#7A90A8]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Member</th>
                      <th className="px-4 py-3 font-semibold">Position</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Account</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((person) => (
                      <PersonTableRow key={person.id} person={person} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile compact cards */}
              <ul className="grid gap-2 md:hidden">
                {group.items.map((person) => (
                  <PersonMobileCard key={person.id} person={person} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {inviteOpen ? (
        <InvitePersonModal
          onClose={() => setInviteOpen(false)}
          onInvited={async (result) => {
            setInviteOpen(false);
            setInviteMessage(
              result.emailSent
                ? `Invite sent to ${result.person.email}.`
                : `Person added. Copy the invite link below (email delivery is not configured yet).`,
            );
            setLastInviteUrl(result.inviteUrl);
            await refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function claimLabel(person: Person) {
  const claim = getPersonClaimStatus(person);
  if (claim === 'claimed') return 'Account active';
  if (claim === 'unclaimed') return 'Invite pending';
  return 'No email';
}

function PersonTableRow({ person }: { person: Person }) {
  return (
    <tr className="border-b border-[#EEF2F6] last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <PersonAvatar person={person} size={40} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#0B1F36]">{person.name}</p>
            <p className="text-xs text-[#7A90A8]">#{person.order ?? '—'}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-[#5B6B7C]">{person.role}</td>
      <td className="px-4 py-3">
        {person.email ? (
          <span className="inline-flex items-center gap-1 text-[#5B6B7C]">
            <Mail className="h-3.5 w-3.5" />
            {person.email}
          </span>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-3 text-[#5B6B7C]">{claimLabel(person)}</td>
      <td className="px-4 py-3">
        <StatusBadge status={person.status} />
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/admin/people/${person.id}`}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#173B6C] hover:bg-[#EEF2F6]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
      </td>
    </tr>
  );
}

function PersonMobileCard({ person }: { person: Person }) {
  return (
    <li>
      <Link
        href={`/admin/people/${person.id}`}
        className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3"
      >
        <PersonAvatar person={person} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#0B1F36]">
            {person.name}
          </p>
          <p className="truncate text-xs text-[#5B6B7C]">{person.role}</p>
          <p className="truncate text-[11px] text-[#7A90A8]">
            {person.email || 'No email'} · {claimLabel(person)}
          </p>
        </div>
        <StatusBadge status={person.status} />
      </Link>
    </li>
  );
}

function PersonAvatar({ person, size }: { person: Person; size: number }) {
  if (person.photoUrl) {
    return (
      <span
        className="relative shrink-0 overflow-hidden rounded-full bg-[#EEF2F6]"
        style={{ width: size, height: size }}
      >
        <Image
          src={person.photoUrl}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
          unoptimized={person.photoUrl.startsWith('http')}
        />
      </span>
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#0B1F36] text-xs font-semibold text-white"
      style={{ width: size, height: size }}
    >
      {person.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function InvitePersonModal({
  onClose,
  onInvited,
}: {
  onClose: () => void;
  onInvited: (result: {
    person: Person;
    inviteUrl: string;
    emailSent: boolean;
  }) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] =
    useState<PersonCategory>('research-team');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B1F36]/45 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xl">
        <h2 className="font-[family-name:var(--font-admin-display)] text-xl text-[#0B1F36]">
          Invite a team member
        </h2>
        <p className="mt-1 text-sm text-[#5B6B7C]">
          Only name, email, and position. They will fill photo, bio, and other
          details when they accept the invite.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            void (async () => {
              try {
                const res = await fetch('/api/auth/invite', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, role, category }),
                });
                const data = (await res.json()) as {
                  error?: string;
                  person?: Person;
                  inviteUrl?: string;
                  emailSent?: boolean;
                };
                if (!res.ok || !data.person || !data.inviteUrl) {
                  setError(data.error || 'Could not send invite.');
                  return;
                }
                await onInvited({
                  person: data.person,
                  inviteUrl: data.inviteUrl,
                  emailSent: Boolean(data.emailSent),
                });
              } catch {
                setError('Could not send invite.');
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          <label className="block text-sm">
            <span className="font-medium text-[#0B1F36]">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#0B1F36]">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#0B1F36]">Position / role</span>
            <input
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Research Associate"
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[#0B1F36]">Committee section</span>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as PersonCategory)
              }
              className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"
            >
              {CATEGORY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {PERSON_CATEGORY_META[key].label}
                </option>
              ))}
            </select>
          </label>

          {error ? (
            <p className="rounded-xl border border-[#F0D4D4] bg-[#FFF8F8] px-3 py-2 text-sm text-[#8A3B3B]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <AdminSecondaryButton type="button" onClick={onClose}>
              Cancel
            </AdminSecondaryButton>
            <AdminPrimaryButton type="submit" disabled={busy}>
              {busy ? 'Adding…' : 'Add & send invite'}
            </AdminPrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
