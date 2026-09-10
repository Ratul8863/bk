'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { contentRepository } from '@/lib/cms/repository';
import type {
  CollectionEntityMap,
  ContentCollectionKey,
  ContentDatabase,
  HomepageConfig,
  SiteSettings,
} from '@/types/content';

interface CmsContextValue {
  database: ContentDatabase | null;
  ready: boolean;
  refresh: () => void;
  createItem: <K extends ContentCollectionKey>(
    collection: K,
    input: Omit<CollectionEntityMap[K], 'id' | 'createdAt' | 'updatedAt'> &
      Partial<Pick<CollectionEntityMap[K], 'id' | 'createdAt' | 'updatedAt'>>,
  ) => CollectionEntityMap[K];
  updateItem: <K extends ContentCollectionKey>(
    collection: K,
    id: string,
    patch: Partial<CollectionEntityMap[K]>,
  ) => CollectionEntityMap[K] | undefined;
  deleteItem: <K extends ContentCollectionKey>(collection: K, id: string) => void;
  duplicateItem: <K extends ContentCollectionKey>(
    collection: K,
    id: string,
  ) => CollectionEntityMap[K] | undefined;
  saveSiteSettings: (patch: Partial<SiteSettings>) => void;
  saveHomepage: (patch: Partial<HomepageConfig>) => void;
  saveNavigation: (patch: Partial<ContentDatabase['navigation']>) => void;
  resetDemoData: () => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [database, setDatabase] = useState<ContentDatabase | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setDatabase(contentRepository.getDatabase());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const value = useMemo<CmsContextValue>(
    () => ({
      database,
      ready,
      refresh,
      createItem: (collection, input) => {
        const { item } = contentRepository.create(collection, input);
        refresh();
        return item;
      },
      updateItem: (collection, id, patch) => {
        const { item } = contentRepository.update(collection, id, patch);
        refresh();
        return item;
      },
      deleteItem: (collection, id) => {
        contentRepository.remove(collection, id);
        refresh();
      },
      duplicateItem: (collection, id) => {
        const { item } = contentRepository.duplicate(collection, id);
        refresh();
        return item;
      },
      saveSiteSettings: (patch) => {
        contentRepository.updateSiteSettings(patch);
        refresh();
      },
      saveHomepage: (patch) => {
        contentRepository.updateHomepage(patch);
        refresh();
      },
      saveNavigation: (patch) => {
        contentRepository.updateNavigation(patch);
        refresh();
      },
      resetDemoData: () => {
        contentRepository.resetDatabase();
        refresh();
      },
    }),
    [database, ready, refresh],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}
