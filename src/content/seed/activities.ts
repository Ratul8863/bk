import type { Activity } from '@/types/content';

const ts = {
  status: 'published' as const,
  createdAt: '2020-06-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  publishedAt: '2020-06-01T00:00:00.000Z',
};

export const activities: Activity[] = [
  {
    ...ts,
    id: 'activity-capacity-building',
    slug: 'capacity-building',
    title: 'Seminar & Training',
    type: 'capacity-building',
    summary:
      'Seminars and training webinars that strengthen research methods and statistical software literacy.',
    imageUrl: '/media/prototype/bksr-activity-workshop.jpg',
    description: `BK School of Research runs capacity-building sessions for students, early-career researchers, and partners.

Documented legacy activity includes the joint webinar “SPSS for the Beginners” (27 June 2020) with the Department of Economics, Rabindra University, Bangladesh — an introduction to SPSS fundamentals open to participants from any background. Related Knowledge Hub resources cover Stata, SPSS, MS Excel, and EViews for cross-sectional, time-series, and statistical analysis.`,
    relatedEventIds: ['event-spss-beginners'],
    order: 1,
    seo: {
      title: 'Capacity Building | BKSR',
      description:
        'Research methods and statistical software capacity building at BK School of Research.',
      canonicalPath: '/activities/capacity-building',
    },
  },
  {
    ...ts,
    id: 'activity-awareness-campaign',
    slug: 'awareness-campaign',
    title: 'Campaigns',
    type: 'awareness-campaign',
    summary:
      'Public campaigns and webinars on social issues, gender, mental health, and child protection.',
    imageUrl: '/media/authentic/event-gender-development.jpg',
    description: `Awareness work at BKSR connects research themes to public dialogue.

Legacy webinars in this stream include “Gender and Development Fundamentals” (19 July 2020), “Impact of COVID-19 on Youth Mental Health” (26 July 2020), and “COVID-19 Pandemic and Child Protection: Health or Humanitarian Crisis?” (4 October 2020). These sessions featured external experts and were moderated or hosted with BKSR leadership.`,
    relatedEventIds: [
      'event-gender-development',
      'event-covid-youth-mental-health',
      'event-covid-child-protection',
    ],
    order: 2,
    seo: {
      title: 'Awareness Campaign | BKSR',
      description:
        'Awareness campaigns and webinars on gender, mental health, and social protection.',
      canonicalPath: '/activities/awareness-campaigns',
    },
  },
  {
    ...ts,
    id: 'activity-research-talk',
    slug: 'research-talk',
    title: 'Research Talk',
    type: 'research-talk',
    summary:
      'Talks and webinars that surface research ideas, regional challenges, and scholarly debate.',
    imageUrl: '/media/authentic/event-covid-youth-mental-health.jpg',
    description: `Research Talk activities bring scholars and the public into conversation on evidence and ideas.

A documented example is the webinar “Globalization and Youths in South Asia: Challenges and Opportunities” (12 July 2020) with Professor Dr. Vivek Kumar (Jawaharlal Nehru University). Related public writing on the legacy site also argued for research as a core instrument of sustainable development.`,
    relatedEventIds: ['event-globalization-youths'],
    order: 3,
    seo: {
      title: 'Research Talk | BKSR',
      description: 'Research talks and scholarly webinars from BK School of Research.',
      canonicalPath: '/activities/research-talks',
    },
  },
  {
    ...ts,
    id: 'activity-innovation-showcasing',
    slug: 'innovation-showcasing',
    title: 'Innovation Showcasing',
    type: 'innovation-showcasing',
    summary:
      'Literary and creative initiatives that showcase youth writing and cultural expression.',
    imageUrl: '/media/authentic/event-covid-child-protection.jpg',
    description: `Beyond formal research outputs, BKSR has hosted creative and literary initiatives.

Legacy examples include the Mother’s Day writing contest “মাকে নিয়ে লিখি” (2020), announcement of winning writers, Bengali literary posts, and the little magazine initiative Saptasudha (detailed archive content was empty on the legacy site and is retained as an archive resource).`,
    relatedEventIds: [],
    order: 4,
    seo: {
      title: 'Innovation Showcasing | BKSR',
      description:
        'Creative and literary showcasing initiatives associated with BK School of Research.',
      canonicalPath: '/activities/innovation-showcasing',
    },
  },
];
