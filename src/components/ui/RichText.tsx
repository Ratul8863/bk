import { cn } from '@/lib/utils';

type RichTextProps = {
  content: string;
  className?: string;
  asHtml?: boolean;
};

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'ul',
  'ol',
  'li',
  'a',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'hr',
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Break legacy single-block prose into readable paragraphs without rewriting facts. */
function softParagraphize(text: string): string {
  if (/\n{2,}/.test(text) || text.length < 420) return text;

  const sentences = text.match(/[^.!?।]+[.!?।]+(?:\s+|$)|[^.!?।]+$/g);
  if (!sentences || sentences.length < 3) return text;

  const paras: string[] = [];
  let buffer = '';

  for (const sentence of sentences) {
    const next = `${buffer}${sentence}`.replace(/\s+/g, ' ').trim();
    if (buffer && next.length > 260) {
      paras.push(buffer.trim());
      buffer = sentence.trim();
    } else {
      buffer = next;
    }
  }

  if (buffer.trim()) paras.push(buffer.trim());
  return paras.length > 1 ? paras.join('\n\n') : text;
}

function inlineFormat(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" rel="noopener noreferrer">$1</a>',
  );
  result = result.replace(
    /(^|[\s(])((https?:\/\/[^\s<]+[^.,;:\s<]))/g,
    '$1<a href="$2" rel="noopener noreferrer">$2</a>',
  );
  result = result.replace(
    /(^|[\s(])([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi,
    '$1<a href="mailto:$2">$2</a>',
  );
  return result;
}

function isListBlock(trimmed: string, marker: RegExp): boolean {
  const lines = trimmed.split('\n').filter((line) => line.trim());
  return (
    lines.length > 0 &&
    lines.every((line) => marker.test(line.trim()) || !line.trim())
  );
}

function blockToHtml(block: string): string {
  const trimmed = block.trim();
  if (!trimmed) return '';

  if (/^---+$/.test(trimmed)) return '<hr />';

  const lines = trimmed.split('\n');
  const firstHeading = lines[0]?.match(/^(#{2,4})\s+(.+)$/);
  if (firstHeading) {
    const level = firstHeading[1].length;
    const headingHtml = `<h${level}>${inlineFormat(firstHeading[2].trim())}</h${level}>`;
    const rest = lines.slice(1).join('\n').trim();
    return rest ? `${headingHtml}${blockToHtml(rest)}` : headingHtml;
  }

  if (trimmed.startsWith('> ')) {
    const quote = trimmed.replace(/^>\s?/gm, '');
    return `<blockquote><p>${inlineFormat(quote).replace(/\n/g, '<br />')}</p></blockquote>`;
  }

  if (isListBlock(trimmed, /^[-*·•]\s+/)) {
    const items = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(
        (line) => `<li>${inlineFormat(line.replace(/^[-*·•]\s+/, ''))}</li>`,
      )
      .join('');
    return `<ul>${items}</ul>`;
  }

  if (isListBlock(trimmed, /^\d+[.)]\s+/)) {
    const items = trimmed
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map(
        (line) => `<li>${inlineFormat(line.replace(/^\d+[.)]\s+/, ''))}</li>`,
      )
      .join('');
    return `<ol>${items}</ol>`;
  }

  return `<p>${inlineFormat(trimmed).replace(/\n/g, '<br />')}</p>`;
}

/** Convert light markdown-ish plain text into safe paragraphs. */
function markdownishToHtml(content: string): string {
  const normalized = softParagraphize(content.replace(/\r\n/g, '\n').trim());

  return normalized
    .split(/\n{2,}/)
    .map((block) => blockToHtml(block))
    .join('');
}

/** Strip disallowed tags / attributes from simple HTML strings. */
function sanitizeHtml(html: string): string {
  return html
    .replace(
      /<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g,
      (match, tag: string, attrs = '') => {
        const name = tag.toLowerCase();
        if (!ALLOWED_TAGS.has(name)) return '';
        if (match.startsWith('</')) return `</${name}>`;
        if (name === 'br') return '<br />';
        if (name === 'hr') return '<hr />';
        if (name === 'a') {
          const href = attrs.match(
            /href\s*=\s*["']((?:https?:\/\/|mailto:)[^"']+)["']/i,
          )?.[1];
          if (!href) return '<span>';
          return `<a href="${href}" rel="noopener noreferrer">`;
        }
        return `<${name}>`;
      },
    )
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

export function RichText({ content, className, asHtml = false }: RichTextProps) {
  if (!content?.trim()) return null;

  const looksLikeHtml = asHtml || /<\/?[a-z][\s\S]*>/i.test(content);
  const html = looksLikeHtml
    ? sanitizeHtml(content)
    : markdownishToHtml(content);

  return (
    <div
      className={cn(
        'rich-text max-w-prose text-[1.05rem] leading-[1.75] text-body md:text-[1.125rem] md:leading-[1.8]',
        '[&>*+*]:mt-5',
        '[&_a]:font-semibold [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-ink/80',
        '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[1.65rem] [&_h2]:leading-snug [&_h2]:tracking-[-0.02em] [&_h2]:text-ink md:[&_h2]:text-3xl',
        '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:text-ink md:[&_h3]:text-2xl',
        '[&_h4]:mt-6 [&_h4]:font-sans [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:uppercase [&_h4]:tracking-[0.14em] [&_h4]:text-accent',
        '[&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border',
        '[&_strong]:font-semibold [&_strong]:text-ink',
        '[&_ul]:my-1 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5',
        '[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-5',
        '[&_li]:pl-1 [&_li]:marker:text-accent',
        '[&_p]:text-pretty',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
