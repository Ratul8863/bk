import { assertCmsAdmin, jsonError, jsonOk } from '@/lib/cms/api-guard';

export async function POST(request: Request) {
  const denied = await assertCmsAdmin(request);
  if (denied) return denied;

  try {
    const body = (await request.json().catch(() => ({}))) as { wipe?: boolean };
    const { serverSeedFromCompiled } = await import(
      '@/lib/cms/server-repository'
    );
    const result = await serverSeedFromCompiled({ wipe: Boolean(body.wipe) });
    return jsonOk({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Seed failed';
    return jsonError(message, 500);
  }
}
