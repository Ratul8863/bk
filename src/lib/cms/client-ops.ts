'use client';

/**
 * Client-side CMS mutations for admin/special pages.
 * Always writes through /api/cms (fs or mongo) — never localStorage.
 */
import { cmsApi } from '@/lib/cms/client-api';
import { slugify } from '@/lib/utils';
import type {
  Achievement,
  AchievementAssignment,
  JoinApplication,
  MemberAchievement,
  Person,
  PersonContentLink,
  PersonLinkEntityType,
  RegistrationEntry,
  RegistrationEntryStatus,
  RegistrationForm,
  RoleAssignment,
} from '@/types/content';
import { DEFAULT_REGISTRATION_FIELDS } from '@/lib/content/registration-forms';

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function loadDb() {
  return cmsApi.getDatabase();
}

function nextMemberVerificationCode(
  people: { verificationCode?: string | null }[],
): string {
  let max = 0;
  for (const person of people) {
    const match = person.verificationCode?.match(/BKSR-(\d+)M/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `BKSR-${String(max + 1).padStart(5, '0')}M`;
}

function nextCertificateCode(
  rows: { certificateCode?: string | null }[],
): string {
  let max = 0;
  for (const row of rows) {
    const match = row.certificateCode?.match(/BKSR-(\d+)C/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `BKSR-${String(max + 1).padStart(5, '0')}C`;
}

export async function upsertRoleAssignment(input: {
  id?: string;
  personId: string;
  role: string;
  year: string;
  order?: number;
}): Promise<RoleAssignment> {
  if (input.id) {
    return cmsApi.update('roleAssignments', input.id, {
      role: input.role.trim(),
      year: input.year.trim(),
      ...(input.order != null ? { order: input.order } : {}),
    });
  }
  const db = await loadDb();
  return cmsApi.create('roleAssignments', {
    personId: input.personId,
    role: input.role.trim(),
    year: input.year.trim(),
    order: input.order ?? db.roleAssignments.length,
  });
}

export async function deleteRoleAssignment(id: string): Promise<void> {
  await cmsApi.remove('roleAssignments', id);
}

export async function syncPersonRoleSnapshot(
  personId: string,
): Promise<RoleAssignment | null> {
  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId);
  if (!person?.appointmentYear || !person.role) return null;
  const exists = db.roleAssignments.find(
    (r) =>
      r.personId === personId &&
      r.year === person.appointmentYear &&
      r.role === person.role,
  );
  if (exists) return exists;
  return upsertRoleAssignment({
    personId,
    role: person.role,
    year: person.appointmentYear,
  });
}

export async function reviewJoinApplication(
  id: string,
  status: 'approved' | 'rejected',
): Promise<JoinApplication | { error: string }> {
  const db = await loadDb();
  const app = db.joinApplications.find((row) => row.id === id);
  if (!app) return { error: 'Application not found.' };
  if (app.status !== 'pending') {
    return { error: 'This application was already reviewed.' };
  }

  const stamp = nowIso();
  let personId: string | null = null;

  if (status === 'approved') {
    const existing = db.people.find(
      (p) => p.email && normalizeEmail(p.email) === app.email,
    );
    if (existing) {
      personId = existing.id;
      if (!existing.verificationCode) {
        await cmsApi.update('people', existing.id, {
          verificationCode: nextMemberVerificationCode(db.people),
          claimStatus: existing.accountId ? 'claimed' : 'unclaimed',
        });
      }
    } else {
      const code = nextMemberVerificationCode(db.people);
      const maxOrder = db.people.reduce(
        (acc, person) => Math.max(acc, person.order ?? 0),
        0,
      );
      const category =
        app.interestTrack === 'administrative-team' ||
        app.interestTrack === 'distinguished-fellow' ||
        app.interestTrack === 'research-team'
          ? app.interestTrack
          : 'research-team';
      const person = await cmsApi.create('people', {
        slug: slugify(app.name) || `member-${Date.now()}`,
        status: 'draft',
        name: app.name,
        role: app.currentRole?.trim() || 'Research affiliate',
        category,
        email: app.email,
        affiliation: app.affiliation,
        bio: '',
        shortBio: '',
        claimStatus: 'unclaimed',
        verificationCode: code,
        researchInterests: app.researchInterests
          ? app.researchInterests
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        order: maxOrder + 1,
      } as Omit<Person, 'id' | 'createdAt' | 'updatedAt'>);
      personId = person.id;
    }
  }

  const updated = await cmsApi.update('joinApplications', id, {
    status,
    personId,
    reviewedAt: stamp,
  });

  if (status === 'approved' && personId) {
    const person =
      (await loadDb()).people.find((p) => p.id === personId) ?? null;
    if (person?.email) {
      await fetch('/api/auth/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: person.name,
          email: person.email,
          role: person.role,
          category: person.category,
        }),
      }).catch(() => null);
    }
  }

  return updated;
}

