import { jsonError, jsonOk } from '@/lib/cms/api-guard';
import { isResendConfigured, sendContactEmail } from '@/lib/email/send';

/**
 * Public contact form → Resend inbox.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const subject = body.subject?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (!name || !email || !subject || !message) {
      return jsonError('Please fill in all fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError('Enter a valid email address.');
    }
    if (message.length > 8000) {
      return jsonError('Message is too long.');
    }

    if (!isResendConfigured()) {
      return jsonError(
        'Email is not configured yet. Please use the addresses listed on this page.',
        503,
      );
    }

    const result = await sendContactEmail({ name, email, subject, message });
    if (!result.sent) {
      return jsonError(
        result.error ||
          'Could not send your message. Please email BKSR directly.',
        502,
      );
    }

    return jsonOk({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Send failed';
    return jsonError(message, 500);
  }
}
