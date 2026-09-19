import { assertCmsAdmin, jsonError, jsonOk } from '@/lib/cms/api-guard';
import { parseCollectionKey } from '@/lib/cms/collection-param';

type RouteContext = {
  params: Promise<{ collection: string; id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const denied = await assertCmsAdmin(request);
  if (denied) return denied;

  const { collection: raw, id } = await context.params;
  const collection = parseCollectionKey(raw);
  if (!collection) return jsonError(`Unknown collection: ${raw}`, 404);

  try {
    const { serverDuplicate } = await import('@/lib/cms/server-repository');
    const item = await serverDuplicate(collection, id);
    if (!item) return jsonError('Not found', 404);
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Duplicate failed';
    return jsonError(message, 500);
  }
}
