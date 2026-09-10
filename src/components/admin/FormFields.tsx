'use client';

import { cn, slugify } from '@/lib/utils';
import { BodyEditor } from './BodyEditor';
import type { FieldDef } from './collections';

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function setPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const keys = path.split('.');
  const next = { ...obj };
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const existing = cursor[key];
    cursor[key] =
      existing && typeof existing === 'object'
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
}

function tagsToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string') return value;
  return '';
}

function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const inputClass =
  'w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm text-[#242B2D] outline-none focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/15';

export function FieldRenderer({
  field,
  values,
  onChange,
  autoSlugFrom,
}: {
  field: FieldDef;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  autoSlugFrom?: string;
}) {
  const raw = getPath(values, field.name);
  const id = `field-${field.name}`;

  const set = (value: unknown) => {
    let next = setPath(values, field.name, value);
    if (
      field.type === 'text' &&
      field.name === autoSlugFrom &&
      typeof value === 'string'
    ) {
      const currentSlug = String(values.slug ?? '');
      const expectedFromOld = slugify(String(values[autoSlugFrom] ?? ''));
      if (!currentSlug || currentSlug === expectedFromOld) {
        next = { ...next, slug: slugify(value) };
      }
    }
    if (field.name === 'name' && autoSlugFrom === 'name' && typeof value === 'string') {
      const currentSlug = String(values.slug ?? '');
      const expectedFromOld = slugify(String(values.name ?? ''));
      if (!currentSlug || currentSlug === expectedFromOld) {
        next = { ...next, slug: slugify(value) };
      }
    }
    onChange(next);
  };

  if (field.type === 'body') {
    return (
      <BodyEditor
        id={id}
        label={field.label}
        value={String(raw ?? '')}
        onChange={set}
        rows={field.rows}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-[#0D2745]">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(raw)}
          onChange={(e) => set(e.target.checked)}
          className="h-4 w-4 rounded border-[#D9DEE5] text-[#173B6C] focus:ring-[#173B6C]"
        />
        {field.label}
      </label>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[#0D2745]">
        {field.label}
        {field.required ? <span className="text-[#8A3B3B]"> *</span> : null}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          id={id}
          value={String(raw ?? '')}
          onChange={(e) => set(e.target.value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          className={inputClass}
        />
      ) : field.type === 'select' || field.type === 'status' ? (
        <select
          id={id}
          value={String(raw ?? '')}
          onChange={(e) => set(e.target.value)}
          className={inputClass}
        >
          {(field.options ?? [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === 'tags' ? (
        <input
          id={id}
          type="text"
          value={tagsToString(raw)}
          onChange={(e) => set(parseTags(e.target.value))}
          placeholder={field.placeholder ?? 'item1, item2'}
          className={inputClass}
        />
      ) : field.type === 'number' ? (
        <input
          id={id}
          type="number"
          value={raw == null || raw === '' ? '' : Number(raw)}
          onChange={(e) =>
            set(e.target.value === '' ? null : Number(e.target.value))
          }
          className={inputClass}
        />
      ) : field.type === 'datetime' ? (
        <input
          id={id}
          type="datetime-local"
          value={toLocalInput(String(raw ?? ''))}
          onChange={(e) =>
            set(e.target.value ? new Date(e.target.value).toISOString() : null)
          }
          className={inputClass}
        />
      ) : field.type === 'slug' ? (
        <input
          id={id}
          type="text"
          value={String(raw ?? '')}
          onChange={(e) => set(slugify(e.target.value))}
          placeholder={field.placeholder}
          className={cn(inputClass, 'font-mono text-xs')}
        />
      ) : (
        <input
          id={id}
          type={field.type === 'url' ? 'url' : 'text'}
          value={String(raw ?? '')}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
      {field.help ? <p className="text-xs text-[#68727D]">{field.help}</p> : null}
    </div>
  );
}

function toLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export { setPath, getPath };
