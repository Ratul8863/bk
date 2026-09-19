import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { serverSubmitRegistration } from '@/lib/cms/public-ops';

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const body = (await request.json().catch(() => ({}))) as {
    data?: Record<string, string | number | boolean>;
  };

  const result = await serverSubmitRegistration(slug, body.data ?? {});
  if (!result.ok) {
    return jsonError(result.error, 400);
  }

  return jsonOk({ entry: result.entry });
}
