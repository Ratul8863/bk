'use client';

import { use } from 'react';
import { CollectionEditorPage } from '@/components/admin/CollectionEditorPage';

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <CollectionEditorPage collectionSlug="notices" mode="edit" id={id} />
  );
}
