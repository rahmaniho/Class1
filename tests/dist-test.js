/* بررسیِ خودبسندگیِ بسته‌ی dist */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '..');
const DIST = ROOT + '/dist';

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

(async function () {
  ok(fs.existsSync(DIST), 'پوشه‌ی dist وجود دارد');
  const need = ['index.html', 'app.js', 'data.js', 'styles.css', 'manifest.json', 'sw.js'];
  need.forEach(f => ok(fs.existsSync(DIST + '/' + f), f + ' در بسته هست'));
  ['images', 'audio'].forEach(d => ok(fs.existsSync(DIST + '/' + d), d + '/ در بسته هست'));

  /* اجرای برنامه از درون dist */
  const html = fs.readFileSync(DIST + '/index.html', 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  ['data.js', 'app.js'].forEach(f => { const s = doc.createElement('script'); s.textContent = fs.readFileSync(DIST + '/' + f, 'utf8'); doc.body.appendChild(s); });
  const sp = doc.getElementById('splash'); if (sp) sp.remove();

  w.location.hash = '#/lesson/m1';
  w.dispatchEvent(new w.Event('hashchange'));
  ok(/مدرسه/.test(doc.body.textContent), 'برنامه از داخلِ dist بالا می‌آید');
  ok(doc.querySelectorAll('.step-item').length > 0, 'صفحه‌ی درس در بسته ساخته می‌شود');

  /* هر نشانیِ تصویر/صدا که در dist صدا زده می‌شود باید روی دیسک باشد */
  const refs = new Set();
  doc.querySelectorAll('img[src], source[src], audio[src]').forEach(el => refs.add(el.getAttribute('src')));
  const appSrc = fs.readFileSync(DIST + '/app.js', 'utf8') + fs.readFileSync(DIST + '/data.js', 'utf8');
  (appSrc.match(/images\/[A-Za-z0-9_\-\/.]+\.(?:png|jpg|jpeg)/g) || []).forEach(m => refs.add(m));
  (appSrc.match(/audio\/[A-Za-z0-9_\-\/.]+\.mp3/g) || []).forEach(m => refs.add(m));
  /* پوشه‌ی videos اختیاری است (انیمیشن حذف شده) */

  let missing = [];
  refs.forEach(r => { if (r && !/^https?:|^data:|^#/.test(r) && !fs.existsSync(DIST + '/' + r)) missing.push(r); });
  ok(missing.length === 0, 'هیچ فایلِ تصویر/صدا/ویدیویی در بسته جا نمانده (' + refs.size + ' ارجاع بررسی شد)' +
    (missing.length ? ' — کم است: ' + missing.slice(0, 5).join('، ') : ''));

  /* مسیرهایی که در زمانِ اجرا ساخته می‌شوند: تصویر و صدای هر درس */
  const CURR = (() => { const g = {}; eval(fs.readFileSync(DIST + '/data.js', 'utf8') + ';g.all=[].concat(CURRICULUM.math,CURRICULUM.farsi,CURRICULUM.science);'); return g; })();
  const missLesson = CURR.all.filter(l => !fs.existsSync(DIST + '/images/lessons/' + l.id + '.jpg'));
  const missAudio = CURR.all.filter(l => !fs.existsSync(DIST + '/audio/lessons/' + l.id + '.mp3'));
  ok(missLesson.length === 0, `تصویرِ هر ۳۹ درس در بسته هست${missLesson.length ? ' — کم است: ' + missLesson.map(l => l.id).join('،') : ''}`);
  ok(missAudio.length === 0, `صدای هر ۳۹ درس در بسته هست${missAudio.length ? ' — کم است: ' + missAudio.map(l => l.id).join('،') : ''}`);
  ok(fs.existsSync(DIST + '/images/icons/icon-512.png'), 'آیکون‌های برنامه در بسته هست');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
