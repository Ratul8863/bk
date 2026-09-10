/**
 * Deep-clean Blogger HTML/text noise in seed content.
 * Preserves factual meaning; does not invent or rewrite claims.
 */
import fs from "fs";

const NOISE_CAPTION_PREFIXES = [
  /^Photo:\s*/i,
  /^Image:\s*/i,
  /^N\.B\.\s.*/i,
];

function cleanHtml(html) {
  if (!html || typeof html !== "string") return html;
  let s = html;

  // Remove scripts/styles
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Unwrap Blogger separators / image wrappers while keeping img/content
  s = s.replace(
    /<div[^>]*class=["'][^"']*separator[^"']*["'][^>]*>/gi,
    "<div>",
  );
  s = s.replace(/<\/?font[^>]*>/gi, "");
  s = s.replace(/\s(?:style|dir|face|color|size)=["'][^"']*["']/gi, "");
  s = s.replace(/\s(?:style|dir)=\{[^}]*\}/gi, "");

  // Drop empty tags
  s = s.replace(/<(p|div|span|b|i|em|strong)[^>]*>\s*<\/\1>/gi, "");
  s = s.replace(/<br\s*\/?>\s*(?:<br\s*\/?>\s*)+/gi, "<br />");

  // Collapse excessive whitespace between tags
  s = s.replace(/>\s{2,}</g, "> <");
  s = s.replace(/[ \t]{2,}/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");

  return s.trim();
}

function cleanPlainText(text) {
  if (!text || typeof text !== "string") return text;
  let s = text;

  // Strip residual tags if any
  s = s.replace(/<[^>]+>/g, " ");

  // Common Blogger caption leaks at start of body/excerpt
  s = s.replace(
    /^(?:Photo|Image):\s*(?:Internet[^.]*\.?\s*)+/i,
    "",
  );
  s = s.replace(
    /Photo:\s*[^\n.]{0,120}(?:Internet|ANI|Daily Asian Age|Nobel Prize|Transfin|Grammarly|Pound Sterling Forecast|Bezon Kumar and BK School of Research)[^\n.]{0,80}\.?\s*/gi,
    "",
  );

  // Liability boilerplate often appended by Blogger theme posts
  s = s.replace(
    /\s*N\.B\.\s*The author is completely responsible[\s\S]*$/i,
    "",
  );
  s = s.replace(
    /\s*The users and visitors are solely responsible[\s\S]*$/i,
    "",
  );
  s = s.replace(
    /\s*This website and its authority will not be responsible[\s\S]*$/i,
    "",
  );

  // Soften duplicated title echoes at start (Title + same title)
  // Do not remove unique content.

  s = s.replace(/\u00a0/g, " ");
  s = s.replace(/[ \t]{2,}/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/^\s+|\s+$/g, "");

  return s;
}

function cleanExcerpt(excerpt, body) {
  let e = cleanPlainText(excerpt);
  if (!e) return e;

  // If excerpt starts with author credit then Photo caption, trim caption clause
  e = e.replace(
    /^([A-Z][a-zA-Z. ]{2,60})\s+Photo:\s*[^.]*\.\s*/u,
    "$1. ",
  );

  // Prefer first ~280 chars of cleaned body if excerpt still looks caption-heavy
  if (/^Photo:/i.test(e) || e.length < 40) {
    const fromBody = cleanPlainText(body).slice(0, 300);
    if (fromBody.length > e.length) e = fromBody;
  }

  // Trim to a reasonable excerpt boundary
  if (e.length > 320) {
    const cut = e.slice(0, 320);
    const lastSpace = cut.lastIndexOf(" ");
    e = (lastSpace > 200 ? cut.slice(0, lastSpace) : cut).trim() + "…";
  }

  return e;
}

function transformSeedObjectFile(file, transformItem) {
  // For TS array files, we clean string fields via a safer JSON roundtrip
  // of imported legacy where available; for seed TS we rewrite field strings carefully.
  // Strategy: read as text and replace body/excerpt string literals after cleaning
  // using a structured approach with Function eval is unsafe; instead process known JSON imports
  // and regenerate TS for news/events/notices from cleaned JSON sidecar.
  void file;
  void transformItem;
}

function loadLegacyPosts() {
  return JSON.parse(
    fs.readFileSync("src/content/imported/legacy-posts.json", "utf8"),
  );
}

function stripToCleanRecord(post) {
  const fullHtml = post.fullContentHtml || "";
  const cleanedHtml = cleanHtml(fullHtml);
  const cleanedText = cleanPlainText(
    post.fullContentText || cleanedHtml.replace(/<[^>]+>/g, " "),
  );
  const excerpt = cleanExcerpt(post.summary || cleanedText.slice(0, 280), cleanedText);
  return {
    ...post,
    fullContentHtml: cleanedHtml,
    fullContentText: cleanedText,
    summary: excerpt,
  };
}

const posts = loadLegacyPosts().map(stripToCleanRecord);
fs.writeFileSync(
  "src/content/imported/legacy-posts.cleaned.json",
  JSON.stringify(posts, null, 2),
);

// Clean seed news/events/notices TS by operating on string contents with field rewrites
function cleanTsStringFields(filePath, fields) {
  let src = fs.readFileSync(filePath, "utf8");
  let changes = 0;

  for (const field of fields) {
    const re = new RegExp(
      `(${field}:\\s*)("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`,
      "g",
    );
    src = src.replace(re, (full, prefix, quoted) => {
      const quote = quoted[0];
      let raw;
      try {
        raw = JSON.parse(quote === "'" ? `"${quoted.slice(1, -1).replace(/"/g, '\\"')}"` : quoted);
      } catch {
        // fallback unescape
        raw = quoted.slice(1, -1)
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
      const cleaned =
        field === "excerpt"
          ? cleanExcerpt(raw, raw)
          : field === "body" || field === "description" || field === "summary"
            ? cleanPlainText(raw)
            : cleanPlainText(raw);
      if (cleaned === raw) return full;
      changes += 1;
      const encoded = JSON.stringify(cleaned);
      return prefix + encoded;
    });
  }

  fs.writeFileSync(filePath, src);
  return changes;
}

const report = {
  legacyPostsCleaned: posts.length,
  sampleBeforeAfter: posts.slice(0, 3).map((p) => ({
    title: p.title,
    summary: p.summary?.slice(0, 160),
  })),
  seedFieldChanges: {
    news: cleanTsStringFields("src/content/seed/news.ts", [
      "excerpt",
      "body",
    ]),
    events: cleanTsStringFields("src/content/seed/events.ts", [
      "summary",
      "description",
    ]),
    notices: cleanTsStringFields("src/content/seed/notices.ts", [
      "summary",
      "body",
    ]),
    resources: cleanTsStringFields("src/content/seed/resources.ts", [
      "summary",
      "body",
    ]),
    pages: cleanTsStringFields("src/content/seed/pages.ts", [
      "excerpt",
      "body",
    ]),
    activities: cleanTsStringFields("src/content/seed/activities.ts", [
      "summary",
      "description",
    ]),
  },
};

fs.writeFileSync(
  ".firecrawl/content-cleanup-report.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
