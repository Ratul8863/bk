import { formatDate } from '@/lib/utils';
import type { Publication } from '@/types/content';

/**
 * Card secondary line for opinions / press — never the full citation
 * (title is already the heading). Prefer abstract, else venue · date.
 */
export function publicationCardSupportingLine(
  publication: Pick<
    Publication,
    | 'title'
    | 'abstract'
    | 'venue'
    | 'publisher'
    | 'year'
    | 'publishedAt'
    | 'citation'
  >,
): string | null {
  const abstract = publication.abstract?.trim();
  if (abstract) {
    return abstract.length > 140
      ? `${abstract.slice(0, 137).trim()}…`
      : abstract;
  }

  const outlet = publication.venue?.trim() || publication.publisher?.trim();
  const dateLabel = publication.publishedAt
    ? formatDate(publication.publishedAt)
    : publication.year
      ? String(publication.year)
      : null;

  const meta = [outlet, dateLabel].filter(Boolean).join(' · ');
  if (meta) return meta;

  const cite = publication.citation?.trim();
  if (!cite) return null;
  const title = publication.title.trim().replace(/\.+$/, '');
  const idx = title ? cite.indexOf(title) : -1;
  if (idx < 0) return null;
  const rest = cite
    .slice(idx + title.length)
    .replace(/^[.”"\s]+/, '')
    .trim();
  return rest || null;
}
