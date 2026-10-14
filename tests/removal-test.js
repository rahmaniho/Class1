/* آزمونِ حذفِ کاملِ بخشِ «ماجرای حروف» (انیمیشن و شعر) */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

const appJs = fs.readFileSync(ROOT + '/app.js', 'utf8');
const css = fs.readFileSync(ROOT + '/styles.css', 'utf8');
const html = fs.readFileSync(ROOT + '/index.html', 'utf8');
const sw = fs.readFileSync(ROOT + '/sw.js', 'utf8');

(async function () {
  console.log('دیگر نباید اثری از انیمیشن باشد:');
  ok(!/ماجرای حروف/.test(appJs), 'عبارتِ «ماجرای حروف» در app.js نیست');
  ok(!/سینمای حروف/.test(appJs), 'عنوانِ «سینمای حروف» در app.js نیست');
  ok(!/majara-horof/.test(appJs), 'ارجاع به فایل‌های انیمیشن در app.js نیست');
  ok(!/majara-horof/.test(sw), 'ارجاع به فایل‌های انیمیشن در sw.js نیست');
  ok(!/شعر ماجرای/.test(appJs), 'بخشِ «شعر ماجرای حروف» حذف شده');
  ok(!/هر بخش از شعر را جداگانه بشنو/.test(appJs), 'جمله‌ی «هر بخش از شعر را جداگانه بشنو» حذف شده');
  ok(!/stories\/poem-/.test(appJs), 'ارجاع به صداهای شعر (poem-*) حذف شده');
  ok(!/cinema-banner/.test(appJs) && !/cinema-banner/.test(css), 'بنر و استایلِ سینما حذف شده');

  console.log('\nفایل‌ها:');
  ['videos/majara-horof.mp4', 'videos/majara-horof-poster.jpg',
    'audio/stories/poem-1.mp3', 'audio/stories/poem-2.mp3',
    'audio/stories/poem-3.mp3', 'audio/stories/poem-4.mp3'
  ].forEach(f => ok(!fs.existsSync(path.join(ROOT, f)), f + ' حذف شده'));
  ['audio/stories/abc-1.mp3', 'audio/stories/abc-4.mp3'].forEach(f =>
    ok(fs.existsSync(path.join(ROOT, f)), f + ' (تلفظِ الفبا) باقی مانده'));

  console.log('\nبخش‌هایی که باید مانده باشند:');
  ok(/APARAT_VIDEOS\.map\(videoCardHTML\)/.test(appJs), 'ویدیوهای آموزشیِ آپارات باقی‌اند');
  ok(/الفبای فارسی را شمرده بشنویم/.test(appJs), 'بخشِ تلفظِ الفبا باقی است');
  ok(/stories\/abc-/.test(appJs), 'صداهای تلفظِ الفبا وصل‌اند');

  console.log('\nصفحه‌ی ویدیوها در عمل:');
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  ['data.js', 'app.js'].forEach(f => { const s = doc.createElement('script'); s.textContent = fs.readFileSync(ROOT + '/' + f, 'utf8'); doc.body.appendChild(s); });
  const sp = doc.getElementById('splash'); if (sp) sp.remove();

  ['#/videos', '#/cinema'].forEach(h => {
    w.location.hash = h;
    w.dispatchEvent(new w.Event('hashchange'));
    const t = doc.getElementById('main').textContent.replace(/\s+/g, ' ');
    ok(/ویدیوهای آموزشی/.test(t), 'مسیر ' + h + ' صفحه‌ی ویدیوها را نشان می‌دهد');
    ok(doc.querySelectorAll('.video-card, .act-card').length > 0, 'کارت‌های ویدیو در ' + h + ' ساخته شده‌اند');
    ok(!/ماجرای حروف/.test(t), 'در ' + h + ' اثری از انیمیشن نیست');
  });

  w.location.hash = '#/';
  w.dispatchEvent(new w.Event('hashchange'));
  const home = doc.getElementById('main').textContent.replace(/\s+/g, ' ');
  ok(!/سینمای حروف/.test(home), 'بنرِ «سینمای حروف» از صفحه‌ی خانه حذف شده');
  ok(/ویدیوهای آموزشی/.test(home), 'بخشِ ویدیوهای آموزشی در خانه باقی است');
  ok(Array.from(doc.querySelectorAll('[data-hash]')).every(el => el.getAttribute('data-hash') !== '#/cinema'),
    'هیچ پیوندی به مسیرِ قدیمیِ سینما نمی‌رود');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
