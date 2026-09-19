import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.next') continue;
      walk(p, out);
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p);
  }
  return out;
}

for (const file of walk('src')) {
  let t = fs.readFileSync(file, 'utf8');
  const o = t;

  t = t.replace(
    /export function generateStaticParams/g,
    'export async function generateStaticParams',
  );

  t = t.replace(
    /await (get\w+\([^)]*\))\s*\n(\s*)\.(filter|map|find|sort|slice)/g,
    '(await $1)\n$2.$3',
  );

  if (t !== o) {
    fs.writeFileSync(file, t);
    console.log(file);
  }
}
