'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export function AccountRedirect() {
  const router = useRouter();
  const { session, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    if (session.role === 'admin') {
      router.replace('/admin');
      return;
    }
    if (session.personSlug) {
      router.replace(`/people/${session.personSlug}`);
      return;
    }
    router.replace('/people');
  }, [ready, session, router]);

  return (
    <p className="text-sm text-muted">Redirecting to your account…</p>
  );
}
