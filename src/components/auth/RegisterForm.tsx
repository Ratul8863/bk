'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  authErrorClass,
  authInputClass,
  authNoticeClass,
} from '@/components/auth/auth-styles';
import { Button } from '@/components/ui/Button';
import { CloudinaryImageField } from '@/components/media/CloudinaryImageField';

type Step = 'email' | 'otp' | 'profile' | 'password';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('invite');
  const { setSession } = useAuth();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [registerToken, setRegisterToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [preview, setPreview] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [inviteReady, setInviteReady] = useState(!inviteToken);

  useEffect(() => {
    if (!inviteToken) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/auth/session?invite=${encodeURIComponent(inviteToken)}`,
        );
        const data = (await res.json()) as {
          error?: string;
          email?: string;
          personPreview?: { name: string; email: string; role: string };
        };
        if (cancelled) return;
        if (!res.ok || !data.email || !data.personPreview) {
          setError(data.error || 'This invite link is not valid.');
          setInviteReady(true);
          return;
        }
        setEmail(data.email);
        setName(data.personPreview.name);
        setPreview(data.personPreview);
        setInviteReady(true);
      } catch {
        if (!cancelled) {
          setError('Could not load invite.');
          setInviteReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inviteToken]);

  const requestCode = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteToken }),
      });
      const data = (await res.json()) as {
        error?: string;
        personPreview?: { name: string; email: string; role: string };
        devOtp?: string;
      };
      if (!res.ok) {
        setError(data.error || 'Could not send code.');
        return;
      }
      setPreview(data.personPreview ?? null);
      setDevOtp(data.devOtp ?? null);
      setName((prev) => prev || data.personPreview?.name || '');
      setStep('otp');
    } catch {
      setError('Could not send code.');
    } finally {
      setBusy(false);
    }
  };

  if (!inviteReady) {
    return <p className="text-sm text-muted">Checking your invitation…</p>;
  }

  return (
    <div className="space-y-6">
      <div className={authNoticeClass}>
        <p className="font-semibold text-ink">
          {inviteToken ? 'Complete your BKSR invitation' : 'Claim your profile'}
        </p>
        <p className="mt-1">
          Verify your email with a one-time code, complete a short profile, then
          set a password to sign in.
        </p>
      </div>

      {preview ? (
        <div className="rounded-[1.15rem] border border-border bg-surface-subtle px-4 py-3.5 text-sm">
          <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Team position
          </p>
          <p className="mt-1 font-display text-xl text-ink">{preview.name}</p>
          <p className="text-muted">{preview.role}</p>
          <p className="mt-1 text-xs text-muted">{preview.email}</p>
        </div>
      ) : null}

      {error ? <p className={authErrorClass}>{error}</p> : null}

      {step === 'email' ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void requestCode();
          }}
        >
          <label className="block text-sm font-semibold text-ink">
            Email
            <input
              type="email"
              required
              className={authInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={Boolean(inviteToken)}
            />
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send verification code'}
          </Button>
        </form>
      ) : null}

      {step === 'otp' ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            void (async () => {
              try {
                const res = await fetch('/api/auth/otp/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, otp }),
                });
                const data = (await res.json()) as {
                  error?: string;
                  registerToken?: string;
                  personPreview?: {
                    name: string;
                    email: string;
                    role: string;
                  };
                };
                if (!res.ok || !data.registerToken) {
                  setError(data.error || 'Incorrect code.');
                  return;
                }
                setRegisterToken(data.registerToken);
                setPreview(data.personPreview ?? preview);
                setDevOtp(null);
                setStep('profile');
              } catch {
                setError('Could not verify code.');
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          {devOtp ? (
            <p className="rounded-md border border-border bg-paper px-3 py-2 text-sm text-body">
              Dev mode: your code is <strong className="font-mono">{devOtp}</strong>{' '}
              (email delivery is not configured).
            </p>
          ) : (
            <p className="text-sm text-muted">
              We sent a verification code to {email}.
            </p>
          )}
          <label className="block text-sm font-semibold text-ink">
            Verification code
            <input
              required
              className={authInputClass}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? 'Checking…' : 'Continue'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void requestCode()}
            >
              Resend code
            </Button>
          </div>
        </form>
      ) : null}

      {step === 'profile' ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep('password');
          }}
        >
          <label className="block text-sm font-semibold text-ink">
            Display name
            <input
              required
              className={authInputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Short bio
            <textarea
              required
              rows={3}
              className={authInputClass}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="One or two sentences about your work"
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Fuller bio (optional)
            <textarea
              rows={5}
              className={authInputClass}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <CloudinaryImageField
            label="Photo (optional)"
            value={photoUrl}
            onChange={setPhotoUrl}
            uploadEndpoint="/api/auth/upload-photo"
            uploadExtraFields={
              registerToken ? { registerToken } : undefined
            }
            help="Upload a portrait to Cloudinary, or paste an image URL."
            className="text-ink [&_label]:font-semibold [&_label]:text-ink"
          />
          <label className="block text-sm font-semibold text-ink">
            Affiliation (optional)
            <input
              className={authInputClass}
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </label>
          <Button type="submit">Continue to password</Button>
        </form>
      ) : null}

      {step === 'password' ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!registerToken) return;
            if (password !== confirm) {
              setError('Passwords do not match.');
              return;
            }
            setBusy(true);
            setError(null);
            void (async () => {
              try {
                const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    registerToken,
                    password,
                    inviteToken,
                    profile: {
                      name,
                      shortBio,
                      bio: bio || shortBio,
                      photoUrl,
                      affiliation,
                    },
                  }),
                });
                const data = (await res.json()) as {
                  error?: string;
                  session?: Parameters<typeof setSession>[0];
                  personSlug?: string;
                };
                if (!res.ok || !data.session || !data.personSlug) {
                  setError(data.error || 'Could not create account.');
                  return;
                }
                setSession(data.session);
                router.push(`/people/${data.personSlug}`);
              } catch {
                setError('Could not create account.');
              } finally {
                setBusy(false);
              }
            })();
          }}
        >
          <label className="block text-sm font-semibold text-ink">
            Password
            <input
              type="password"
              required
              minLength={8}
              className={authInputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Confirm password
            <input
              type="password"
              required
              minLength={8}
              className={authInputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      ) : null}

      <p className="border-t border-border pt-5 text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
