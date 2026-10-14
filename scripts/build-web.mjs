#!/usr/bin/env node
/* =========================================================
   مدرسه‌ی من — آماده‌سازی پوشه‌ی dist برای بسته‌بندی
   فقط فایل‌های مورد نیازِ خود برنامه را کپی می‌کند
   (بدون .git، tests، node_modules، resources و scripts)
   ========================================================= */
import { cp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const FILES = [
  'index.html',
  'app.js',
  'data.js',
  'styles.css',
  'manifest.json',
  'sw.js'
];

const DIRS = ['images', 'audio'];      /* همیشه لازم */
const OPTIONAL_DIRS = ['videos'];      /* اگر نباشد، نادیده گرفته می‌شود */

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const f of FILES) {
    const src = join(root, f);
    if (!(await exists(src))) throw new Error('فایل لازم پیدا نشد: ' + f);
    await cp(src, join(dist, f));
  }
  for (const d of DIRS) {
    const src = join(root, d);
    if (!(await exists(src))) throw new Error('پوشه‌ی لازم پیدا نشد: ' + d);
    await cp(src, join(dist, d), { recursive: true });
  }
  for (const d of OPTIONAL_DIRS) {
    const src = join(root, d);
    if (await exists(src)) await cp(src, join(dist, d), { recursive: true });
  }

  /* پرونده‌ی مشخصاتِ ساخت — برای نمایش در صفحه‌ی دانلود */
  const pkg = JSON.parse(await (await import('node:fs/promises')).readFile(join(root, 'package.json'), 'utf8'));
  const info = {
    app: 'مدرسه‌ی من',
    version: pkg.version || '1.0.0',
    builtAt: new Date().toISOString(),
    files: FILES.length,
    dirs: DIRS
  };
  await writeFile(join(dist, 'build-info.json'), JSON.stringify(info, null, 2), 'utf8');

  console.log('dist آماده شد → ' + dist);
  console.log('  فایل‌ها: ' + FILES.join('، '));
  console.log('  پوشه‌ها: ' + DIRS.join('، '));
  console.log('  نسخه: ' + info.version);
}

main().catch(e => { console.error('خطا:', e.message); process.exit(1); });
