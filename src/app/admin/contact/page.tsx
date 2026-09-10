'use client';

import { SettingsEditorPage } from '@/components/admin/SettingsEditorPage';

export default function Page() {
  return (
    <SettingsEditorPage
      mode="contact"
      title="Contact Info"
      description="Address, phone, and organization emails shown on the public site."
    />
  );
}
