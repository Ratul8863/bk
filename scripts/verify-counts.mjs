import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const appDir = ".next/server/app";
const files = walk(appDir);
const html = files.filter((f) => f.endsWith(".html"));
const meta = files.filter((f) => f.endsWith(".meta"));
const rsc = files.filter((f) => f.endsWith(".rsc"));

console.log(
  JSON.stringify(
    {
      html: html.length,
      meta: meta.length,
      rsc: rsc.length,
      sampleHtml: html.slice(0, 15).map((f) =>
        f.replace(/\\/g, "/").replace(/^.*\.next\/server\/app/, ""),
      ),
    },
    null,
    2,
  ),
);

// News excerpt samples
const news = fs.readFileSync("src/content/seed/news.ts", "utf8");
const excerpts = [...news.matchAll(/excerpt:\s*"((?:\\.|[^"\\])*)"/g)]
  .slice(0, 6)
  .map((m) => JSON.parse(`"${m[1]}"`).slice(0, 140));
console.log("excerpts:", excerpts);
