#!/usr/bin/env node
/* =========================================================
   مدرسه‌ی من — ساختِ آیکون و صفحه‌ی آغازینِ اندروید
   ورودی: images/icons/class1.png  (آیکونِ اصلیِ مخزن)
   خروجی: android/app/src/main/res/mipmap-<چگالی>/ic_launcher...png
           android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
           android/app/src/main/res/drawable-<حالت>/splash.png

   چرا خودمان می‌سازیم؟
   ابزارِ capacitor-assets هنگامِ ساخت از یک تصویرِ واحد،
   کلِ تصویر را در قابِ ۱۰۸ واحدی می‌کشد؛ در نتیجه لبه‌های
   تصویر زیرِ ماسکِ گردِ اندروید بُریده می‌شد. اینجا محتوا
   در ناحیه‌ی امن می‌ماند و حاشیه شفاف است.

   کاربرد:
     node scripts/make-android-icons.mjs
     node scripts/make-android-icons.mjs --root /مسیر/مخزن --android /مسیر/android
   ========================================================= */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
/* sharp معمولاً با npm install در ریشه نصب می‌شود؛ اگر نبود از tests می‌خوانیم */
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = require(join(here, '..', 'tests', 'node_modules', 'sharp'));
}

/* ---------- آرگومان‌ها ---------- */
function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--'))
    ? process.argv[i + 1]
    : fallback;
}
const root = arg('root', join(here, '..'));
const androidDir = arg('android', join(root, 'android'));
const RES = join(androidDir, 'app', 'src', 'main', 'res');
const SRC = join(root, 'images', 'icons', 'class1.png');

/* ---------- تنظیمات ---------- */
const ICON_BG = '#F9FAFB';            /* رنگِ پس‌زمینه‌ی خودِ آیکون */
const SPLASH_BG = '#FFF8EA';          /* کرمِ صفحه‌ی آغازین */
const SPLASH_BG_NIGHT = '#2B2622';    /* نسخه‌ی شبانه (نورِ ناگهانی نمی‌زند) */
const FOREGROUND_SCALE = 0.82;        /* محتوا در همین اندازه کاملاً در ناحیه‌ی امن است */
const SPLASH_LOGO = 0.22;             /* نسبتِ آیکون به ضلعِ کوچک‌ترِ صفحه */

/* آیکون‌های معمولی (۴۸ واحد) و آیکون‌های انطباقی (۱۰۸ واحد) بر پایه‌ی چگالی */
const LEGACY = { ldpi: 36, mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
const ADAPTIVE = { ldpi: 81, mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };

/* صفحه‌ی آغازین: نامِ پوشه، عرض، ارتفاع */
const SPLASH_SIZES = { ldpi: 240, mdpi: 320, hdpi: 480, xhdpi: 720, xxhdpi: 960, xxxhdpi: 1280 };
const SPLASH_LAND = { ldpi: [320, 240], mdpi: [480, 320], hdpi: [800, 480], xhdpi: [1280, 720], xxhdpi: [1600, 960], xxxhdpi: [1920, 1280] };

const PNG_OPTS = { compressionLevel: 9, adaptiveFiltering: true, palette: true, colours: 220, dither: 1, effort: 10 };

/* ---------- ابزارها ---------- */
async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}
async function put(file, buf) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
  return buf.length;
}
const kb = (n) => (n / 1024).toFixed(0).padStart(5) + ' KB';

/* آیکونِ معمولی: تصویرِ کامل، بدون حاشیه */
async function makeLegacy(src, size) {
  return sharp(src).resize(size, size, { fit: 'cover' }).png(PNG_OPTS).toBuffer();
}

