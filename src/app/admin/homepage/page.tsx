'use client';

import { Suspense } from 'react';
import { HomepageEditorPage } from '@/components/admin/HomepageEditorPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-[#697274]">Loading…</p>}>
      <HomepageEditorPage />
    </Suspense>
  );
}
