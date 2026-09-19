/**
 * Structured About hub copy from docs/New folder/About.docx.
 * Shared so homepage Who we are and /about stay aligned.
 */

export const ABOUT_HEADLINE =
  'Advancing Knowledge, Shaping Policy, Transforming Societies';

export const ABOUT_OVERVIEW_PARAGRAPHS = [
  'Established in 2015, BK School of Research (BKSR) is a globally engaged institution dedicated to generating evidence-based knowledge, shaping policy, and driving lasting social impact. Our multidisciplinary work spans Arts and Humanities, Social Sciences, Business and Economics, and Public Health, bringing together 15 distinguished research fellows, 55 research scholars, and 300 enumerators across 26 countries.',
  'With 35 completed research projects published in leading journals including Elsevier, Springer, and Taylor & Francis, and findings featured by WHO and UNICEF, BK School of Research bridges rigorous research with real-world policy and practice. Our work has also been presented at international conferences in the UK, UAE, India, Sri Lanka, Nepal, Bangladesh, and beyond, reflecting our growing global reach. Beyond research, we have empowered over 15,000 young individuals through training, mentorship, and innovation programs, many now pursuing global careers.',
  'We collaborate across borders with partners including Positive Sciences (France) and the Ceylon Foundation for Economic Policy Analysis (CFEP) in Sri Lanka, and remain open to new partnerships that advance research for good.',
  'Recognized with the Joy Bangla Youth Award (2022) and Rising Youth Award (2023), BK School of Research continues to nurture the next generation of researchers turning evidence into impact.',
] as const;

/** Homepage Who we are identity block (same source as overview). */
export const ABOUT_OVERVIEW_IDENTITY = ABOUT_OVERVIEW_PARAGRAPHS.join('\n\n');

export const ABOUT_VISION =
  'To be a globally recognized center of research excellence, empowering young researchers across diverse fields to generate evidence-based knowledge, shape policy, and drive lasting social impact.';

export const ABOUT_MISSIONS = [
  {
    id: 'mission-research',
    title: 'Evidence-based research',
    body: 'To pursue innovative, evidence-based research that confronts pressing socio-economic and developmental challenges.',
  },
  {
    id: 'mission-youth',
    title: 'Empower young researchers',
    body: 'To empower youths, early-career researchers, and young professionals, building their capacity through training, mentorship, collaboration, and publication.',
  },
  {
    id: 'mission-bridge',
    title: 'Bridge research and action',
    body: 'To bridge the gap between research and action, turning evidence into policy that governments, institutions, and communities can act on.',
  },
  {
    id: 'mission-partners',
    title: 'Forge partnerships',
    body: 'To forge partnerships across borders and disciplines with universities, institutions, and change-makers who share our commitment to research for good.',
  },
  {
    id: 'mission-public',
    title: 'Carry knowledge outward',
    body: 'To carry knowledge beyond the walls of academia through journals, policy briefs, and public conversation so that research speaks not only to scholars, but also to the world it seeks to serve.',
  },
] as const;

export const ABOUT_VALUES = [
  {
    id: 'value-rigor',
    title: 'Rigor & quality',
    body: 'Uphold rigor and quality in every stage of research.',
  },
  {
    id: 'value-youth',
    title: 'Invest in youth',
    body: 'Invest in young researchers to build lasting capacity.',
  },
  {
    id: 'value-integrity',
    title: 'Honesty & transparency',
    body: 'Commit to honesty and transparency in research and reporting.',
  },
  {
    id: 'value-collaborate',
    title: 'Collaborate',
    body: 'Collaborate across disciplines and borders to address shared challenges.',
  },
  {
    id: 'value-impact',
    title: 'Public benefit',
    body: 'Translate research into policy, practice, and public benefit.',
  },
] as const;

export const ABOUT_WHAT_WE_DO = [
  {
    id: 'do-research',
    title: 'Research',
    body: 'Evidence-based research across health, business, policy, and culture — through funded projects and contract research for government bodies, NGOs, and development partners.',
  },
  {
    id: 'do-publish',
    title: 'Publish',
    body: 'Peer-reviewed articles in scholarly journals, plus policy briefs, research reports, and working papers that reach practitioners and policymakers directly.',
  },
  {
    id: 'do-capacity',
    title: 'Build capacity',
    body: 'Training, fellowships, and mentorship for early-career researchers, with roundtables, briefings, seminars, and international partnerships.',
  },
  {
    id: 'do-community',
    title: 'Engage communities',
    body: 'Field studies, public health surveys, and partnerships with civil society so research leads to real, lasting impact.',
  },
] as const;

export const ABOUT_HIGHLIGHT_STATS = [
  { id: 'fellows', value: '15', label: 'Research fellows' },
  { id: 'scholars', value: '55', label: 'Research scholars' },
  { id: 'enumerators', value: '300', label: 'Enumerators' },
  { id: 'countries', value: '26', label: 'Countries' },
  { id: 'projects', value: '35', label: 'Completed projects' },
  { id: 'youth', value: '15000+', label: 'Young people empowered' },
] as const;

export const ABOUT_AWARDS = [
  { id: 'joy-bangla', label: 'Joy Bangla Youth Award', year: '2022' },
  { id: 'rising-youth', label: 'Rising Youth Award', year: '2023' },
] as const;

export const ABOUT_PARTNERS = [
  'Positive Sciences (France)',
  'Ceylon Foundation for Economic Policy Analysis — CFEP (Sri Lanka)',
] as const;

export const ABOUT_FIELDS = [
  'Arts & Humanities',
  'Social Sciences',
  'Business & Economics',
  'Public Health',
] as const;

export const ABOUT_GOVERNANCE_PREVIEW = {
  intro:
    'BK School of Research operates under a structured governance framework designed to ensure accountability, transparency, and sound institutional decision-making.',
  pillars: [
    {
      id: 'board',
      title: 'Governing Board',
      body: 'Apex authority for strategy, major policies, and institutional integrity.',
    },
    {
      id: 'executive',
      title: 'Executive Leadership',
      body: 'Day-to-day management led by the Executive Director, accountable to the Board.',
    },
    {
      id: 'committees',
      title: 'Standing Committees',
      body: 'Ethics, research advisory, finance & audit, and HR & grievance oversight.',
    },
    {
      id: 'accountability',
      title: 'Accountability',
      body: 'Financial and programmatic reporting, policy monitoring, and public disclosure.',
    },
  ],
} as const;