export async function saveAchievement(
  input: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<Achievement, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Achievement> {
  if (input.id) {
    return cmsApi.update('achievements', input.id, {
      ...input,
      slug: slugify(input.slug || input.title),
    });
  }
  return cmsApi.create('achievements', {
    slug: slugify(input.slug || input.title),
    status: input.status ?? 'published',
    title: input.title,
    description: input.description,
    publishedAt: nowIso(),
  });
}

export async function assignAchievement(input: {
  achievementId: string;
  personId: string;
  notes?: string;
  withCertificate?: boolean;
}): Promise<AchievementAssignment> {
  const db = await loadDb();
  return cmsApi.create('achievementAssignments', {
    achievementId: input.achievementId,
    personId: input.personId,
    certificateCode: input.withCertificate
      ? nextCertificateCode(db.achievementAssignments)
      : null,
    notes: input.notes,
    assignedAt: nowIso(),
  });
}

export async function deleteAchievementAssignment(id: string): Promise<void> {
  await cmsApi.remove('achievementAssignments', id);
}

export async function addMemberAchievement(input: {
  personId: string;
  title: string;
  description?: string;
  year?: string;
}): Promise<MemberAchievement> {
  return cmsApi.create('memberAchievements', {
    personId: input.personId,
    title: input.title.trim(),
    description: input.description?.trim(),
    year: input.year?.trim(),
  });
}

export async function deleteMemberAchievement(id: string): Promise<void> {
  await cmsApi.remove('memberAchievements', id);
}

export async function replaceEntityPersonLinks(
  entityType: PersonLinkEntityType,
  entityId: string,
  rows: { personId: string; role: string }[],
): Promise<void> {
  const db = await loadDb();
  const existing = db.personContentLinks.filter(
    (link) => link.entityType === entityType && link.entityId === entityId,
  );
  await Promise.all(
    existing.map((link) => cmsApi.remove('personContentLinks', link.id)),
  );
  await Promise.all(
    rows
      .filter((row) => row.personId)
      .map((row, index) =>
        cmsApi.create('personContentLinks', {
          personId: row.personId,
          entityType,
          entityId,
          role: row.role.trim() || 'contributor',
          order: index,
        }),
      ),
  );
}

export async function addPersonContentLink(input: {
  personId: string;
  entityType: PersonLinkEntityType;
  entityId: string;
  role: string;
}): Promise<PersonContentLink | { error: string }> {
  const db = await loadDb();
  const duplicate = db.personContentLinks.find(
    (link) =>
      link.personId === input.personId &&
      link.entityType === input.entityType &&
      link.entityId === input.entityId,
  );
  if (duplicate) {
    return { error: 'That person is already linked to this item.' };
  }
  return cmsApi.create('personContentLinks', {
    personId: input.personId,
    entityType: input.entityType,
    entityId: input.entityId,
    role: input.role.trim() || 'contributor',
    order: db.personContentLinks.length,
  });
}

export async function removePersonContentLink(id: string): Promise<void> {
  await cmsApi.remove('personContentLinks', id);
}

export async function saveRegistrationForm(
  input: Omit<RegistrationForm, 'id' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<RegistrationForm, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<RegistrationForm> {
  const slug = slugify(input.slug || input.title) || `form-${Date.now()}`;
  const linkMode =
    input.entityType === 'join'
      ? ('dedicated' as const)
      : input.linkMode === 'shared' || input.entityId === 'shared'
        ? ('shared' as const)
        : ('dedicated' as const);
  const entityId =
    input.entityType === 'join'
      ? input.entityId
      : linkMode === 'shared'
        ? 'shared'
        : input.entityId;

  if (input.id) {
    return cmsApi.update('registrationForms', input.id, {
      ...input,
      slug,
      entityId,
      linkMode,
    });
  }
  const db = await loadDb();
  if (linkMode === 'dedicated' && input.entityType !== 'join') {
    const conflict = db.registrationForms.find(
      (f) =>
        f.entityType === input.entityType &&
        f.entityId === entityId &&
        f.linkMode !== 'shared' &&
        f.entityId !== 'shared',
    );
    if (conflict) {
      throw new Error(
        input.entityType === 'vacancy'
          ? 'Another dedicated form is already linked to this vacancy. Edit that form, or use a shared form and attach it on the notice.'
          : 'Another dedicated form is already linked to this event. Edit that form, or use a shared form and attach it on the event.',
      );
    }
  }
  return cmsApi.create('registrationForms', {
    slug,
    title: input.title,
    description: input.description,
    entityType: input.entityType,
    entityId,
    linkMode,
    fields: input.fields?.length ? input.fields : DEFAULT_REGISTRATION_FIELDS,
    isOpen: input.isOpen ?? true,
    requiresApproval: input.requiresApproval ?? false,
    maxSubmissions: input.maxSubmissions ?? null,
    closedMessage: input.closedMessage,
    successMessage: input.successMessage,
    status: input.status ?? 'published',
  });
}

export async function deleteRegistrationForm(id: string): Promise<void> {
  const db = await loadDb();
  const entries = db.registrationEntries.filter((e) => e.formId === id);
  await Promise.all(
    entries.map((entry) => cmsApi.remove('registrationEntries', entry.id)),
  );
  await cmsApi.remove('registrationForms', id);
}

export async function updateEntryStatus(
  entryId: string,
  status: RegistrationEntryStatus,
  reviewedBy = 'admin',
): Promise<RegistrationEntry | undefined> {
  return cmsApi.update('registrationEntries', entryId, {
    status,
    reviewedAt: nowIso(),
    reviewedBy,
  });
}

export async function deleteRegistrationEntry(entryId: string): Promise<void> {
  await cmsApi.remove('registrationEntries', entryId);
}
