import { cookies } from 'next/headers';
import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { completeRegistration } from '@/lib/auth/server-ops';
import { AUTH_SESSION_COOKIE } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    registerToken?: string;
    password?: string;
    inviteToken?: string;
    profile?: {
      name?: string;
      shortBio?: string;
      bio?: string;
      photoUrl?: string;
      affiliation?: string;
    };
  };

  const result = await completeRegistration({
    registerToken: body.registerToken ?? '',
    password: body.password ?? '',
    inviteToken: body.inviteToken,
    profile: {
      name: body.profile?.name ?? '',
      shortBio: body.profile?.shortBio ?? '',
      bio: body.profile?.bio ?? '',
      photoUrl: body.profile?.photoUrl,
      affiliation: body.profile?.affiliation,
    },
  });

  if (!result.ok) return jsonError(result.error, 400);

  const jar = await cookies();
  jar.set(AUTH_SESSION_COOKIE, result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return jsonOk({
    session: result.session,
    personSlug: result.personSlug,
  });
}
