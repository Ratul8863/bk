'use client';

import { SettingsEditorPage } from '@/components/admin/SettingsEditorPage';

export default function Page() {
  return (
    <SettingsEditorPage
      mode="social"
      title="Social Links"
      description="Public social profiles linked from the footer and contact areas."
    />
  );
}
