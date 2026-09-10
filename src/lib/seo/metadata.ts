import type { Metadata } from 'next';
import { siteSettings } from '@/content/seed/site-settings';
import type { SEOData } from '@/types/content';

const SITE_NAME = siteSettings.organizationName;
const DEFAULT_SEO = siteSettings.defaultSeo;

export interface BuildMetadataOptions {
  path?: string;
  siteName?: string;
  defaults?: SEOData;
  absoluteUrlBase?: string;
}

function joinTitle(pageTitle: string, siteName: string): string {
  if (!pageTitle) return siteName;
  if (pageTitle.includes(siteName)) return pageTitle;
  return `${pageTitle} | ${siteName}`;
}

/**
 * Build Next.js Metadata from content SEOData + site defaults.
 */
export function buildMetadata(
  seo?: Partial<SEOData> | null,
  options: BuildMetadataOptions = {},
): Metadata {
  const defaults = options.defaults ?? DEFAULT_SEO;
  const siteName = options.siteName ?? SITE_NAME;

  const title = joinTitle(seo?.title || defaults.title, siteName);
  const description = seo?.description || defaults.description;
  const keywords = seo?.keywords ?? defaults.keywords;
  const ogImage = seo?.ogImage || defaults.ogImage;
  const canonicalPath =
    seo?.canonicalPath || options.path || defaults.canonicalPath;
  const noIndex = seo?.noIndex ?? defaults.noIndex ?? false;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  if (canonicalPath) {
    metadata.alternates = {
      canonical: options.absoluteUrlBase
        ? new URL(canonicalPath, options.absoluteUrlBase).toString()
        : canonicalPath,
    };
  }

  return metadata;
}

export function buildPageMetadata(
  title: string,
  description: string,
  path?: string,
): Metadata {
  return buildMetadata({ title, description, canonicalPath: path });
}
