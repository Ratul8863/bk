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
    /export function generateMetadata/g,
    'export async function generateMetadata',
  );
  t = t.replace(
    /export function activityMetadata/g,
    'export async function activityMetadata',
  );
  if (t !== o) {
    fs.writeFileSync(file, t);
    console.log(file);
  }
}
