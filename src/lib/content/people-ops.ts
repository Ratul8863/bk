import { v4 as uuidv4 } from 'uuid';
import { contentRepository } from '@/lib/cms/repository';
import { slugify } from '@/lib/utils';
import type {
  Achievement,
  AchievementAssignment,
  ContentDatabase,
  JoinApplication,
  MemberAchievement,
  Person,
  RoleAssignment,
} from '@/types/content';

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function nextMemberVerificationCode(db: ContentDatabase): string {
  let max = 0;
  for (const person of db.people) {
    const match = person.verificationCode?.match(/BKSR-(\d+)M/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `BKSR-${String(max + 1).padStart(5, '0')}M`;
}

export function nextCertificateCode(db: ContentDatabase): string {
  let max = 0;
  for (const row of db.achievementAssignments) {
    const match = row.certificateCode?.match(/BKSR-(\d+)C/i);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `BKSR-${String(max + 1).padStart(5, '0')}C`;
}

export function findPersonByVerificationCode(
  db: ContentDatabase,
  code: string,
): Person | undefined {
  const normalized = code.trim().toUpperCase();
  return db.people.find(
    (person) => person.verificationCode?.toUpperCase() === normalized,
  );
}

export function findByCertificateCode(
  db: ContentDatabase,
  code: string,
): {
  assignment: AchievementAssignment;
  achievement: Achievement | undefined;
  person: Person | undefined;
} | null {
  const normalized = code.trim().toUpperCase();
  const assignment = db.achievementAssignments.find(
    (row) => row.certificateCode?.toUpperCase() === normalized,
  );
  if (!assignment) return null;
  return {
    assignment,
    achievement: db.achievements.find((a) => a.id === assignment.achievementId),
    person: db.people.find((p) => p.id === assignment.personId),
  };
}

export function getRoleAssignmentsForPerson(
  db: ContentDatabase,
  personId: string,
): RoleAssignment[] {
  return db.roleAssignments
    .filter((row) => row.personId === personId)
    .sort((a, b) => b.year.localeCompare(a.year) || (a.order ?? 0) - (b.order ?? 0));
}

export function upsertRoleAssignment(input: {
  id?: string;
  personId: string;
  role: string;
  year: string;
  order?: number;
}): RoleAssignment {
  const db = contentRepository.getDatabase();
  const stamp = nowIso();
  if (input.id) {
    const index = db.roleAssignments.findIndex((r) => r.id === input.id);
    if (index === -1) throw new Error('Assignment not found');
    const updated: RoleAssignment = {
      ...db.roleAssignments[index],
      role: input.role.trim(),
      year: input.year.trim(),
      order: input.order ?? db.roleAssignments[index].order,
      updatedAt: stamp,
    };
    const next = [...db.roleAssignments];
    next[index] = updated;
    contentRepository.saveDatabase({ ...db, roleAssignments: next });
    return updated;
  }
  const created: RoleAssignment = {
    id: uuidv4(),
    personId: input.personId,
    role: input.role.trim(),
    year: input.year.trim(),
    order: input.order ?? db.roleAssignments.length,
    createdAt: stamp,
    updatedAt: stamp,
  };
  contentRepository.saveDatabase({
    ...db,
    roleAssignments: [...db.roleAssignments, created],
  });
  return created;
}

export function deleteRoleAssignment(id: string): void {
  const db = contentRepository.getDatabase();
  contentRepository.saveDatabase({
    ...db,
    roleAssignments: db.roleAssignments.filter((r) => r.id !== id),
  });
}

/** Sync Person.role + appointmentYear into a RoleAssignment row if missing */
export function syncPersonRoleSnapshot(personId: string): RoleAssignment | null {
  const db = contentRepository.getDatabase();
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

export function submitJoinApplication(input: {
  name: string;
  email: string;
  affiliation?: string;
  message: string;
}): JoinApplication | { error: string } {
  const db = contentRepository.getDatabase();
  const email = normalizeEmail(input.email);
  if (!input.name.trim() || !email.includes('@') || !input.message.trim()) {
    return { error: 'Name, email, and message are required.' };
  }
  const pending = db.joinApplications.find(
    (row) => row.email === email && row.status === 'pending',
  );
  if (pending) {
    return { error: 'An application with this email is already pending.' };
  }
  const stamp = nowIso();
  const created: JoinApplication = {
    id: uuidv4(),
    name: input.name.trim(),
    email,
    affiliation: input.affiliation?.trim() || undefined,
    message: input.message.trim(),
    status: 'pending',
    personId: null,
    createdAt: stamp,
    updatedAt: stamp,
    reviewedAt: null,
  };
  contentRepository.saveDatabase({
    ...db,
    joinApplications: [...db.joinApplications, created],
  });
  return created;
}

export function reviewJoinApplication(
  id: string,
  status: 'approved' | 'rejected',
): JoinApplication | { error: string } {
  const db = contentRepository.getDatabase();
  const index = db.joinApplications.findIndex((row) => row.id === id);
  if (index === -1) return { error: 'Application not found.' };
  const app = db.joinApplications[index];
  if (app.status !== 'pending') {
    return { error: 'This application was already reviewed.' };
  }

  const stamp = nowIso();
  let personId: string | null = null;
  let people = db.people;

  if (status === 'approved') {
    const existing = db.people.find(
      (p) => p.email && normalizeEmail(p.email) === app.email,
    );
    if (existing) {
      personId = existing.id;
      if (!existing.verificationCode) {
        people = db.people.map((p) =>
          p.id === existing.id
            ? {
                ...p,
                verificationCode: nextMemberVerificationCode(db),
                claimStatus: p.accountId ? 'claimed' : 'unclaimed',
                updatedAt: stamp,
              }
            : p,
        );
      }
    } else {
      const code = nextMemberVerificationCode(db);
      const person: Person = {
        id: uuidv4(),
        slug: slugify(app.name) || `member-${Date.now()}`,
        status: 'published',
        createdAt: stamp,
        updatedAt: stamp,
        publishedAt: stamp,
        name: app.name,
        role: 'Research affiliate',
        category: 'research-team',
        email: app.email,
        affiliation: app.affiliation,
        bio: app.message,
        shortBio: app.message.slice(0, 180),
        claimStatus: 'unclaimed',
        verificationCode: code,
        researchInterests: [],
        order: 99,
      };
      personId = person.id;
      people = [...db.people, person];
    }
  }

  const updated: JoinApplication = {
    ...app,
    status,
    personId,
    updatedAt: stamp,
    reviewedAt: stamp,
  };
  const apps = [...db.joinApplications];
  apps[index] = updated;
  contentRepository.saveDatabase({
    ...db,
    people,
    joinApplications: apps,
  });
  return updated;
}

export function ensurePersonVerificationCode(personId: string): string | null {
  const db = contentRepository.getDatabase();
  const person = db.people.find((p) => p.id === personId);
  if (!person) return null;
  if (person.verificationCode) return person.verificationCode;
  const code = nextMemberVerificationCode(db);
  contentRepository.update('people', personId, { verificationCode: code });
  return code;
}

export function getVerifiedAchievementsForPerson(
  db: ContentDatabase,
  personId: string,
) {
  return db.achievementAssignments
    .filter((row) => row.personId === personId)
    .map((row) => ({
      assignment: row,
      achievement: db.achievements.find((a) => a.id === row.achievementId),
    }))
    .filter((row) => row.achievement)
    .sort((a, b) =>
      b.assignment.assignedAt.localeCompare(a.assignment.assignedAt),
    );
}

export function getMemberAchievementsForPerson(
  db: ContentDatabase,
  personId: string,
): MemberAchievement[] {
  return db.memberAchievements
    .filter((row) => row.personId === personId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveAchievement(
  input: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'> &
    Partial<Pick<Achievement, 'id' | 'createdAt' | 'updatedAt'>>,
): Achievement {
  const db = contentRepository.getDatabase();
  const stamp = nowIso();
  if (input.id) {
    const index = db.achievements.findIndex((a) => a.id === input.id);
    if (index === -1) throw new Error('Achievement not found');
    const updated: Achievement = {
      ...db.achievements[index],
      ...input,
      slug: slugify(input.slug || input.title),
      updatedAt: stamp,
    };
    const next = [...db.achievements];
    next[index] = updated;
    contentRepository.saveDatabase({ ...db, achievements: next });
    return updated;
  }
  const created: Achievement = {
    id: uuidv4(),
    slug: slugify(input.slug || input.title),
    status: input.status ?? 'published',
    title: input.title,
    description: input.description,
    createdAt: stamp,
    updatedAt: stamp,
    publishedAt: stamp,
  };
  contentRepository.saveDatabase({
    ...db,
    achievements: [...db.achievements, created],
  });
  return created;
}

export function assignAchievement(input: {
  achievementId: string;
  personId: string;
  notes?: string;
  withCertificate?: boolean;
}): AchievementAssignment {
  const db = contentRepository.getDatabase();
  const stamp = nowIso();
  const created: AchievementAssignment = {
    id: uuidv4(),
    achievementId: input.achievementId,
    personId: input.personId,
    certificateCode: input.withCertificate
      ? nextCertificateCode(db)
      : null,
    notes: input.notes,
    assignedAt: stamp,
    createdAt: stamp,
    updatedAt: stamp,
  };
  contentRepository.saveDatabase({
    ...db,
    achievementAssignments: [...db.achievementAssignments, created],
  });
  return created;
}

export function deleteAchievementAssignment(id: string): void {
  const db = contentRepository.getDatabase();
  contentRepository.saveDatabase({
    ...db,
    achievementAssignments: db.achievementAssignments.filter((a) => a.id !== id),
  });
}

export function addMemberAchievement(input: {
  personId: string;
  title: string;
  description?: string;
  year?: string;
}): MemberAchievement {
  const db = contentRepository.getDatabase();
  const stamp = nowIso();
  const created: MemberAchievement = {
    id: uuidv4(),
    personId: input.personId,
    title: input.title.trim(),
    description: input.description?.trim(),
    year: input.year?.trim(),
    createdAt: stamp,
    updatedAt: stamp,
  };
  contentRepository.saveDatabase({
    ...db,
    memberAchievements: [...db.memberAchievements, created],
  });
  return created;
}

export function deleteMemberAchievement(id: string): void {
  const db = contentRepository.getDatabase();
  contentRepository.saveDatabase({
    ...db,
    memberAchievements: db.memberAchievements.filter((a) => a.id !== id),
  });
}
