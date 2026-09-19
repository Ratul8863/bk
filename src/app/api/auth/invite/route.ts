import { assertCmsAdmin, jsonError, jsonOk } from '@/lib/cms/api-guard';
import { adminInvitePerson } from '@/lib/auth/server-ops';
import type { PersonCategory } from '@/types/content';

export async function POST(request: Request) {
  const denied = await assertCmsAdmin(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    role?: string;
    category?: PersonCategory;
  };

  const result = await adminInvitePerson({
    name: body.name ?? '',
    email: body.email ?? '',
    role: body.role ?? '',
    category: body.category ?? 'research-team',
  });

  if (!result.ok) return jsonError(result.error, 400);
  return jsonOk(result);
}
