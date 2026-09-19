'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  authErrorClass,
  authInputClass,
  authNoticeClass,
} from '@/components/auth/auth-styles';
import { Button } from '@/components/ui/Button';
import type { AuthSession } from '@/types/auth';

export function LoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as {
        error?: string;
        session?: AuthSession;
      };
      if (!res.ok || !data.session) {
        setError(data.error || 'Could not sign in.');
        return;
      }
      setSession(data.session);
      if (data.session.role === 'admin') {
        router.push('/admin');
        return;
      }
      if (data.session.personSlug) {
        router.push(`/people/${data.session.personSlug}`);
        return;
      }
      router.push('/account');
    } catch {
      setError('Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={authNoticeClass}>
        <p className="font-semibold text-ink">Member access</p>
        <p className="mt-1">
          Use the email and password from your BKSR invitation or profile claim.
        </p>
      </div>

      {error ? <p className={authErrorClass}>{error}</p> : null}

      <form className="space-y-5" onSubmit={onSubmit}>
        <label className="block">
          <span className="font-sans text-sm font-semibold text-ink">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </label>
        <label className="block">
          <span className="font-sans text-sm font-semibold text-ink">
            Password
          </span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </label>
        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-muted hover:text-accent"
          >
            Forgot password?
          </Link>
          <Button type="submit" variant="primary" disabled={busy} withArrow>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
      </form>
    </div>
  );
}
