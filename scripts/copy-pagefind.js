import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve(process.cwd(), 'dist', 'pagefind');
const destDir = path.resolve(process.cwd(), 'public', 'pagefind');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('✓ Copied Pagefind files to public/pagefind for dev server support');
}
