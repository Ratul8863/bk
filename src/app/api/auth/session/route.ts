import { AUTH_SESSION_COOKIE } from '@/lib/auth/cookies';
import { cookies } from 'next/headers';
import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import {
  destroySession,
  resolveInvite,
  sessionFromToken,
} from '@/lib/auth/server-ops';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invite = searchParams.get('invite');
  if (invite) {
    const result = await resolveInvite(invite);
    if (!result.ok) return jsonError(result.error, 400);
    return jsonOk({
      email: result.email,
      personPreview: {
        name: result.person.name,
        email: result.email,
        role: result.person.role,
        category: result.person.category,
      },
    });
  }

  const jar = await cookies();
  const token = jar.get(AUTH_SESSION_COOKIE)?.value;
  const session = await sessionFromToken(token);
  return jsonOk({ session });
}

export async function DELETE() {
  const jar = await cookies();
  const token = jar.get(AUTH_SESSION_COOKIE)?.value;
  await destroySession(token);
  jar.delete(AUTH_SESSION_COOKIE);
  return jsonOk({ ok: true });
}
