import type { ResearchProject } from '@/types/content';

const ts = {
  status: 'published' as const,
  createdAt: '2018-01-01T00:00:00.000Z',
  updatedAt: '2026-09-19T00:00:00.000Z',
};

/**
 * Research portfolio from docs/New folder/Research.docx (Sep 2026).
 * Ongoing = named projects in progress.
 * Completed = journal-article projects from the Completed (Journal Articles) list.
 */

export const ongoingProjects: ResearchProject[] = [
  {
    ...ts,
    id: 'project-char-land-climate-displacement',
    slug: 'climate-change-forced-displacement-livelihood-char-land-dwellers',
    publishedAt: '2024-01-01T00:00:00.000Z',
    title:
      'Climate Change, Forced Displacement, and Livelihood: Coping Mechanisms among Char Land Dwellers in Bangladesh',
    summary:
      'Examines how char land communities cope with climate-driven displacement and livelihood disruption in Bangladesh.',
    description:
      'Ongoing research on climate change, forced displacement, and livelihood coping mechanisms among char land dwellers in Bangladesh.',
    researchStatus: 'ongoing',
    areaIds: ['area-environment-climate', 'area-migration-diaspora'],
    leadAuthorNames: [],
    startYear: 2024,
    year: 2024,
    featuredImageUrl: '/media/prototype/bksr-research-field.jpg',
  },
  {
    ...ts,
    id: 'project-char-land-coping-drivers',
    slug: 'drivers-of-coping-mechanisms-char-land-climate-migrants',
    publishedAt: '2024-01-01T00:00:00.000Z',
    title:
      'Drivers of Coping Mechanisms among Char Land Dwellers in Bangladesh: Insights from Climate-Induced Migrant Communities in Bangladesh',
    summary:
      'Identifies drivers of coping strategies among climate-induced migrant communities living on Bangladesh’s char lands.',
    description:
      'Ongoing research on the drivers of coping mechanisms among char land dwellers, drawing insights from climate-induced migrant communities in Bangladesh.',
    researchStatus: 'ongoing',
    areaIds: ['area-environment-climate', 'area-migration-diaspora'],
    leadAuthorNames: [],
    startYear: 2024,
    year: 2024,
  },
  {
    ...ts,
    id: 'project-nepali-students-taiwan',
    slug: 'migration-young-nepali-students-taiwan',
    publishedAt: '2025-01-01T00:00:00.000Z',
    title:
      'Migration of Young Nepali Students in Taiwan: Motivations, Aspirations, Expectations, and Challenges',
    summary:
      'Studies motivations, aspirations, expectations, and challenges among young Nepali students migrating to Taiwan.',
    description:
      'Ongoing research on student migration from Nepal to Taiwan, focusing on motivations, aspirations, expectations, and challenges.',
    researchStatus: 'ongoing',
    areaIds: ['area-migration-diaspora', 'area-education-culture'],
    leadAuthorNames: [],
    startYear: 2025,
    year: 2025,
  },
];

