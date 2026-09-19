'use client';

import { use } from 'react';
import { RegistrationEntriesInboxPage } from '@/components/admin/RegistrationEntriesInboxPage';

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RegistrationEntriesInboxPage formId={id} />;
}
