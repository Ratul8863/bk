import fs from "fs";

const posts = JSON.parse(fs.readFileSync(".firecrawl/bksr-posts.json", "utf8"));
const pages = JSON.parse(fs.readFileSync(".firecrawl/bksr-pages.json", "utf8"));

const strip = (html) =>
  (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const extractImages = (html) => {
  const imgs = [];
  const re = /src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html || ""))) {
    if (m[1].includes("blogger") || m[1].includes("googleusercontent")) {
      imgs.push(m[1]);
    }
  }
  return [...new Set(imgs)];
};

const normalizedPosts = (posts.feed?.entry || []).map((e) => {
  const html = e.content?.$t || e.summary?.$t || "";
  return {
    title: e.title?.$t || "",
    slug: (e.link || [])
      .find((l) => l.rel === "alternate")
      ?.href?.split("/")
      .pop()
      ?.replace(".html", ""),
    originalUrl: (e.link || []).find((l) => l.rel === "alternate")?.href,
    publishedDate: e.published?.$t,
    updatedDate: e.updated?.$t,
    categories: (e.category || []).map((c) => c.term),
    author: e.author?.[0]?.name?.$t || "BK School of Research",
    fullContentHtml: html,
    fullContentText: strip(html),
    summary: strip(html).slice(0, 320),
    featuredImage: extractImages(html)[0] || null,
    galleryImages: extractImages(html),
    source: "legacy-blogspot",
  };
});

const normalizedPages = (pages.feed?.entry || []).map((e) => {
  const html = e.content?.$t || "";
  return {
    title: e.title?.$t || "",
    slug: (e.link || [])
      .find((l) => l.rel === "alternate")
      ?.href?.split("/")
      .pop()
      ?.replace(".html", ""),
    originalUrl: (e.link || []).find((l) => l.rel === "alternate")?.href,
    publishedDate: e.published?.$t,
    updatedDate: e.updated?.$t,
    fullContentHtml: html,
    fullContentText: strip(html),
    summary: strip(html).slice(0, 400),
    featuredImage: extractImages(html)[0] || null,
    galleryImages: extractImages(html),
    source: "legacy-blogspot",
  };
});

fs.mkdirSync("src/content/imported", { recursive: true });
fs.writeFileSync(
  "src/content/imported/legacy-posts.json",
  JSON.stringify(normalizedPosts, null, 2)
);
fs.writeFileSync(
  "src/content/imported/legacy-pages.json",
  JSON.stringify(normalizedPages, null, 2)
);

console.log("Posts:", normalizedPosts.length);
normalizedPosts.forEach((p, i) => {
  console.log(
    `${i + 1}. [${(p.publishedDate || "").slice(0, 10)}] ${p.title}`
  );
  console.log(`   cats: ${(p.categories || []).join(", ")}`);
  console.log(`   ${p.summary.slice(0, 140)}`);
});

console.log("\nPages:", normalizedPages.length);
normalizedPages.forEach((p, i) => {
  console.log(`${i + 1}. ${p.title} (${p.slug})`);
  console.log(`   ${p.summary.slice(0, 200)}`);
});
