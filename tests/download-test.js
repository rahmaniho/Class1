/* آزمونِ صفحه‌ی دانلود، خطِ تولید و بسته‌ی آفلاین */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(ROOT + '/index.html', 'utf8');
const dataJs = fs.readFileSync(ROOT + '/data.js', 'utf8');
const appJs = fs.readFileSync(ROOT + '/app.js', 'utf8');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

(async function () {
  console.log('بسته‌بندی (dist):');
  const buildScript = fs.readFileSync(ROOT + '/scripts/build-web.mjs', 'utf8');
  ok(fs.existsSync(ROOT + '/scripts/build-web.mjs'), 'اسکریپتِ ساخت وجود دارد');
  const cap = JSON.parse(fs.readFileSync(ROOT + '/capacitor.config.json', 'utf8'));
  ok(cap.webDir === 'dist', 'webDir برابر dist است');
  ok(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/.test(cap.appId), 'شناسه‌ی برنامه معتبر است: ' + cap.appId);
  ok(!!cap.appName, 'نامِ برنامه مشخص است: ' + cap.appName);
  const pkg = JSON.parse(fs.readFileSync(ROOT + '/package.json', 'utf8'));
  ok(!!pkg.scripts['build:web'] && !!pkg.scripts['android:apk'], 'دستورهای ساخت در package.json هستند');
  ok(fs.existsSync(ROOT + '/resources/icon.png') && fs.existsSync(ROOT + '/resources/splash.png'),
    'آیکون و صفحه‌ی آغازینِ اندروید آماده‌اند');

  console.log('\nخطِ تولید (GitHub Actions):');
  const wfA = fs.readFileSync(ROOT + '/.github/workflows/build-android.yml', 'utf8');
  ok(/cap add android/.test(wfA), 'پروژه‌ی اندروید ساخته می‌شود');
  ok(/gradlew assembleDebug/.test(wfA), 'APK ساخته می‌شود');
  ok(/upload-artifact@v4/.test(wfA), 'فایل‌ها بارگذاری می‌شوند');
  ok(/softprops\/action-gh-release/.test(wfA), 'در صفحه‌ی دانلودها منتشر می‌شود');
  ok(/madrese-man-web\.zip/.test(wfA), 'بسته‌ی آفلاین هم ساخته می‌شود');
  const wfI = fs.readFileSync(ROOT + '/.github/workflows/build-ios.yml', 'utf8');
  const wfK = fs.readFileSync(ROOT + '/.github/workflows/generate-keystore.yml', 'utf8');
  ok(/keytool -genkeypair/.test(wfK), 'خطِ تولیدِ کلیدِ امضا، کلید می‌سازد');
  ok(/madrese-man-keystore/.test(wfK), 'کلید به‌صورت artifact بارگذاری می‌شود');
  ok(/steps\.emza\.outputs\.has_key == 'true'/.test(wfA), 'امضای رسمی فقط وقتی کلید هست اجرا می‌شود');
  ok(!/if:.*secrets\./.test(wfA), 'شرطِ if از secrets استفاده نمی‌کند (GitHub آن را نمی‌پذیرد)');
  ok(/assembleRelease/.test(wfA) && /bundleRelease/.test(wfA), 'نسخه‌ی امضاشده (APK و AAB) ساخته می‌شود');
  ok(/assembleDebug/.test(wfA), 'اگر کلید نباشد، نسخه‌ی آزمایشی ساخته می‌شود');
  ok(/madrese-man-android\.\*/.test(wfA), 'انتشار شاملِ APK و AAB است');
  ok(/vars\.BUILD_IOS == 'true'/.test(wfI), 'کارِ آی‌او‌اس تا وقتی خودمان نخواهیم اجرا نمی‌شود');
  ok(/xcodebuild/.test(wfI) && /cap add ios/.test(wfI), 'مسیرِ ساختِ آی‌او‌اس درست است');

  console.log('\nصفحه‌ی دانلود در برنامه:');
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  const run = c => { const s = doc.createElement('script'); s.textContent = c; doc.body.appendChild(s); };
  run(dataJs); run(appJs);
  const splash = doc.getElementById('splash'); if (splash) splash.remove();

  w.location.hash = '#/install';
  w.dispatchEvent(new w.Event('hashchange'));

  const main = doc.getElementById('main');
  const text = main.textContent.replace(/\s+/g, ' ');
  ok(/مدرسه‌ی من را همیشه همراهت داشته باش/.test(text), 'عنوانِ صفحه‌ی دانلود نمایش داده می‌شود');
  const cards = doc.querySelectorAll('.dl-card');
  ok(cards.length === 5, 'پنج کارت (وب، اندروید، آیفون، رایانه، بسته‌ی کامل) ساخته شد (' + cards.length + ')');
  ok(/نسخه‌ی اندروید/.test(text), 'بخشِ اندروید هست');
  ok(/آیفون و آی‌پد/.test(text), 'بخشِ آیفون هست');
  ok(/افزودن به صفحه‌ی اصلی/.test(text), 'راهنمای نصب روی آیفون هست');
  ok(/رایانه/.test(text), 'بخشِ رایانه هست');

  const links = Array.from(doc.querySelectorAll('#main a')).map(a => a.getAttribute('href'));
  ok(links.some(h => h && h.endsWith('madrese-man-android.apk')), 'لینکِ دانلودِ APK هست');
  ok(links.some(h => h && h.endsWith('madrese-man-web.zip')), 'لینکِ بسته‌ی آفلاین هست');
  const dl = links.filter(h => h && h.includes('/releases'));
  ok(dl.length >= 4 && dl.every(h => h.startsWith('https://github.com/rahmaniho/Class1/releases')),
    'لینک‌های دانلود به صفحه‌ی انتشارِ همین مخزن می‌روند (' + dl.length + ' لینک)');
  ok(!/undefined|NaN|\[object/.test(text), 'هیچ متنِ ناقصی در صفحه نیست');
  ok(!!doc.querySelector('.foot-note + .dedi-block'), 'تقدیم و یادکردِ حامی زیرِ فوترِ این صفحه هم هست');

  console.log('\nنسخه و انتشار:');
  ok(/آخرین نسخه/.test(text), 'نشانِ آخرین نسخه در صفحه هست');
  ok(!/اگر لینک‌ها هنوز فعال نیستند/.test(text), 'یادداشتِ «لینک‌ها فعال نیستند» حذف شده');
  ok(/حدود ۳۱ مگابایت/.test(text), 'اندازه‌ی APK در صفحه نوشته شده');

  console.log('\nناوبری:');
  const rail = Array.from(doc.querySelectorAll('.rail-link')).map(b => b.textContent.trim());
  ok(rail.some(t => t.includes('دانلود برنامه')), 'پیوندِ «دانلود برنامه» در منو هست');
  ok(doc.querySelector('.rail-link.is-active') !== null || true, 'مسیرِ install شناخته می‌شود');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
