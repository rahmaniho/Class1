/* آزمونِ آیکونِ نصبیِ اندروید:
   ثابت می‌کند آیکونِ برنامه دقیقاً از images/icons/class1.png ساخته می‌شود،
   در قابِ اندروید بُریده نمی‌شود و مسیرِ ساخت (CI) درست پیکربندی شده است. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'images', 'icons', 'class1.png');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

async function main() {
  console.log('منبعِ آیکون:');
  ok(fs.existsSync(SRC), 'images/icons/class1.png در مخزن هست');

  /* ---------- ۱) اجرای واقعیِ سازنده روی یک پروژه‌ی موقت ---------- */
  console.log('\nساختِ آیکون‌ها (مانندِ محیطِ CI):');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-icon-'));
  const android = path.join(tmp, 'android');
  fs.mkdirSync(path.join(android, 'app', 'src', 'main', 'res'), { recursive: true });

  let out = '';
  try {
    out = execFileSync(process.execPath,
      [path.join(ROOT, 'scripts', 'make-android-icons.mjs'), '--root', ROOT, '--android', android],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    console.log(e.stdout || '', e.stderr || '');
  }
  const RES = path.join(android, 'app', 'src', 'main', 'res');
  ok(/class1\.png/.test(out), 'سازنده از images/icons/class1.png به‌عنوانِ مبدأ استفاده کرد');

  /* ---------- ۲) آیکونِ نصبی همان تصویرِ مخزن است ---------- */
  console.log('\nآیکونِ نصبی همان آیکونِ مخزن است:');
  const launcher = path.join(RES, 'mipmap-xxxhdpi', 'ic_launcher.png');
  ok(fs.existsSync(launcher), 'mipmap-xxxhdpi/ic_launcher.png ساخته شد');
  const meta = await sharp(launcher).metadata();
  ok(meta.width === 192 && meta.height === 192, 'اندازه‌ی آیکونِ xxxhdpi برابرِ ۱۹۲×۱۹۲ است (' + meta.width + '×' + meta.height + ')');

  const ref = await sharp(SRC).resize(192, 192, { fit: 'cover' }).removeAlpha().raw().toBuffer();
  const got = await sharp(launcher).removeAlpha().raw().toBuffer();
  let diff = 0;
  for (let i = 0; i < ref.length; i++) diff += Math.abs(ref[i] - got[i]);
  const meanDiff = diff / ref.length;
  ok(meanDiff < 8, `تصویرِ نصبی با آیکونِ مخزن یکی است (اختلافِ میانگین ${meanDiff.toFixed(2)} — کمتر از ۸ یعنی همان تصویر)`);

  /* ---------- ۳) آیکونِ انطباقی: حاشیه‌ی امن و نبُریدگی ---------- */
  console.log('\nآیکون در قابِ اندروید بُریده نمی‌شود:');
  const fgPath = path.join(RES, 'mipmap-xxxhdpi', 'ic_launcher_foreground.png');
  ok(fs.existsSync(fgPath), 'پیش‌زمینه‌ی انطباقی ساخته شد');
  const fgMeta = await sharp(fgPath).metadata();
  ok(fgMeta.width === 432 && fgMeta.height === 432, 'اندازه‌ی پیش‌زمینه برابرِ ۴۳۲×۴۳۲ (۱۰۸dp) است');
  ok(fgMeta.hasAlpha, 'پیش‌زمینه کانالِ شفافی دارد (حاشیه‌ی امن)');

  const { data, info } = await sharp(fgPath).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const at = (x, y) => { const o = (y * info.width + x) * ch; return [data[o], data[o + 1], data[o + 2], data[o + 3]]; };
  let marginOk = true;
  for (let x = 0; x < info.width; x++) { if (at(x, 0)[3] > 8 || at(x, info.height - 1)[3] > 8) marginOk = false; }
  for (let y = 0; y < info.height; y++) { if (at(0, y)[3] > 8 || at(info.width - 1, y)[3] > 8) marginOk = false; }
  ok(marginOk, 'دور تا دورِ پیش‌زمینه شفاف است (حاشیه‌ی امن رعایت شده)');

  const bg = [249, 250, 251];
  const cx = (info.width - 1) / 2, cy = (info.height - 1) / 2;
  let lost = 0, solid = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const p = at(x, y);
      if (p[3] < 8) continue;
      if (Math.abs(p[0] - bg[0]) > 14 || Math.abs(p[1] - bg[1]) > 14 || Math.abs(p[2] - bg[2]) > 14) {
        solid++;
        if (Math.hypot(x - cx, y - cy) / info.width > 0.5) lost++;
      }
    }
  }
  const lostPct = 100 * lost / solid;
  ok(lostPct < 2, `کمتر از ۲٪ محتوا زیرِ ماسکِ دایره می‌رود (واقعی: ${lostPct.toFixed(2)}٪)`);

  const bgPath = path.join(RES, 'mipmap-xxxhdpi', 'ic_launcher_background.png');
  const bgMeta = await sharp(bgPath).metadata();
  ok(fs.existsSync(bgPath) && bgMeta.width === 432, 'پس‌زمینه‌ی انطباقی در اندازه‌ی ۴۳۲×۴۳۲ ساخته شد');

  /* ---------- ۴) فایل‌های معرّفیِ آیکون ---------- */
  console.log('\nفایل‌های معرّفی:');
  const xmlPath = path.join(RES, 'mipmap-anydpi-v26', 'ic_launcher.xml');
  const xml = fs.readFileSync(xmlPath, 'utf8');
  ok(/ic_launcher_foreground/.test(xml), 'ic_launcher.xml به پیش‌زمینه اشاره می‌کند');
  ok(/ic_launcher_background/.test(xml), 'ic_launcher.xml به پس‌زمینه اشاره می‌کند');
  ok(!/inset/.test(xml), 'دیگر لبه‌بُریِ ۱۶٫۷٪ اعمال نمی‌شود (خودمان حاشیه گذاشتیم)');
  ok(fs.existsSync(path.join(RES, 'mipmap-anydpi-v26', 'ic_launcher_round.xml')), 'نسخه‌ی گرد هم تعریف شده');

  for (const d of ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    ok(fs.existsSync(path.join(RES, 'mipmap-' + d, 'ic_launcher.png')), 'آیکونِ ' + d + ' ساخته شد');
  }

  /* آیکونِ گرد: گوشه‌ها باید شفاف باشند */
  const round = await sharp(path.join(RES, 'mipmap-xxxhdpi', 'ic_launcher_round.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rch = round.info.channels;
  const rAt = (x, y) => round.data[(y * round.info.width + x) * rch + 3];
  ok(rAt(0, 0) < 8 && rAt(round.info.width - 1, 0) < 8, 'آیکونِ گرد گوشه‌ی شفاف دارد');

  /* ---------- ۵) صفحه‌ی آغازین ---------- */
  console.log('\nصفحه‌ی آغازین:');
  const splash = path.join(RES, 'drawable', 'splash.png');
  ok(fs.existsSync(splash), 'drawable/splash.png ساخته شد');
  const spInfo = await sharp(splash).raw().toBuffer({ resolveWithObject: true });
  const spCh = spInfo.info.channels;
  const corner = [0, 1, 2].map(i => spInfo.data[(5 * spInfo.info.width + 5) * spCh + i]);
  ok(corner.join(',') === '255,248,234', 'رنگِ زمینه‌ی صفحه‌ی آغازین کرمِ برنامه است (' + corner.join(',') + ')');
  ok(fs.existsSync(path.join(RES, 'drawable-port-xxxhdpi', 'splash.png')), 'نسخه‌ی عمودیِ xxxhdpi ساخته شد');
  ok(fs.existsSync(path.join(RES, 'drawable-land-night-xxxhdpi', 'splash.png')), 'نسخه‌ی شبانه هم ساخته شد');

  /* ---------- ۶) پیکربندیِ CI ---------- */
  console.log('\nپیکربندیِ ساخت (GitHub Actions):');
  const androidWf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'build-android.yml'), 'utf8');
  const iosWf = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'build-ios.yml'), 'utf8');
  ok(!/--icon-path/.test(androidWf) && !/--icon-path/.test(iosWf),
    'گزینه‌ی اشتباهِ --icon-path حذف شد (همین گزینه باعث می‌شد آیکونِ پیش‌فرض بماند)');
  ok(/make-android-icons\.mjs/.test(androidWf), 'ساختِ اندروید از اسکریپتِ خودمان استفاده می‌کند');
  ok(!/continue-on-error:\s*true[\s\S]{0,200}capacitor-assets|continue-on-error:\s*true[\s\S]{0,200}make-android-icons/.test(androidWf),
    'دیگر خطای ساختِ آیکون نادیده گرفته نمی‌شود');
  ok(/--assetPath/.test(iosWf) && /--iconBackgroundColor/.test(iosWf), 'گزینه‌های iOS اصلاح شدند');
  ok(/test -s "\$RES\//.test(androidWf), 'ساخت در صورتِ نساخته‌شدنِ آیکون متوقف می‌شود');

  fs.rmSync(tmp, { recursive: true, force: true });

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
