'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { RegistrationForm } from '@/types/content';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-3 font-sans text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15';

export function PublicRegistrationForm({
  initialForm,
  entityTitle,
  entityHref,
  isFull = false,
}: {
  initialForm: RegistrationForm;
  entityTitle?: string | null;
  entityHref?: string | null;
  isFull?: boolean;
}) {
  const [form] = useState(initialForm);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const fields = useMemo(
    () => [...form.fields].sort((a, b) => a.order - b.order),
    [form.fields],
  );

  if (done) {
    return (
      <div className="border border-accent/30 bg-sage/40 px-6 py-10 md:px-8">
        <p className="font-display text-2xl text-ink">Registration received</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {form.successMessage ||
            'Thank you. Your registration was saved.'}
        </p>
        {entityHref ? (
          <Button href={entityHref} variant="secondary" className="mt-6">
            Back to event
          </Button>
        ) : null}
      </div>
    );
  }

  if (!form.isOpen) {
    return (
      <div className="border border-border bg-surface-subtle px-6 py-10 md:px-8">
        <p className="font-display text-2xl text-ink">Registration closed</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {form.closedMessage || 'This form is not accepting submissions.'}
        </p>
        {entityHref ? (
          <Link
            href={entityHref}
            className="mt-6 inline-flex font-medium text-accent hover:underline"
          >
            View event
          </Link>
        ) : null}
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="border border-border bg-surface-subtle px-6 py-10 md:px-8">
        <p className="font-display text-2xl text-ink">Capacity reached</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          This form has reached its maximum number of submissions.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        void (async () => {
          try {
            const res = await fetch(
              `/api/public/forms/${encodeURIComponent(form.slug)}/submit`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: values }),
              },
            );
            const data = (await res.json()) as { error?: string };
            if (!res.ok) {
              setError(data.error || 'Could not submit registration.');
              return;
            }
            setDone(true);
          } catch {
            setError('Could not submit registration.');
          } finally {
            setBusy(false);
          }
        })();
      }}
    >
      {entityTitle ? (
        <div className="border border-accent/25 bg-sage/30 px-4 py-3 text-sm text-body">
          <p className="font-semibold text-ink">Event registration</p>
          <p className="mt-1 leading-relaxed">Linked to: {entityTitle}.</p>
        </div>
      ) : null}

      {error ? (
        <p className="border border-[#E8C4C4] bg-[#FBF0F0] px-4 py-3 text-sm text-[#8A3B3B]">
          {error}
        </p>
      ) : null}

      {fields.map((field) => {
        if (field.type === 'checkbox') {
          return (
            <label
              key={field.key}
              className="flex items-center gap-2 text-sm font-semibold text-ink"
            >
              <input
                type="checkbox"
                checked={Boolean(values[field.key])}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.key]: e.target.checked,
                  }))
                }
              />
              {field.label}
              {field.required ? ' *' : ''}
            </label>
          );
        }

        if (field.type === 'textarea') {
          return (
            <label key={field.key} className="block">
              <span className="font-sans text-sm font-semibold text-ink">
                {field.label}
                {field.required ? ' *' : ''}
              </span>
              <textarea
                required={field.required}
                rows={4}
                placeholder={field.placeholder}
                value={String(values[field.key] ?? '')}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className={inputClass}
              />
            </label>
          );
        }

        if (field.type === 'dropdown') {
          return (
            <label key={field.key} className="block">
              <span className="font-sans text-sm font-semibold text-ink">
                {field.label}
                {field.required ? ' *' : ''}
              </span>
              <select
                required={field.required}
                value={String(values[field.key] ?? '')}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className={inputClass}
              >
                <option value="">Select…</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (field.type === 'radio') {
          return (
            <fieldset key={field.key}>
              <legend className="font-sans text-sm font-semibold text-ink">
                {field.label}
                {field.required ? ' *' : ''}
              </legend>
              <div className="mt-2 space-y-2">
                {(field.options ?? []).map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm text-ink"
                  >
                    <input
                      type="radio"
                      name={field.key}
                      required={field.required}
                      checked={String(values[field.key] ?? '') === opt}
                      onChange={() =>
                        setValues((prev) => ({
                          ...prev,
                          [field.key]: opt,
                        }))
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>
          );
        }

        return (
          <label key={field.key} className="block">
            <span className="font-sans text-sm font-semibold text-ink">
              {field.label}
              {field.required ? ' *' : ''}
            </span>
            <input
              required={field.required}
              type={
                field.type === 'email'
                  ? 'email'
                  : field.type === 'number'
                    ? 'number'
                    : field.type === 'phone'
                      ? 'tel'
                      : 'text'
              }
              placeholder={field.placeholder}
              value={String(values[field.key] ?? '')}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  [field.key]: e.target.value,
                }))
              }
              className={inputClass}
            />
          </label>
        );
      })}

      <Button type="submit" variant="primary" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit registration'}
      </Button>
    </form>
  );
}
