import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { verifyOtp } from '@/lib/auth/server-ops';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    otp?: string;
  };
  const result = await verifyOtp({
    email: body.email ?? '',
    otp: body.otp ?? '',
  });
  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
