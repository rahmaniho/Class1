/* آزمونِ آیکونِ برنامه، حق‌نشر و بازدارنده‌های کپی */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

/* خواندنِ بخش‌های متنیِ PNG */
function pngText(buf) {
  const out = {};
  let off = 8;
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.slice(off + 4, off + 8).toString('ascii');
    if (type === 'tEXt') {
      const d = buf.slice(off + 8, off + 8 + len);
      const nul = d.indexOf(0);
      out[d.slice(0, nul).toString('latin1')] = d.slice(nul + 1).toString('utf8');
    }
    off += 12 + len;
    if (type === 'IEND') break;
  }
  return out;
}
const size = f => fs.statSync(path.join(ROOT, f)).size;

(async function () {
  console.log('آیکونِ بهینه‌شده:');
  const icons = [
    ['images/icons/class1.png', 1254],
    ['images/icons/icon-512.png', 512],
    ['images/icons/icon-192.png', 192],
    ['images/icons/apple-touch-icon.png', 180],
    ['images/icons/icon-maskable-512.png', 512],
    ['images/icons/favicon-32.png', 32],
    ['resources/icon.png', 1024]
  ];
  for (const [f, dim] of icons) {
    ok(fs.existsSync(path.join(ROOT, f)), f + ' وجود دارد');
  }
  ok(size('images/icons/class1.png') < 1024 * 1024,
    `فایلِ اصلی از ۲ مگابایت به ${(size('images/icons/class1.png') / 1024).toFixed(0)}KB رسیده`);
  ok(size('images/icons/icon-192.png') < 60 * 1024, 'icon-192 زیرِ ۶۰ کیلوبایت است');
  ok(size('images/icons/favicon-32.png') < 8 * 1024, 'favicon زیرِ ۸ کیلوبایت است');

  console.log('\nحق‌نشرِ درج‌شده در فایل‌های تصویر:');
  let withMeta = 0;
  for (const [f] of icons) {
    const meta = pngText(fs.readFileSync(path.join(ROOT, f)));
    const good = meta.Copyright && meta.License && /همه‌ی حقوق محفوظ/.test(meta.Copyright);
    if (good) withMeta++; else console.log('     بدون حق‌نشر: ' + f);
  }
  ok(withMeta === icons.length, `هر ${icons.length} فایلِ تصویر حق‌نشر دارد (${withMeta})`);
  const m512 = pngText(fs.readFileSync(path.join(ROOT, 'images/icons/icon-512.png')));
  ok(/دبستان شهید قاسمی/.test(m512.Copyright || ''), 'متنِ حق‌نشر نامِ دبستان را دارد');
  ok(/KarenSoft/.test(m512.Author || ''), 'نامِ سازنده درج شده');

  console.log('\nاستفاده از آیکون در برنامه:');
  const manifest = JSON.parse(fs.readFileSync(ROOT + '/manifest.json', 'utf8'));
  const srcs = manifest.icons.map(i => i.src);
  ok(srcs.includes('images/icons/icon-512.png') && srcs.includes('images/icons/icon-maskable-512.png'),
    'manifest آیکونِ تازه را استفاده می‌کند');
  ok(manifest.icons.some(i => i.purpose === 'maskable'), 'نسخه‌ی ماسک‌شدنی برای اندروید تعریف شده');
  const html = fs.readFileSync(ROOT + '/index.html', 'utf8');
  ok(/rel="icon"[^>]*favicon-32\.png/.test(html), 'favicon به index.html اضافه شده');
  ok(/rel="apple-touch-icon"/.test(html), 'آیکونِ آیفون در index.html هست');
  ok(/splash-app-icon/.test(html), 'آیکون در صفحه‌ی بارگذاری نمایش داده می‌شود');
  ok(/name="copyright"/.test(html), 'متای حق‌نشر در index.html هست');
  ok(fs.existsSync(ROOT + '/LICENSE'), 'فایلِ LICENSE در مخزن هست');

  const appJs = fs.readFileSync(ROOT + '/app.js', 'utf8');
  ok(/const COPYRIGHT = \{/.test(appJs), 'حق‌نشرِ دیداری در برنامه تعریف شده');
  ok(/protectAssets\(\)/.test(appJs), 'بازدارنده‌های کپی اجرا می‌شوند');
  ok(/contextmenu/.test(appJs) && /dragstart/.test(appJs), 'راست‌کلیک و کشیدنِ تصویر بسته شده');

  console.log('\nنمایشِ حق‌نشر در صفحات:');
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  ['data.js', 'app.js'].forEach(f => { const s = doc.createElement('script'); s.textContent = fs.readFileSync(ROOT + '/' + f, 'utf8'); doc.body.appendChild(s); });
  const sp = doc.getElementById('splash'); if (sp) sp.remove();

  ['#/', '#/lesson/m1', '#/install', '#/games'].forEach(h => {
    w.location.hash = h;
    w.dispatchEvent(new w.Event('hashchange'));
    const c = doc.querySelector('.copyright-line');
    ok(!!c && /همه‌ی حقوق محفوظ/.test(c.textContent), 'حق‌نشر زیرِ فوترِ ' + h + ' دیده می‌شود');
  });

  w.location.hash = '#/install';
  w.dispatchEvent(new w.Event('hashchange'));
  const hero = doc.querySelector('.install-hero img');
  ok(!!hero && /icon-512\.png/.test(hero.getAttribute('src') || ''), 'صفحه‌ی دانلود آیکونِ برنامه را نشان می‌دهد');
  ok(Array.from(doc.querySelectorAll('img')).every(i => i.getAttribute('draggable') === 'false'),
    'هیچ تصویری قابلِ کشیدن نیست');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