/* آیکونِ گرد (برای لانچرهایی که آیکونِ دایره می‌خواهند) */
async function makeRound(src, size) {
  const svg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/></svg>`
  );
  const resized = await sharp(src).resize(size, size, { fit: 'cover' }).toBuffer();
  return sharp(resized).composite([{ input: svg, blend: 'dest-in' }]).png(PNG_OPTS).toBuffer();
}

/* پیش‌زمینه‌ی انطباقی: تصویر در مرکز با حاشیه‌ی شفاف (چیزی بُریده نمی‌شود) */
async function makeForeground(src, size) {
  const inner = Math.round(size * FOREGROUND_SCALE);
  const resized = await sharp(src).resize(inner, inner, { fit: 'cover' }).toBuffer();
  const top = Math.round((size - inner) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, top, left: top }])
    .png(PNG_OPTS)
    .toBuffer();
}

/* پس‌زمینه‌ی انطباقی: رنگِ یک‌دستِ همرنگِ خودِ آیکون */
async function makeBackground(size) {
  return sharp({ create: { width: size, height: size, channels: 4, background: ICON_BG } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/* صفحه‌ی آغازین */
async function makeSplash(src, width, height, night) {
  const logo = Math.round(Math.min(width, height) * SPLASH_LOGO);
  const icon = await sharp(src).resize(logo, logo, { fit: 'cover' }).toBuffer();
  return sharp({ create: { width, height, channels: 3, background: night ? SPLASH_BG_NIGHT : SPLASH_BG } })
    .composite([{ input: icon, gravity: 'center' }])
    .png(PNG_OPTS)
    .toBuffer();
}

const ADAPTIVE_XML = (file) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;

/* ---------- اجرا ---------- */
async function main() {
  if (!(await exists(SRC))) throw new Error('آیکونِ اصلی پیدا نشد: ' + SRC);
  if (!(await exists(RES))) {
    console.log('پوشه‌ی منابعِ اندروید وجود ندارد (' + RES + ')؛ چیزی ساخته نشد.');
    console.log('ابتدا پروژه‌ی اندروید را بسازید:  npx cap add android');
    return;
  }

  const src = await readFile(SRC);
  console.log('آیکونِ مبدأ: images/icons/class1.png');

  /* ۱) آیکون‌های معمولی و گرد */
  console.log('\nآیکونِ برنامه (معـمولی و گرد):');
  for (const [density, size] of Object.entries(LEGACY)) {
    const dir = join(RES, 'mipmap-' + density);
    const a = await put(join(dir, 'ic_launcher.png'), await makeLegacy(src, size));
    const b = await put(join(dir, 'ic_launcher_round.png'), await makeRound(src, size));
    console.log(`  ✓ mipmap-${density.padEnd(7)} ${String(size).padStart(3)}×${String(size).padEnd(3)}  آیکون ${kb(a)}، گرد ${kb(b)}`);
  }

  /* ۲) آیکونِ انطباقی (اندروید ۸ به بالا) */
  console.log('\nآیکونِ انطباقی (پیش‌زمینه با حاشیه‌ی امن):');
  for (const [density, size] of Object.entries(ADAPTIVE)) {
    const dir = join(RES, 'mipmap-' + density);
    const f = await put(join(dir, 'ic_launcher_foreground.png'), await makeForeground(src, size));
    const g = await put(join(dir, 'ic_launcher_background.png'), await makeBackground(size));
    console.log(`  ✓ mipmap-${density.padEnd(7)} ${String(size).padStart(3)}×${String(size).padEnd(3)}  پیش‌زمینه ${kb(f)}، پس‌زمینه ${kb(g)}`);
  }
  const anydpi = join(RES, 'mipmap-anydpi-v26');
  await put(join(anydpi, 'ic_launcher.xml'), Buffer.from(ADAPTIVE_XML(), 'utf8'));
  await put(join(anydpi, 'ic_launcher_round.xml'), Buffer.from(ADAPTIVE_XML(), 'utf8'));
  console.log('  ✓ mipmap-anydpi-v26/ic_launcher.xml و ic_launcher_round.xml');

  /* ۳) صفحه‌ی آغازین */
  console.log('\nصفحه‌ی آغازین:');
  await put(join(RES, 'drawable', 'splash.png'), await makeSplash(src, 320, 480, false));
  await put(join(RES, 'drawable-night', 'splash.png'), await makeSplash(src, 320, 240, true));
  console.log('  ✓ drawable/splash.png و drawable-night/splash.png');
  for (const [density, [w, h]] of Object.entries(SPLASH_LAND)) {
    const portW = SPLASH_SIZES[density];
    const portH = Math.round(portW * 1.5);
    for (const night of [false, true]) {
      const suffix = night ? '-night' : '';
      await put(join(RES, `drawable-land${suffix}-${density}`, 'splash.png'), await makeSplash(src, w, h, night));
      await put(join(RES, `drawable-port${suffix}-${density}`, 'splash.png'), await makeSplash(src, portW, portH, night));
    }
  }
  console.log('  ✓ نسخه‌های افقی/عمودی برای ldpi تا xxxhdpi (روز و شب)');

  /* ۴) گزارشِ اطمینان */
  const biggest = ADAPTIVE.xxxhdpi;
  const fg = join(RES, 'mipmap-xxxhdpi', 'ic_launcher_foreground.png');
  const meta = await sharp(fg).metadata();
  const inner = Math.round(biggest * FOREGROUND_SCALE);
  console.log('\nبررسیِ نهایی:');
  console.log(`  • پیش‌زمینه: ${meta.width}×${meta.height}، محتوا ${inner}×${inner} در مرکز`);
  console.log(`  • حاشیه‌ی شفافِ هر طرف: ${Math.round((biggest - inner) / 2)} پیکسل (ناحیه‌ی امنِ اندروید)`);
  console.log(`  • رنگِ پس‌زمینه‌ی آیکون: ${ICON_BG}`);
  console.log('  • آیکون از images/icons/class1.png گرفته شد ✓');
}

main().catch((e) => {
  console.error('خطا در ساختِ آیکون‌های اندروید: ' + e.message);
  process.exit(1);
});
