import 'server-only';
import { randomUUID } from 'crypto';
import { revalidateTag } from 'next/cache';
import {
  CMS_CACHE_TAGS,
  LIST_COLLECTION_KEYS,
  MONGO_COLLECTIONS,
  mongoNameForList,
} from '@/lib/db/collections';
import { getDb } from '@/lib/db/mongo';
import { ensureIndexes } from '@/lib/db/indexes';
import { seedDatabase } from '@/content/seed';
import type {
  CollectionEntityMap,
  ContentCollectionKey,
  ContentDatabase,
  HomepageConfig,
  NavigationItem,
  SiteSettings,
} from '@/types/content';

const SINGLETON_ID = 'default';

function nowIso(): string {
  return new Date().toISOString();
}

function stripMongoId<T extends Record<string, unknown>>(doc: T): Omit<T, '_id'> {
  const { _id: _ignored, ...rest } = doc;
  return rest;
}

async function readSingleton<T>(
  collection: string,
  fallback: T,
): Promise<T> {
  const db = await getDb();
  const doc = await db.collection(collection).findOne({ _id: SINGLETON_ID } as never);
  if (!doc) return structuredClone(fallback);
  return stripMongoId(doc as Record<string, unknown>) as T;
}

async function writeSingleton(
  collection: string,
  data: Record<string, unknown>,
  tag: string,
): Promise<void> {
  const db = await getDb();
  const { id: _idField, ...rest } = data;
  await db.collection(collection).updateOne(
    { _id: SINGLETON_ID } as never,
    { $set: { ...rest, id: data.id ?? SINGLETON_ID } },
    { upsert: true },
  );
  revalidateTag(tag, 'max');
  revalidateTag(CMS_CACHE_TAGS.all, 'max');
}

export async function mongoGetFullDatabase(): Promise<ContentDatabase> {
  const db = await getDb();
  const seed = structuredClone(seedDatabase);

  const [siteSettings, homepage, navigation, ...lists] = await Promise.all([
    readSingleton(MONGO_COLLECTIONS.siteSettings, seed.siteSettings),
    readSingleton(MONGO_COLLECTIONS.homepage, seed.homepage),
    readSingleton(MONGO_COLLECTIONS.navigation, seed.navigation),
    ...LIST_COLLECTION_KEYS.map(async (key) => {
      const rows = await db
        .collection(mongoNameForList(key))
        .find({})
        .toArray();
      return [
        key,
        rows.map((row) => stripMongoId(row as Record<string, unknown>)),
      ] as const;
    }),
  ]);

  const database = {
    version: seed.version,
    siteSettings,
    homepage,
    navigation,
  } as ContentDatabase;

  for (const [key, rows] of lists) {
    (database as unknown as Record<string, unknown>)[key] = rows;
  }

  const meta = await db.collection(MONGO_COLLECTIONS.meta).findOne({
    _id: 'version',
  } as never);
  if (meta && typeof (meta as unknown as { version?: number }).version === 'number') {
    database.version = (meta as unknown as { version: number }).version;
  }

  return database;
}

export async function mongoGetAll<K extends ContentCollectionKey>(
  collection: K,
): Promise<CollectionEntityMap[K][]> {
  const db = await getDb();
  const rows = await db.collection(mongoNameForList(collection)).find({}).toArray();
  return rows.map((row) =>
    stripMongoId(row as Record<string, unknown>),
  ) as unknown as CollectionEntityMap[K][];
}

export async function mongoGetById<K extends ContentCollectionKey>(
  collection: K,
  id: string,
): Promise<CollectionEntityMap[K] | undefined> {
  const db = await getDb();
  const row = await db.collection(mongoNameForList(collection)).findOne({ id });
  if (!row) return undefined;
  return stripMongoId(row as Record<string, unknown>) as unknown as CollectionEntityMap[K];
}

export async function mongoGetBySlug<K extends ContentCollectionKey>(
  collection: K,
  slug: string,
): Promise<CollectionEntityMap[K] | undefined> {
  const db = await getDb();
  const row = await db.collection(mongoNameForList(collection)).findOne({ slug });
  if (!row) return undefined;
  return stripMongoId(row as Record<string, unknown>) as unknown as CollectionEntityMap[K];
}

