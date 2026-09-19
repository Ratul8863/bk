import 'server-only';

export type MailResult = { sent: boolean; preview?: string; error?: string };

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * Email delivery via Resend.
 * Without RESEND_API_KEY, logs and returns sent:false so UI can show invite/OTP.
 * FROM must be a verified Resend domain (not a free Gmail address).
 */
async function deliver(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    'BK School of Research <onboarding@resend.dev>';

  if (!key) {
    console.info('[bksr-email:dev]', {
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return { sent: false, preview: input.text };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('[bksr-email] Resend failed', res.status, body);
      return {
        sent: false,
        preview: input.text,
        error: `Resend ${res.status}: ${body.slice(0, 200)}`,
      };
    }
    return { sent: true };
  } catch (err) {
    console.error('[bksr-email] send error', err);
    return {
      sent: false,
      preview: input.text,
      error: err instanceof Error ? err.message : 'Send failed',
    };
  }
}

export async function sendInviteEmail(input: {
  to: string;
  name: string;
  role: string;
  inviteUrl: string;
}): Promise<MailResult> {
  const subject = `You've been added to BK School of Research`;
  const text = [
    `Dear ${input.name},`,
    ``,
    `You have been added to BK School of Research as ${input.role}.`,
    ``,
    `Create your account and complete your profile here:`,
    input.inviteUrl,
    ``,
    `This link will ask you to verify your email with a one-time code, then set your password and profile details.`,
    ``,
    `— BK School of Research`,
  ].join('\n');

  const html = `
    <p>Dear ${escapeHtml(input.name)},</p>
    <p>You have been added to <strong>BK School of Research</strong> as <strong>${escapeHtml(input.role)}</strong>.</p>
    <p><a href="${escapeHtml(input.inviteUrl)}">Create your account and complete your profile</a></p>
    <p>You will verify your email with a one-time code, then set a password and your profile details (photo, short bio, and more).</p>
    <p>— BK School of Research</p>
  `;

  return deliver({ to: input.to, subject, html, text });
}

export async function sendOtpEmail(input: {
  to: string;
  name: string;
  otp: string;
}): Promise<MailResult> {
  const subject = `Your BKSR verification code`;
  const text = [
    `Dear ${input.name},`,
    ``,
    `Your verification code is: ${input.otp}`,
    ``,
    `It expires in 10 minutes.`,
    ``,
    `— BK School of Research`,
  ].join('\n');
  const html = `
    <p>Dear ${escapeHtml(input.name)},</p>
    <p>Your verification code is:</p>
    <p style="font-size:24px;letter-spacing:4px;font-weight:700">${escapeHtml(input.otp)}</p>
    <p>It expires in 10 minutes.</p>
    <p>— BK School of Research</p>
  `;
  return deliver({ to: input.to, subject, html, text });
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<MailResult> {
  const to =
    process.env.CONTACT_INBOX_EMAIL?.trim() ||
    process.env.RESEND_CONTACT_TO?.trim() ||
    'info@bkschoolofresearch.org';

  const subject = `[BKSR contact] ${input.subject}`;
  const text = [
    `From: ${input.name} <${input.email}>`,
    ``,
    input.message,
  ].join('\n');
  const html = `
    <p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
  `;

  return deliver({
    to,
    subject,
    html,
    text,
    replyTo: input.email,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
