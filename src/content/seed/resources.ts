import type { Resource } from '@/types/content';

const ts = {
  status: 'published' as const,
  createdAt: '2018-01-01T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
  publishedAt: '2018-01-01T00:00:00.000Z',
};

export const resources: Resource[] = [
  {
    ...ts,
    id: 'resource-stata-cross-sectional',
    slug: 'stata-cross-sectional',
    title: 'Stata for Cross-Sectional Analysis',
    summary:
      'Cross-sectional analysis videos covering OLS/linear/simple/multiple regression and binary logit regression.',
    description:
      'Cross-sectional analysis video series covering OLS / linear / simple / multiple regression and binary logit regression in Stata. Migrated from the legacy Knowledge Hub Stata page.',
    resourceType: 'video-series',
    topics: ['cross-sectional', 'regression', 'logit'],
    software: ['Stata'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/stata.html',
    seo: {
      title: 'Stata for Cross-Sectional Analysis | BKSR Knowledge Hub',
      description: 'Stata tutorials for cross-sectional analysis from BK School of Research.',
      canonicalPath: '/resources/stata-cross-sectional',
    },
  },
  {
    ...ts,
    id: 'resource-spss-cross-sectional',
    slug: 'spss-cross-sectional',
    title: 'SPSS for Cross-Sectional Analysis',
    summary: 'Cross-sectional analysis video resources using SPSS.',
    description:
      'Cross-sectional analysis video resources using SPSS. The legacy Knowledge Hub page listed video placeholders for classroom and self-study use.',
    resourceType: 'video-series',
    topics: ['cross-sectional'],
    software: ['SPSS'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/spss.html',
  },
  {
    ...ts,
    id: 'resource-excel-statistical',
    slug: 'excel-statistical-analysis',
    title: 'MS Excel for Statistical Analysis',
    summary:
      'Statistical analysis videos including Foster-Greer-Thorbecke (FGT) Index estimation.',
    description:
      'Statistical analysis videos including Foster-Greer-Thorbecke (FGT) Index estimation in MS Excel. Carried forward from the legacy Knowledge Hub Excel page.',
    resourceType: 'video-series',
    topics: ['statistical-analysis', 'poverty-measurement', 'FGT'],
    software: ['MS Excel'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/ms-excel.html',
  },
  {
    ...ts,
    id: 'resource-stata-statistical',
    slug: 'stata-statistical-analysis',
    title: 'Stata for Statistical Analysis',
    summary: 'Statistical estimation videos using Stata.',
    description: 'Statistical Estimation Videos (legacy page placeholder).',
    resourceType: 'video-series',
    topics: ['statistical-analysis'],
    software: ['Stata'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/stata_23.html',
  },
  {
    ...ts,
    id: 'resource-stata-time-series',
    slug: 'stata-time-series',
    title: 'Stata for Time Series Analysis',
    summary: 'Time-series estimation guidance using Stata.',
    description:
      'Here you can find the estimation process of Time Series Data using Stata (legacy page noted additional topics as forthcoming).',
    resourceType: 'tool-guide',
    topics: ['time-series'],
    software: ['Stata'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/stata_21.html',
  },
  {
    ...ts,
    id: 'resource-eviews-time-series',
    slug: 'eviews-time-series',
    title: 'EViews for Time Series Analysis',
    summary: 'Time-series estimation guidance using EViews.',
    description:
      'Here you can find the estimation process of Time Series Data using EViews (legacy page noted additional topics as forthcoming).',
    resourceType: 'tool-guide',
    topics: ['time-series'],
    software: ['EViews'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/eviews.html',
  },
  {
    ...ts,
    id: 'resource-spss-statistical',
    slug: 'spss-statistical-analysis',
    title: 'SPSS for Statistical Analysis',
    summary: 'Statistical analysis resources using SPSS.',
    description: 'Statistical Analysis (legacy page placeholder).',
    resourceType: 'video-series',
    topics: ['statistical-analysis'],
    software: ['SPSS'],
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/spss_23.html',
  },
  {
    ...ts,
    id: 'resource-saptasudha',
    slug: 'saptasudha',
    title: 'Saptasudha',
    summary:
      'Little magazine / literary archive initiative associated with BK School of Research.',
    description:
      'BK School of Research created academic content and published a little magazine named Saptasudha (mentioned on the About page). The legacy “About Saptasudha” and Editorial Board pages were empty of detailed archive content.',
    resourceType: 'archive',
    topics: ['literary', 'magazine', 'archive'],
    notes:
      'Detailed archive content was empty on the legacy site; retained as an archive initiative for future cataloguing.',
    originalLegacyUrl: 'https://bkschoolofresearch.blogspot.com/p/about-saptasudha.html',
    seo: {
      title: 'Saptasudha Archive | BKSR Knowledge Hub',
      description:
        'Saptasudha little magazine archive initiative of BK School of Research.',
      canonicalPath: '/resources/saptasudha',
    },
  },
];