export async function mongoCreate<K extends ContentCollectionKey>(
  collection: K,
  input: Omit<CollectionEntityMap[K], 'id' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<CollectionEntityMap[K], 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<CollectionEntityMap[K]> {
  const timestamp = nowIso();
  const prepared = { ...input } as Record<string, unknown>;

  if (collection === 'people') {
    const personInput = prepared as Partial<import('@/types/content').Person>;
    if (!personInput.verificationCode) {
      const people = await mongoGetAll('people');
      let max = 0;
      for (const person of people) {
        const match = person.verificationCode?.match(/BKSR-(\d+)M/i);
        if (match) max = Math.max(max, Number(match[1]));
      }
      prepared.verificationCode = `BKSR-${String(max + 1).padStart(5, '0')}M`;
    }
    if (personInput.email && !personInput.claimStatus) {
      prepared.claimStatus = 'unclaimed';
    }
  }

  const item = {
    ...prepared,
    id: (prepared.id as string | undefined) ?? randomUUID(),
    createdAt: (prepared.createdAt as string | undefined) ?? timestamp,
    updatedAt: (prepared.updatedAt as string | undefined) ?? timestamp,
  } as CollectionEntityMap[K];

  const db = await getDb();
  await db.collection(mongoNameForList(collection)).insertOne({
    ...item,
    _id: (item as { id: string }).id,
  } as never);

  revalidateTag(CMS_CACHE_TAGS.collection(collection), 'max');
  revalidateTag(CMS_CACHE_TAGS.all, 'max');
  return item;
}

export async function mongoUpdate<K extends ContentCollectionKey>(
  collection: K,
  id: string,
  patch: Partial<CollectionEntityMap[K]>,
): Promise<CollectionEntityMap[K] | undefined> {
  const existing = await mongoGetById(collection, id);
  if (!existing) return undefined;

  const updated = {
    ...existing,
    ...patch,
    id,
    updatedAt: nowIso(),
  } as CollectionEntityMap[K];

  const db = await getDb();
  await db.collection(mongoNameForList(collection)).replaceOne(
    { id },
    { ...updated, _id: id } as never,
  );

  revalidateTag(CMS_CACHE_TAGS.collection(collection), 'max');
  revalidateTag(CMS_CACHE_TAGS.all, 'max');
  return updated;
}

export async function mongoRemove<K extends ContentCollectionKey>(
  collection: K,
  id: string,
): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection(mongoNameForList(collection)).deleteOne({ id });
  if (result.deletedCount === 0) return false;

  if (collection === 'people') {
    await Promise.all([
      db.collection(MONGO_COLLECTIONS.personContentLinks).deleteMany({ personId: id }),
      db.collection(MONGO_COLLECTIONS.roleAssignments).deleteMany({ personId: id }),
      db.collection(MONGO_COLLECTIONS.achievementAssignments).deleteMany({ personId: id }),
      db.collection(MONGO_COLLECTIONS.memberAchievements).deleteMany({ personId: id }),
    ]);
  } else if (collection === 'events') {
    await db
      .collection(MONGO_COLLECTIONS.personContentLinks)
      .deleteMany({ entityType: 'event', entityId: id });
    const forms = await db
      .collection(MONGO_COLLECTIONS.registrationForms)
      .find({ entityType: 'event', entityId: id })
      .project({ id: 1 })
      .toArray();
    const formIds = forms.map((f) => (f as { id: string }).id);
    await db
      .collection(MONGO_COLLECTIONS.registrationForms)
      .deleteMany({ entityType: 'event', entityId: id });
    if (formIds.length) {
      await db
        .collection(MONGO_COLLECTIONS.registrationEntries)
        .deleteMany({ formId: { $in: formIds } });
    }
  } else if (collection === 'researchProjects') {
    await db
      .collection(MONGO_COLLECTIONS.personContentLinks)
      .deleteMany({ entityType: 'research', entityId: id });
  } else if (collection === 'publications') {
    await db
      .collection(MONGO_COLLECTIONS.personContentLinks)
      .deleteMany({ entityType: 'publication', entityId: id });
  } else if (collection === 'activities') {
    await db
      .collection(MONGO_COLLECTIONS.personContentLinks)
      .deleteMany({ entityType: 'activity', entityId: id });
  }

  revalidateTag(CMS_CACHE_TAGS.collection(collection), 'max');
  revalidateTag(CMS_CACHE_TAGS.all, 'max');
  return true;
}

export async function mongoDuplicate<K extends ContentCollectionKey>(
  collection: K,
  id: string,
): Promise<CollectionEntityMap[K] | undefined> {
  const source = await mongoGetById(collection, id);
  if (!source) return undefined;

  const timestamp = nowIso();
  const copy = structuredClone(source) as CollectionEntityMap[K] & {
    slug?: string;
    title?: string;
    name?: string;
    status?: string;
  };
  copy.id = randomUUID();
  copy.createdAt = timestamp;
  copy.updatedAt = timestamp;
  if ('slug' in copy && typeof copy.slug === 'string') {
    copy.slug = `${copy.slug}-copy`;
  }
  if ('status' in copy) copy.status = 'draft';
  if ('title' in copy && typeof copy.title === 'string') {
    copy.title = `${copy.title} (Copy)`;
  }
  if ('name' in copy && typeof copy.name === 'string') {
    copy.name = `${copy.name} (Copy)`;
  }

  const db = await getDb();
  await db.collection(mongoNameForList(collection)).insertOne({
    ...copy,
    _id: copy.id,
  } as never);

  revalidateTag(CMS_CACHE_TAGS.collection(collection), 'max');
  revalidateTag(CMS_CACHE_TAGS.all, 'max');
  return copy as CollectionEntityMap[K];
}

