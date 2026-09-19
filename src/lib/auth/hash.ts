/** Demo-only password hashing (SHA-256). Phase 2: Argon2id. */

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`bksr-demo-v1:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  const next = await hashPassword(password);
  return next === passwordHash;
}

export async function hashOtp(otp: string): Promise<string> {
  const data = new TextEncoder().encode(`bksr-otp-v1:${otp}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}
