import type { ResearchArea } from '@/types/content';

const ts = {
  createdAt: '2016-12-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  publishedAt: '2016-12-01T00:00:00.000Z',
};

export const researchAreas: ResearchArea[] = [
  {
    id: 'area-education',
    slug: 'education',
    status: 'published',
    ...ts,
    title: 'Education',
    shortDescription: 'Learning systems, academic performance, and education strategy.',
    description:
      'Research on education systems, student academic performance, information literacy, and strategies that improve learning outcomes in Bangladesh and beyond.',
    order: 1,
    seo: {
      title: 'Education Research | BKSR',
      description: 'BK School of Research work on education, literacy, and academic performance.',
      canonicalPath: '/research/areas/education',
    },
  },
  {
    id: 'area-public-policy',
    slug: 'public-policy',
    status: 'published',
    ...ts,
    title: 'Public Policy',
    shortDescription: 'Evidence for governance, institutions, and policy design.',
    description:
      'Work linking research evidence to governance, public administration, and policy choices that affect livelihoods and institutions.',
    order: 2,
    seo: {
      title: 'Public Policy Research | BKSR',
      description: 'Evidence-based public policy research from BK School of Research.',
      canonicalPath: '/research/areas/public-policy',
    },
  },
  {
    id: 'area-social-development',
    slug: 'social-development',
    status: 'published',
    ...ts,
    title: 'Social Development',
    shortDescription: 'Poverty, remittances, youth, and social change.',
    description:
      'Interdisciplinary inquiry into poverty alleviation, remittance impacts, youth opportunity, and broader social development pathways.',
    order: 3,
  },
  {
    id: 'area-health',
    slug: 'health',
    status: 'published',
    ...ts,
    title: 'Health',
    shortDescription: 'Health outcomes, wellbeing, and mental health themes.',
    description:
      'Research and dialogue on health-related outcomes, including remittance links to health spending, youth mental health, and wellbeing.',
    order: 4,
  },
  {
    id: 'area-entrepreneurship',
    slug: 'entrepreneurship',
    status: 'published',
    ...ts,
    title: 'Entrepreneurship',
    shortDescription: 'Enterprise, opportunity, and economic agency.',
    description:
      'Ongoing thematic work by BKSR scholars on entrepreneurship and related economic agency.',
    order: 5,
  },
  {
    id: 'area-wellbeing',
    slug: 'wellbeing',
    status: 'published',
    ...ts,
    title: 'Wellbeing',
    shortDescription: 'Social connection, loneliness, and quality of life.',
    description:
      'Studies of wellbeing, social networks, loneliness, and related quality-of-life questions.',
    order: 6,
  },
  {
    id: 'area-poverty',
    slug: 'poverty',
    status: 'published',
    ...ts,
    title: 'Poverty',
    shortDescription: 'Poverty measurement, remittances, and welfare.',
    description:
      'Research on poverty dynamics, remittance effects on poverty and welfare, and related development indicators.',
    order: 7,
  },
  {
    id: 'area-women-empowerment',
    slug: 'women-empowerment',
    status: 'published',
    ...ts,
    title: 'Women Empowerment',
    shortDescription: 'Gender, agency, and development.',
    description:
      'Thematic research and capacity work on gender and development, including women empowerment.',
    order: 8,
  },
  {
    id: 'area-environment',
    slug: 'environment',
    status: 'published',
    ...ts,
    title: 'Environment',
    shortDescription: 'Environmental impacts and sustainability practice.',
    description:
      'Work on environmental impacts, sustainability in practice, and related ecological questions.',
    order: 9,
  },
  {
    id: 'area-climate-environment',
    slug: 'climate-and-environment',
    status: 'published',
    ...ts,
    title: 'Climate & Environment',
    shortDescription: 'Climate change perception, risk, and adaptation themes.',
    description:
      'Research and commentary on climate change causes and effects in Bangladesh and the region, including student perception and knowledge studies.',
    order: 10,
  },
  {
    id: 'area-behavioral-economics',
    slug: 'behavioral-economics',
    status: 'published',
    ...ts,
    title: 'Behavioral Economics',
    shortDescription: 'Behavioral insights for economic decision-making.',
    description:
      'Exploration of behavioral economics ideas and their relevance to development and policy.',
    order: 11,
  },
  {
    id: 'area-sustainable-development',
    slug: 'sustainable-development',
    status: 'published',
    ...ts,
    title: 'Sustainable Development',
    shortDescription: 'Research as a lever for sustainable progress.',
    description:
      'Research and public writing on sustainable development, innovation, and the role of rigorous inquiry.',
    order: 12,
  },
  {
    id: 'area-business-economics',
    slug: 'business-and-economics',
    status: 'published',
    ...ts,
    title: 'Business & Economics',
    shortDescription: 'Financial economics, remittances, and markets.',
    description:
      'Applied work in business and economics, including remittances, financial forecasting, banking performance, and related topics.',
    order: 13,
  },
];
