import {
  MEMBER_EDITABLE_PERSON_FIELDS,
  type MemberEditablePersonField,
} from '@/types/auth';
import type { Person, PersonClaimStatus, PersonSocialLink } from '@/types/content';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getPersonClaimStatus(
  person: Pick<Person, 'accountId' | 'claimStatus' | 'email'>,
): PersonClaimStatus | null {
  if (person.accountId) return 'claimed';
  if (person.claimStatus === 'claimed') return 'claimed';
  if (person.email?.trim()) return 'unclaimed';
  return null;
}

export function isMemberEditableField(
  field: string,
): field is MemberEditablePersonField {
  return (MEMBER_EDITABLE_PERSON_FIELDS as readonly string[]).includes(field);
}

/** Strip a patch to only member-allowed Person fields */
export function pickMemberPersonPatch(
  patch: Partial<Person>,
): Partial<Pick<Person, MemberEditablePersonField>> {
  const next: Partial<Pick<Person, MemberEditablePersonField>> = {};
  for (const key of MEMBER_EDITABLE_PERSON_FIELDS) {
    if (key in patch) {
      (next as Record<string, unknown>)[key] = patch[key];
    }
  }
  return next;
}

export function parseSocialLinksInput(raw: string): PersonSocialLink[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes('|') ? '|' : line.includes(':') ? ':' : null;
      if (!sep) return { label: 'Link', url: line };
      const idx = line.indexOf(sep);
      const label = line.slice(0, idx).trim() || 'Link';
      const url = line.slice(idx + 1).trim();
      return { label, url };
    })
    .filter((link) => link.url.length > 0);
}

export function formatSocialLinksInput(links?: PersonSocialLink[]): string {
  if (!links?.length) return '';
  return links.map((l) => `${l.label}|${l.url}`).join('\n');
}
