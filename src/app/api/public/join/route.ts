import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { serverSubmitJoinApplication } from '@/lib/cms/public-ops';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    data?: Record<string, string | number | boolean>;
  };

  const data = body.data && typeof body.data === 'object' ? body.data : {};
  const result = await serverSubmitJoinApplication(data);

  if ('error' in result) {
    return jsonError(result.error, 400);
  }

  return jsonOk({ application: result });
}
