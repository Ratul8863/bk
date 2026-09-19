import 'server-only';
import {
  serverCreate,
  serverGetFullDatabase,
} from '@/lib/cms/server-repository';
import {
  getFormBySlug,
  getJoinForm,
  isFormFull,
} from '@/lib/content/registration-forms';
import type {
  JoinApplication,
  JoinInterestTrack,
  RegistrationEntry,
  RegistrationForm,
} from '@/types/content';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function str(
  data: Record<string, string | number | boolean>,
  key: string,
): string {
  const raw = data[key];
  if (raw == null) return '';
  return typeof raw === 'string' ? raw.trim() : String(raw).trim();
}

function mapInterestTrack(raw: string): JoinInterestTrack {
  const v = raw.toLowerCase();
  if (v.includes('distinguished')) return 'distinguished-fellow';
  if (v.includes('admin')) return 'administrative-team';
  if (v.includes('other')) return 'other';
  if (v === 'research-team') return 'research-team';
  return 'research-team';
}

function validateDynamicFields(
  form: RegistrationForm,
  data: Record<string, string | number | boolean>,
):
  | { ok: true; cleaned: Record<string, string | number | boolean> }
  | { ok: false; error: string } {
  const cleaned: Record<string, string | number | boolean> = {};
  for (const field of [...form.fields].sort((a, b) => a.order - b.order)) {
    const raw = data[field.key];
    if (field.type === 'checkbox') {
      cleaned[field.key] = Boolean(raw);
      if (field.required && !cleaned[field.key]) {
        return { ok: false, error: `${field.label} is required.` };
      }
      continue;
    }
    const text =
      raw == null ? '' : typeof raw === 'string' ? raw.trim() : String(raw);
    if (field.required && !text) {
      return { ok: false, error: `${field.label} is required.` };
    }
    if (field.type === 'email' && text && !text.includes('@')) {
      return { ok: false, error: 'Enter a valid email address.' };
    }
    if (field.type === 'number' && text) {
      const n = Number(text);
      if (Number.isNaN(n)) {
        return { ok: false, error: `${field.label} must be a number.` };
      }
      cleaned[field.key] = n;
    } else if (text) {
      cleaned[field.key] = text;
    }
  }
  return { ok: true, cleaned };
}

/**
 * Submit /join using the CMS join form definition (Google Forms–style fields).
 * Core columns stay populated for approval/invite; full answers are stored too.
 */
export async function serverSubmitJoinApplication(
  data: Record<string, string | number | boolean>,
): Promise<JoinApplication | { error: string }> {
  const db = await serverGetFullDatabase();
  const form = getJoinForm(db);

  if (!form.isOpen) {
    return { error: form.closedMessage || 'Applications are currently closed.' };
  }

  const validated = validateDynamicFields(form, data);
  if (!validated.ok) return { error: validated.error };
  const cleaned = validated.cleaned;

  const name = str(cleaned, 'name');
  const email = normalizeEmail(str(cleaned, 'email'));
  const message =
    str(cleaned, 'message') ||
    str(cleaned, 'motivation') ||
    str(cleaned, 'why');

  if (!name || !email.includes('@') || !message) {
    return {
      error: 'Name, email, and motivation are required.',
    };
  }

  const pending = db.joinApplications.find(
    (row) => row.email === email && row.status === 'pending',
  );
  if (pending) {
    return { error: 'An application with this email is already pending.' };
  }

  return serverCreate('joinApplications', {
    name,
    email,
    phone: str(cleaned, 'phone') || undefined,
    affiliation: str(cleaned, 'affiliation') || undefined,
    currentRole: str(cleaned, 'currentRole') || undefined,
    city: str(cleaned, 'city') || undefined,
    interestTrack: mapInterestTrack(str(cleaned, 'interestTrack')),
    researchInterests: str(cleaned, 'researchInterests') || undefined,
    portfolioUrl: str(cleaned, 'portfolioUrl') || undefined,
    message,
    answers: cleaned,
    status: 'pending',
    personId: null,
    reviewedAt: null,
  });
}

export async function serverSubmitRegistration(
  formSlug: string,
  data: Record<string, string | number | boolean>,
): Promise<
  { ok: true; entry: RegistrationEntry } | { ok: false; error: string }
> {
  const db = await serverGetFullDatabase();
  const form = getFormBySlug(db, formSlug);
  if (!form || form.status === 'draft' || form.status === 'archived') {
    return { ok: false, error: 'This registration form is not available.' };
  }
  if (form.entityType === 'join') {
    return {
      ok: false,
      error: 'Use the Join BKSR page to submit this application.',
    };
  }
  if (!form.isOpen) {
    return {
      ok: false,
      error: form.closedMessage || 'Registration is closed.',
    };
  }
  if (isFormFull(db, form)) {
    return { ok: false, error: 'This form has reached capacity.' };
  }

  const validated = validateDynamicFields(form, data);
  if (!validated.ok) return { ok: false, error: validated.error };
  const cleaned = validated.cleaned;

  const emailField = form.fields.find((f) => f.type === 'email');
  const email =
    emailField && typeof cleaned[emailField.key] === 'string'
      ? normalizeEmail(String(cleaned[emailField.key]))
      : null;

  if (email) {
    const duplicate = db.registrationEntries.find(
      (entry) =>
        entry.formId === form.id &&
        entry.email &&
        normalizeEmail(entry.email) === email,
    );
    if (duplicate) {
      return {
        ok: false,
        error: 'This email has already been used to register for this form.',
      };
    }
  }

  const entry = await serverCreate('registrationEntries', {
    formId: form.id,
    formSlug: form.slug,
    data: cleaned,
    status: 'submitted',
    email,
    reviewedAt: null,
    reviewedBy: null,
  });

  return { ok: true, entry };
}