export const completedProjects: ResearchProject[] = [
  {
    ...ts,
    id: 'project-remittances-rural-development-2026',
    slug: 'remittances-pathway-rural-development-bangladesh-2026',
    publishedAt: '2026-01-01T00:00:00.000Z',
    title:
      'Remittances as a pathway to rural development: micro-level evidence on household well-being and poverty reduction in Bangladesh',
    summary:
      'Micro-level evidence on how remittances shape household well-being and poverty reduction in rural Bangladesh.',
    description:
      'Kumar, B. (2026). Remittances as a pathway to rural development: micro-level evidence on household well-being and poverty reduction in Bangladesh. SN Business and Economics, 6:328.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-migration-diaspora'],
    leadAuthorNames: ['Kumar, B.'],
    year: 2026,
    endYear: 2026,
    publicationIds: ['pub-kumar-remittances-rural-development-2026'],
    featuredImageUrl: '/media/prototype/bksr-pub-cover-remittances.jpg',
  },
  {
    ...ts,
    id: 'project-information-literacy-undergraduates-2026',
    slug: 'information-literacy-skills-bangladeshi-undergraduates-2026',
    publishedAt: '2026-01-01T00:00:00.000Z',
    title:
      'Information literacy skills among Bangladeshi undergraduates: measurement, determinants and the role of libraries',
    summary:
      'Measures information literacy among Bangladeshi undergraduates and examines determinants and the role of libraries.',
    description:
      'Banik, P, Roy, P, B. and Kumar, B (2026). Information literacy skills among Bangladeshi undergraduates: measurement, determinants and the role of libraries. Performance Measurement and Metrics, 1-29.',
    researchStatus: 'completed',
    areaIds: ['area-education-culture'],
    leadAuthorNames: [
      'Banik, P',
      'Roy, P, B.',
      'Kumar, B',
    ],
    year: 2026,
    endYear: 2026,
    publicationIds: ['pub-banik-information-literacy-undergraduates-2026'],
    url: 'https://doi.org/10.1108/PMM-03-2026-0025',
  },
  {
    ...ts,
    id: 'project-climate-women-pwd-2026',
    slug: 'climate-change-impacts-coping-women-persons-with-disabilities-2026',
    publishedAt: '2026-01-01T00:00:00.000Z',
    title:
      'Climate Change Impacts and Coping Mechanisms among Women and Persons with Disabilities: Insights from Climate-Induced Migrant Communities',
    summary:
      'Documents climate impacts and coping among women and persons with disabilities in climate-induced migrant communities.',
    description:
      'Kumar, B., Mimi, M. B., Ko, J., Ridwan, M., Banik, P., Rani, D., & Lee, H. F. (2026). Climate Change Impacts and Coping Mechanisms among Women and Persons with Disabilities: Insights from Climate-Induced Migrant Communities. Environment, Innovation and Management, 2, 2650011.',
    researchStatus: 'completed',
    areaIds: [
      'area-environment-climate',
      'area-gender-development',
      'area-migration-diaspora',
    ],
    leadAuthorNames: [
      'Kumar, B.',
      'Mimi, M. B.',
      'Ko, J.',
      'Ridwan, M.',
      'Banik, P.',
      'Rani, D.',
      'Lee, H. F.',
    ],
    year: 2026,
    endYear: 2026,
    publicationIds: ['pub-kumar-climate-women-pwd-2026'],
    featuredImageUrl: '/media/prototype/bksr-pub-cover-climate.jpg',
  },
  {
    ...ts,
    id: 'project-ncf-2021-teachers-2026',
    slug: 'national-curriculum-framework-2021-bangladeshi-teachers-2026',
    publishedAt: '2026-01-01T00:00:00.000Z',
    title:
      "Navigating the uncharted: a phenomenological study of Bangladeshi teachers’ perceptions and experiences in implementing the National Curriculum Framework 2021",
    summary:
      'Phenomenological study of Bangladeshi teachers’ experiences implementing the National Curriculum Framework 2021.',
    description:
      'Al Galib, S., Nurudden, A. M., Sarker, T., Kumar, B., & Banik, P. (2026). Navigating the uncharted: a phenomenological study of Bangladeshi teachers’ perceptions and experiences in implementing the National Curriculum Framework 2021. Discover Education, 5(1), 248.',
    researchStatus: 'completed',
    areaIds: ['area-education-culture'],
    leadAuthorNames: [
      'Al Galib, S.',
      'Nurudden, A. M.',
      'Sarker, T.',
      'Kumar, B.',
      'Banik, P.',
    ],
    year: 2026,
    endYear: 2026,
    publicationIds: ['pub-al-galib-ncf-teachers-2026'],
  },
  {
    ...ts,
    id: 'project-covid-rohingya-2022',
    slug: 'covid-19-rohingya-refugees-bangladesh-2022',
    publishedAt: '2022-01-01T00:00:00.000Z',
    title:
      'COVID-19 and the Rohingya Refugees in Bangladesh: Socioeconomic and Health Impacts on Women and Adolescents',
    summary:
      'Socioeconomic and health impacts of COVID-19 on Rohingya women and adolescents in Bangladesh.',
    description:
      'Kumar, B., Pinky, S. D., Pulock, O. S., Kamal, R. S. and Aziz, R. (2022). COVID-19 and the Rohingya Refugees in Bangladesh: Socioeconomic and Health Impacts on Women and Adolescents. International Journal of Asia Pacific Studies, 18(2): 179-199.',
    researchStatus: 'completed',
    areaIds: [
      'area-health-wellbeing',
      'area-migration-diaspora',
      'area-gender-development',
    ],
    leadAuthorNames: [
      'Kumar, B.',
      'Pinky, S. D.',
      'Pulock, O. S.',
      'Kamal, R. S.',
      'Aziz, R.',
    ],
    year: 2022,
    endYear: 2022,
    publicationIds: ['pub-kumar-covid-rohingya-2022'],
  },
  {
    ...ts,
    id: 'project-energy-growth-2022',
    slug: 'energy-consumption-economic-growth-linkage-2022',
    publishedAt: '2022-01-01T00:00:00.000Z',
    title:
      'Energy Consumption and Economic Growth Linkage: Global Evidence from Symmetric and Asymmetric Simulations',
    summary:
      'Global evidence on energy consumption–growth linkages using symmetric and asymmetric simulations.',
    description:
      'Ali, W., Nathaniel, S. P., Adikunle, I. A. and Kumar, B. (2022). Energy Consumption and Economic Growth Linkage: Global Evidence from Symmetric and Asymmetric Simulations. Quaestiones Geographicae, 41(2): 67-82.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-environment-climate'],
    leadAuthorNames: [
      'Ali, W.',
      'Nathaniel, S. P.',
      'Adikunle, I. A.',
      'Kumar, B.',
    ],
    year: 2022,
    endYear: 2022,
    publicationIds: ['pub-ali-energy-growth-2022'],
  },
  {
    ...ts,
    id: 'project-kap-covid-students-2021',
    slug: 'knowledge-attitudes-practices-covid-19-students-bangladesh-2021',
    publishedAt: '2021-01-01T00:00:00.000Z',
    title:
      'Knowledge, Attitudes and Practices towards COVID-19 Guidelines among Students in Bangladesh',
    summary:
      'Survey of student knowledge, attitudes, and practices toward COVID-19 guidelines in Bangladesh.',
    description:
      'Kumar, B., Pinky, S. D. and Nurudden, A. M. (2021). Knowledge, Attitudes and Practices towards COVID-19 Guidelines among Students in Bangladesh. Social Sciences and Humanities Open, 4(1): 100194.',
    researchStatus: 'completed',
    areaIds: ['area-health-wellbeing', 'area-education-culture'],
    leadAuthorNames: [
      'Kumar, B.',
      'Pinky, S. D.',
      'Nurudden, A. M.',
    ],
    year: 2021,
    endYear: 2021,
    publicationIds: ['pub-kumar-kap-covid-students-2021'],
  },
  {
    ...ts,
    id: 'project-covid-economic-health-2020',
    slug: 'addressing-economic-health-challenges-covid-19-bangladesh-2020',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title:
      'Addressing Economic and Health Challenges of COVID-19 in Bangladesh: Preparation and Response',
    summary:
      'Assessment of Bangladesh’s preparation and response to the economic and health challenges of COVID-19.',
    description:
      'Kumar, B. and Pinky, S. D. (2020). Addressing Economic and Health Challenges of COVID-19 in Bangladesh: Preparation and Response. Journal of Public Affairs, e2556.',
    researchStatus: 'completed',
    areaIds: ['area-health-wellbeing', 'area-economics-sustainability'],
    leadAuthorNames: ['Kumar, B.', 'Pinky, S. D.'],
    year: 2020,
    endYear: 2020,
    publicationIds: ['pub-kumar-covid-economic-health-2020'],
  },
  {
    ...ts,
    id: 'project-job-satisfaction-banks-2020',
    slug: 'employees-job-satisfaction-turnover-private-banks-bangladesh-2020',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title:
      'Employees’ Job Satisfaction, Job Alternatives, and Turnover Intention: Evidence from Private Banks, Bangladesh',
    summary:
      'Evidence on job satisfaction, alternatives, and turnover intention among private bank employees in Bangladesh.',
    description:
      'Awal, M. R., Kumar, B., Saha, P. and Saha, A. (2020). Employees’ Job Satisfaction, Job Alternatives, and Turnover Intention: Evidence from Private Banks, Bangladesh. Economic Insights- Trends and Challenges, 9(3): 67-75.',
    researchStatus: 'completed',
    areaIds: ['area-business-technology'],
    leadAuthorNames: [
      'Awal, M. R.',
      'Kumar, B.',
      'Saha, P.',
      'Saha, A.',
    ],
    year: 2020,
    endYear: 2020,
    publicationIds: ['pub-awal-job-satisfaction-banks-2020'],
  },
  {
    ...ts,
    id: 'project-unemployment-governance-poverty-pakistan',
    slug: 'unemployment-governance-and-poverty-in-pakistan',
    publishedAt: '2020-01-01T00:00:00.000Z',
    title:
      'Impact of Unemployment and Governance on Poverty in Pakistan: a Fresh Insight from Non-linear ARDL Co-integration Approach',
    summary:
      'Non-linear ARDL co-integration analysis of unemployment, governance, and poverty in Pakistan.',
    description:
      'Meo, M. S., Kumar, B., Chughtai, S., Khan, V. J., Dost, M. K. B. and Nisar, Q. A. (2020). Impact of Unemployment and Governance on Poverty in Pakistan: a Fresh Insight from Non-linear ARDL Co-integration Approach. Global Business Review, 1-18.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-society-politics'],
    leadAuthorNames: [
      'Meo, M. S.',
      'Kumar, B.',
      'Chughtai, S.',
      'Khan, V. J.',
      'Dost, M. K. B.',
      'Nisar, Q. A.',
    ],
    year: 2020,
    endYear: 2020,
    publicationIds: ['pub-meo-unemployment-governance-poverty-2020'],
  },
  {
    ...ts,
    id: 'project-social-network-loneliness-academic-performance',
    slug: 'social-network-loneliness-and-academic-performance',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'The Relationship between Social Network, Social Media Use, Loneliness and Academic Performance: A Study among University Students in Bangladesh',
    summary:
      'Relationships among social networks, social media use, loneliness, and academic performance for Bangladeshi university students.',
    description:
      'Islam, M. A. and Kumar, B. (2019). The Relationship between Social Network, Social Media Use, Loneliness and Academic Performance: A Study among University Students in Bangladesh. World of Media Journal of Russian Media and Journalism Studies, 2019(4): 25-47.',
    researchStatus: 'completed',
    areaIds: ['area-media-communication', 'area-education-culture'],
    leadAuthorNames: ['Islam, M. A.', 'Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: [
      'pub-islam-kumar-social-network-loneliness-2019',
      'pub-islam-kumar-nexus-social-network-igi-2019',
    ],
    featuredImageUrl: '/media/prototype/bksr-knowledge-archive.jpg',
  },
  {
    ...ts,
    id: 'project-climate-perception-university-students',
    slug: 'perception-and-knowledge-on-climate-change-university-students',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Perception and Knowledge on Climate Change: A Case Study on University Students in Bangladesh',
    summary:
      'Case study of climate change perception and knowledge among university students in Bangladesh.',
    description:
      'Kumar, B., Asad, A. I., Chandraaroy, B. and Banik, P. (2019). Perception and Knowledge on Climate Change: A Case Study on University Students in Bangladesh. Journal of Atmospheric Science Research, 2(3): 17-22.',
    researchStatus: 'completed',
    areaIds: ['area-environment-climate', 'area-education-culture'],
    leadAuthorNames: [
      'Kumar, B.',
      'Asad, A. I.',
      'Chandraaroy, B.',
      'Banik, P.',
    ],
    year: 2019,
    endYear: 2019,
    publicationIds: [
      'pub-kumar-climate-perception-2019',
      'pub-kumar-climate-perception-conference-2019',
    ],
    featuredImageUrl: '/media/prototype/bksr-pub-cover-climate.jpg',
  },
  {
    ...ts,
    id: 'project-remittances-poverty-alleviation',
    slug: 'international-remittances-and-poverty-alleviation-bangladesh',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'The Impact of International Remittances on Poverty Alleviation in Bangladesh',
    summary:
      'Analyzed the impact of international remittances on poverty alleviation in Bangladesh.',
    description:
      'Kumar, B. (2019). The Impact of International Remittances on Poverty Alleviation in Bangladesh. Remittances Review, 4(1): 67-86.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-migration-diaspora'],
    leadAuthorNames: ['Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-poverty-alleviation-2019'],
    featuredImageUrl: '/media/prototype/bksr-pub-cover-remittances.jpg',
  },
  {
    ...ts,
    id: 'project-remittances-poverty-welfare-cumilla',
    slug: 'remittances-poverty-and-welfare-cumilla',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title: 'Remittances, Poverty and Welfare: Evidence from Cumilla, Bangladesh',
    summary:
      'Local evidence on remittances, poverty, and welfare from Cumilla, Bangladesh.',
    description:
      'Kumar, B. (2019). Remittances, Poverty and Welfare: Evidence from Cumilla, Bangladesh. American Journal of Data Mining and Knowledge Discovery, 4(1): 46-52.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-migration-diaspora'],
    leadAuthorNames: ['Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-poverty-welfare-cumilla-2019'],
  },
  {
    ...ts,
    id: 'project-remittances-education-health',
    slug: 'international-remittances-education-and-health-bangladesh',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'The Impact of International Remittances Education and Health in Bangladesh',
    summary:
      'Studied remittance impacts on education and health outcomes in Bangladesh.',
    description:
      'Kumar, B. (2019). The Impact of International Remittances Education and Health in Bangladesh. International Journal of Science and Qualitative Analysis, 5(1): 6-14.',
    researchStatus: 'completed',
    areaIds: ['area-education-culture', 'area-health-wellbeing'],
    leadAuthorNames: ['Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-remittances-education-health-2019'],
  },
  {
    ...ts,
    id: 'project-facebook-use-loneliness',
    slug: 'facebook-use-and-loneliness-public-private-universities',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Social Network, Facebook Use and Loneliness: A Comparative Analysis between Public and Private University Students in Bangladesh',
    summary:
      'Comparative analysis of Facebook use and loneliness across public and private university students in Bangladesh.',
    description:
      'Kumar, B., Banik, P. and Islam, M. A. (2019). Social Network, Facebook Use and Loneliness: A Comparative Analysis between Public and Private University Students in Bangladesh. International Journal of Psychological and Brain Science, 4(2): 20-28.',
    researchStatus: 'completed',
    areaIds: ['area-media-communication', 'area-health-wellbeing'],
    leadAuthorNames: [
      'Kumar, B.',
      'Banik, P.',
      'Islam, M. A.',
    ],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-kumar-facebook-loneliness-2019'],
  },
  {
    ...ts,
    id: 'project-information-literacy-academic-performance',
    slug: 'information-literacy-and-academic-performance',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      "Impact of Information Literacy Skill on Students’ Academic Performance in Bangladesh",
    summary:
      "Assessed how information literacy skills relate to students' academic performance.",
    description:
      'Banik, P. and Kumar, B. (2019). Impact of Information Literacy Skill on Students’ Academic Performance in Bangladesh. International Journal of European Studies, 3(1): 27-33.',
    researchStatus: 'completed',
    areaIds: ['area-education-culture'],
    leadAuthorNames: ['Banik, P.', 'Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-banik-kumar-information-literacy-2019'],
  },
  {
    ...ts,
    id: 'project-military-involvement-1971',
    slug: 'indian-military-involvement-1971-east-pakistan',
    publishedAt: '2019-01-01T00:00:00.000Z',
    title:
      'Indian Military Involvement in the 1971 Crisis of East-Pakistan: A Justification of Level of Analysis',
    summary:
      'Level-of-analysis justification of Indian military involvement in the 1971 East-Pakistan crisis.',
    description:
      'Das, S. and Kumar, B. (2019). Indian Military Involvement in the 1971 Crisis of East-Pakistan: A Justification of Level of Analysis. American Journal of Theoretical and Applied Business, 5(4): 84-89.',
    researchStatus: 'completed',
    areaIds: ['area-society-politics'],
    leadAuthorNames: ['Das, S.', 'Kumar, B.'],
    year: 2019,
    endYear: 2019,
    publicationIds: ['pub-das-kumar-military-1971-2019'],
  },
  {
    ...ts,
    id: 'project-utilization-international-remittances',
    slug: 'utilization-of-international-remittances-bangladesh',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title: 'Utilization of International Remittances in Bangladesh',
    summary:
      'Examined how international remittances are utilized in Bangladesh.',
    description:
      'Kumar, B., Hossain, M. E. and Osmani, M. A. G. (2018). Utilization of International Remittances in Bangladesh. Remittances Review, 3(1): 5-18.',
    researchStatus: 'completed',
    areaIds: ['area-economics-sustainability', 'area-migration-diaspora'],
    leadAuthorNames: [
      'Kumar, B.',
      'Hossain, M. E.',
      'Osmani, M. A. G.',
    ],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-kumar-utilization-remittances-2018'],
  },
  {
    ...ts,
    id: 'project-financial-forecasting-arch-mexico',
    slug: 'financial-forecasting-arch-family-mexico',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title:
      'Financial Forecasting by Autoregressive Conditional Heteroscedasticity (ARCH) Family: A Case of Mexico',
    summary:
      'Applied ARCH-family models to financial forecasting for Mexico.',
    description:
      'Khan, V. J., Qadeer, A. and Kumar B. (2018). Financial Forecasting by Autoregressive Conditional Heteroscedasticity (ARCH) Family: A Case of Mexico. Journal of Public Policy and Administration, 2(3): 32-39.',
    researchStatus: 'completed',
    areaIds: ['area-business-technology', 'area-economics-sustainability'],
    leadAuthorNames: [
      'Khan, V. J.',
      'Qadeer, A.',
      'Kumar B.',
    ],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-khan-arch-mexico-2018'],
  },
  {
    ...ts,
    id: 'project-bank-performance-pakistan',
    slug: 'internal-external-factors-bank-performance-pakistan',
    publishedAt: '2018-01-01T00:00:00.000Z',
    title:
      'Impact of Internal and External Factors on Bank Performance in Pakistan',
    summary:
      'Analyzed internal and external determinants of bank performance in Pakistan.',
    description:
      'Fani, K. A., Khan, V. J., Kumar, B. and Pk, B. K. (2018). Impact of Internal and External Factors on Bank Performance in Pakistan. International and Public Affairs, 2(4): 66-77.',
    researchStatus: 'completed',
    areaIds: ['area-business-technology', 'area-economics-sustainability'],
    leadAuthorNames: [
      'Fani, K. A.',
      'Khan, V. J.',
      'Kumar, B.',
      'Pk, B. K.',
    ],
    year: 2018,
    endYear: 2018,
    publicationIds: ['pub-fani-bank-performance-pakistan-2018'],
  },
];

export const researchProjects: ResearchProject[] = [
  ...ongoingProjects,
  ...completedProjects,
];
