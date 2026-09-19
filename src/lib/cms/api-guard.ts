import { timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getCmsDriver } from '@/lib/cms/server-repository';

export const CMS_ADMIN_COOKIE = 'bksr_cms_admin';

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function matchSecret(provided: string, expected: string): boolean {
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Admin mutations:
 * - Mongo: requires CMS_ADMIN_SECRET (cookie or header)
 * - Local file CMS: open in development; secret required if CMS_ADMIN_SECRET is set
 */
export async function assertCmsAdmin(
  request: Request,
): Promise<NextResponse | null> {
  const driver = getCmsDriver();
  const expected = process.env.CMS_ADMIN_SECRET;

  if (driver === 'fs' && !expected) {
    return null;
  }

  if (!expected) {
    return jsonError('CMS_ADMIN_SECRET is not configured on the server', 503);
  }

  const header = request.headers.get('x-cms-admin-secret') ?? '';
  if (header && matchSecret(header, expected)) return null;

  try {
    const jar = await cookies();
    const cookie = jar.get(CMS_ADMIN_COOKIE)?.value ?? '';
    if (cookie && matchSecret(cookie, expected)) return null;
  } catch {
    /* cookies() unavailable outside request context */
  }

  return jsonError('Unauthorized', 401);
}

export function isApiCmsEnabled(): boolean {
  return true;
}

export function requireCmsDriver(): NextResponse | null {
  return null;
}

/** @deprecated use requireCmsDriver */
export function requireMongoDriver(): NextResponse | null {
  return requireCmsDriver();
}
