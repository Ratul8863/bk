'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { RegistrationForm, RegistrationFormField } from '@/types/content';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-white px-3.5 py-3 font-sans text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15';

const selectClass = `${inputClass} appearance-none bg-[length:1rem] bg-[right_0.85rem_center] bg-no-repeat pr-10`;

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230b233f'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: RegistrationFormField;
  value: string | boolean;
  onChange: (next: string | boolean) => void;
}) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 text-sm font-semibold text-ink">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded border-border"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          {field.label}
          {field.required ? ' *' : ''}
        </span>
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset>
        <legend className="font-sans text-sm font-semibold text-ink">
          {field.label}
          {field.required ? ' *' : ''}
        </legend>
        <div className="mt-2 space-y-2">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2.5 text-sm text-ink"
            >
              <input
                type="radio"
                name={field.key}
                required={field.required}
                checked={String(value) === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'textarea') {
    return (
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">
          {field.label}
          {field.required ? ' *' : ''}
        </span>
        <textarea
          className={inputClass}
          rows={field.key === 'message' ? 5 : 3}
          required={field.required}
          placeholder={field.placeholder}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === 'dropdown') {
    return (
      <label className="block">
        <span className="font-sans text-sm font-semibold text-ink">
          {field.label}
          {field.required ? ' *' : ''}
        </span>
        <select
          className={selectClass}
          style={{ backgroundImage: chevron }}
          required={field.required}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
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

  return (
    <label className="block">
      <span className="font-sans text-sm font-semibold text-ink">
        {field.label}
        {field.required ? ' *' : ''}
      </span>
      <input
        className={inputClass}
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
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function JoinApplicationForm({
  form,
}: {
  form: RegistrationForm;
}) {
  const fields = useMemo(
    () => [...form.fields].sort((a, b) => a.order - b.order),
    [form.fields],
  );
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!form.isOpen) {
    return (
      <div className="rounded-[1.25rem] border border-ink/10 bg-surface-subtle px-6 py-10 sm:px-8">
        <p className="font-display text-2xl text-ink">Applications closed</p>
        <p className="mt-3 text-sm leading-relaxed text-body">
          {form.closedMessage || 'This form is not accepting submissions.'}
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-[1.25rem] border border-ink/10 bg-surface-subtle px-6 py-10 sm:px-8">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Received
        </p>
        <p className="mt-3 font-display text-2xl text-ink sm:text-3xl">
          Application received
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-body sm:text-base">
          {form.successMessage ||
            'Thank you. BKSR administrators will review your application.'}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-7"
          onClick={() => setDone(false)}
        >
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <form
      id="join-application-form"
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        void (async () => {
          try {
            const res = await fetch('/api/public/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: values }),
            });
            const data = (await res.json()) as { error?: string };
            if (!res.ok) {
              setError(data.error || 'Could not submit application.');
              return;
            }
            setDone(true);
          } catch {
            setError('Could not submit application.');
          } finally {
            setSubmitting(false);
          }
        })();
      }}
    >
      {fields.map((field) => (
        <FieldControl
          key={field.key}
          field={field}
          value={values[field.key] ?? (field.type === 'checkbox' ? false : '')}
          onChange={(next) =>
            setValues((prev) => ({ ...prev, [field.key]: next }))
          }
        />
      ))}

      {error ? <p className="text-sm text-bronze">{error}</p> : null}

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted sm:max-w-xs">
          No account required. After approval you receive an email invite.
        </p>
        <Button type="submit" variant="primary" disabled={submitting} withArrow>
          {submitting ? 'Submitting…' : 'Submit application'}
        </Button>
      </div>
    </form>
  );
}
