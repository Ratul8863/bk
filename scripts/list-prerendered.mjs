import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const root = path.join(".next", "server", "app");
const files = walk(root);
const routes = files
  .map((f) => {
    let rel = path.relative(root, f).replace(/\\/g, "/");
    rel = rel.replace(/\.html$/, "");
    if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
    if (rel === "index" || rel === "") return "/";
    return "/" + rel;
  })
  .sort();

console.log("htmlCount", routes.length);
for (const r of routes) console.log(r);
