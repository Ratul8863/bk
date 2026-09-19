'use client';

import { useState } from 'react';
import { cmsApi } from '@/lib/cms/client-api';
import { cn } from '@/lib/utils';

type CloudinaryImageFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  help?: string;
  disabled?: boolean;
  className?: string;
  /** When set, upload is allowed without CMS admin (register flow). */
  uploadEndpoint?: string;
  uploadExtraFields?: Record<string, string>;
};

/**
 * URL field + Cloudinary file upload for images used across admin / register.
 */
export function CloudinaryImageField({
  id,
  label,
  value,
  onChange,
  help,
  disabled,
  className,
  uploadEndpoint,
  uploadExtraFields,
}: CloudinaryImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      if (uploadEndpoint) {
        const form = new FormData();
        form.append('file', file);
        for (const [k, v] of Object.entries(uploadExtraFields ?? {})) {
          form.append(k, v);
        }
        const res = await fetch(uploadEndpoint, {
          method: 'POST',
          credentials: 'include',
          body: form,
        });
        const data = (await res.json()) as {
          error?: string;
          url?: string;
          storage?: { url?: string };
        };
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        const url = data.url || data.storage?.url;
        if (!url) throw new Error('Upload returned no URL');
        onChange(url);
      } else {
        const result = await cmsApi.uploadMedia(file, {
          title: file.name,
          kind: 'image',
        });
        onChange(result.item.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium text-[#0D2745]">
        {label}
      </label>
      {value ? (
        <div className="overflow-hidden rounded-lg border border-[#D9DEE5] bg-[#F8F7F3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-36 w-full object-cover"
          />
        </div>
      ) : null}
      <input
        id={id}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://res.cloudinary.com/…"
        disabled={disabled || uploading}
        className="w-full rounded-lg border border-[#D9DEE5] bg-white px-3 py-2 text-sm text-[#242B2D] outline-none focus:border-[#173B6C] focus:ring-2 focus:ring-[#173B6C]/15"
      />
      <label className="flex cursor-pointer flex-col gap-1 rounded-lg border border-dashed border-[#D9DEE5] bg-white px-3 py-3 text-sm hover:border-[#173B6C]/40">
        <span className="font-medium text-[#0D2745]">
          {uploading ? 'Uploading to Cloudinary…' : 'Upload image to Cloudinary'}
        </span>
        <span className="text-xs text-[#68727D]">
          JPG, PNG, WebP, or GIF · max 12 MB
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={disabled || uploading}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void upload(file);
          }}
        />
      </label>
      {help ? <p className="text-xs text-[#68727D]">{help}</p> : null}
      {error ? <p className="text-xs font-medium text-[#8A3B3B]">{error}</p> : null}
    </div>
  );
}
