/* آزمونِ نصبِ نسخه‌ی وب از مرورگر (PWA) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(ROOT + '/index.html', 'utf8');
const dataJs = fs.readFileSync(ROOT + '/data.js', 'utf8');
const appJs = fs.readFileSync(ROOT + '/app.js', 'utf8');
const swJs = fs.readFileSync(ROOT + '/sw.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync(ROOT + '/manifest.json', 'utf8'));

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

function boot(opts = {}) {
  const dom = new JSDOM(html, {
    url: 'http://localhost:8000/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(w) {
      if (opts.capacitor) w.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android' };
    }
  });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  const run = c => { const s = doc.createElement('script'); s.textContent = c; doc.body.appendChild(s); };
  run(dataJs); run(appJs);
  const splash = doc.getElementById('splash'); if (splash) splash.remove();
  return { dom, w, doc };
}

function go(w, doc, hash) {
  w.location.hash = hash;
  w.dispatchEvent(new w.Event('hashchange'));
}

(async function () {
  console.log('مانیفست و پیش‌نیازهای نصب:');
  ok(manifest.display === 'standalone', 'حالتِ نمایش standalone است');
  ok(!!manifest.start_url && !!manifest.scope, 'start_url و scope تعریف شده‌اند');
  ok(manifest.id === './', 'شناسه‌ی پایدارِ برنامه (id) تعریف شده است');
  ok(Array.isArray(manifest.display_override) && manifest.display_override.includes('standalone'),
    'display_override برای مرورگرهای تازه‌تر هست');
  const sizes = (manifest.icons || []).map(i => i.sizes);
  ok(sizes.includes('192x192') && sizes.includes('512x512'), 'آیکون‌های ۱۹۲ و ۵۱۲ پیکسل هست');
  ok((manifest.icons || []).some(i => i.purpose === 'maskable'), 'آیکونِ maskable برای اندروید هست');
  ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'میان‌بُرهای برنامه تعریف شده‌اند');
  ok(/rel="manifest"/.test(html), 'مانیفست به صفحه وصل است');
  ok(/rel="apple-touch-icon"/.test(html) && /apple-mobile-web-app-capable/.test(html),
    'پیش‌نیازهای نصب در iOS در صفحه هست');
  ok(/serviceWorker\.register\('sw\.js', \{ scope: '\.\/', updateViaCache: 'none' \}\)/.test(appJs),
    'Service Worker با scope درست و بدون کشِ قدیمی ثبت می‌شود');
  ok(/beforeinstallprompt/.test(appJs) && /installBannerHTML/.test(appJs),
    'رویدادِ نصبِ مرورگر و دعوت‌نامه‌ی نصب مدیریت می‌شود');
  ok(/const CACHE = 'madrese-man-v5'/.test(swJs), 'نسخه‌ی کشِ Service Worker به‌روز شده است');

  console.log('\nصفحه‌ی خانه:');
  let { w, doc } = boot();
  go(w, doc, '#/');
  ok(!!doc.querySelector('.install-cta'), 'دعوت‌نامه‌ی نصب روی خانه نمایش داده می‌شود');
  ok(/نصب کن/.test(doc.querySelector('.install-cta').textContent), 'متنِ دعوت‌نامه درباره‌ی نصب است');
  const ctaBtn = doc.querySelector('.install-cta [data-act="install-now"]');
  ok(!!ctaBtn, 'دکمه‌ی نصب در دعوت‌نامه هست');

  console.log('\nراهنمای نصبِ دستی (مرورگر بدون دکمه‌ی خودکار):');
  ctaBtn.click();
  let modal = doc.getElementById('modal-root');
  ok(!!modal, 'با زدن دکمه، پنجره‌ی راهنما باز می‌شود');
  ok(/نصب از مرورگر/.test(modal.textContent), 'عنوانِ راهنمای نصب درست است');
  ok(/منوی مرورگر|نوار نشانی/.test(modal.textContent), 'مراحلِ نصب از منوی مرورگر نوشته شده‌اند');
  const closeBtn = modal.querySelector('[data-act="install-dismiss"]');
  ok(!!closeBtn, 'دکمه‌ی بستنِ راهنما هست');
  closeBtn.click();

  console.log('\nدکمه‌ی نصبِ خودکارِ مرورگر:');
  let prompted = false;
  const ev = new w.Event('beforeinstallprompt', { cancelable: true });
  ev.prompt = () => { prompted = true; };
  ev.userChoice = Promise.resolve({ outcome: 'accepted' });
  w.dispatchEvent(ev);
  const readyBtn = doc.querySelector('.install-cta [data-act="install-now"]');
  ok(/نصب برنامه/.test(readyBtn.textContent), 'دکمه پس از آماده‌شدنِ مرورگر به «نصب برنامه» تغییر می‌کند');
  readyBtn.click();
  await new Promise(r => setTimeout(r, 30));
  ok(prompted, 'پنجره‌ی نصبِ خودکارِ مرورگر فراخوانی می‌شود');
  modal = doc.getElementById('modal-root');
  ok(!!modal && /نصب شد/.test(modal.textContent), 'پس از تأیید، پیامِ «نصب شد» نمایش داده می‌شود');

  console.log('\nصفحه‌ی نصب:');
  go(w, doc, '#/install');
  const text = doc.getElementById('main').textContent.replace(/\s+/g, ' ');
  ok(doc.querySelectorAll('.dl-card').length === 5, 'پنج کارتِ نصب (وب، اندروید، آیفون، رایانه، بسته) هست');
  ok(/نصب نسخه‌ی وب \(از مرورگر\)/.test(text), 'کارتِ نصب از مرورگر در صفحه هست');
  ok(/آماده‌ی نصب|نصب از منوی مرورگر|نصب‌شده/.test(text), 'وضعیتِ نصبِ همین مرورگر نشان داده می‌شود');
  ok(doc.querySelectorAll('.dl-steps li').length >= 3, 'مرحله‌های نصب گام‌به‌گام نوشته شده‌اند');

  console.log('\nداخلِ نسخه‌ی نصبیِ اندروید:');
  const native = boot({ capacitor: true });
  go(native.w, native.doc, '#/');
  ok(!native.doc.querySelector('.install-cta'), 'در اپِ اندروید، دعوت‌نامه‌ی نصبِ مرورگر پنهان است');
  go(native.w, native.doc, '#/install');
  ok(/نصب‌شده روی این دستگاه/.test(native.doc.getElementById('main').textContent),
    'وضعیت «نصب‌شده» در صفحه‌ی نصب نشان داده می‌شود');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
