import { cookies } from 'next/headers';
import { timingSafeEqual } from 'crypto';
import {
  CMS_ADMIN_COOKIE,
  jsonError,
  jsonOk,
} from '@/lib/cms/api-guard';
import { getCmsDriver } from '@/lib/cms/server-repository';

const MAX_AGE = 60 * 60 * 12;

function secretsMatch(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const expected = process.env.CMS_ADMIN_SECRET;
  const driver = getCmsDriver();

  if (!expected) {
    if (driver === 'fs') {
      return jsonOk({ ok: true, open: true });
    }
    return jsonError('CMS_ADMIN_SECRET is not configured', 503);
  }

  const body = (await request.json().catch(() => ({}))) as { secret?: string };
  if (!body.secret || !secretsMatch(body.secret, expected)) {
    return jsonError('Invalid secret', 401);
  }

  const jar = await cookies();
  jar.set(CMS_ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });

  return jsonOk({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(CMS_ADMIN_COOKIE);
  return jsonOk({ ok: true });
}

export async function GET() {
  const driver = getCmsDriver();
  const expected = process.env.CMS_ADMIN_SECRET;

  if (!expected && driver === 'fs') {
    return jsonOk({
      authenticated: true,
      apiEnabled: true,
      driver,
      open: true,
    });
  }

  const jar = await cookies();
  const value = jar.get(CMS_ADMIN_COOKIE)?.value;
  const authenticated = Boolean(
    expected && value && secretsMatch(value, expected),
  );
  return jsonOk({
    authenticated,
    apiEnabled: true,
    driver,
  });
}
