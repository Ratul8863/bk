'use client';

import { Suspense } from 'react';
import { NavigationEditorPage } from '@/components/admin/NavigationEditorPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#697274]">Loading…</p>}>
      <NavigationEditorPage />
    </Suspense>
  );
}
