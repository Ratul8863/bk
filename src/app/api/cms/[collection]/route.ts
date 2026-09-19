import { assertCmsAdmin, jsonError, jsonOk } from '@/lib/cms/api-guard';
import { parseCollectionKey } from '@/lib/cms/collection-param';

type RouteContext = { params: Promise<{ collection: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { collection: raw } = await context.params;
  const collection = parseCollectionKey(raw);
  if (!collection) return jsonError(`Unknown collection: ${raw}`, 404);

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const slug = url.searchParams.get('slug');
  const publishedOnly = url.searchParams.get('published') === '1';

  try {
    const {
      serverGetById,
      serverGetBySlug,
      serverGetAll,
    } = await import('@/lib/cms/server-repository');

    if (id) {
      const item = await serverGetById(collection, id);
      if (!item) return jsonError('Not found', 404);
      if (
        publishedOnly &&
        'status' in item &&
        (item as { status: string }).status !== 'published'
      ) {
        return jsonError('Not found', 404);
      }
      return jsonOk({ item });
    }

    if (slug) {
      const item = await serverGetBySlug(collection, slug);
      if (!item) return jsonError('Not found', 404);
      if (
        publishedOnly &&
        'status' in item &&
        (item as { status: string }).status !== 'published'
      ) {
        return jsonError('Not found', 404);
      }
      return jsonOk({ item });
    }

    let items = await serverGetAll(collection);
    if (publishedOnly) {
      items = items.filter(
        (item) =>
          !('status' in item) ||
          (item as { status: string }).status === 'published',
      );
    }
    return jsonOk({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Query failed';
    return jsonError(message, 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const denied = await assertCmsAdmin(request);
  if (denied) return denied;

  const { collection: raw } = await context.params;
  const collection = parseCollectionKey(raw);
  if (!collection) return jsonError(`Unknown collection: ${raw}`, 404);

  try {
    const body = await request.json();
    const { serverCreate } = await import('@/lib/cms/server-repository');
    const item = await serverCreate(collection, body);
    return jsonOk({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Create failed';
    return jsonError(message, 500);
  }
}
