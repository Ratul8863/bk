'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type PublicForm = {
  id: string;
  slug: string;
  title: string;
  isOpen: boolean;
  status: string;
  maxSubmissions: number | null;
  closedMessage?: string;
};

export function RegistrationCTA({
  eventId,
  eventStatus,
  externalRegistrationUrl,
}: {
  eventId: string;
  eventStatus: 'upcoming' | 'past' | 'cancelled';
  externalRegistrationUrl?: string | null;
}) {
  const [form, setForm] = useState<PublicForm | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/public/lookup?eventId=${encodeURIComponent(eventId)}`,
        );
        const data = (await res.json()) as {
          form?: PublicForm | null;
          entryCount?: number;
        };
        if (cancelled) return;
        setForm(data.form ?? null);
        setEntryCount(data.entryCount ?? 0);
      } catch {
        if (!cancelled) setForm(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const full =
    form != null &&
    form.maxSubmissions != null &&
    form.maxSubmissions > 0 &&
    entryCount >= form.maxSubmissions;

  if (!ready) {
    return (
      <p className="text-sm text-muted">Checking registration options…</p>
    );
  }

  if (eventStatus === 'past' || eventStatus === 'cancelled') {
    if (externalRegistrationUrl && eventStatus === 'past') {
      return null;
    }
    return (
      <p className="rounded-[1rem] border border-border bg-surface-subtle px-4 py-3 text-sm text-muted">
        Registration is not open for this session.
      </p>
    );
  }

  if (form) {
    if (!form.isOpen) {
      return (
        <div className="rounded-[1rem] border border-border bg-surface-subtle px-4 py-4">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Registration
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body">
            {form.closedMessage || 'Registration is currently closed.'}
          </p>
        </div>
      );
    }
    if (full) {
      return (
        <div className="rounded-[1rem] border border-border bg-surface-subtle px-4 py-4">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Registration
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body">
            This workshop has reached capacity
            {form.maxSubmissions ? ` (${form.maxSubmissions} places)` : ''}.
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-[1rem] border border-ink/12 bg-white px-4 py-4 shadow-[0_14px_30px_-24px_rgba(13,39,69,0.35)]">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Registration
        </p>
        <p className="mt-2 font-display text-xl text-ink">{form.title}</p>
        {form.maxSubmissions ? (
          <p className="mt-1 text-xs text-muted">
            {entryCount} / {form.maxSubmissions} places filled
          </p>
        ) : null}
        <Button
          href={`/forms/${form.slug}`}
          variant="primary"
          className="mt-4 w-full"
          withArrow
        >
          Register now
        </Button>
      </div>
    );
  }

  if (externalRegistrationUrl) {
    return (
      <Button
        href={externalRegistrationUrl}
        external
        variant="primary"
        className="w-full"
        withArrow
      >
        Register
      </Button>
    );
  }

  return (
    <p className="text-sm text-muted">
      No registration form is linked yet.{' '}
      <Link href="/contact" className="font-medium text-accent hover:underline">
        Contact BKSR
      </Link>
    </p>
  );
}
