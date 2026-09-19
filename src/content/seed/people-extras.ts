import type {
  Achievement,
  AchievementAssignment,
  JoinApplication,
  MemberAchievement,
  RoleAssignment,
} from '@/types/content';

const now = '2026-09-13T00:00:00.000Z';

export const roleAssignments: RoleAssignment[] = [
  {
    id: 'role-bezon-2016-director',
    personId: 'person-bezon-kumar',
    role: 'Director',
    year: '2016-2017',
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'role-bezon-current-ed',
    personId: 'person-bezon-kumar',
    role: 'Executive Director',
    year: '2025-2026',
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export const joinApplications: JoinApplication[] = [];

export const achievements: Achievement[] = [
  {
    id: 'ach-founding-leadership',
    slug: 'founding-leadership',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    title: 'Founding leadership',
    description:
      'Recognised for establishing and sustaining BK School of Research as an independent research institute.',
  },
  {
    id: 'ach-research-excellence',
    slug: 'research-excellence-citation',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    title: 'Research excellence citation',
    description:
      'Recognised for sustained peer-reviewed publication and mentoring contribution.',
  },
];

export const achievementAssignments: AchievementAssignment[] = [
  {
    id: 'ach-assign-bezon-founding',
    achievementId: 'ach-founding-leadership',
    personId: 'person-bezon-kumar',
    certificateCode: 'BKSR-00001C',
    notes: 'Seeded demo assignment',
    assignedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export const memberAchievements: MemberAchievement[] = [];
