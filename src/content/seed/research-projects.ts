import type { ResearchProject } from '@/types/content';

const legacyOngoing = 'https://bkschoolofresearch.blogspot.com/p/on-going.html';
const legacyCompleted = 'https://bkschoolofresearch.blogspot.com/p/completed.html';
const ts = {
  status: 'published' as const,
  createdAt: '2018-01-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
};

/** Completed projects mapped 1:1 from journal articles on the legacy Completed page */
export const completedProjects: ResearchProject[] = [
  {
    ...ts,
    id: 'project-unemployment-governance-poverty-pakistan',
    slug: 'unemployment-governance-and-poverty-in-pakistan',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title:
      'Impact of Unemployment and Governance on Poverty in Pakistan',
    summary:
      'Non-linear ARDL co-integration analysis of unemployment, governance, and poverty in Pakistan.',
    description: `Non-linear ARDL co-integration analysis of unemployment, governance, and poverty in Pakistan.
Lead contributors listed in the legacy completed archive: M. S. Meo, B. Kumar, S. Chughtai, V. J. Khan, M. K. B. Dost, Q. A. Nisar (2020).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-poverty', 'area-public-policy', 'area-business-economics'],
    leadAuthorNames: ['M. S. Meo', 'B. Kumar', 'S. Chughtai', 'V. J. Khan', 'M. K. B. Dost', 'Q. A. Nisar'],
    year: 2020,
    endYear: 2020,
    publicationIds: ['pub-meo-unemployment-governance-poverty-2020'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-social-network-loneliness-academic-performance',
    slug: 'social-network-loneliness-and-academic-performance',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Social Network, Social Media Use, Loneliness and Academic Performance among University Students in Bangladesh',
    summary:
      'Examined relationships among social networks, social media use, loneliness, and academic performance for Bangladeshi university students.',
    description: `Examined relationships among social networks, social media use, loneliness, and academic performance for Bangladeshi university students.
Lead contributors listed in the legacy completed archive: M. A. Islam, B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-wellbeing', 'area-education'],
    leadAuthorNames: ['M. A. Islam', 'B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: [
      'pub-islam-kumar-social-network-loneliness-2019',
      'pub-islam-kumar-nexus-social-network-igi-2019',
    ],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-climate-perception-university-students',
    slug: 'perception-and-knowledge-on-climate-change-university-students',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: 'Perception and Knowledge on Climate Change among University Students in Bangladesh',
    summary:
      'Case study of climate change perception and knowledge among university students in Bangladesh.',
    description: `Case study of climate change perception and knowledge among university students in Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar, A. I. Asad, B. Chandraaroy, P. Banik (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-climate-environment', 'area-education'],
    leadAuthorNames: ['B. Kumar', 'A. I. Asad', 'B. Chandraaroy', 'P. Banik'],
    year: 2019,
    endYear: 2019,
    publicationIds: [
      'pub-kumar-climate-perception-2019',
      'pub-kumar-climate-perception-conference-2019',
    ],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-remittances-poverty-alleviation',
    slug: 'international-remittances-and-poverty-alleviation-bangladesh',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: 'International Remittances and Poverty Alleviation in Bangladesh',
    summary:
      'Analyzed the impact of international remittances on poverty alleviation in Bangladesh.',
    featuredImageUrl: '/media/prototype/bksr-research-field.jpg',
    description: `Analyzed the impact of international remittances on poverty alleviation in Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-poverty', 'area-business-economics'],
    leadAuthorNames: ['B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-poverty-alleviation-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-remittances-poverty-welfare-cumilla',
    slug: 'remittances-poverty-and-welfare-cumilla',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: 'Remittances, Poverty and Welfare: Evidence from Cumilla, Bangladesh',
    summary:
      'Local evidence on remittances, poverty, and welfare from Cumilla, Bangladesh.',
    description: `Local evidence on remittances, poverty, and welfare from Cumilla, Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-poverty', 'area-social-development'],
    leadAuthorNames: ['B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-poverty-welfare-cumilla-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-remittances-education-health',
    slug: 'international-remittances-education-and-health-bangladesh',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: 'International Remittances, Education and Health in Bangladesh',
    summary:
      'Studied remittance impacts on education and health outcomes in Bangladesh.',
    description: `Studied remittance impacts on education and health outcomes in Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-education', 'area-health'],
    leadAuthorNames: ['B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-education-health-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-facebook-use-loneliness',
    slug: 'facebook-use-and-loneliness-public-private-universities',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Social Network, Facebook Use and Loneliness among Public and Private University Students',
    summary:
      'Comparative analysis of Facebook use and loneliness across public and private university students in Bangladesh.',
    description: `Comparative analysis of Facebook use and loneliness across public and private university students in Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar, P. Banik, M. A. Islam (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-wellbeing'],
    leadAuthorNames: ['B. Kumar', 'P. Banik', 'M. A. Islam'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-facebook-loneliness-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-information-literacy-academic-performance',
    slug: 'information-literacy-and-academic-performance',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: "Information Literacy Skill and Students' Academic Performance in Bangladesh",
    summary:
      "Assessed how information literacy skills relate to students' academic performance.",
    description: `Assessed how information literacy skills relate to students' academic performance.
Lead contributors listed in the legacy completed archive: P. Banik, B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-education'],
    leadAuthorNames: ['P. Banik', 'B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-banik-kumar-information-literacy-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-military-involvement-1971',
    slug: 'indian-military-involvement-1971-east-pakistan',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Indian Military Involvement in the 1971 Crisis of East-Pakistan: Level of Analysis',
    summary:
      'Level-of-analysis justification of Indian military involvement in the 1971 East-Pakistan crisis.',
    description: `Level-of-analysis justification of Indian military involvement in the 1971 East-Pakistan crisis.
Lead contributors listed in the legacy completed archive: S. Das, B. Kumar (2019).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-public-policy'],
    leadAuthorNames: ['S. Das', 'B. Kumar'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-das-kumar-military-1971-2019'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-utilization-international-remittances',
    slug: 'utilization-of-international-remittances-bangladesh',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title: 'Utilization of International Remittances in Bangladesh',
    summary:
      'Examined how international remittances are utilized in Bangladesh.',
    description: `Examined how international remittances are utilized in Bangladesh.
Lead contributors listed in the legacy completed archive: B. Kumar, M. E. Hossain, M. A. G. Osmani (2018).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-business-economics', 'area-social-development'],
    leadAuthorNames: ['B. Kumar', 'M. E. Hossain', 'M. A. G. Osmani'],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-kumar-utilization-remittances-2018'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-financial-forecasting-arch-mexico',
    slug: 'financial-forecasting-arch-family-mexico',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title: 'Financial Forecasting with ARCH Family Models: Mexico',
    summary:
      'Applied ARCH-family models to financial forecasting for Mexico.',
    description: `Applied ARCH-family models to financial forecasting for Mexico.
Lead contributors listed in the legacy completed archive: V. J. Khan, A. Qadeer, B. Kumar (2018).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-business-economics'],
    leadAuthorNames: ['V. J. Khan', 'A. Qadeer', 'B. Kumar'],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-khan-arch-mexico-2018'],
    originalLegacyUrl: legacyCompleted,
  },
  {
    ...ts,
    id: 'project-bank-performance-pakistan',
    slug: 'internal-external-factors-bank-performance-pakistan',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title: 'Internal and External Factors on Bank Performance in Pakistan',
    summary:
      'Analyzed internal and external determinants of bank performance in Pakistan.',
    description: `Analyzed internal and external determinants of bank performance in Pakistan.
Lead contributors listed in the legacy completed archive: K. A. Fani, V. J. Khan, B. Kumar, B. K. Pk (2018).
This completed project is mapped from the corresponding publication entry on the BKSR Completed research page.`,
    researchStatus: 'completed',
    areaIds: ['area-business-economics'],
    leadAuthorNames: ['K. A. Fani', 'V. J. Khan', 'B. Kumar', 'B. K. Pk'],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-fani-bank-performance-pakistan-2018'],
    originalLegacyUrl: legacyCompleted,
  },
];

/**
 * Ongoing theme entries from legacy Ongoing page.
 * themeCount = number of projects stated on the legacy list.
 */
export const ongoingProjects: ResearchProject[] = [
  {
    ...ts,
    id: 'project-ongoing-entrepreneurship',
    slug: 'ongoing-entrepreneurship',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Entrepreneurship (Ongoing Theme)',
    summary:
      'BKSR research scholars are currently working on entrepreneurship-related projects.',
    description:
      'Legacy Ongoing page listed Entrepreneurship with 2 research projects in progress. Individual project titles were not published on the legacy site.',
    researchStatus: 'ongoing',
    areaIds: ['area-entrepreneurship', 'area-business-economics'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-wellbeing',
    slug: 'ongoing-wellbeing',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Wellbeing (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on wellbeing.',
    description:
      'Legacy Ongoing page listed Wellbeing with 3 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-wellbeing', 'area-health'],
    leadAuthorNames: [],
    themeCount: 3,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-poverty',
    slug: 'ongoing-poverty',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Poverty (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on poverty.',
    description: 'Legacy Ongoing page listed Poverty with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-poverty', 'area-social-development'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-women-empowerment',
    slug: 'ongoing-women-empowerment',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Women Empowerment (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on women empowerment.',
    description:
      'Legacy Ongoing page listed Women Empowerment with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-women-empowerment'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-tourism',
    slug: 'ongoing-tourism',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Tourism (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on tourism.',
    description: 'Legacy Ongoing page listed Tourism with 1 research project in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-social-development', 'area-business-economics'],
    leadAuthorNames: [],
    themeCount: 1,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-productivity',
    slug: 'ongoing-productivity',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Productivity (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on productivity.',
    description: 'Legacy Ongoing page listed Productivity with 1 research project in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-business-economics'],
    leadAuthorNames: [],
    themeCount: 1,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-environment',
    slug: 'ongoing-environment',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Environment (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on environment.',
    description: 'Legacy Ongoing page listed Environment with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-environment', 'area-climate-environment'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-financial-economics',
    slug: 'ongoing-financial-economics',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Financial Economics (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on financial economics.',
    description:
      'Legacy Ongoing page listed Financial Economics with 1 research project in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-business-economics'],
    leadAuthorNames: [],
    themeCount: 1,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-sustainable-development',
    slug: 'ongoing-sustainable-development',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Sustainable Development (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on sustainable development.',
    description:
      'Legacy Ongoing page listed Sustainable Development with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-sustainable-development'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-behavioral-economics',
    slug: 'ongoing-behavioral-economics',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Behavioral Economics (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on behavioral economics.',
    description:
      'Legacy Ongoing page listed Behavioral Economics with 1 research project in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-behavioral-economics'],
    leadAuthorNames: [],
    themeCount: 1,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-social-media',
    slug: 'ongoing-social-media',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Social Media (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on social media.',
    description: 'Legacy Ongoing page listed Social Media with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-wellbeing', 'area-education'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
  {
    ...ts,
    id: 'project-ongoing-information-literacy',
    slug: 'ongoing-information-literacy',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title: 'Information Literacy (Ongoing Theme)',
    summary: 'Ongoing BKSR thematic research on information literacy.',
    description:
      'Legacy Ongoing page listed Information Literacy with 2 research projects in progress.',
    researchStatus: 'ongoing',
    areaIds: ['area-education'],
    leadAuthorNames: [],
    themeCount: 2,
    originalLegacyUrl: legacyOngoing,
  },
];

export const researchProjects: ResearchProject[] = [
  ...completedProjects,
  ...ongoingProjects,
];
