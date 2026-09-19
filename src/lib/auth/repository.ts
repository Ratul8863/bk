import { contentRepository } from '@/lib/cms/repository';
import { hashOtp, hashPassword, verifyPassword } from '@/lib/auth/hash';
import { normalizeEmail } from '@/lib/auth/permissions';
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  type Account,
  type AuthSession,
} from '@/types/auth';
import type { Person } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

export const AUTH_STORAGE_KEY = 'bksr-auth-v1';

const OTP_TTL_MS = 10 * 60 * 1000;
const REGISTER_TOKEN_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  personId: string;
}

interface RegisterTokenRecord {
  email: string;
  personId: string;
  expiresAt: number;
}

interface AuthStore {
  accounts: Account[];
  session: AuthSession | null;
  otps: Record<string, OtpRecord>;
  registerTokens: Record<string, RegisterTokenRecord>;
  seeded: boolean;
}

export type CheckEmailResult =
  | {
      ok: true;
      /** Demo-only: shown in Dev OTP callout — never in production */
      demoOtp: string;
      personPreview: { name: string; email: string; role: string };
    }
  | { ok: false; error: string };

export type VerifyOtpResult =
  | {
      ok: true;
      registerToken: string;
      personPreview: { name: string; email: string; role: string };
    }
  | { ok: false; error: string };

export type RegisterResult =
  | { ok: true; session: AuthSession; personSlug: string }
  | { ok: false; error: string };

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emptyStore(): AuthStore {
  return {
    accounts: [],
    session: null,
    otps: {},
    registerTokens: {},
    seeded: false,
  };
}

function readStore(): AuthStore {
  if (!canUseLocalStorage()) return emptyStore();
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as AuthStore;
    return {
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
      session: parsed.session ?? null,
      otps: parsed.otps ?? {},
      registerTokens: parsed.registerTokens ?? {},
      seeded: Boolean(parsed.seeded),
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: AuthStore): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(store));
}

function nowIso(): string {
  return new Date().toISOString();
}

function generateOtp(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return String(n).padStart(6, '0');
}

function findPersonByEmail(email: string): Person | undefined {
  const normalized = normalizeEmail(email);
  const people = contentRepository.getDatabase().people as Person[];
  return people.find(
    (p) => p.email && normalizeEmail(p.email) === normalized,
  );
}

function findAccountByEmail(store: AuthStore, email: string): Account | undefined {
  const normalized = normalizeEmail(email);
  return store.accounts.find((a) => a.email === normalized);
}

async function ensureDemoAdmin(store: AuthStore): Promise<AuthStore> {
  if (store.seeded && findAccountByEmail(store, DEMO_ADMIN_EMAIL)) {
    return store;
  }
  const existing = findAccountByEmail(store, DEMO_ADMIN_EMAIL);
  if (existing) {
    store.seeded = true;
    writeStore(store);
    return store;
  }
  const passwordHash = await hashPassword(DEMO_ADMIN_PASSWORD);
  const stamp = nowIso();
  store.accounts.push({
    id: 'account-demo-admin',
    email: DEMO_ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
    personId: null,
    emailVerifiedAt: stamp,
    createdAt: stamp,
    updatedAt: stamp,
  });
  store.seeded = true;
  writeStore(store);
  return store;
}

function toSession(account: Account): AuthSession {
  return {
    accountId: account.id,
    email: account.email,
    role: account.role,
    personId: account.personId ?? null,
    createdAt: nowIso(),
  };
}

