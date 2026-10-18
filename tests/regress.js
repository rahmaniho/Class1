/* آزمونِ جامعِ رگرسیون — همه‌ی فعالیت‌ها، متن‌ها، حامی، ویدیو و صدا */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = path.join(__dirname, '..');

const html = fs.readFileSync(ROOT + '/index.html', 'utf8');
const dataJs = fs.readFileSync(ROOT + '/data.js', 'utf8');
const appJs = fs.readFileSync(ROOT + '/app.js', 'utf8');
const css = fs.readFileSync(ROOT + '/styles.css', 'utf8');

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fail++; console.log('  ✗ ' + n); } };
const CURR = (() => { const g = {}; eval(dataJs + ';g.m=CURRICULUM.math;g.f=CURRICULUM.farsi;g.s=CURRICULUM.science;'); return g; })();

(async function () {
  const dom = new JSDOM(html, { url: 'http://localhost:8000/', runScripts: 'dangerously', pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  w.scrollTo = () => { };
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() { }, removeListener() { } }));
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  const run = c => { const s = doc.createElement('script'); s.textContent = c; doc.body.appendChild(s); };
  run(dataJs); run(appJs);
  const splash = doc.getElementById('splash'); if (splash) splash.remove();
  const nav = h => { w.location.hash = h; w.dispatchEvent(new w.Event('hashchange')); };

  console.log('فعالیت‌ها (کلیک روی پاسخِ درست در هر کدام):');
  let checked = 0, right = 0, textIssues = 0, longOpt = 0;
  for (const sub of ['m', 'f', 's']) {
    for (const lesson of CURR[sub]) {
      const acts = lesson.activities || [];
      for (let i = 0; i < acts.length; i++) {
        const a = acts[i];
        const expected = (a.type === 'count') ? String(a.count)
          : (a.type === 'tenframe') ? String(a.value)
            : (a.type === 'math') ? String(a.op === '+' ? a.a + a.b : a.a - a.b)
              : (a.type === 'letter') ? a.letter
                : (a.type === 'sound') ? a.first
                  : String(a.answer);
        nav('#/lesson/' + lesson.id);
        const steps = doc.querySelectorAll('.step-item');
        if (steps.length < i + 2) { ok(false, `${lesson.id}[${i}] گام ساخته نشد`); continue; }
        steps[i + 1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        const card = doc.querySelector('#activity-card');
        if (card) {
          [card.querySelector('.act-prompt'), ...card.querySelectorAll('.opt')].forEach(el => {
            const t = (el && el.textContent || '');
            if (/undefined|NaN|\[object/.test(t) || !t.trim()) { textIssues++; console.log('     متنِ مشکل‌دار در ' + lesson.id + '[' + i + ']: ' + t.slice(0, 40)); }
          });
          if (card.querySelector('.options-grid.is-long')) longOpt++;
        }
        const opts = Array.from(doc.querySelectorAll('#activity-card .opt'));
        const match = opts.find(o => o.dataset.value === expected);
        checked++;
        if (!match) { ok(false, `${lesson.id}[${i}] گزینه‌ی «${expected}» در صفحه نیست`); continue; }
        match.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
        const fb = doc.querySelector('#feedback-slot .feedback');
        const fbText = fb ? fb.textContent : '';
        if (/undefined|NaN|\[object/.test(fbText) || !fbText.trim()) { textIssues++; console.log('     بازخوردِ مشکل‌دار در ' + lesson.id + '[' + i + ']'); }
        if (fb && fb.classList.contains('is-right')) right++;
      }
    }
  }
  ok(right === checked, `همه‌ی پاسخ‌های درست پذیرفته شد (${right}/${checked})`);
  ok(textIssues === 0, `هیچ متنِ undefined/NaN/خالی در سؤال، گزینه یا بازخورد نیست (${textIssues} مورد)`);
  ok(longOpt > 0, `سؤال‌های گزینه‌بلند تک‌ستونه می‌شوند (${longOpt} فعالیت)`);

  console.log('\nچیدمان و یادکرد:');
  nav('#/lesson/m4');
  doc.querySelectorAll('.step-item')[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  ok(!!doc.querySelector('.compare-board'), 'تخته‌ی مقایسه با کلاسِ compare-board ساخته می‌شود');
  ok(/@media \(max-width: 1439px\)/.test(css) && /@media \(max-width: 1023px\)/.test(css), 'نقاطِ شکستِ لپ‌تاپ و تبلت برقرارند');
  ok((css.match(/\{/g) || []).length === (css.match(/\}/g) || []).length, 'آکولادهای CSS متوازن‌اند');
  nav('#/lesson/m1');
  const bt = (doc.querySelector('.foot-note + .dedi-block') || { textContent: '' }).textContent.replace(/\s+/g, ' ');
  ok(bt.includes('تقدیم دانش‌آموزان شهدای میناب') && bt.includes('لیلا آبکه'), 'تقدیم و حامی زیرِ فوترِ صفحه‌ی درس هست');
  nav('#/');
  ok(!!doc.querySelector('.sponsor-card'), 'کارتِ حامی روی صفحه‌ی خانه هست');

  console.log('\nآموزشِ گام‌به‌گام هر درس:');
  let richLessons = 0, teachSteps = 0, visualLessons = 0;
  const VISUAL = ['objects', 'letters', 'story', 'equation', 'numline', 'tenframe',
    'placevalue', 'pattern', 'shapes', 'compare', 'clock', 'living', 'plant', 'beanjar',
    'animals', 'seasons', 'weather', 'shadow', 'sound', 'materials', 'safety', 'senses'];
  for (const sub of ['m', 'f', 's']) {
    for (const l of CURR[sub]) {
      const steps = l.teach || [];
      teachSteps += steps.length;
      if (steps.length >= 4) richLessons++;
      if (steps.some(t => VISUAL.indexOf(t.kind) !== -1)) visualLessons++;
    }
  }
  ok(richLessons === 39, `همه‌ی ۳۹ درس دست‌کم چهار گامِ آموزش دارند (${richLessons})`);
  ok(teachSteps >= 150, `مجموع گام‌های آموزش ${teachSteps} است`);
  ok(visualLessons === 39, `هر درس دست‌کم یک گامِ تصویری دارد (${visualLessons})`);
  nav('#/lesson/m1');
  ok(doc.querySelectorAll('.teach-step-block').length === 4, 'گام‌های آموزش به شکل کارت‌های جدا نمایش داده می‌شوند');
  ok(!!doc.querySelector('.teach-step-block svg'), 'کارت‌های آموزش تصویر دارند');
  const allAudio = doc.querySelector('.lesson-audio');
  ok(!!allAudio && allAudio.dataset.audio === 'lessons/m1', 'دکمه‌ی شنیدنِ همه‌ی آموزش به فایلِ درس وصل است');
  const sayChars = doc.querySelector('.lesson-audio').dataset.text.length;
  ok(sayChars > 180, `متنِ گفتارِ درس کامل است (${sayChars} نویسه)`);

  console.log('\nویدیو و صدا:');
  const ids = ((appJs.match(/LESSON_AUDIO = \[([\s\S]*?)\]/) || [])[1] || '').match(/'[a-z]\d+'/g) || [];
  ok(ids.length === 39, `صدای هدف برای ۳۹ درس تعریف شده (${ids.length})`);
  let files = 0; try { files = fs.readdirSync(ROOT + '/audio/lessons').filter(f => f.endsWith('.mp3')).length; } catch (e) { }
  ok(files === 39, `۳۹ فایلِ صوتی در audio/lessons است (${files})`);
  let objFiles = []; try { objFiles = fs.readdirSync(ROOT + '/audio/objectives').filter(f => f.endsWith('.mp3')); } catch (e) { }
  ok(objFiles.length === 39, `۳۹ فایلِ صوتی برای هدفِ درس‌ها هست (${objFiles.length})`);
  ok(objFiles.every(f => fs.statSync(ROOT + '/audio/objectives/' + f).size > 1500), 'فایل‌های هدفِ درس خالی نیستند');
  let qFiles = []; try { qFiles = fs.readdirSync(ROOT + '/audio/questions').filter(f => f.endsWith('.mp3')); } catch (e) { }
  ok(qFiles.length >= 100, `صوتِ پرسش‌ها ساخته شده است (${qFiles.length} فایل)`);
  nav('#/lesson/m1');
  ok(!!doc.querySelector('.objective-banner .obj-audio[data-audio="objectives/m1"]'), 'دکمه‌ی صوتیِ هدف در صفحه‌ی درس به فایلِ اختصاصی وصل است');
  doc.querySelectorAll('.step-item')[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  ok(!!doc.querySelector('#activity-card .act-speak[data-audio^="questions/q-"]'), 'هر پرسش دکمه‌ی شنیدن دارد');
  nav('#/lessons/math');
  ok(!!doc.querySelector('.lesson-card[role="button"] .card-obj-audio[data-audio="objectives/m1"]'), 'کارتِ درس هم دکمه‌ی صوتیِ هدف دارد');
  ok(/aparat\.com\/api\/fa\/v1\/video\/video\/show\/videohash/.test(appJs), 'مسیرِ مستقیمِ ویدیو از API ی آپارات خوانده می‌شود');
  ok(/video-native/.test(appJs) && /vt\/frame/.test(appJs), 'هر دو مسیرِ پخشِ داخلی برقرار است');
  const opens = (appJs.match(/window\.open/g) || []).length;
  ok(opens <= 1 && /if \(v\.short\)[\s\S]{0,120}window\.open/.test(appJs), 'باز شدنِ بیرونی فقط برای ویدیوی کوتاه است');
  ok(html.includes('لیلا آبکه') && html.includes('تقدیم دانش‌آموزان شهدای میناب'), 'اسپلش حامی و تقدیم را دارد');

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
