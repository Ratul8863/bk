import type { ContentCollectionKey } from '@/types/content';
import { LIST_COLLECTION_KEYS } from '@/lib/db/collections';

const KEY_SET = new Set<string>(LIST_COLLECTION_KEYS);

export function parseCollectionKey(
  value: string,
): ContentCollectionKey | null {
  if (!KEY_SET.has(value)) return null;
  return value as ContentCollectionKey;
}
