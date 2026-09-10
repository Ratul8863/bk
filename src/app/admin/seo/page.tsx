'use client';

import { SettingsEditorPage } from '@/components/admin/SettingsEditorPage';

export default function Page() {
  return (
    <SettingsEditorPage
      mode="seo"
      title="SEO Defaults"
      description="Fallback title, description, keywords, and OG image for pages without custom SEO."
    />
  );
}
