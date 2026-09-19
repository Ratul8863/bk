import { Suspense } from 'react';
import {
  UtilityFormFooterLink,
  UtilityFormShell,
} from '@/components/layout/UtilityFormShell';
import { FormSidePanel } from '@/components/layout/FormSidePanel';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Register',
  'Accept your BKSR invitation or claim an allowlisted team profile.',
  '/register',
);

export default function RegisterPage() {
  return (
    <UtilityFormShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Register' },
      ]}
      title="Create your account"
      description="If an administrator invited you, open the link from your email. Verify with a one-time code, complete your profile, then set a password."
      panel={
        <FormSidePanel
          eyebrow="Invitation"
          title="Claimed profiles only."
          description="Registration is invite- or allowlist-based. Apply to join first if you are not yet on the team."
          lottieSrc="/media/lottie/auth-secure.json"
          footer={
            <>
              Need access?{' '}
              <a
                href="/join"
                className="font-semibold text-paper underline-offset-2 hover:underline"
              >
                Apply to join BKSR
              </a>
              .
            </>
          }
        />
      }
      cardEyebrow="Account"
      cardTitle="Complete registration"
      footer={
        <>
          Already registered?{' '}
          <UtilityFormFooterLink href="/login">Sign in</UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/join">Apply to join</UtilityFormFooterLink>
        </>
      }
    >
      <Suspense
        fallback={<p className="text-sm text-muted">Loading registration…</p>}
      >
        <RegisterForm />
      </Suspense>
    </UtilityFormShell>
  );
}
