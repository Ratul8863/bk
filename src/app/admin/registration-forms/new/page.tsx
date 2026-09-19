'use client';

import { Suspense } from 'react';
import { RegistrationFormEditorPage } from '@/components/admin/RegistrationFormEditorPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#68727D]">Loading…</p>}>
      <RegistrationFormEditorPage mode="new" />
    </Suspense>
  );
}
