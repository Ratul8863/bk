import {
  UtilityFormFooterLink,
  UtilityFormShell,
} from '@/components/layout/UtilityFormShell';
import { FormSidePanel } from '@/components/layout/FormSidePanel';
import { Button } from '@/components/ui/Button';
import { authNoticeClass } from '@/components/auth/auth-styles';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata(
  'Forgot password',
  'Password reset will be available when email delivery is connected.',
  '/forgot-password',
);

export default function ForgotPasswordPage() {
  return (
    <UtilityFormShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Forgot password' },
      ]}
      title="Forgot password"
      description="Secure email reset ships with the production auth backend. Until then, use the options below."
      panel={
        <FormSidePanel
          eyebrow="Account"
          title="We will help you back in."
          description="Password reset by email is planned for Phase 2. For demo access, an administrator can clear the auth store or re-invite you."
          lottieSrc="/media/lottie/auth-secure.json"
        />
      }
      cardEyebrow="Reset"
      cardTitle="Password recovery"
      footer={
        <>
          <UtilityFormFooterLink href="/login">Back to sign in</UtilityFormFooterLink>
          {' · '}
          <UtilityFormFooterLink href="/contact">Contact BKSR</UtilityFormFooterLink>
        </>
      }
    >
      <div className="space-y-5">
        <div className={authNoticeClass}>
          <p className="font-semibold text-ink">Demo stub</p>
          <p className="mt-1.5">
            OTP-backed reset links will be emailed securely in Phase 2. For now,
            ask an administrator to clear the demo auth store, or register again
            after they unlink your profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/login" variant="primary">
            Back to sign in
          </Button>
          <Button href="/contact" variant="secondary">
            Contact BKSR
          </Button>
        </div>
      </div>
    </UtilityFormShell>
  );
}
