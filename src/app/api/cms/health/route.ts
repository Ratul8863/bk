import {
  assertCmsAdmin,
  jsonError,
  jsonOk,
} from '@/lib/cms/api-guard';
import { getCmsDriver } from '@/lib/cms/server-repository';
import { isMongoConfigured } from '@/lib/db/mongo';
import { isCloudinaryConfigured } from '@/lib/storage/cloudinary';
import { isResendConfigured } from '@/lib/email/send';

export async function GET() {
  const driver = getCmsDriver();
  return jsonOk({
    ok: true,
    driver,
    apiEnabled: true,
    mongoConfigured: isMongoConfigured(),
    cloudinaryConfigured: isCloudinaryConfigured(),
    resendConfigured: isResendConfigured(),
    mode: driver === 'mongo' ? 'mongo' : 'local-file',
  });
}

export async function POST(request: Request) {
  const denied = await assertCmsAdmin(request);
  if (denied) return denied;

  const driver = getCmsDriver();
  if (driver === 'fs') {
    try {
      const { fsDataFilePath, fsGetFullDatabase } = await import(
        '@/lib/cms/fs-repository'
      );
      await fsGetFullDatabase();
      return jsonOk({
        ok: true,
        driver: 'fs',
        dataFile: fsDataFilePath(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'FS health failed';
      return jsonError(message, 500);
    }
  }

  try {
    const { getDb } = await import('@/lib/db/mongo');
    const { ensureIndexes } = await import('@/lib/db/indexes');
    const db = await getDb();
    await db.command({ ping: 1 });
    await ensureIndexes(db);
    return jsonOk({ ok: true, driver: 'mongo', ping: true, indexes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Health check failed';
    return jsonError(message, 500);
  }
}
