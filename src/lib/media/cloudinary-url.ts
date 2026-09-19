/**
 * Client-safe Cloudinary delivery helpers.
 * Uploads stay server-side (`src/lib/storage/cloudinary.ts`).
 */

export function getCloudinaryCloudName(): string | null {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    process.env.CLOUDINARY_CLOUD_NAME?.trim() ||
    null
  );
}

export function isCloudinaryUrl(src: string): boolean {
  try {
    const host = new URL(src).hostname;
    return host === 'res.cloudinary.com' || host.endsWith('.cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * Next.js `loader` for Cloudinary-hosted images — width/quality transforms.
 * Non-Cloudinary sources are returned unchanged (caller should skip loader).
 */
export function cloudinaryImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number | `${number}`;
}): string {
  if (!isCloudinaryUrl(src)) return src;

  const q =
    typeof quality === 'number'
      ? quality
      : quality
        ? Number(quality)
        : 75;

  // Insert / transform segment after /upload/
  // e.g. .../upload/v123/folder/file.jpg → .../upload/f_auto,q_75,w_640/v123/...
  const marker = '/upload/';
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const before = src.slice(0, idx + marker.length);
  let after = src.slice(idx + marker.length);

  // Drop an existing transform segment (no version prefix, contains _)
  if (after && !after.startsWith('v') && after.includes(',')) {
    const slash = after.indexOf('/');
    if (slash !== -1) after = after.slice(slash + 1);
  }

  const transforms = [`f_auto`, `q_${Number.isFinite(q) ? q : 75}`, `w_${width}`].join(
    ',',
  );
  return `${before}${transforms}/${after}`;
}
