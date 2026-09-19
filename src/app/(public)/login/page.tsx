import {
  UtilityFormFooterLink,
  UtilityFormShell,
} from '@/components/layout/UtilityFormShell';
import { FormSidePanel } from '@/components/layout/FormSidePanel';
import { LoginForm } from '@/components/auth/LoginForm';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Sign in',
  'Sign in to BK School of Research to manage your claimed profile.',
  '/login',
);

export default function LoginPage() {
  return (
    <UtilityFormShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Sign in' },
      ]}
      title="Sign in"
      description="Members manage their claimed profiles. Administrators open the Content Studio after signing in."
      panel={
        <FormSidePanel
          eyebrow="Members"
          title="Your profile, securely."
          description="Sign in with the email from your BKSR invitation or profile claim. Applications go through Join — not open signup."
          lottieSrc="/media/lottie/auth-secure.json"
          footer={
            <>
              New to BKSR?{' '}
              <a
                href="/join"
                className="font-semibold text-paper underline-offset-2 hover:underline"
              >
                Apply to join
              </a>
              .
            </>
          }
        />
      }
      cardEyebrow="Account"
      cardTitle="Member sign in"
      footer={
        <>
          Invited?{' '}
          <UtilityFormFooterLink href="/register">
            Create your account
          </UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/join">Apply to join</UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/forgot-password">
            Forgot password
          </UtilityFormFooterLink>
        </>
      }
    >
      <LoginForm />
    </UtilityFormShell>
  );
}
