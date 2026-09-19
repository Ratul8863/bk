'use client';

import { Suspense, use } from 'react';
import { RegistrationFormEditorPage } from '@/components/admin/RegistrationFormEditorPage';

function Editor({ id }: { id: string }) {
  return <RegistrationFormEditorPage mode="edit" id={id} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense fallback={<p className="text-sm text-[#68727D]">Loading…</p>}>
      <Editor id={id} />
    </Suspense>
  );
}
