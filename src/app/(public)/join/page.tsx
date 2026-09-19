import Link from 'next/link';
import { JoinApplicationForm } from '@/components/public/JoinApplicationForm';
import { FormSidePanel } from '@/components/layout/FormSidePanel';
import {
  UtilityFormFooterLink,
  UtilityFormShell,
} from '@/components/layout/UtilityFormShell';
import { getContentDatabase } from '@/lib/cms/get-content-database';
import { getJoinForm } from '@/lib/content/registration-forms';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Join BKSR',
  'Apply to join BK School of Research as a researcher or organisational collaborator.',
  '/join',
);

export default async function JoinPage() {
  const form = getJoinForm(await getContentDatabase());

  return (
    <UtilityFormShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'People', href: '/people' },
        { label: 'Join' },
      ]}
      title="Join BKSR"
      description={
        form.description ||
        'One application. We review it, then invite approved applicants to create an account.'
      }
      panel={
        <FormSidePanel
          eyebrow="Join BKSR"
          title="One form. We review. You get an invite."
          description="No account needed to apply. Choose your path in the form, share your details, and wait for our email if approved."
          lottieSrc="/media/lottie/join-apply.json"
          footer={
            <>
              Already invited?{' '}
              <Link
                href="/register"
                className="font-semibold text-paper underline-offset-2 hover:underline"
              >
                Create your account
              </Link>
              .
            </>
          }
        />
      }
      cardEyebrow="Application"
      cardTitle={form.title}
      footer={
        <>
          Already invited?{' '}
          <UtilityFormFooterLink href="/register">
            Create your account
          </UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/people/career">
            Career vacancies
          </UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/contact">Contact</UtilityFormFooterLink>
        </>
      }
    >
      <JoinApplicationForm form={form} />
    </UtilityFormShell>
  );
}
