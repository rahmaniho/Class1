/* آزمونِ چیدمانِ صفحه‌ی درس روی اندازه‌های واقعیِ دستگاه‌ها */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const css = fs.readFileSync(ROOT + '/styles.css', 'utf8');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };

const RAIL_W = 248, RAIL_HIDDEN_MAX = 820, CONTENT_MAX = 1280, GAP = 24;
const padding = vw => (vw <= 620 ? 16 : (vw <= 820 ? 20 : 48));
const columns = vw => (vw <= 1023 ? { mode: 1, fixed: [], gaps: 0 }
  : vw <= 1439 ? { mode: 2, fixed: [232], gaps: GAP }
    : { mode: 3, fixed: [260, 240], gaps: GAP * 2 });

const DEVICES = [['آیفون SE', 320], ['آیفون ۱۲/۱۳', 390], ['آیفون پرو مکس', 430],
['گلکسی (عمودی)', 360], ['تبلتِ کوچک', 600], ['آیپد (عمودی)', 768], ['آیپد (افقی)', 1024],
['آیپد پرو ۱۱', 1194], ['لپ‌تاپ ۱۲۸۰', 1280], ['لپ‌تاپ ۱۳۶۶', 1366], ['لپ‌تاپ ۱۴۴۰', 1440],
['مک‌بوک ۱۵۱۲', 1512], ['دسکتاپ ۱۹۲۰', 1920], ['نمایشگر بزرگ', 2560]];

console.log('عرضِ ستونِ میانیِ صفحه‌ی درس:\n');
const MIN_CENTER = 280;
DEVICES.forEach(([name, vw]) => {
  const rail = vw > RAIL_HIDDEN_MAX ? RAIL_W : 0;
  const content = Math.min(CONTENT_MAX, vw - rail) - padding(vw) * 2;
  const c = columns(vw);
  const center = content - c.fixed.reduce((a, b) => a + b, 0) - c.gaps;
  console.log(`  ${name.padEnd(20)} ${String(vw).padStart(4)}px → ${c.mode} ستون · میانی ${String(Math.round(center)).padStart(4)}px`);
  ok(center >= MIN_CENTER, `ستونِ میانی در «${name}» (${Math.round(center)}px) خوانا می‌ماند`);
});

console.log('\nقواعدِ CSS:');
ok(/@media \(max-width: 1439px\)[\s\S]{0,200}\.lesson-layout \{\s*grid-template-columns: 232px minmax\(0, 1fr\)/.test(css), 'در ≤۱۴۳۹px دوستونه می‌شود');
ok(/@media \(max-width: 1023px\)[\s\S]{0,300}\.lesson-layout \{\s*grid-template-columns: minmax\(0, 1fr\)/.test(css), 'در ≤۱۰۲۳px تک‌ستونه می‌شود');
ok(/\.lesson-side\.progress-panel \{\s*grid-column: 1 \/ -1;/.test(css), 'ستونِ پیشرفت در دوستونه، عرضِ کامل می‌گیرد');
ok(/\.step-list \{\s*flex-direction: row;\s*overflow-x: auto;/.test(css), 'فهرستِ گام‌ها در موبایل افقی است');
ok(css.includes('.compare-board'), 'compare-board تعریف شده');
ok(/repeat\(auto-fit, minmax\(min\(120px, 100%\), 1fr\)\)/.test(css), 'options-grid سرریز نمی‌کند');
ok(/repeat\(auto-fill, minmax\(min\(280px, 100%\), 1fr\)\)/.test(css), 'lesson-grid سرریز نمی‌کند');
ok(css.includes('.options-grid.is-long'), 'is-long تعریف شده');
ok(css.includes('.dl-card') && css.includes('.dl-steps'), 'استایلِ صفحه‌ی دانلود اضافه شده');
ok(!/style="display:grid;grid-template-columns:1fr 1fr/.test(fs.readFileSync(ROOT + '/app.js', 'utf8')), 'استایلِ خطیِ ثابت حذف شده');
ok((css.match(/\{/g) || []).length === (css.match(/\}/g) || []).length, 'آکولادهای CSS متوازن‌اند');

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
