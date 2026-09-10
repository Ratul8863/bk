import fs from "fs";

const pages = JSON.parse(fs.readFileSync(".firecrawl/bksr-pages.json", "utf8"));
const posts = JSON.parse(fs.readFileSync(".firecrawl/bksr-posts.json", "utf8"));

const strip = (html) =>
  (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const bySlug = {};
for (const e of pages.feed?.entry || []) {
  const url = (e.link || []).find((l) => l.rel === "alternate")?.href || "";
  const slug = url.split("/").pop()?.replace(".html", "") || "";
  bySlug[slug] = {
    title: e.title?.$t || "",
    url,
    text: strip(e.content?.$t || ""),
    html: e.content?.$t || "",
  };
}

const keys = [
  "about-us",
  "people",
  "completed",
  "on-going",
  "fellow",
  "research-team",
  "research-assistants",
  "staff",
  "research",
  "about-saptasudha",
  "editorial-board",
  "galary",
];

let out = "";
for (const k of keys) {
  const p = bySlug[k];
  out += `\n\n========== ${k} ==========\n`;
  if (!p) {
    out += "MISSING\n";
    continue;
  }
  out += `TITLE: ${p.title}\nURL: ${p.url}\n\n${p.text.slice(0, 6000)}\n`;
}
fs.writeFileSync(".firecrawl/key-pages-text.txt", out);
console.log("Wrote key pages, chars:", out.length);

// Extract verified org facts from job vacancy post
const job = (posts.feed?.entry || []).find((e) =>
  (e.title?.$t || "").includes("Job Vacancy")
);
if (job) {
  fs.writeFileSync(
    ".firecrawl/org-facts.txt",
    strip(job.content?.$t || "").slice(0, 3000)
  );
}
