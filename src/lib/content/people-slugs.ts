import type { PersonCategory } from '@/types/content';

/**
 * Reserved /people/[slug] category hubs.
 * Must never be assigned as an individual person slug.
 */
export const RESERVED_PEOPLE_CATEGORY_SLUGS: Record<string, PersonCategory> = {
  'executive-director': 'executive-director',
  'distinguished-fellows': 'distinguished-fellow',
  'research-team': 'research-team',
  'administrative-team': 'administrative-team',
};

export function isReservedPeopleSlug(slug: string): boolean {
  return Boolean(RESERVED_PEOPLE_CATEGORY_SLUGS[slug]);
}
