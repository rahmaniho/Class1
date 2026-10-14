#!/usr/bin/env node
/* =========================================================
   مدرسه‌ی من — بهینه‌سازی آیکونِ برنامه و درجِ حق‌نشر
   ورودی: images/icons/class1.png (تصویرِ اصلی)
   خروجی: اندازه‌های گوناگون برای مرورگر، آیفون، اندروید و PWA
   هر فایلِ خروجی حاویِ اطلاعاتِ حق‌نشر (بخشِ متنیِ PNG) است
   ========================================================= */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
/* sharp معمولاً با npm install در ریشه نصب می‌شود؛ اگر نبود از tests می‌خوانیم */
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = require(join(dirname(fileURLToPath(import.meta.url)), '..', 'tests', 'node_modules', 'sharp'));
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'images/icons/class1.png');

const COPYRIGHT = {
  Copyright: '© ۱۴۰۴ مدرسه‌ی من — دبستان شهید قاسمی. همه‌ی حقوق محفوظ است.',
  Author: 'مدرسه‌ی من (KarenSoft)',
  License: 'All rights reserved. No copying or redistribution without written permission.',
  Source: 'https://github.com/rahmaniho/Class1'
};

/* ---------- درجِ بخشِ متنی (tEXt) در فایل PNG ---------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function addTextChunks(pngBuffer, meta) {
  const chunks = [];
  for (const [k, v] of Object.entries(meta)) {
    const data = Buffer.concat([Buffer.from(k, 'latin1'), Buffer.from([0]), Buffer.from(v, 'utf8')]);
    chunks.push(chunk('tEXt', data));
  }
  /* درج پس از IHDR (امضای ۸ بایتی + طول + نوع + داده + CRC) */
  const ihdrLen = pngBuffer.readUInt32BE(8);
  const after = 8 + 4 + 4 + ihdrLen + 4;
  return Buffer.concat([pngBuffer.slice(0, after), ...chunks, pngBuffer.slice(after)]);
}
function readTextChunks(pngBuffer) {
  const out = {};
  let off = 8;
  while (off < pngBuffer.length) {
    const len = pngBuffer.readUInt32BE(off);
    const type = pngBuffer.slice(off + 4, off + 8).toString('ascii');
    if (type === 'tEXt') {
      const data = pngBuffer.slice(off + 8, off + 8 + len);
      const nul = data.indexOf(0);
      out[data.slice(0, nul).toString('latin1')] = data.slice(nul + 1).toString('utf8');
    }
    off += 12 + len;
    if (type === 'IEND') break;
  }
  return out;
}

/* ---------- تولید ---------- */
const OUT = [
  { file: 'images/icons/icon-512.png', size: 512, maskable: false },
  { file: 'images/icons/icon-192.png', size: 192, maskable: false },
  { file: 'images/icons/apple-touch-icon.png', size: 180, maskable: false },
  { file: 'images/icons/icon-maskable-512.png', size: 512, maskable: true },
  { file: 'images/icons/favicon-32.png', size: 32, maskable: false },
  { file: 'resources/icon.png', size: 1024, maskable: false }
];

const BG = { r: 249, g: 249, b: 250, alpha: 1 };   /* رنگِ پس‌زمینه‌ی خودِ آیکون */
const SPLASH_BG = '#FFF8EA';

async function make(out, img) {
  const { size, maskable } = out;
  let pipeline;
  if (maskable) {
    /* نسخه‌ی ماسک‌شدنی برای اندروید: تصویر در ۸۰٪ میانی با حاشیه‌ی امن */
    const inner = Math.round(size * 0.8);
    const resized = await sharp(img).resize(inner, inner, { fit: 'cover' }).toBuffer();
    pipeline = sharp({
      create: { width: size, height: size, channels: 4, background: BG }
    }).composite([{ input: resized, top: Math.round((size - inner) / 2), left: Math.round((size - inner) / 2) }]);
  } else {
    pipeline = sharp(img).resize(size, size, { fit: 'cover' });
  }
  const buf = await pipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, colours: 200, dither: 1, effort: 10 })
    .toBuffer();
  const withMeta = addTextChunks(buf, COPYRIGHT);
  await writeFile(join(root, out.file), withMeta);
  return withMeta.length;
}

async function main() {
  const srcBuf = await readFile(SRC);
  const before = (await stat(SRC)).size;
  console.log('ورودی: images/icons/class1.png — ' + (before / 1024 / 1024).toFixed(2) + ' مگابایت');

  /* خودِ فایلِ اصلی را هم فشرده می‌کنیم (بدون تغییرِ اندازهٔ منطقی) */
  const meta = await sharp(srcBuf).metadata();
  const srcOpt = await sharp(srcBuf)
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, colours: 220, dither: 1, effort: 10 })
    .toBuffer();
  await writeFile(SRC, addTextChunks(srcOpt, COPYRIGHT));
  const after = (await stat(SRC)).size;
  console.log(`فایلِ اصلیِ آیکون: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB ` +
    `(کاهش ${(100 - after / before * 100).toFixed(0)}٪) — ${meta.width}×${meta.height}\n`);

  for (const out of OUT) {
    const bytes = await make(out, srcBuf);
    console.log('  ✓ ' + out.file.padEnd(38) + (bytes / 1024).toFixed(0).padStart(5) + ' KB  (' + out.size + '×' + out.size + (out.maskable ? '، ماسک‌شدنی' : '') + ')');
  }

  /* صفحه‌ی آغازینِ اندروید */
  const iconForSplash = await sharp(srcBuf).resize(560, 560, { fit: 'cover' }).toBuffer();
  const splash = await sharp({ create: { width: 2732, height: 2732, channels: 3, background: SPLASH_BG } })
    .composite([{ input: iconForSplash, top: (2732 - 560) / 2, left: (2732 - 560) / 2 }])
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: true, colours: 200, dither: 1 })
    .toBuffer();
  await writeFile(join(root, 'resources/splash.png'), addTextChunks(splash, COPYRIGHT));
  console.log('  ✓ resources/splash.png' + ' '.repeat(18) + (splash.length / 1024).toFixed(0).padStart(5) + ' KB  (2732×2732)');

  /* بررسیِ حق‌نشرِ درج‌شده */
  const check = readTextChunks(await readFile(join(root, 'images/icons/icon-512.png')));
  console.log('\nحق‌نشرِ درج‌شده در icon-512.png:');
  Object.entries(check).forEach(([k, v]) => console.log('  ' + k + ': ' + v));
}

main().catch(e => { console.error('خطا:', e.message); process.exit(1); });
