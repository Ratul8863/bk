import fs from "fs";

const path = "src/content/seed/news.ts";
let s = fs.readFileSync(path, "utf8");

const noise = new Set([
  "Slide",
  "Others",
  "Nature and Beauty",
  "Notice",
  "Call for Writings",
  "Poems",
]);
const map = { "Sates and Politics": "States and Politics" };

s = s.replace(/categoryLabels:\s*\[([^\]]*)\]/g, (_m, inner) => {
  const labels = [...inner.matchAll(/"([^"]+)"/g)]
    .map((x) => x[1])
    .map((l) => map[l] || l)
    .filter((l) => !noise.has(l));
  const uniq = [...new Set(labels)];
  return `categoryLabels: [${uniq.map((l) => JSON.stringify(l)).join(", ")}]`;
});

fs.writeFileSync(path, s);
console.log("Cleaned news categoryLabels");