export const authRepository = {
  async init(): Promise<AuthSession | null> {
    let store = readStore();
    store = await ensureDemoAdmin(store);
    return store.session;
  },

  getSession(): AuthSession | null {
    return readStore().session;
  },

  getAccounts(): Account[] {
    return readStore().accounts.map(({ passwordHash: _, ...rest }) => ({
      ...rest,
      passwordHash: '[redacted]',
    })) as Account[];
  },

  async checkEmail(email: string): Promise<CheckEmailResult> {
    let store = readStore();
    store = await ensureDemoAdmin(store);

    const normalized = normalizeEmail(email);
    if (!normalized || !normalized.includes('@')) {
      return { ok: false, error: 'Enter a valid email address.' };
    }

    const person = findPersonByEmail(normalized);
    if (!person) {
      return {
        ok: false,
        error:
          'This email is not on the BKSR people allowlist. Ask an administrator to add your profile first.',
      };
    }

    if (person.accountId || findAccountByEmail(store, normalized)) {
      return {
        ok: false,
        error: 'An account already exists for this email. Please sign in instead.',
      };
    }

    const otp = generateOtp();
    const codeHash = await hashOtp(otp);
    store.otps[normalized] = {
      codeHash,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
      personId: person.id,
    };
    writeStore(store);

    return {
      ok: true,
      demoOtp: otp,
      personPreview: {
        name: person.name,
        email: normalized,
        role: person.role,
      },
    };
  },

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
    const store = readStore();
    const normalized = normalizeEmail(email);
    const record = store.otps[normalized];

    if (!record) {
      return { ok: false, error: 'No active code for this email. Request a new one.' };
    }
    if (Date.now() > record.expiresAt) {
      delete store.otps[normalized];
      writeStore(store);
      return { ok: false, error: 'Code expired. Request a new one.' };
    }
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      delete store.otps[normalized];
      writeStore(store);
      return { ok: false, error: 'Too many attempts. Request a new code.' };
    }

    const ok = (await hashOtp(otp.trim())) === record.codeHash;
    if (!ok) {
      record.attempts += 1;
      store.otps[normalized] = record;
      writeStore(store);
      return { ok: false, error: 'Incorrect code. Try again.' };
    }

    const person = contentRepository
      .getDatabase()
      .people.find((p) => p.id === record.personId) as Person | undefined;
    if (!person) {
      return { ok: false, error: 'Linked profile was removed. Contact an administrator.' };
    }

    delete store.otps[normalized];
    const registerToken = uuidv4();
    store.registerTokens[registerToken] = {
      email: normalized,
      personId: person.id,
      expiresAt: Date.now() + REGISTER_TOKEN_TTL_MS,
    };
    writeStore(store);

    return {
      ok: true,
      registerToken,
      personPreview: {
        name: person.name,
        email: normalized,
        role: person.role,
      },
    };
  },

  async register(
    registerToken: string,
    password: string,
  ): Promise<RegisterResult> {
    const store = readStore();
    const token = store.registerTokens[registerToken];
    if (!token) {
      return { ok: false, error: 'Registration session expired. Start again.' };
    }
    if (Date.now() > token.expiresAt) {
      delete store.registerTokens[registerToken];
      writeStore(store);
      return { ok: false, error: 'Registration session expired. Start again.' };
    }
    if (password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' };
    }

    if (findAccountByEmail(store, token.email)) {
      return { ok: false, error: 'An account already exists for this email.' };
    }

    const person = contentRepository
      .getDatabase()
      .people.find((p) => p.id === token.personId) as Person | undefined;
    if (!person) {
      return { ok: false, error: 'Linked profile was removed. Contact an administrator.' };
    }

    const stamp = nowIso();
    const account: Account = {
      id: uuidv4(),
      email: token.email,
      passwordHash: await hashPassword(password),
      role: 'member',
      personId: person.id,
      emailVerifiedAt: stamp,
      createdAt: stamp,
      updatedAt: stamp,
    };

    store.accounts.push(account);
    delete store.registerTokens[registerToken];
    const session = toSession(account);
    store.session = session;
    writeStore(store);

    contentRepository.update('people', person.id, {
      accountId: account.id,
      claimStatus: 'claimed',
      email: token.email,
    });

    return { ok: true, session, personSlug: person.slug };
  },

  async login(email: string, password: string): Promise<LoginResult> {
    let store = readStore();
    store = await ensureDemoAdmin(store);

    const normalized = normalizeEmail(email);
    const account = findAccountByEmail(store, normalized);
    if (!account) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    const valid = await verifyPassword(password, account.passwordHash);
    if (!valid) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const session = toSession(account);
    store.session = session;
    writeStore(store);
    return { ok: true, session };
  },

  logout(): void {
    const store = readStore();
    store.session = null;
    writeStore(store);
  },

  resetAuthStore(): void {
    if (!canUseLocalStorage()) return;
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
