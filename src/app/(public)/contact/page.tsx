import { PageHero } from '@/components/layout/PageHero';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ContactForm } from '@/components/public/ContactForm';
import { getSiteSettings } from '@/lib/content/queries';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Contact',
  'Contact BK School of Research in Shahjadpur, Sirajganj, Bangladesh.',
  '/contact',
);

export default function ContactPage() {
  const settings = getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Contact"
        description="Reach BKSR by email, phone, or the form below."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl text-ink">Institutional details</h2>
              <address className="mt-6 space-y-3 text-base not-italic leading-relaxed text-body">
                <p>{settings.organizationName}</p>
                <p>{settings.address.full}</p>
                <p>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-accent hover:underline">
                    {settings.phone}
                  </a>
                </p>
                <p>
                  General:{' '}
                  <a href={`mailto:${settings.emails.general}`} className="text-accent hover:underline">
                    {settings.emails.general}
                  </a>
                </p>
                <p>
                  Executive Director:{' '}
                  <a href={`mailto:${settings.emails.executiveDirector}`} className="text-accent hover:underline">
                    {settings.emails.executiveDirector}
                  </a>
                </p>
                <p>
                  Research Director:{' '}
                  <a href={`mailto:${settings.emails.researchDirector}`} className="text-accent hover:underline">
                    {settings.emails.researchDirector}
                  </a>
                </p>
              </address>
            </div>
            <ContactForm />
          </div>
        </Container>
      </Section>
    </>
  );
}

