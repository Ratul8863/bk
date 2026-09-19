import type { ResearchArea } from '@/types/content';

const ts = {
  createdAt: '2016-12-01T00:00:00.000Z',
  updatedAt: '2026-09-17T00:00:00.000Z',
  publishedAt: '2016-12-01T00:00:00.000Z',
};

export const researchAreas: ResearchArea[] = [
  {
    id: 'area-economics-sustainability',
    slug: 'economics-and-sustainability',
    status: 'published',
    ...ts,
    title: 'Economics and Sustainability',
    shortDescription:
      'Advancing inclusive growth through sustainable economic development.',
    description:
      'Advancing inclusive growth through sustainable economic development.',
    order: 1,
    seo: {
      title: 'Economics and Sustainability | BKSR',
      description:
        'Inclusive growth and sustainable economic development research at BK School of Research.',
      canonicalPath: '/research/areas/economics-and-sustainability',
    },
  },
  {
    id: 'area-business-technology',
    slug: 'business-and-technology',
    status: 'published',
    ...ts,
    title: 'Business and Technology',
    shortDescription:
      'Driving innovation at the intersection of enterprise and technology.',
    description:
      'Driving innovation at the intersection of enterprise and technology.',
    order: 2,
    seo: {
      title: 'Business and Technology | BKSR',
      description:
        'Enterprise and technology research at BK School of Research.',
      canonicalPath: '/research/areas/business-and-technology',
    },
  },
  {
    id: 'area-data-science-ai',
    slug: 'data-science-and-artificial-intelligence',
    status: 'published',
    ...ts,
    title: 'Data Science and Artificial Intelligence',
    shortDescription:
      'Harnessing data and AI for evidence-based decision-making.',
    description:
      'Harnessing data and AI for evidence-based decision-making.',
    order: 3,
    seo: {
      title: 'Data Science and Artificial Intelligence | BKSR',
      description:
        'Data science and AI for evidence-based decision-making at BK School of Research.',
      canonicalPath: '/research/areas/data-science-and-artificial-intelligence',
    },
  },
  {
    id: 'area-behaviour-decision',
    slug: 'behaviour-and-decision-making',
    status: 'published',
    ...ts,
    title: 'Behaviour and Decision-Making',
    shortDescription:
      'Understanding the human drivers behind choice and action.',
    description:
      'Understanding the human drivers behind choice and action.',
    order: 4,
    seo: {
      title: 'Behaviour and Decision-Making | BKSR',
      description:
        'Behavioural and decision-making research at BK School of Research.',
      canonicalPath: '/research/areas/behaviour-and-decision-making',
    },
  },
  {
    id: 'area-health-wellbeing',
    slug: 'health-and-well-being',
    status: 'published',
    ...ts,
    title: 'Health and Well-being',
    shortDescription:
      'Promoting health systems and quality of life for all.',
    description: 'Promoting health systems and quality of life for all.',
    order: 5,
    seo: {
      title: 'Health and Well-being | BKSR',
      description:
        'Health systems and wellbeing research at BK School of Research.',
      canonicalPath: '/research/areas/health-and-well-being',
    },
  },
  {
    id: 'area-environment-climate',
    slug: 'environment-and-climate',
    status: 'published',
    ...ts,
    title: 'Environment and Climate',
    shortDescription:
      'Building resilience through climate action and environmental stewardship.',
    description:
      'Building resilience through climate action and environmental stewardship.',
    order: 6,
    seo: {
      title: 'Environment and Climate | BKSR',
      description:
        'Climate action and environmental stewardship research at BK School of Research.',
      canonicalPath: '/research/areas/environment-and-climate',
    },
  },
  {
    id: 'area-gender-development',
    slug: 'gender-and-development',
    status: 'published',
    ...ts,
    title: 'Gender and Development',
    shortDescription:
      'Advancing equity and empowerment across gender lines.',
    description: 'Advancing equity and empowerment across gender lines.',
    order: 7,
    seo: {
      title: 'Gender and Development | BKSR',
      description:
        'Gender equity and development research at BK School of Research.',
      canonicalPath: '/research/areas/gender-and-development',
    },
  },
  {
    id: 'area-migration-diaspora',
    slug: 'migration-and-diaspora',
    status: 'published',
    ...ts,
    title: 'Migration and Diaspora',
    shortDescription:
      'Examining mobility, displacement, and cross-border connections.',
    description:
      'Examining mobility, displacement, and cross-border connections.',
    order: 8,
    seo: {
      title: 'Migration and Diaspora | BKSR',
      description:
        'Migration and diaspora research at BK School of Research.',
      canonicalPath: '/research/areas/migration-and-diaspora',
    },
  },
  {
    id: 'area-society-politics',
    slug: 'society-and-politics',
    status: 'published',
    ...ts,
    title: 'Society and Politics',
    shortDescription:
      'Exploring governance, institutions, and civic life.',
    description: 'Exploring governance, institutions, and civic life.',
    order: 9,
    seo: {
      title: 'Society and Politics | BKSR',
      description:
        'Governance, institutions, and civic life research at BK School of Research.',
      canonicalPath: '/research/areas/society-and-politics',
    },
  },
  {
    id: 'area-education-culture',
    slug: 'education-and-culture',
    status: 'published',
    ...ts,
    title: 'Education and Culture',
    shortDescription:
      'Shaping knowledge, learning, and cultural identity.',
    description: 'Shaping knowledge, learning, and cultural identity.',
    order: 10,
    seo: {
      title: 'Education and Culture | BKSR',
      description:
        'Education and culture research at BK School of Research.',
      canonicalPath: '/research/areas/education-and-culture',
    },
  },
  {
    id: 'area-media-communication',
    slug: 'media-and-communication',
    status: 'published',
    ...ts,
    title: 'Media and Communication',
    shortDescription:
      'Understanding information flow and public discourse in a digital age.',
    description:
      'Understanding information flow and public discourse in a digital age.',
    order: 11,
    seo: {
      title: 'Media and Communication | BKSR',
      description:
        'Media and communication research at BK School of Research.',
      canonicalPath: '/research/areas/media-and-communication',
    },
  },
];
