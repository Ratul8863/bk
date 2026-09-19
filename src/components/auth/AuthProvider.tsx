'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthSession } from '@/types/auth';

interface AuthContextValue {
  session: AuthSession | null;
  ready: boolean;
  refresh: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = (await res.json()) as { session?: AuthSession | null };
      setSessionState(data.session ?? null);
    } catch {
      setSessionState(null);
    }
  }, []);

  useEffect(() => {
    void refresh().finally(() => setReady(true));
  }, [refresh]);

  const setSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/session', {
      method: 'DELETE',
      credentials: 'include',
    }).catch(() => null);
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      ready,
      refresh,
      setSession,
      logout,
    }),
    [session, ready, refresh, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function useAuthOptional(): AuthContextValue | null {
  return useContext(AuthContext);
}
