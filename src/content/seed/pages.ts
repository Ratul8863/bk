import type { Page } from '@/types/content';

const ts = {
  status: 'published' as const,
  createdAt: '2016-12-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  publishedAt: '2016-12-01T00:00:00.000Z',
};

export const pages: Page[] = [
  {
    ...ts,
    id: 'page-who-we-are',
    slug: 'who-we-are',
    title: 'Who We Are',
    excerpt:
      'A research institution generating evidence-based knowledge, shaping policy, and driving lasting social impact across 26 countries.',
    body: `BK School of Research (BKSR), established in 2015, is a research institution dedicated to generating evidence-based knowledge, shaping policy, and driving lasting social impact. Our multidisciplinary work spans Arts and Humanities, Social Sciences, Business and Economics, and Public Health, bringing together 15 research fellows, 55 research scholars, and 300 enumerators across 26 countries.

We are committed to nurturing the next generation of researchers. Through training, mentorship, and innovation programs, we have empowered over 15,000 young individuals, many now pursuing global careers in research and development.

Our findings have shaped policy conversations, informed institutions like WHO and UNICEF, and reached communities through publications and partnerships, reflecting who we are: a bridge between evidence and impact.

## Vision

To be a globally recognized center of research excellence, empowering young researchers across diverse fields to generate evidence-based knowledge, shape policy, and drive lasting social impact.

## Missions

- To pursue innovative, evidence-based research that confronts pressing socio-economic and developmental challenges.
- To empower youths, early-career researchers, and young professionals, building their capacity through training, mentorship, collaboration, and publication.
- To bridge the gap between research and action, turning evidence into policy that governments, institutions, and communities can act on.
- To forge partnerships across borders and disciplines with universities, institutions, and change-makers who share our commitment to research for good.
- To carry knowledge beyond the walls of academia through journals, policy briefs, and public conversation so that research speaks not only to scholars, but also to the world it seeks to serve.

## Core Values

- To uphold rigor and quality in every stage of research.
- To invest in young researchers to build lasting capacity.
- To commit to honesty and transparency in research and reporting.
- To collaborate across disciplines and borders to address shared challenges.
- To translate research into policy, practice, and public benefit.`,
    template: 'about',
    order: 1,
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/about-us.html',
    seo: {
      title: 'Who We Are | BK School of Research',
      description:
        'Mission, vision, and institutional identity of BK School of Research.',
      canonicalPath: '/about/who-we-are',
    },
  },
  {
    ...ts,
    id: 'page-what-we-do',
    slug: 'what-we-do',
    title: 'What We Do',
    excerpt:
      'Evidence-based research, peer-reviewed publishing, capacity building, and community-facing fieldwork.',
    body: `BK School of Research conducts evidence-based research across health, business, policy, and culture, through both funded projects and contract research for government bodies, NGOs, and development partners.

We publish peer-reviewed articles in scholarly journals, along with policy briefs, research reports, and working paper series to reach practitioners and policymakers directly, ensuring our research translates into real-world use.

BK School of Research supports early-career researchers through training, fellowships, and mentorship, and we engage policymakers and academics through roundtables, briefings, seminars, and international partnerships.

We also work directly with communities through field studies, public health surveys, and partnerships with civil society organizations, ensuring our research leads to real, lasting impact.`,
    template: 'about',
    order: 2,
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/about-us.html',
    seo: {
      title: 'What We Do | BK School of Research',
      description:
        'Research, publishing, training, and community engagement at BK School of Research.',
      canonicalPath: '/about/what-we-do',
    },
  },
  {
    ...ts,
    id: 'page-governance',
    slug: 'governance',
    title: 'Governance',
    excerpt:
      'A structured framework for accountability, transparency, and sound institutional decision-making.',
    body: `BK School of Research operates under a structured governance framework designed to ensure accountability, transparency, and sound institutional decision-making across all areas of its work.

## Governing Board

BK School of Research is governed by a Governing Board, which serves as the institution's apex decision-making authority. The board sets the institution's strategic direction, approves major policies, and provides overarching oversight of institutional performance and integrity. It comprises a balanced mix of institutional leadership and independent members drawn from academia and the research sector, ensuring that governance decisions reflect diverse expertise and remain free from undue concentration of authority. The board convenes periodically to review institutional performance, approve key policies, and provide strategic guidance, with all proceedings formally documented.

## Executive Leadership

Day-to-day management of BK School of Research is entrusted to its executive leadership, headed by the Executive Director, who is accountable to the Governing Board. The Executive Director oversees the implementation of institutional strategy, research operations, and administrative functions, while major decisions including significant budgetary allocations, new institutional partnerships, and policy revisions remain subject to Board review and approval, in accordance with a clearly defined delegation of authority.

## Standing Committees

To distribute oversight responsibility and ensure specialized attention to key institutional functions, BK School of Research maintains the following standing committees:

- **Ethics Review Committee (ERC):** Reviews and approves all research involving human participants, assesses risk-benefit considerations, and monitors ongoing ethical compliance throughout the research lifecycle.
- **Research Advisory Committee:** Provides scientific and academic oversight of research design, methodology, and quality, ensuring that all research outputs meet institutional and international standards of rigor.
- **Finance and Audit Committee:** Oversees budgeting, financial controls, and the conduct of internal and external audits, ensuring the transparent and accountable use of institutional and donor resources.
- **Human Resources and Grievance Committee:** Oversees staff conduct, HR policy compliance, and the fair, impartial handling of workplace and research-related grievances.

## Accountability and Transparency Mechanisms

BK School of Research upholds accountability through a combination of internal and external mechanisms:

- **Financial Reporting:** Annual financial statements are prepared and reviewed through internal and external audit processes, ensuring transparent stewardship of institutional and donor funds.
- **Programmatic Reporting:** Annual reports detailing research activities, outcomes, and institutional performance are shared with donors, partners, and relevant stakeholders.
- **Policy Compliance Monitoring:** Adherence to institutional policies is monitored on an ongoing basis by the relevant committees, with periodic reviews to ensure continued alignment with evolving regulatory and sector standards.
- **Public Disclosure:** Governance structures, institutional policies, and leadership information are made publicly accessible, reflecting the institution's commitment to openness and accountability toward donors, partners, and the communities it serves.`,
    template: 'about',
    order: 3,
    status: 'published',
    seo: {
      title: 'Governance | BK School of Research',
      description:
        'Governing Board, executive leadership, committees, and accountability at BK School of Research.',
      canonicalPath: '/about/governance',
    },
  },
  {
    ...ts,
    id: 'page-policies',
    slug: 'policies',
    title: 'Our Policies',
    excerpt:
      'Privacy, correspondence, and institutional standards for the BKSR website.',
    body: `BK School of Research publishes this website to share research, publications, programmes, and institutional information.

**Privacy**

Contact forms on this site are demonstration interfaces and do not transmit data to a server. For formal correspondence, use the email addresses listed on the Contact page.

Server logs for hosting and analytics, if enabled by the deployment platform, may include standard technical data such as IP address, browser type, and requested URLs. Personal profiles are not sold or shared for advertising.

Questions about privacy may be sent to info@bkschoolofresearch.org.

**Research integrity**

BKSR expects honest attribution, careful handling of data, and transparent citation in work associated with the organisation. Formal research-integrity, authorship, and ethics statements will be expanded here as institutional documents are finalised for the new site.

**Terms of use**

Content on this website is provided for informational and educational purposes. Where third-party publications or media are cited, rights remain with the original publishers. For permissions or formal requests, contact the Executive Director or Research Director via the addresses on the Contact page.`,
    template: 'about',
    order: 4,
    status: 'published',
    seo: {
      title: 'Our Policies | BK School of Research',
      description: 'Privacy and institutional policies of BK School of Research.',
      canonicalPath: '/about/policies',
    },
  },
  {
    ...ts,
    id: 'page-contact',
    slug: 'contact',
    title: 'Contact',
    excerpt: 'Get in touch with BK School of Research.',
    body: `BK School of Research

Address: Shahjadpur, Sirajganj-6770, Bangladesh
Phone: +8801747256047

Email:
- General: info@bkschoolofresearch.org
- Executive Director: exe_dir@bkschoolofresearch.org
- Research Director: dir_res@bkschoolofresearch.org`,
    template: 'contact',
    order: 10,
    seo: {
      title: 'Contact | BK School of Research',
      description: 'Contact BK School of Research in Shahjadpur, Sirajganj, Bangladesh.',
      canonicalPath: '/contact',
    },
  },
];
