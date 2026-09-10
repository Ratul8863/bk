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
      'BK School of Research (BKSR) works in business, economics, social sciences, and the humanities.',
    body: `Welcome to BK School of Research.

BK School of Research (BKSR) is a research organization that works in Business, Economics, Social Sciences, and Humanities. The motto of the organization is Research, Reformation and Development — dreaming of a developed world by doing research via reformation.

Besides research, BKSR also creates academic content, publishes a little magazine named Saptasudha, and other educative and entertainment contents. BK School of Research was first founded by Bezon Kumar in October 2015 and started its official journey in December 2016. BKSR generally works with young students, researchers, and university teachers.

BKSR works co-operatively among its researchers, fellows, and members. Anyone who has recently enrolled or passed a Bachelor's and Master's Degree in Business, Economics, Social Sciences, and Humanities can be a member of this academic platform. BKSR provides support to those who are dedicated to research or other academic works, including editing and proofreading, plagiarism checking, statistical software support, data input and analysis, report review, academic lessons, and related facilities.

BK School of Research dreams to make a green, peaceful, prosperous, non-discriminating, and non-depriving world by doing innovative research, building awareness among people, and educating people — aligned with the tagline “a heaven for inquisitive minds.”`,
    template: 'about',
    order: 1,
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/about-us.html',
    seo: {
      title: 'Who We Are | BK School of Research',
      description:
        'Learn about BK School of Research — mission, history, and institutional identity.',
      canonicalPath: '/about/who-we-are',
    },
  },
  {
    ...ts,
    id: 'page-what-we-do',
    slug: 'what-we-do',
    title: 'What We Do',
    excerpt:
      'Research, education, awareness, and knowledge resources for evidence-based policy.',
    body: `BK School of Research focuses on:

1. Research on social and economic issues across education, public policy, social development, health, climate and environment, and related themes.
2. Educating and training people through capacity building, webinars, and knowledge-hub resources on statistical software and methods.
3. Building awareness through public campaigns, research talks, and creative initiatives.

Mission: to do research on social issues, educate and train up people, and build awareness among people.

Vision: to contribute to making a green, peaceful, prosperous, non-discriminating, and non-depriving world.`,
    template: 'about',
    order: 2,
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/about-us.html',
    seo: {
      title: 'What We Do | BK School of Research',
      description: 'Research, education, and awareness work at BK School of Research.',
      canonicalPath: '/about/what-we-do',
    },
  },
  {
    ...ts,
    id: 'page-governance',
    slug: 'governance',
    title: 'Governance',
    excerpt:
      'BKSR is led by an Executive Director, with cooperative work among researchers, fellows, and members.',
    body: `BK School of Research is led by an Executive Director who steers institutional direction, research programmes, and public engagement.

**Current leadership**

Bezon Kumar serves as Executive Director of BK School of Research. He is also a Lecturer in Economics at Rabindra University, Bangladesh. On the legacy BKSR site his role was listed as Director; the new site uses the Executive Director title.

**How BKSR works**

BKSR works co-operatively among its researchers, fellows, and members. Anyone who has recently enrolled or completed a Bachelor's or Master's degree in Business, Economics, Social Sciences, or Humanities can participate in this academic platform. BKSR supports members dedicated to research and related academic work — including editing and proofreading, plagiarism checking, statistical software support, data input and analysis, report review, and academic lessons.

**Team categories**

Category hubs for Distinguished Fellows, Research Team, and Administrative Team are reserved on this site. Legacy people pages for those groups were empty and are not filled with invented names. Profiles will appear as they are formally published.`,
    template: 'about',
    order: 3,
    status: 'published',
    seo: {
      title: 'Governance | BK School of Research',
      description: 'Governance and leadership of BK School of Research.',
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
