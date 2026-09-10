import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { getNavigation, getSiteSettings } from '@/lib/content/queries';

type PublicShellProps = {
  children: React.ReactNode;
};

export function PublicShell({ children }: PublicShellProps) {
  const settings = getSiteSettings();
  const navigation = getNavigation();

  return (
    <>
      <SkipLink />
      <SiteHeader
        organizationName={settings.organizationName}
        navigation={navigation.main}
      />
      <main id="main-content" className="min-w-0 flex-1 overflow-x-clip">
        {children}
      </main>
      <SiteFooter
        settings={settings}
        footerNav={navigation.footer}
        knowledgeHub={navigation.knowledgeHub}
      />
    </>
  );
}
