import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { requestOtp } from '@/lib/auth/server-ops';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    inviteToken?: string;
  };
  const result = await requestOtp({
    email: body.email ?? '',
    inviteToken: body.inviteToken,
  });
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
