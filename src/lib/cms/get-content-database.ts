import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { CMS_CACHE_TAGS } from '@/lib/db/collections';
import { getCmsDriver } from '@/lib/cms/server-repository';
import type { ContentDatabase } from '@/types/content';

/**
 * Request-deduped + tag-cached content database for Server Components.
 * Uses local `.data/cms-database.json` (fs) or MongoDB depending on CMS_DRIVER.
 */
export const getContentDatabase = cache(async (): Promise<ContentDatabase> => {
  const driver = getCmsDriver();

  return unstable_cache(
    async () => {
      const { serverGetFullDatabase } = await import(
        '@/lib/cms/server-repository'
      );
      return serverGetFullDatabase();
    },
    ['bksr-cms-database', driver],
    {
      tags: [CMS_CACHE_TAGS.all],
      revalidate: 30,
    },
  )();
});
