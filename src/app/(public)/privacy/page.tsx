import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getSiteSettings } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Privacy',
  'Privacy information for the BK School of Research website.',
  '/privacy',
);

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        title="Privacy"
        description="How this website handles information."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]}
      />
      <Section>
        <Container narrow>
          <div className="space-y-6 text-base leading-relaxed text-body">
            <p>
              {settings.organizationName} ({settings.organizationShortName}) publishes this website
              to share research, publications, and institutional information.
            </p>
            <p>
              Contact forms on this site are demonstration interfaces only and do not transmit data
              to a server. For formal correspondence, use the email addresses listed on the Contact page.
            </p>
            <p>
              Server logs for hosting and analytics, if enabled by the deployment platform, may
              include standard technical data such as IP address, browser type, and requested URLs.
              No personal profiles are sold or shared for advertising.
            </p>
            <p>
              Questions about privacy may be sent to{' '}
              <a href={`mailto:${settings.emails.general}`} className="text-accent hover:underline">
                {settings.emails.general}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

