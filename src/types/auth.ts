/** Auth domain — parallel to CMS content (localStorage demo → Mongo/JWT later) */

export type AccountRole = 'admin' | 'member';

export type PersonClaimStatus = 'unclaimed' | 'claimed';

export interface Account {
  id: string;
  email: string;
  passwordHash: string;
  role: AccountRole;
  /** Linked Person when role is member */
  personId?: string | null;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  accountId: string;
  email: string;
  role: AccountRole;
  personId?: string | null;
  personSlug?: string | null;
  createdAt: string;
}

/** Fields a claimed member may edit on their own Person profile */
export const MEMBER_EDITABLE_PERSON_FIELDS = [
  'name',
  'bio',
  'shortBio',
  'photoUrl',
  'researchInterests',
  'phone',
  'affiliation',
  'socialLinks',
] as const;

export type MemberEditablePersonField =
  (typeof MEMBER_EDITABLE_PERSON_FIELDS)[number];

export const DEMO_ADMIN_EMAIL = 'admin@bksr.local';
export const DEMO_ADMIN_PASSWORD = 'admin123';
