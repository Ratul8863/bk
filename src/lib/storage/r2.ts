import 'server-only';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE_URL,
  );
}

function getClient(): S3Client {
  const accountId = required('R2_ACCOUNT_ID');
  const endpoint =
    process.env.R2_ENDPOINT ||
    `https://${accountId}.r2.cloudflarestorage.com`;

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: required('R2_ACCESS_KEY_ID'),
      secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
    },
  });
}

function publicUrlForKey(key: string): string {
  const base = required('R2_PUBLIC_BASE_URL').replace(/\/$/, '');
  return `${base}/${key}`;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export async function uploadToR2(input: {
  body: Buffer | Uint8Array;
  contentType: string;
  filename: string;
  folder?: string;
}): Promise<{ key: string; url: string }> {
  const bucket = required('R2_BUCKET');
  const folder = (input.folder || 'media').replace(/^\/+|\/+$/g, '');
  const safe = sanitizeFilename(input.filename) || 'file';
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safe}`;

  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: input.body,
      ContentType: input.contentType,
    }),
  );

  return { key, url: publicUrlForKey(key) };
}

export async function deleteFromR2(key: string): Promise<void> {
  const bucket = required('R2_BUCKET');
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

/** Optional: browser-direct upload via presigned PUT */
export async function createR2PresignedUpload(input: {
  filename: string;
  contentType: string;
  folder?: string;
  expiresInSeconds?: number;
}): Promise<{ key: string; uploadUrl: string; publicUrl: string }> {
  const bucket = required('R2_BUCKET');
  const folder = (input.folder || 'media').replace(/^\/+|\/+$/g, '');
  const safe = sanitizeFilename(input.filename) || 'file';
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safe}`;

  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: input.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: input.expiresInSeconds ?? 600,
  });

  return {
    key,
    uploadUrl,
    publicUrl: publicUrlForKey(key),
  };
}

export function keyFromPublicUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '');
  if (!base || !url.startsWith(base + '/')) return null;
  return url.slice(base.length + 1);
}
