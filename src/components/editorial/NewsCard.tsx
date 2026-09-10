import Link from 'next/link';
import { ImageFrame } from '@/components/ui/ImageFrame';
import { MetaLine } from '@/components/ui/MetaLine';
import { formatDateShort } from '@/lib/utils';
import type { NewsArticle } from '@/types/content';
import { cn } from '@/lib/utils';

type NewsCardProps = {
  article: NewsArticle;
  className?: string;
  featured?: boolean;
};

export function NewsCard({ article, className, featured = false }: NewsCardProps) {
  const date = article.publishedAt ?? article.createdAt;

  return (
    <article className={cn('group', className)}>
      {article.featuredImageUrl ? (
        <Link href={`/news/${article.slug}`} className="mb-5 block">
          <ImageFrame
            src={article.featuredImageUrl}
            alt=""
            aspect={featured ? 'wide' : 'video'}
          />
        </Link>
      ) : null}
      <MetaLine
        items={[
          formatDateShort(date),
          ...(article.categoryLabels?.slice(0, 1) ?? []),
        ]}
      />
      <h3
        className={cn(
          'mt-2 font-display leading-snug text-ink',
          featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
        )}
      >
        <Link
          href={`/news/${article.slug}`}
          className="transition-colors group-hover:text-accent"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted md:text-base">
        {article.excerpt}
      </p>
    </article>
  );
}
