'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  FileEdit,
  FlaskConical,
  Users,
  Clock,
} from 'lucide-react';
import { formatDateShort } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { useCms } from './CmsProvider';

function MetricCard({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: number;
  href: string;
  icon: typeof BookOpen;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3] p-4 transition-colors hover:border-[#173B6C]/40 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#68727D]">
            {label}
          </p>
          <p className="mt-2 font-[family-name:var(--font-admin-display)] text-3xl text-[#0D2745]">
            {value}
          </p>
        </div>
        <span className="rounded-lg bg-[#E4F0EB] p-2 text-[#173B6C]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export function DashboardPage() {
  const { database, ready } = useCms();

  const metrics = useMemo(() => {
    if (!database) return null;
    const drafts = [
      ...database.publications,
      ...database.researchProjects,
      ...database.news,
      ...database.events,
      ...database.notices,
      ...database.people,
      ...database.pages,
      ...database.activities,
      ...database.resources,
    ].filter((item) => item.status === 'draft').length;

    const upcomingEvents = database.events.filter(
      (e) => e.eventStatus === 'upcoming' && e.status === 'published',
    ).length;

    const recentlyEdited = [
      ...database.publications.map((i) => ({
        id: i.id,
        title: i.title,
        href: `/admin/publications/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'Publication',
      })),
      ...database.researchProjects.map((i) => ({
        id: i.id,
        title: i.title,
        href: `/admin/research/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'Research',
      })),
      ...database.news.map((i) => ({
        id: i.id,
        title: i.title,
        href: `/admin/news/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'News',
      })),
      ...database.events.map((i) => ({
        id: i.id,
        title: i.title,
        href: `/admin/events/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'Event',
      })),
      ...database.people.map((i) => ({
        id: i.id,
        title: i.name,
        href: `/admin/people/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'Person',
      })),
      ...database.notices.map((i) => ({
        id: i.id,
        title: i.title,
        href: `/admin/notices/${i.id}`,
        updatedAt: i.updatedAt,
        status: i.status,
        kind: 'Notice',
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 8);

    return {
      research: database.researchProjects.length,
      publications: database.publications.length,
      people: database.people.length,
      upcomingEvents,
      drafts,
      recentlyEdited,
    };
  }, [database]);

  if (!ready || !metrics) {
    return <p className="text-sm text-[#68727D]">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-admin-display)] text-2xl text-[#0D2745]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#68727D]">
          Content overview for BK School of Research — counts from your CMS
          library, not visitor analytics.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Research projects"
          value={metrics.research}
          href="/admin/research"
          icon={FlaskConical}
        />
        <MetricCard
          label="Publications"
          value={metrics.publications}
          href="/admin/publications"
          icon={BookOpen}
        />
        <MetricCard
          label="People"
          value={metrics.people}
          href="/admin/people"
          icon={Users}
        />
        <MetricCard
          label="Upcoming events"
          value={metrics.upcomingEvents}
          href="/admin/events"
          icon={Calendar}
        />
        <MetricCard
          label="Drafts"
          value={metrics.drafts}
          href="/admin/publications"
          icon={FileEdit}
        />
      </div>

      <section className="rounded-xl border border-[#D9DEE5] bg-[#F8F7F3]">
        <div className="flex items-center gap-2 border-b border-[#D9DEE5] px-4 py-3">
          <Clock className="h-4 w-4 text-[#173B6C]" />
          <h2 className="text-sm font-semibold text-[#0D2745]">
            Recently edited
          </h2>
        </div>
        <ul className="divide-y divide-[#E8ECE8]">
          {metrics.recentlyEdited.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <Link
                href={item.href}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-[#FBF9F4]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0D2745]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#68727D]">{item.kind}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-[#68727D]">
                    {formatDateShort(item.updatedAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/admin/news/new', label: 'Write news' },
          { href: '/admin/publications/new', label: 'Add publication' },
          { href: '/admin/homepage', label: 'Edit homepage' },
          { href: '/admin/navigation', label: 'Edit navigation' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border border-dashed border-[#C5DCD4] bg-white/60 px-4 py-4 text-sm font-medium text-[#173B6C] hover:border-[#173B6C] hover:bg-[#E4F0EB]"
          >
            {action.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
