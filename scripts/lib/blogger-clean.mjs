/**
 * Safe Blogger content cleaners — preserve factual text; remove markup/captions only.
 */

export function cleanHtml(html) {
  if (!html || typeof html !== "string") return html;
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/\s(?:style|dir|face|color|size|align|border|height|width|data-original-height|data-original-width|imageanchor)=["'][^"']*["']/gi, "");
  s = s.replace(/<\/?font\b[^>]*>/gi, "");
  s = s.replace(/<\/?o:p\b[^>]*>/gi, "");
  s = s.replace(
    /<div\b[^>]*class=["'][^"']*separator[^"']*["'][^>]*>/gi,
    "<div>",
  );
  s = s.replace(/<(p|div|span|b|i|em|strong|a)(\s[^>]*)?>\s*<\/\1>/gi, "");
  s = s.replace(/(?:<br\s*\/?>\s*){3,}/gi, "<br /><br />");
  s = s.replace(/>\s{2,}</g, "> <");
  s = s.replace(/[ \t]{2,}/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

export function cleanPlainText(text) {
  if (!text || typeof text !== "string") return text;
  let s = text;
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/\u00a0/g, " ");

  // Short photo credit only: "Photo: Internet (...)" or "Photo: ANI photo" up to first period / closing paren group
  s = s.replace(
    /\bPhoto:\s*(?:Internet|ANI|Bezon Kumar(?: and BK School of Research)?)(?:\s*\([^)]{0,80}\))?\s*/gi,
    "",
  );
  s = s.replace(
    /\bPhoto:\s*(?:Daily Asian Age|Nobel Prize Website|Transfin YouTube Chanel|Grammarly|Pound Sterling Forecast)(?:\s+and\s+Internet)?\s*/gi,
    "",
  );

  // Liability boilerplate (template footer)
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
  s = s.replace(
    /\s*The authors and users are humbly requested not to write any conflicting issues\.?/gi,
    "",
  );

  s = s.replace(/[ \t]{2,}/g, " ");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

export function cleanExcerpt(summary, bodyText) {
  let e = cleanPlainText(summary || "");
  const body = cleanPlainText(bodyText || "");
  if ((!e || e.length < 60) && body) {
    e = body.slice(0, 300);
  }
  if (e.length > 300) {
    const cut = e.slice(0, 300);
    const last = cut.lastIndexOf(" ");
    e = `${(last > 180 ? cut.slice(0, last) : cut).trim()}…`;
  }
  return e;
}

const NOISE_LABELS = new Set([
  "Slide",
  "Others",
  "Nature and Beauty",
  "Notice",
  "Call for Writings",
  "Poems",
]);

const LABEL_MAP = { "Sates and Politics": "States and Politics" };

export function cleanCategoryLabels(labels = []) {
  return [
    ...new Set(
      labels
        .map((l) => LABEL_MAP[l] || l)
        .filter((l) => !NOISE_LABELS.has(l)),
    ),
  ];
}