export async function mongoUpdateSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await readSingleton(
    MONGO_COLLECTIONS.siteSettings,
    seedDatabase.siteSettings,
  );
  const next = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  };
  await writeSingleton(
    MONGO_COLLECTIONS.siteSettings,
    next as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.siteSettings,
  );
  return next;
}

export async function mongoUpdateHomepage(
  patch: Partial<HomepageConfig>,
): Promise<HomepageConfig> {
  const current = await readSingleton(
    MONGO_COLLECTIONS.homepage,
    seedDatabase.homepage,
  );
  const next = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  };
  await writeSingleton(
    MONGO_COLLECTIONS.homepage,
    next as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.homepage,
  );
  return next;
}

export async function mongoUpdateNavigation(
  patch: Partial<ContentDatabase['navigation']>,
): Promise<ContentDatabase['navigation']> {
  const current = await readSingleton(
    MONGO_COLLECTIONS.navigation,
    seedDatabase.navigation,
  );
  const next = {
    ...current,
    ...patch,
  };
  await writeSingleton(
    MONGO_COLLECTIONS.navigation,
    { id: 'default', ...next } as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.navigation,
  );
  return next;
}

export async function mongoReplaceNavigationList(
  key: keyof ContentDatabase['navigation'],
  items: NavigationItem[],
): Promise<ContentDatabase['navigation']> {
  return mongoUpdateNavigation({ [key]: items });
}

/** One-shot seed from compiled seedDatabase into Mongo (upsert). */
export async function mongoSeedFromCompiled(
  options: { wipe?: boolean } = {},
): Promise<{ collections: number; documents: number }> {
  const db = await getDb();
  await ensureIndexes(db);

  if (options.wipe) {
    await Promise.all([
      db.collection(MONGO_COLLECTIONS.siteSettings).deleteMany({}),
      db.collection(MONGO_COLLECTIONS.homepage).deleteMany({}),
      db.collection(MONGO_COLLECTIONS.navigation).deleteMany({}),
      ...LIST_COLLECTION_KEYS.map((key) =>
        db.collection(mongoNameForList(key)).deleteMany({}),
      ),
    ]);
  }

  const seed = structuredClone(seedDatabase);
  let documents = 0;

  await writeSingleton(
    MONGO_COLLECTIONS.siteSettings,
    seed.siteSettings as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.siteSettings,
  );
  documents += 1;

  await writeSingleton(
    MONGO_COLLECTIONS.homepage,
    seed.homepage as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.homepage,
  );
  documents += 1;

  await writeSingleton(
    MONGO_COLLECTIONS.navigation,
    { id: 'default', ...seed.navigation } as unknown as Record<string, unknown>,
    CMS_CACHE_TAGS.navigation,
  );
  documents += 1;

  for (const key of LIST_COLLECTION_KEYS) {
    const items = seed[key] as Array<{ id: string }>;
    if (!items.length) continue;
    const col = db.collection(mongoNameForList(key));
    const ops = items.map((item) => ({
      replaceOne: {
        filter: { id: item.id },
        replacement: { ...item, _id: item.id },
        upsert: true,
      },
    }));
    // Mongo bulkWrite typed as Document
    await col.bulkWrite(ops as never);
    documents += items.length;
  }

  await db.collection(MONGO_COLLECTIONS.meta).updateOne(
    { _id: 'version' } as never,
    {
      $set: {
        version: seed.version,
        seededAt: nowIso(),
      },
    },
    { upsert: true },
  );

  revalidateTag(CMS_CACHE_TAGS.all, 'max');

  return {
    collections: 3 + LIST_COLLECTION_KEYS.length,
    documents,
  };
}

export const mongoCmsRepository = {
  getFullDatabase: mongoGetFullDatabase,
  getAll: mongoGetAll,
  getById: mongoGetById,
  getBySlug: mongoGetBySlug,
  create: mongoCreate,
  update: mongoUpdate,
  remove: mongoRemove,
  duplicate: mongoDuplicate,
  updateSiteSettings: mongoUpdateSiteSettings,
  updateHomepage: mongoUpdateHomepage,
  updateNavigation: mongoUpdateNavigation,
  replaceNavigationList: mongoReplaceNavigationList,
  seedFromCompiled: mongoSeedFromCompiled,
};
