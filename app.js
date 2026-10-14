/* =========================================================
   مدرسه‌ی من — منطق برنامه
   router · فعالیت‌ها · تصویرسازی SVG · پیشرفت
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     کمکی‌ها
     --------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function shuffle(arr, seed) {
    const a = arr.slice();
    let s = seed || 1;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------------------------------------------------------
     نشانک‌ها (SVG sprite)
     --------------------------------------------------------- */
  const STAR_POINTS = '12,0 13.91,7.38 20.49,3.51 16.62,10.09 24,12 16.62,13.91 20.49,20.49 13.91,16.62 12,24 10.09,16.62 3.51,20.49 7.38,13.91 0,12 7.38,10.09 3.51,3.51 10.09,7.38';

  function sprite() {
    return `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="i-star" viewBox="0 0 24 24">
    <polygon points="${STAR_POINTS}" fill="#FF6B5E" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-star-yellow" viewBox="0 0 24 24">
    <polygon points="${STAR_POINTS}" fill="#FFD45A" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-play" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#4D9BE6" stroke="#17213A" stroke-width="2"/>
    <path d="M10 8.5 L16 12 L10 15.5 Z" fill="#fff" stroke="#17213A" stroke-width="1.4" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-speaker" viewBox="0 0 24 24">
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="#4D9BE6" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M15.5 9c1.2 1.2 1.2 4.8 0 6" fill="none" stroke="#17213A" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 6.5c2.3 2.3 2.3 8.7 0 11" fill="none" stroke="#17213A" stroke-width="2" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-arrow-left" viewBox="0 0 24 24">
    <path d="M14.5 5 L7.5 12 L14.5 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24">
    <path d="M9.5 5 L16.5 12 L9.5 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 12H6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-check" viewBox="0 0 24 24">
    <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-wrench" viewBox="0 0 24 24">
    <path d="M14.5 4a4.5 4.5 0 0 0-4 6.4L4 17v3h3l6.6-6.5A4.5 4.5 0 1 0 14.5 4z" fill="#FFE6C7" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-home" viewBox="0 0 24 24">
    <path d="M4 11 L12 4 L20 11 V20 H4 Z" fill="#FFD45A" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M10 20 v-5 h4 v5" fill="#fff" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-book" viewBox="0 0 24 24">
    <path d="M4 5.5c2.5-1.2 5.5-1.2 8 .5 2.5-1.7 5.5-1.7 8-.5v13c-2.5-1.2-5.5-1.2-8 .5-2.5-1.7-5.5-1.7-8-.5z" fill="#DDF3FF" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M12 6v13" stroke="#17213A" stroke-width="2"/>
  </symbol>
  <symbol id="i-game" viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="11" rx="4" fill="#DDF4E4" stroke="#17213A" stroke-width="2"/>
    <path d="M7 11v3M5.5 12.5h3" stroke="#17213A" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="11.5" r="1.3" fill="#17213A"/>
    <circle cx="18.2" cy="13.7" r="1.3" fill="#17213A"/>
  </symbol>
  <symbol id="i-chart" viewBox="0 0 24 24">
    <rect x="4" y="12" width="4" height="8" fill="#4D9BE6" stroke="#17213A" stroke-width="2"/>
    <rect x="10" y="8" width="4" height="12" fill="#FFD45A" stroke="#17213A" stroke-width="2"/>
    <rect x="16" y="4" width="4" height="16" fill="#45B97C" stroke="#17213A" stroke-width="2"/>
  </symbol>
  <symbol id="i-menu" viewBox="0 0 24 24">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-close" viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-sun" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5" fill="#FFD45A" stroke="#17213A" stroke-width="2"/>
    <g stroke="#17213A" stroke-width="2" stroke-linecap="round">
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>
    </g>
  </symbol>
  <symbol id="i-heart" viewBox="0 0 24 24">
    <path d="M12 20 C6 15.5 3.5 12.2 3.5 9.2 A4.2 4.2 0 0 1 12 7.6 A4.2 4.2 0 0 1 20.5 9.2 C20.5 12.2 18 15.5 12 20z" fill="#FF6B5E" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-eye" viewBox="0 0 24 24">
    <path d="M2.5 12 C5.5 7 8.8 5 12 5 s6.5 2 9.5 7 c-3 5-6.3 7-9.5 7 s-6.5-2-9.5-7z" fill="#DDF3FF" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3" fill="#17213A"/>
  </symbol>
  <symbol id="i-question" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="#FFD45A" stroke="#17213A" stroke-width="2"/>
    <path d="M9.5 9.2a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1 1-1.1 1.8" fill="none" stroke="#17213A" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="16.4" r="1.2" fill="#17213A"/>
  </symbol>
  <symbol id="i-lightbulb" viewBox="0 0 24 24">
    <path d="M12 3.5a5.5 5.5 0 0 1 3 10.1V16H9v-2.4a5.5 5.5 0 0 1 3-10.1z" fill="#FFD45A" stroke="#17213A" stroke-width="2" stroke-linejoin="round"/>
    <path d="M9.5 18.5h5M10.5 21h3" stroke="#17213A" stroke-width="2" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-target" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="#fff" stroke="#17213A" stroke-width="2"/>
    <circle cx="12" cy="12" r="5" fill="#FF6B5E" stroke="#17213A" stroke-width="2"/>
    <circle cx="12" cy="12" r="1.6" fill="#17213A"/>
  </symbol>
</svg>`;
  }

  const icon = (id, cls) => `<svg class="${cls || ''}" aria-hidden="true"><use href="#i-${id}"></use></svg>`;

  /* ---------------------------------------------------------
     تصویرسازی — اشیای مسطح با خط ۲ پیکسلی
     --------------------------------------------------------- */
  const INK = '#17213A';

  function objApple() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="سیب"><path d="M32 18c-8-6-20-2-21 10-1 12 8 26 15 26 2 0 3-1 6-1s4 1 6 1c7 0 16-14 15-26-1-12-13-16-21-10z" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M32 18c0-6 2-9 6-11" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><path d="M33 10c4-4 9-4 11-2-2 4-7 6-11 2z" fill="#45B97C" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
  }
  function objStar() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="ستاره"><polygon points="32,6 37.6,22.5 55,22.8 41,33.2 46.2,50 32,39.8 17.8,50 23,33.2 9,22.8 26.4,22.5" fill="#FFD45A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  }
  function objFish() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="ماهی"><path d="M10 32c8-12 22-16 34-10 4 2 7 5 8 10-1 5-4 8-8 10-12 6-26 2-34-10z" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M52 32c-3 2-6 5-6 5l1 5 7-4z" fill="#4D9BE6" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="22" cy="28" r="2.4" fill="${INK}"/><path d="M30 38c3 3 8 3 11 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M34 22c2-3 6-4 9-3" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  }
  function objBall() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="توپ"><circle cx="32" cy="32" r="22" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5"/><path d="M32 10v44M10 32h44" stroke="${INK}" stroke-width="2.2"/><path d="M13 22c10 5 28 5 38 0M13 42c10-5 28-5 38 0" fill="none" stroke="${INK}" stroke-width="2.2"/></svg>`;
  }
  function objDuck() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="اردک"><ellipse cx="30" cy="40" rx="18" ry="12" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><circle cx="46" cy="26" r="10" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><path d="M54 26h8l-8 4z" fill="#FF6B5E" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="48" cy="23" r="1.8" fill="${INK}"/><path d="M18 36c4 4 12 4 16 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M22 52l-2 6M30 52l2 6" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  }
  function objLeaf() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="برگ"><path d="M50 12C28 12 12 24 12 42c0 4 1 7 2 10 18 2 36-10 38-28 0-4-1-8-2-12z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 50c8-12 18-22 30-30" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M26 40l-6-4M34 32l-6-3M40 26l-4-5" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  function objCoin() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="سکه"><circle cx="32" cy="32" r="20" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><circle cx="32" cy="32" r="13" fill="none" stroke="${INK}" stroke-width="2"/><text x="32" y="39" text-anchor="middle" font-family="Vazirmatn, Tahoma, sans-serif" font-size="18" font-weight="800" fill="${INK}">۱</text></svg>`;
  }
  function objPencil() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="مداد"><path d="M14 50l4-12 26-26 8 8-26 26z" fill="#FFD45A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M44 12l8 8" stroke="${INK}" stroke-width="2.5"/><path d="M14 50l3-9 6 6z" fill="#FFE6C7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 36l8 8" stroke="${INK}" stroke-width="2.2"/></svg>`;
  }
  function objDrop() {
    return `<svg viewBox="0 0 64 64" role="img" aria-label="قطره‌ی آب"><path d="M32 8c8 12 16 21 16 30a16 16 0 0 1-32 0c0-9 8-18 16-30z" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 38a8 8 0 0 0 8 8" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  }

  const OBJECTS = {
    apple: objApple, star: objStar, fish: objFish, ball: objBall,
    duck: objDuck, leaf: objLeaf, coin: objCoin, pencil: objPencil, drop: objDrop
  };

  function objSVG(name) {
    return (OBJECTS[name] || objApple)();
  }

  /* شکل‌های هندسی */
  function shapeSVG(name) {
    switch (name) {
      case 'circle':
        return `<svg viewBox="0 0 64 64" role="img" aria-label="دایره"><circle cx="32" cy="32" r="22" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5"/></svg>`;
      case 'square':
        return `<svg viewBox="0 0 64 64" role="img" aria-label="مربع"><rect x="12" y="12" width="40" height="40" rx="4" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/></svg>`;
      case 'triangle':
        return `<svg viewBox="0 0 64 64" role="img" aria-label="مثلث"><path d="M32 10 L54 50 H10 Z" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
      case 'rectangle':
        return `<svg viewBox="0 0 64 64" role="img" aria-label="مستطیل"><rect x="8" y="18" width="48" height="28" rx="4" fill="#45B97C" stroke="${INK}" stroke-width="2.5"/></svg>`;
      case 'star':
        return objStar();
      default:
        return `<svg viewBox="0 0 64 64"><text x="32" y="40" text-anchor="middle" font-size="30">?</text></svg>`;
    }
  }
  const SHAPE_NAMES = {
    circle: 'دایره', square: 'مربع', triangle: 'مثلث', rectangle: 'مستطیل', star: 'ستاره'
  };

  /* نمای بزرگ درس‌ها */
  function bigArtSVG(kind) {
    switch (kind) {
      case 'tenframe':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="ده‌چارچوب با هفت مهره">
          <rect x="20" y="20" width="200" height="90" rx="12" fill="#fff" stroke="${INK}" stroke-width="3"/>
          <g stroke="${INK}" stroke-width="2.5">
            <rect x="30" y="30" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="70" y="30" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="110" y="30" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="150" y="30" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="190" y="30" width="20" height="32" rx="6" fill="#DDF3FF"/>
            <rect x="30" y="68" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="70" y="68" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="110" y="68" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="150" y="68" width="34" height="32" rx="6" fill="#DDF3FF"/><rect x="190" y="68" width="20" height="32" rx="6" fill="#DDF3FF"/>
          </g>
          <g fill="#FF6B5E" stroke="${INK}" stroke-width="2">
            <circle cx="47" cy="46" r="11"/><circle cx="87" cy="46" r="11"/><circle cx="127" cy="46" r="11"/><circle cx="167" cy="46" r="11"/><circle cx="47" cy="84" r="11"/><circle cx="87" cy="84" r="11"/><circle cx="127" cy="84" r="11"/>
          </g>
          <text x="120" y="152" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="34" font-weight="800" fill="${INK}">۷</text>
        </svg>`;
      case 'lettercard':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="کارت حرف با مداد">
          <rect x="40" y="24" width="150" height="130" rx="16" fill="#fff" stroke="${INK}" stroke-width="3"/>
          <rect x="40" y="24" width="150" height="34" rx="16" fill="#FFD45A" stroke="${INK}" stroke-width="3"/>
          <text x="115" y="112" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="72" font-weight="800" fill="${INK}">ب</text>
          <g transform="translate(168,108) rotate(35)"><rect x="0" y="0" width="18" height="60" rx="4" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><path d="M0 60 L9 74 L18 60 Z" fill="#FFE6C7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>
        </svg>`;
      case 'beanjar':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="شیشه‌ی جوانه‌ی لوبیا">
          <rect x="72" y="46" width="96" height="112" rx="14" fill="#DDF3FF" stroke="${INK}" stroke-width="3"/>
          <rect x="82" y="110" width="76" height="40" rx="8" fill="#C9A16B" stroke="${INK}" stroke-width="2.5"/>
          <path d="M120 110 C120 90 116 78 108 68" fill="none" stroke="#45B97C" stroke-width="6" stroke-linecap="round"/>
          <path d="M108 68 C96 62 92 50 96 42 C106 44 112 56 108 68z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M112 76 C122 68 134 70 138 78 C128 86 118 84 112 76z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <ellipse cx="120" cy="122" rx="12" ry="9" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
          <rect x="68" y="36" width="104" height="14" rx="7" fill="#FFE6C7" stroke="${INK}" stroke-width="3"/>
        </svg>`;
      case 'plant':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="گیاه با ریشه، ساقه، برگ و گل">
          <path d="M120 120 V50" stroke="#45B97C" stroke-width="8" stroke-linecap="round"/>
          <path d="M120 88 C100 82 88 68 86 52 C104 54 118 70 120 88z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M120 78 C140 72 152 58 154 42 C136 44 122 60 120 78z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <circle cx="120" cy="40" r="14" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5"/>
          <g fill="#FFD45A" stroke="${INK}" stroke-width="2.2">
            <circle cx="120" cy="22" r="8"/><circle cx="138" cy="40" r="8"/><circle cx="120" cy="58" r="8"/><circle cx="102" cy="40" r="8"/>
          </g>
          <path d="M120 122 C112 138 104 148 92 156 M120 122 C126 138 136 148 150 154 M120 122 V158" fill="none" stroke="#C9A16B" stroke-width="5" stroke-linecap="round"/>
          <rect x="70" y="120" width="100" height="40" rx="10" fill="#FFE6C7" stroke="${INK}" stroke-width="2.5"/>
        </svg>`;
      case 'animals':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="پرنده، ماهی و خرگوش">
          <g transform="translate(12,40)"><ellipse cx="36" cy="46" rx="26" ry="18" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><circle cx="58" cy="30" r="12" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/><path d="M68 30h10l-10 5z" fill="#FF6B5E" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="61" cy="27" r="1.8" fill="${INK}"/><path d="M20 42c8-12 20-12 28 0-10 6-20 6-28 0z" fill="#FFE08A" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/></g>
          <g transform="translate(88,46)"><path d="M10 36c8-12 22-16 34-10 4 2 7 5 8 10-1 5-4 8-8 10-12 6-26 2-34-10z" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="22" cy="32" r="2.2" fill="${INK}"/></g>
          <g transform="translate(160,36)"><ellipse cx="36" cy="56" rx="22" ry="16" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="36" cy="34" r="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M28 22c-2-10 0-16 4-16 3 4 2 12 0 16zM44 22c2-10 0-16-4-16-3 4-2 12 0 16z" fill="#FFE6C7" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="31" cy="32" r="1.8" fill="${INK}"/><circle cx="41" cy="32" r="1.8" fill="${INK}"/></g>
        </svg>`;
      case 'seasons':
        return `<svg class="big-art" viewBox="0 0 260 180" role="img" aria-label="چهار فصل">
          <g>
            <rect x="10" y="30" width="54" height="110" rx="12" fill="#DDF4E4" stroke="${INK}" stroke-width="2.5"/>
            <circle cx="37" cy="62" r="12" fill="#FF6B5E" stroke="${INK}" stroke-width="2.2"/>
            <text x="37" y="108" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">بهار</text>
            <rect x="74" y="30" width="54" height="110" rx="12" fill="#FFE6C7" stroke="${INK}" stroke-width="2.5"/>
            <circle cx="101" cy="62" r="13" fill="#FFD45A" stroke="${INK}" stroke-width="2.2"/>
            <text x="101" y="108" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">تابستان</text>
            <rect x="138" y="30" width="54" height="110" rx="12" fill="#FFD9B0" stroke="${INK}" stroke-width="2.5"/>
            <path d="M165 50c-8 6-8 18 0 24 8-6 8-18 0-24z" fill="#FF6B5E" stroke="${INK}" stroke-width="2.2"/>
            <text x="165" y="108" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">پاییز</text>
            <rect x="202" y="30" width="54" height="110" rx="12" fill="#DDF3FF" stroke="${INK}" stroke-width="2.5"/>
            <path d="M229 48v22M218 59h22M221 51l16 16M237 51l-16 16" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>
            <circle cx="229" cy="59" r="4" fill="#fff" stroke="${INK}" stroke-width="1.6"/>
            <text x="229" y="108" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">زمستان</text>
          </g>
        </svg>`;
      case 'weather':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="ابر، باران و خورشید">
          <circle cx="66" cy="52" r="22" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
          <g stroke="${INK}" stroke-width="2.5" stroke-linecap="round"><path d="M66 22v-8M66 82v8M36 52h-8M96 52h8M44 30l-6-6M88 30l6-6"/></g>
          <path d="M96 76c-16 0-28 10-28 22 0 2 0 3 1 5h84c1-2 1-3 1-5 0-12-12-22-28-22-3 0-6 1-9 2-4-6-12-10-21-10-12 0-20 6-20 6z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <g stroke="#4D9BE6" stroke-width="3.4" stroke-linecap="round"><path d="M86 112l-6 16M110 112l-6 16M134 112l-6 16M158 112l-6 16"/></g>
        </svg>`;
      case 'shadow':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="درخت و سایه">
          <circle cx="196" cy="40" r="18" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
          <rect x="70" y="80" width="14" height="60" fill="#17213A"/>
          <circle cx="77" cy="66" r="30" fill="#45B97C" stroke="${INK}" stroke-width="2.5"/>
          <path d="M84 140 L170 140 L196 158 L96 158 Z" fill="#C9A16B" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
          <rect x="30" y="140" width="180" height="6" rx="3" fill="#FFE6C7"/>
        </svg>`;
      case 'clock':
        return clockSVG(3);
      case 'materials':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="شیشه، چوب، اسفنج و آب">
          <rect x="16" y="60" width="40" height="70" rx="8" fill="#DDF3FF" stroke="${INK}" stroke-width="2.5" opacity="0.9"/>
          <rect x="70" y="60" width="40" height="70" rx="8" fill="#C9A16B" stroke="${INK}" stroke-width="2.5"/>
          <rect x="124" y="60" width="40" height="70" rx="8" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
          <rect x="178" y="60" width="40" height="70" rx="8" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5"/>
          <text x="36" y="152" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">شیشه</text>
          <text x="90" y="152" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">چوب</text>
          <text x="144" y="152" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">اسفنج</text>
          <text x="198" y="152" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">آب</text>
        </svg>`;
      case 'living':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="گربه‌ی زنده و توپ بی‌جان">
          <g transform="translate(24,40)">
            <ellipse cx="46" cy="70" rx="30" ry="22" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
            <circle cx="46" cy="36" r="20" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
            <path d="M30 22l-4-12 12 6zM62 22l4-12-12 6z" fill="#FFD45A" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
            <circle cx="39" cy="34" r="2.2" fill="${INK}"/><circle cx="53" cy="34" r="2.2" fill="${INK}"/>
            <path d="M42 42c2 2 6 2 8 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
            <path d="M74 72c10 2 14-6 10-12" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          <g transform="translate(140,70)">${objBall().replace('<svg viewBox="0 0 64 64"', '<svg width="86" height="86" viewBox="0 0 64 64"')}</g>
          <text x="70" y="160" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">جاندار</text>
          <text x="186" y="160" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="15" font-weight="800" fill="${INK}">بی‌جان</text>
        </svg>`;
      case 'safety':
        return `<svg class="big-art" viewBox="0 0 240 180" role="img" aria-label="عبور ایمن از خیابان">
          <rect x="100" y="30" width="26" height="70" rx="8" fill="#17213A"/>
          <circle cx="113" cy="48" r="7" fill="#FF6B5E" stroke="#fff" stroke-width="2"/>
          <circle cx="113" cy="66" r="7" fill="#FFD45A" stroke="#fff" stroke-width="2"/>
          <circle cx="113" cy="84" r="7" fill="#45B97C" stroke="#fff" stroke-width="2"/>
          <rect x="20" y="120" width="200" height="30" fill="#687187"/>
          <g fill="#fff"><rect x="34" y="126" width="26" height="18" rx="3"/><rect x="76" y="126" width="26" height="18" rx="3"/><rect x="118" y="126" width="26" height="18" rx="3"/><rect x="160" y="126" width="26" height="18" rx="3"/></g>
          <g transform="translate(52,72)"><circle cx="10" cy="8" r="7" fill="#FFD45A" stroke="${INK}" stroke-width="2"/><path d="M10 16v14M10 22l-7 6M10 22l7 6M10 30l-5 12M10 30l5 12" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" fill="none"/></g>
        </svg>`;
      case 'senses':
        return `<svg class="big-art" viewBox="0 0 260 140" role="img" aria-label="حواس پنج‌گانه">
          <g transform="translate(12,30)"><use href="#i-eye" width="44" height="44"/><text x="22" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">بینایی</text></g>
          <g transform="translate(62,30)"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M8 6a5 5 0 0 1 8 4c0 3-2 4-3 6s-1 4-3 4a3 3 0 0 1-3-3" fill="#FFE6C7" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/></svg><text x="22" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">شنوایی</text></g>
          <g transform="translate(112,30)"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M12 4c3 0 5 3 5 7 0 5-2 8-5 8s-5-3-5-8c0-4 2-7 5-7z" fill="#FF6B5E" stroke="${INK}" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="${INK}"/></svg><text x="22" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">بویایی</text></g>
          <g transform="translate(162,30)"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M7 18c2-4 2-8 1-12M11 18c1-4 1-9 0-13M15 18c0-4 1-8 2-11" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M6 18h11c2 0 3 2 3 4H5c0-2 1-4 1-4z" fill="#FFD45A" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></svg><text x="22" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">لامسه</text></g>
          <g transform="translate(212,30)"><svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 10c0-3 3-5 7-5s7 2 7 5c0 6-3 10-7 10S5 16 5 10z" fill="#FF6B5E" stroke="${INK}" stroke-width="2"/><path d="M9 11c1 2 5 2 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg><text x="22" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">چشایی</text></g>
        </svg>`;
      case 'shapes':
        return `<svg class="big-art" viewBox="0 0 240 150" role="img" aria-label="شکل‌های هندسی">
          <g transform="translate(10,30)"><svg width="46" height="46" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5"/></svg><text x="23" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">دایره</text></g>
          <g transform="translate(68,30)"><svg width="46" height="46" viewBox="0 0 64 64"><rect x="12" y="12" width="40" height="40" rx="4" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/></svg><text x="23" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">مربع</text></g>
          <g transform="translate(126,30)"><svg width="46" height="46" viewBox="0 0 64 64"><path d="M32 10 L54 50 H10 Z" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></svg><text x="23" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">مثلث</text></g>
          <g transform="translate(184,30)"><svg width="46" height="46" viewBox="0 0 64 64"><rect x="8" y="18" width="48" height="28" rx="4" fill="#45B97C" stroke="${INK}" stroke-width="2.5"/></svg><text x="23" y="72" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="13" font-weight="700" fill="${INK}">مستطیل</text></g>
        </svg>`;
      case 'pattern':
        return `<svg class="big-art" viewBox="0 0 240 100" role="img" aria-label="الگوی شکل‌ها">
          <g transform="translate(12,22)"><svg width="52" height="52" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5"/></svg></g>
          <g transform="translate(74,22)"><svg width="52" height="52" viewBox="0 0 64 64"><rect x="12" y="12" width="40" height="40" rx="4" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/></svg></g>
          <g transform="translate(136,22)"><svg width="52" height="52" viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5"/></svg></g>
          <rect x="198" y="22" width="32" height="32" rx="8" fill="#FFD45A" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 4"/>
          <text x="214" y="46" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="20" font-weight="800" fill="${INK}">؟</text>
        </svg>`;
      case 'sound':
        return `<svg class="big-art" viewBox="0 0 240 150" role="img" aria-label="طبل، زنگ و گوش">
          <g transform="translate(18,36)">
            <ellipse cx="42" cy="30" rx="36" ry="14" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5"/>
            <path d="M6 30 V72 C6 82 22 88 42 88 C62 88 78 82 78 72 V30" fill="#FFD45A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M20 22 L34 60 M64 22 L50 60" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
          </g>
          <g transform="translate(112,40)">
            <path d="M18 66 C8 66 4 56 4 44 C4 28 14 14 30 10" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M30 10 C40 14 46 26 46 40 C46 54 40 62 32 66 Z" fill="#FFD45A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
            <rect x="12" y="66" width="26" height="8" rx="4" fill="#FF6B5E" stroke="${INK}" stroke-width="2.2"/>
          </g>
          <g transform="translate(182,44)">
            <path d="M12 10 a18 18 0 0 1 24 22 c0 10-6 12-8 18 s-2 12-8 12 a8 8 0 0 1-8-8" fill="#FFE6C7" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M16 26 a10 10 0 0 1 10 12" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
          </g>
        </svg>`;
      case 'compare':
        return `<svg class="big-art" viewBox="0 0 240 130" role="img" aria-label="مقایسه‌ی دو گروه سیب">
          <rect x="10" y="16" width="98" height="98" rx="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
          <rect x="132" y="16" width="98" height="98" rx="14" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
          <g transform="translate(18,26) scale(0.62)">${objApple()}${objApple().replace('<svg', '<svg x="64"')}${objApple().replace('<svg', '<svg x="32" y="64"')}${objApple().replace('<svg', '<svg x="0" y="64"')}</g>
          <g transform="translate(148,42) scale(0.62)">${objApple()}${objApple().replace('<svg', '<svg x="64"')}</g>
          <text x="200" y="36" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="17" font-weight="800" fill="#FF6B5E">کمتر</text>
          <text x="58" y="36" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="17" font-weight="800" fill="#45B97C">بیشتر</text>
        </svg>`;
      case 'numline':
        return numlineSVG(1, 10);
      default:
        return objApple().replace('viewBox="0 0 64 64"', 'class="big-art" viewBox="0 0 64 64"');
    }
  }

  function clockSVG(hour) {
    const angles = { 2: 60, 3: 90, 4: 120, 5: 150, 6: 180, 7: 210, 8: 240, 9: 270, 10: 300, 11: 330, 12: 0, 1: 30 };
    const a = ((angles[hour] || 0) - 90) * Math.PI / 180;
    const hx = 120 + 34 * Math.cos(a), hy = 120 + 34 * Math.sin(a);
    const ticks = [];
    for (let i = 0; i < 12; i++) {
      const t = (i * 30 - 90) * Math.PI / 180;
      const x1 = 120 + 78 * Math.cos(t), y1 = 120 + 78 * Math.sin(t);
      const x2 = 120 + 68 * Math.cos(t), y2 = 120 + 68 * Math.sin(t);
      ticks.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`);
    }
    return `<svg class="big-art" viewBox="0 0 240 240" role="img" aria-label="ساعت ${faDigits(hour)}">
      <circle cx="120" cy="120" r="92" fill="#fff" stroke="${INK}" stroke-width="4"/>
      ${ticks.join('')}
      <line x1="120" y1="120" x2="${hx.toFixed(1)}" y2="${hy.toFixed(1)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <line x1="120" y1="120" x2="120" y2="52" stroke="#FF6B5E" stroke-width="6" stroke-linecap="round"/>
      <circle cx="120" cy="120" r="7" fill="#FF6B5E" stroke="${INK}" stroke-width="2.5"/>
    </svg>`;
  }

  function numlineSVG(from, to, highlight) {
    const cells = [];
    for (let n = from; n <= to; n++) {
      const x = (n - from) * 46;
      cells.push(`<rect x="${x}" y="8" width="40" height="40" rx="8" fill="${n === highlight ? '#FFD45A' : '#fff'}" stroke="${INK}" stroke-width="2.2"/>
        <text x="${x + 20}" y="37" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="20" font-weight="800" fill="${INK}">${faDigits(n)}</text>`);
    }
    const w = (to - from + 1) * 46;
    return `<svg class="big-art" viewBox="0 0 ${w} 56" style="width:min(100%, ${w}px)" role="img" aria-label="ردیف اعداد ${faDigits(from)} تا ${faDigits(to)}">
      <rect x="0" y="4" width="${w}" height="48" rx="12" fill="#DDF3FF" stroke="${INK}" stroke-width="2.2"/>
      ${cells.join('')}
    </svg>`;
  }

  function tenframeSVG(value) {
    const cells = [];
    for (let i = 0; i < 10; i++) {
      const x = 14 + (i % 5) * 46, y = i < 5 ? 14 : 64;
      cells.push(`<rect x="${x}" y="${y}" width="40" height="40" rx="8" fill="#fff" stroke="${INK}" stroke-width="2.2"/>`);
      if (i < value) {
        cells.push(`<circle cx="${x + 20}" cy="${y + 20}" r="13" fill="#FF6B5E" stroke="${INK}" stroke-width="2.2"/>`);
      }
    }
    return `<svg class="big-art" viewBox="0 0 250 120" role="img" aria-label="ده‌چارچوب با ${faDigits(value)} مهره">
      <rect x="4" y="4" width="242" height="112" rx="14" fill="#DDF3FF" stroke="${INK}" stroke-width="2.4"/>
      ${cells.join('')}
    </svg>`;
  }

  function objectsBoard(object, count) {
    const items = [];
    for (let i = 0; i < count; i++) items.push(objSVG(object));
    return `<div class="objects-board" aria-label="${faDigits(count)} شیء">${items.join('')}</div>`;
  }

  function equationSVG(a, op, b) {
    return `<div class="equation" aria-label="${faDigits(a)} ${op === '+' ? 'به‌علاوه' : 'منهای'} ${faDigits(b)}">
      <span class="eq-box">${faDigits(a)}</span>
      <span class="eq-op">${op === '+' ? '＋' : '－'}</span>
      <span class="eq-box">${faDigits(b)}</span>
      <span class="eq-op">＝</span>
      <span class="eq-box" style="background:var(--yellow)">؟</span>
    </div>`;
  }

  function sceneSVG(name) {
    switch (name) {
      case 'plant':
        return bigArtSVG('plant');
      case 'seed':
        return bigArtSVG('beanjar');
      case 'weather':
        return bigArtSVG('weather');
      default:
        return bigArtSVG('plant');
    }
  }

  /* صحنه‌ی درختِ دانش — نماد اصلی */
  function heroTreeSVG() {
    return `
<svg viewBox="0 0 560 520" role="img" aria-label="درخت دانش با ستاره و سه خانه‌ی درختی شماره‌دار" class="hero-tree">
  <!-- زمین -->
  <path d="M30 470 C 120 430 220 420 300 430 C 380 420 470 435 530 470 L 530 505 L 30 505 Z" fill="#FFE6C7" stroke="${INK}" stroke-width="3"/>
  <!-- خورشید -->
  <g transform="translate(64,72)">
    <polygon points="${STAR_POINTS}" transform="scale(1.7)" fill="#FFD45A" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
  </g>
  <!-- ستاره‌ی تاج -->
  <g class="hero-star" transform="translate(238,18)">
    <polygon points="${STAR_POINTS}" transform="scale(3.2)" fill="#FF6B5E" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>
  </g>
  <!-- شاخه‌ها (کشیده‌شدن با انیمیشن) -->
  <g class="tree-draw" fill="none" stroke-linecap="round">
    <path d="M285 465 C 283 400 278 340 285 285" stroke="#17213A" stroke-width="30" style="--len:200"/>
    <path d="M285 330 C 230 312 195 272 178 222" stroke="#FF6B5E" stroke-width="15" style="--len:150"/>
    <path d="M285 312 C 340 296 388 258 412 205" stroke="#4D9BE6" stroke-width="15" style="--len:150"/>
    <path d="M285 372 C 238 362 198 348 162 315" stroke="#FFD45A" stroke-width="13" style="--len:140"/>
    <path d="M285 360 C 332 352 372 338 408 310" stroke="#45B97C" stroke-width="13" style="--len:140"/>
    <path d="M285 292 C 262 252 250 210 248 168" stroke="#45B97C" stroke-width="13" style="--len:140"/>
    <path d="M285 292 C 308 252 322 212 330 168" stroke="#FF6B5E" stroke-width="13" style="--len:140"/>
  </g>
  <!-- تاج درخت: برش‌های کاغذی -->
  <g stroke="${INK}" stroke-width="3">
    <circle cx="178" cy="205" r="44" fill="#DDF4E4"/>
    <circle cx="412" cy="188" r="48" fill="#FFE6C7"/>
    <circle cx="162" cy="300" r="34" fill="#DDF4E4"/>
    <circle cx="408" cy="295" r="36" fill="#FFD9B0"/>
    <circle cx="248" cy="150" r="34" fill="#DDF4E4"/>
    <circle cx="330" cy="150" r="34" fill="#FFE6C7"/>
    <circle cx="288" cy="228" r="56" fill="#DDF4E4"/>
    <circle cx="285" cy="300" r="30" fill="#DDF4E4"/>
  </g>
  <!-- خانه‌های درختی با شماره -->
  <g stroke="${INK}" stroke-width="3">
    <g transform="translate(140,120)">
      <rect x="0" y="18" width="76" height="52" rx="8" fill="#FF6B5E"/>
      <path d="M-6 20 L38 -8 L82 20 Z" fill="#FFD45A" stroke-linejoin="round"/>
      <circle cx="38" cy="96" r="20" fill="#fff"/>
      <text x="38" y="105" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="26" font-weight="800" fill="${INK}" stroke="none">۱</text>
    </g>
    <g transform="translate(248,58)">
      <rect x="0" y="18" width="76" height="52" rx="8" fill="#4D9BE6"/>
      <path d="M-6 20 L38 -8 L82 20 Z" fill="#FFE6C7" stroke-linejoin="round"/>
      <circle cx="38" cy="96" r="20" fill="#fff"/>
      <text x="38" y="105" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="26" font-weight="800" fill="${INK}" stroke="none">۲</text>
    </g>
    <g transform="translate(372,120)">
      <rect x="0" y="18" width="76" height="52" rx="8" fill="#FFD45A"/>
      <path d="M-6 20 L38 -8 L82 20 Z" fill="#FF6B5E" stroke-linejoin="round"/>
      <circle cx="38" cy="96" r="20" fill="#fff"/>
      <text x="38" y="105" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="26" font-weight="800" fill="${INK}" stroke="none">۳</text>
    </g>
  </g>
  <!-- سیب و برگ -->
  <g transform="translate(120,255) scale(0.9)">
    <circle cx="20" cy="22" r="16" fill="#FF6B5E" stroke="${INK}" stroke-width="3"/>
    <path d="M20 8 V2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g transform="translate(430,255)">
    <path d="M20 30 C12 18 14 6 24 2 C32 10 30 24 20 30z" fill="#45B97C" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  </g>
  <!-- قایق کاغذی کوچک روی زمین -->
  <g transform="translate(60,420)">
    <path d="M4 22 L54 22 L44 42 L14 42 Z" fill="#4D9BE6" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M29 2 L29 22 L10 22 Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M29 2 L29 22 L48 22 Z" fill="#FFE6C7" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  </g>
  <!-- ساعت جیبی -->
  <g transform="translate(440,410)">
    <circle cx="24" cy="26" r="18" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
    <path d="M24 26 L24 16 M24 26 L31 26" stroke="#FF6B5E" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="20" y="2" width="8" height="8" rx="2" fill="#FFD45A" stroke="${INK}" stroke-width="2"/>
  </g>
  <!-- برگ‌های ریز -->
  <g stroke="${INK}" stroke-width="2.4">
    <path d="M95 350 C88 340 90 330 98 326 C104 334 102 344 95 350z" fill="#45B97C"/>
    <path d="M465 350 C458 340 460 330 468 326 C474 334 472 344 465 350z" fill="#45B97C"/>
  </g>
</svg>`;
  }

  /* نقاشی موضوع‌ها برای کارت‌های جزیره */
  function islandArtSVG(subject) {
    if (subject === 'math') {
      return `<svg viewBox="0 0 240 160" role="img" aria-label="ده‌چارچوب و اعداد">
        <rect x="16" y="30" width="150" height="100" rx="12" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <g stroke="${INK}" stroke-width="2">
          <rect x="28" y="42" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="58" y="42" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="88" y="42" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="118" y="42" width="26" height="34" rx="6" fill="#DDF3FF"/>
          <rect x="28" y="82" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="58" y="82" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="88" y="82" width="26" height="34" rx="6" fill="#DDF3FF"/><rect x="118" y="82" width="26" height="34" rx="6" fill="#DDF3FF"/>
        </g>
        <g fill="#FF6B5E" stroke="${INK}" stroke-width="2"><circle cx="41" cy="59" r="9"/><circle cx="71" cy="59" r="9"/><circle cx="101" cy="59" r="9"/><circle cx="41" cy="99" r="9"/></g>
        <g transform="translate(176,26)"><circle cx="26" cy="26" r="22" fill="#FFD45A" stroke="${INK}" stroke-width="3"/><text x="26" y="35" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="24" font-weight="800" fill="${INK}">۱</text></g>
        <g transform="translate(176,90)"><circle cx="26" cy="26" r="22" fill="#4D9BE6" stroke="${INK}" stroke-width="3"/><text x="26" y="35" text-anchor="middle" font-family="Vazirmatn, Tahoma" font-size="24" font-weight="800" fill="#fff">۲</text></g>
      </svg>`;
    }
    if (subject === 'farsi') {
      return `<svg viewBox="0 0 240 160" role="img" aria-label="کاغذ حروف و مداد">
        <rect x="30" y="18" width="130" height="124" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <path d="M52 48h86M52 72h86M52 96h60" stroke="${INK}" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
        <text x="72" y="82" font-family="Vazirmatn, Tahoma" font-size="52" font-weight="800" fill="${INK}">ب</text>
        <text x="112" y="82" font-family="Vazirmatn, Tahoma" font-size="52" font-weight="800" fill="#FF6B5E">پ</text>
        <g transform="translate(168,30) rotate(28)"><rect x="0" y="0" width="20" height="94" rx="5" fill="#FFD45A" stroke="${INK}" stroke-width="3"/><path d="M0 94 L10 116 L20 94 Z" fill="#FFE6C7" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="0" y="0" width="20" height="16" rx="5" fill="#FF6B5E" stroke="${INK}" stroke-width="3"/></g>
      </svg>`;
    }
    return `<svg viewBox="0 0 240 160" role="img" aria-label="شیشه‌ی جوانه‌ی لوبیا">
      <rect x="82" y="34" width="86" height="102" rx="14" fill="#DDF3FF" stroke="${INK}" stroke-width="3"/>
      <rect x="92" y="92" width="66" height="36" rx="8" fill="#C9A16B" stroke="${INK}" stroke-width="2.5"/>
      <path d="M125 92 C125 72 120 60 112 50" fill="none" stroke="#45B97C" stroke-width="6" stroke-linecap="round"/>
      <path d="M112 50 C100 44 96 32 100 24 C110 26 116 38 112 50z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M116 58 C126 50 138 52 142 60 C132 68 122 66 116 58z" fill="#45B97C" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="125" cy="104" rx="11" ry="8" fill="#FFD45A" stroke="${INK}" stroke-width="2.5"/>
      <rect x="78" y="24" width="94" height="14" rx="7" fill="#FFE6C7" stroke="${INK}" stroke-width="3"/>
      <g transform="translate(28,70)">${objDrop().replace('<svg viewBox="0 0 64 64"', '<svg width="54" height="54" viewBox="0 0 64 64"')}</g>
      <g transform="translate(176,24)"><polygon points="${STAR_POINTS}" transform="scale(1.8)" fill="#FFD45A" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/></g>
    </svg>`;
  }

  /* ---------------------------------------------------------
     تصویرهای تصویری (PNG) با جایگزین SVG در صورت خطا
     --------------------------------------------------------- */
  const ART = {
    hero: {
      src: 'images/hero-world.jpg',
      alt: 'درخت دانش با خانه‌های درختی، خورشید خندان، قایق کاغذی و مکعب‌های رنگی'
    },
    math: {
      src: 'images/subject-math.jpg',
      alt: 'وسایل ریاضی: ده‌چارچوب با مهره‌های رنگی، مکعب‌های شمارش و کاسه‌ی سیب'
    },
    farsi: {
      src: 'images/subject-farsi.jpg',
      alt: 'میز فارسی: کتاب باز، مداد زرد، پرنده و قایق کاغذی'
    },
    science: {
      src: 'images/subject-science.jpg',
      alt: 'کشف علوم: جوانه‌ی لوبیا در شیشه، خورشید، ابر بارانی و کفشدوزک'
    },
    celebrate: {
      src: 'images/celebrate.jpg',
      alt: 'مدال کاغذی، بادکنک و ستاره‌های رنگی برای جشن یادگیری'
    }
  };

  function artImg(kind, opts) {
    const a = ART[kind];
    const o = opts || {};
    const fallback = o.fallback || '';
    return `<img src="${a.src}" alt="${escapeHtml(o.alt !== undefined ? o.alt : a.alt)}"
      ${o.cls ? `class="${o.cls}"` : ''}
      ${o.style ? `style="${o.style}"` : ''}
      loading="${o.eager ? 'eager' : 'lazy'}"
      onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='${o.fallbackDisplay || 'block'}'">
      ${fallback ? `<div style="display:none;${o.fallbackStyle || ''}">${fallback}</div>` : ''}`;
  }

  function subjectArt(subjectId, opts) {
    return artImg(subjectId, Object.assign({
      fallback: islandArtSVG(subjectId),
      fallbackStyle: 'width:100%'
    }, opts || {}));
  }

  /* ---------------------------------------------------------
     وضعیت و پیشرفت
     --------------------------------------------------------- */
  const STORE_KEY = 'madrese-man-progress-v1';

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { lessons: {}, games: {}, last: null };
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.progress)); } catch (e) { /* ignore */ }
  }
  function markLessonDone(lessonId, stars, total) {
    const cur = state.progress.lessons[lessonId] || { done: false, stars: 0, total: total };
    cur.done = true;
    cur.stars = Math.max(cur.stars || 0, stars || 0);
    cur.total = total;
    state.progress.lessons[lessonId] = cur;
    saveProgress();
  }
  function recordActivity(lessonId, idx, correct) {
    const cur = state.progress.lessons[lessonId] || { done: false, stars: 0, total: 0 };
    cur.results = cur.results || {};
    cur.results[idx] = correct;
    state.progress.lessons[lessonId] = cur;
    saveProgress();
  }

  const state = {
    route: { view: 'home' },
    progress: loadProgress(),
    session: null,   // { lessonId, stepIndex, stars, answered }
    game: null       // { gameId, round, score }
  };

  function findLesson(id) {
    for (const s of Object.keys(CURRICULUM)) {
      const found = CURRICULUM[s].find(l => l.id === id);
      if (found) return { lesson: found, subject: s };
    }
    return null;
  }

  /* ---------------------------------------------------------
     گفتار (در صورت پشتیبانی مرورگر)
     --------------------------------------------------------- */
  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) return false;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fa-IR';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------------------------------------------------------
     صداهای ضبط‌شده‌ی حروف و کلمه‌ها
     اول فایل صوتی پخش می‌شود؛ اگر نبود، گفتار مرورگر جایگزین است
     --------------------------------------------------------- */
  const AUDIO_FILES = {
    /* حروف الفبا */
    'آ': 'letters/alef', 'ب': 'letters/be', 'پ': 'letters/pe', 'ت': 'letters/te',
    'ث': 'letters/the', 'ج': 'letters/jim', 'چ': 'letters/che', 'ح': 'letters/ha',
    'خ': 'letters/kha', 'د': 'letters/dal', 'ذ': 'letters/zal', 'ر': 'letters/re',
    'ز': 'letters/ze', 'ژ': 'letters/zhe', 'س': 'letters/sin', 'ش': 'letters/shin', 'ص': 'letters/sad',
    'ض': 'letters/zad', 'ط': 'letters/ta', 'ظ': 'letters/za', 'ع': 'letters/ain',
    'غ': 'letters/ghain', 'ف': 'letters/fe', 'ق': 'letters/qaf', 'ک': 'letters/kaf',
    'گ': 'letters/gaf', 'ل': 'letters/lam', 'م': 'letters/mim', 'ن': 'letters/nun',
    'و': 'letters/vav', 'ه': 'letters/heh', 'هـ': 'letters/heh', 'ی': 'letters/yeh',
    /* کلمه‌های درس‌ها */
    'آب': 'words/ab', 'برف': 'words/barf', 'پرواز': 'words/parvaz', 'توپ': 'words/toop',
    'ثوب': 'words/soob', 'اثر': 'words/asar', 'جوجه': 'words/joojeh', 'چتر': 'words/chatr',
    'جعبه': 'words/jobeh', 'چرخ': 'words/charkh', 'حلزون': 'words/halazoon', 'خورشید': 'words/khorshid',
    'حبه': 'words/habbeh', 'خانه': 'words/khaneh', 'درخت': 'words/derakht', 'ذره': 'words/zarreh',
    'دست': 'words/dast', 'بذر': 'words/bazar', 'رنگینکمان': 'words/ranginakaman', 'زنبور': 'words/zanboor',
    'روز': 'words/rooz', 'زیر': 'words/zir', 'ژاکت': 'words/jaket', 'سیب': 'words/sib', 'شمع': 'words/sham',
    'صدا': 'words/seda', 'باغ': 'words/bagh', 'طوطی': 'words/toti', 'ظرف': 'words/zarf',
    'عسل': 'words/asal', 'غروب': 'words/ghorub', 'فیل': 'words/fil', 'قورباغه': 'words/ghorbagheh',
    'کتاب': 'words/ketab', 'گربه': 'words/gorbeh', 'لکلک': 'words/laklak', 'ماهی': 'words/mahi',
    'نان': 'words/nan', 'والیبال': 'words/valeyball', 'هندوانه': 'words/hendevaneh', 'یخ': 'words/yakh',
    'هویج': 'words/havij', 'یادگیری': 'words/yadgiri', 'گنجشک': 'words/gonjeshk',
    'خانواده': 'words/khanevadeh', 'صبحانه': 'words/sobhaneh', 'رنگین‌کمان': 'words/ranginakaman',
    'بزرگسال': 'words/bozorgsal', 'مدرسه': 'words/madrese', 'الگو': 'words/elgoo'
  };

  const audioCache = {};

  function playSound(text, directRel) {
    const raw = String(text || '').trim();
    if (!raw && !directRel) return false;
    const key = raw.replace(/\u200c/g, ''); /* حذف نیم‌فاصله برای جست‌وجوی نگاشت */
    const rel = directRel || AUDIO_FILES[key] || AUDIO_FILES[raw];
    if (rel && typeof Audio !== 'undefined') {
      try {
        if (!audioCache[rel]) {
          audioCache[rel] = new Audio('audio/' + rel + '.mp3');
        }
        const a = audioCache[rel];
        if (a.error) {
          delete audioCache[rel];
          return speak(raw);
        }
        let fellBack = false;
        const fallback = function () {
          if (!fellBack) { fellBack = true; speak(raw); }
        };
        a.addEventListener('error', fallback, { once: true });
        try { a.currentTime = 0; } catch (e) { /* ignore */ }
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(fallback);
        return true;
      } catch (e) {
        /* به گفتار مرورگر برمی‌گردیم */
      }
    }
    return speak(raw);
  }

  /* ---------------------------------------------------------
     روتر
     --------------------------------------------------------- */
  function parseHash() {
    const h = (location.hash || '#/').replace(/^#/, '');
    const parts = h.split('/').filter(Boolean);
    if (parts.length === 0) return { view: 'home' };
    if (parts[0] === 'lessons') return { view: 'lessons', subject: parts[1] || 'math' };
    if (parts[0] === 'lesson') return { view: 'lesson', lessonId: parts[1] };
    if (parts[0] === 'games') return { view: 'games' };
    if (parts[0] === 'game') return { view: 'game', gameId: parts[1] };
    if (parts[0] === 'progress') return { view: 'progress' };
    if (parts[0] === 'cinema') return { view: 'cinema' };
    return { view: 'home' };
  }

  function go(hash) {
    location.hash = hash;
  }

  window.addEventListener('hashchange', () => {
    state.route = parseHash();
    if (state.route.view !== 'lesson') state.session = null;
    if (state.route.view !== 'game') state.game = null;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* ---------------------------------------------------------
     پوسته
     --------------------------------------------------------- */
  const NAV = [
    { id: 'home', label: 'خانه', icon: 'home', hash: '#/' },
    { id: 'lessons', label: 'درس‌ها', icon: 'book', hash: '#/lessons/math' },
    { id: 'games', label: 'بازی‌ها', icon: 'game', hash: '#/games' },
    { id: 'progress', label: 'پیشرفت من', icon: 'chart', hash: '#/progress' }
  ];

  function railHTML(active) {
    const links = NAV.map(n => `
      <button class="rail-link ${active === n.id ? 'is-active' : ''}" data-act="nav" data-hash="${n.hash}">
        ${icon(n.icon)}<span>${n.label}</span>
      </button>`).join('');
    return `
      <div>
        <a class="wordmark" href="#/" aria-label="مدرسه‌ی من، صفحه‌ی اصلی">
          <svg class="star-mini" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="#FF6B5E" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/></svg>
          <span>مدرسه‌ی من</span>
        </a>
        <div style="margin-top:10px"><span class="rail-grade">پایه‌ی اول</span></div>
      </div>
      <nav class="rail-nav" aria-label="ناوبری اصلی">${links}</nav>
      <div class="rail-foot">
        <button class="adult-link" data-act="adult">${icon('wrench')}<span>ورود بزرگ‌ترها</span></button>
      </div>`;
  }

  function topbarHTML() {
    return `
      <a class="wordmark" href="#/" style="font-size:20px">
        <svg class="star-mini" viewBox="0 0 24 24" aria-hidden="true" style="width:28px;height:28px"><polygon points="${STAR_POINTS}" fill="#FF6B5E" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <span>مدرسه‌ی من</span>
      </a>
      <button class="icon-btn" data-act="sheet-open" aria-label="باز کردن منو">${icon('menu')}</button>`;
  }

  /* ---------------------------------------------------------
     نما: خانه
     --------------------------------------------------------- */
  /* ---------------------------------------------------------
     کردیت KarenSoft — نوار پایین فوتر (با آرت‌ورک اصلی لوگو)
     --------------------------------------------------------- */
  function karenCreditHTML() {
    return `
      <a class="karen-credit" href="https://www.karen-soft.ir" target="_blank" rel="noopener noreferrer" dir="ltr"
         aria-label="طراحی و توسعه توسط کارن سافت — karen-soft.ir">
        <span class="karen-credit-mark" aria-hidden="true">
          <img src="images/karensoft/mark.png" alt="" width="256" height="256">
          <span class="karen-orbit"></span>
          <span class="karen-orbit karen-orbit-2"></span>
        </span>
        <span class="karen-credit-body">
          <span class="karen-credit-label">Designed &amp; Developed by</span>
          <span class="karen-credit-words">
            <img class="karen-word-en" src="images/karensoft/wordmark-en.png" alt="Karensoft" width="410" height="48">
            <span class="karen-credit-sep" aria-hidden="true">|</span>
            <img class="karen-word-fa" src="images/karensoft/wordmark-fa.png" alt="کارن سافت" width="383" height="96">
            <span class="karen-shine" aria-hidden="true"></span>
          </span>
        </span>
      </a>`;
  }

  function currentLessonId() {
    if (state.progress.last && findLesson(state.progress.last)) return state.progress.last;
    return 'm1';
  }

  function renderHome() {
    const cur = findLesson(currentLessonId());
    const subjects = ['math', 'farsi', 'science'];
    const islands = subjects.map((sid, i) => {
      const s = SUBJECTS[sid];
      const n = CURRICULUM[sid].length;
      return `
      <button class="island ${s.fieldClass} reveal d${i}" data-act="subject" data-subject="${sid}" aria-label="درس‌های ${s.title}">
        <div class="island-art">${subjectArt(sid)}</div>
        <div class="island-body">
          <div class="island-title">${s.title}</div>
          <div class="island-tag">${s.tagline}</div>
          <div class="lesson-meta"><span class="chip">${faDigits(n)} درس</span></div>
          <div class="island-cta">مشاهده‌ی درس‌ها
            <span class="arrow-dot">${icon('arrow-left')}</span>
          </div>
        </div>
      </button>`;
    }).join('');

    const done = cur && state.progress.lessons[cur.lesson.id] && state.progress.lessons[cur.lesson.id].done;
    const strip = cur ? `
      <section class="lesson-strip reveal" aria-label="درس فعال">
        <div class="marker" aria-hidden="true">${icon('star-yellow')}</div>
        <div class="strip-copy">
          <span class="t-label">درس امروز</span>
          <h2 class="t-sub">${escapeHtml(cur.lesson.title)}</h2>
          <div class="strip-meta">
            <span class="chip">${icon('play')} ${faDigits(cur.lesson.minutes || 8)} دقیقه</span>
            <span class="chip ${done ? 'is-done' : ''}">${done ? 'تکمیل‌شده' : 'در حال یادگیری'}</span>
          </div>
        </div>
        <button class="btn btn-primary" data-act="lesson" data-lesson="${cur.lesson.id}">
          ${icon('play')} ${done ? 'مرور دوباره' : 'شروع درس'}
        </button>
      </section>` : '';

    const acts = [
      {
        title: 'شمارش تا ۱۰', desc: 'با میوه‌ها و ستاره‌ها تمرین شمارش کن.', art: 'tenframe',
        hash: '#/lesson/m3'
      },
      {
        title: 'حروف و صداها', desc: 'حرف درست را بشنو و پیدا کن.', art: 'lettercard',
        hash: '#/lesson/f0'
      },
      {
        title: 'الگوها', desc: 'ترتیب شکل‌ها را کامل کن.', art: 'pattern',
        hash: '#/lesson/m10'
      },
      {
        title: 'کشف طبیعت', desc: 'جاندار و بی‌جان را تشخیص بده.', art: 'beanjar',
        hash: '#/lesson/s1'
      }
    ].map(a => `
      <button class="act-card reveal" data-act="nav" data-hash="${a.hash}">
        <div class="act-ill">${bigArtSVG(a.art)}</div>
        <div class="act-title">${a.title}</div>
        <div class="act-desc">${a.desc}</div>
        <div class="act-link">شروع ${icon('arrow-left')}</div>
      </button>`).join('');

    return `
      <div class="main-inner">
        <section class="stage" aria-label="شروع یادگیری">
          <div class="stage-copy">
            <span class="stage-kicker">${icon('sun')} مدرسه‌ی من · پایه‌ی اول</span>
            <h1 class="t-display">امروز چه چیزی یاد بگیریم؟</h1>
            <p class="stage-sub">هر روز کمی تمرین، کمی بازی، کلی کشف تازه</p>
            <div class="stage-actions">
              <button class="btn btn-primary" data-act="lesson" data-lesson="${cur ? cur.lesson.id : 'm1'}">${icon('play')} شروع یادگیری</button>
              <button class="btn btn-secondary" data-act="subject" data-subject="math">${icon('book')} درس‌های امروز</button>
            </div>
          </div>
          <div class="stage-art" id="stage-art">
            ${heroTreeSVG()}
            <div class="fly-chip c1" style="--fx:-90px;--fy:190px"></div>
            <div class="fly-chip c2" style="--fx:10px;--fy:230px"></div>
            <div class="fly-chip c3" style="--fx:110px;--fy:190px"></div>
          </div>
        </section>

        <figure class="img-frame stage-banner reveal" aria-label="دنیای یادگیری">
          ${artImg('hero', { eager: true, alt: ART.hero.alt })}
        </figure>

        <section class="section" aria-label="موضوع‌ها">
          <div class="section-head">
            <h2 class="t-heading">جزیره‌ی درس‌ها</h2>
            <p class="t-label">یک موضوع را انتخاب کن</p>
          </div>
          <div class="islands">${islands}</div>
        </section>

        <section class="section">${strip}</section>

        <section class="section" aria-label="سینمای حروف">
          <div class="section-head">
            <h2 class="t-heading">سینمای حروف</h2>
            <button class="btn btn-quiet" data-act="nav" data-hash="#/cinema">تماشای انیمیشن</button>
          </div>
          <button class="cinema-banner reveal" data-act="nav" data-hash="#/cinema" aria-label="تماشای انیمیشن ماجرای حروف">
            <img src="videos/majara-horof-poster.jpg" alt="ماجرای حروف — سحر کوچولو و حروف الفبا" loading="lazy">
            <span class="cinema-copy">
              <span class="cinema-kicker">${icon('play')} تماشا کن</span>
              <span class="cinema-title">ماجرای حروف</span>
              <span class="cinema-desc">انیمیشن شعر و موزیک کودکانه برای یادگیری الفبا</span>
            </span>
          </button>
        </section>

        <section class="section" aria-label="فعالیت‌ها">
          <div class="section-head">
            <h2 class="t-heading">بازی و تمرین</h2>
            <button class="btn btn-quiet" data-act="nav" data-hash="#/games">همه‌ی بازی‌ها</button>
          </div>
          <div class="activity-row">${acts}</div>
        </section>

        <footer class="foot-note">
          <span class="foot-group">
            <span>مدرسه‌ی من · آموزش ریاضی، فارسی و علوم پایه‌ی اول</span>
            ${karenCreditHTML()}
          </span>
          <span>ساخته‌شده برای یادگیری شاد و آرام</span>
        </footer>
      </div>`;
  }

  /* ---------------------------------------------------------
     ویدیوهای آموزشی آپارات — پخش داخل برنامه
     --------------------------------------------------------- */
  const APARAT_VIDEOS = [
    { id: 'e78l931', title: 'آموزش نوشتاری و تلفظ الفبای فارسی', desc: 'شکل نوشتاری و تلفظ حروف الفبا', art: 'lettercard', subjects: ['farsi'] },
    { id: '2091511502462279680', short: true, title: 'آموزش الفبا — نسخه‌ی کوتاه', desc: 'مرور سریع نوشتاری و تلفظ الفبا', art: 'lettercard', subjects: ['farsi'] },
    { id: 'w86s7l4', title: 'آموزش الفبا', desc: 'آموزش کامل حروف الفبای فارسی', art: 'shapes', subjects: ['farsi'] },
    { id: 'q20d11z', title: 'الفبا و کلمات با قصه‌های کودکانه', desc: 'آموزش تصویری الفبا و کلمات با روایت داستانی', art: 'beanjar', subjects: ['farsi'] },
    { id: 'ygd6y22', title: 'آموزش کلمات با تصاویر', desc: 'کلمه‌ها همراه تصاویر متنی', art: 'materials', subjects: ['farsi'] },
    { id: 'pkec434', title: 'آهنگ لالایی کوچولو', desc: 'لالایی ملایم برای آرامش کودکان', art: 'sound', subjects: [] },
    { id: 'icmg8ag', title: 'لالایی قشنگ', desc: 'یک لالایی دیگر برای خواب آرام', art: 'sound', subjects: [] },
    { id: 'vyl6ve8', title: 'لالایی آرام', desc: 'آهنگ لالایی ملایم کودکانه', art: 'sound', subjects: [] },
    { id: 'jqh714a', title: 'انیمیشن شاد مداد رنگی', desc: 'انیمیشن رنگی و شاد برای کودکان', art: 'pattern', subjects: [] },
    { id: 'shiq3le', title: 'انیمیشن عروسک قشنگ من', desc: 'انیمیشن عروسکی دوست‌داشتنی', art: 'seasons', subjects: [] },
    { id: 'b411t82', title: 'علوم: آبزیان', desc: 'ویدیوی آموزشی درباره‌ی جانداران آبزی', art: 'animals', subjects: ['science'] },
    { id: 'myi4q6v', title: 'ریاضی: آموزش اعداد', desc: 'یادگیری اعداد برای ریاضی اول', art: 'numline', subjects: ['math'] }
  ];

  function aparatUrl(v) {
    return v.short ? 'https://www.aparat.com/shorts/' + v.id : 'https://www.aparat.com/v/' + v.id;
  }

  function videoCardHTML(v) {
    return `
      <button class="act-card ext-card reveal" data-act="video" data-video="${v.id}" aria-label="پخش ${escapeHtml(v.title)}">
        <div class="act-ill">${bigArtSVG(v.art)}</div>
        <div class="act-title">${v.title}</div>
        <div class="act-desc">${v.desc}</div>
        <div class="act-link">${icon('play')} پخش ویدیو</div>
      </button>`;
  }

  function openVideoModal(videoId) {
    const v = APARAT_VIDEOS.find(x => x.id === videoId);
    if (!v) return;
    closeModal();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'modal-root';
    wrap.innerHTML = `
      <div class="modal video-modal" role="dialog" aria-modal="true" aria-labelledby="video-title">
        <div class="modal-head">
          <h2 class="t-sub" id="video-title">${escapeHtml(v.title)}</h2>
          <button class="icon-btn" data-act="modal-close" aria-label="بستن">${icon('close')}</button>
        </div>
        <div class="video-frame">
          <iframe class="video-embed" src="https://www.aparat.com/embed/${v.id}" title="${escapeHtml(v.title)}"
            allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <div class="stage-actions">
          <a class="btn btn-secondary" href="${aparatUrl(v)}" target="_blank" rel="noopener noreferrer">تماشا در آپارات</a>
          <button class="btn btn-quiet" data-act="modal-close">بستن</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
  }

  /* ---------------------------------------------------------
     سینمای حروف (ویدیوی انیمیشن)
     --------------------------------------------------------- */
  function renderCinema() {
    return `
      <div class="main-inner">
        <section class="section" aria-label="سینمای حروف">
          <div class="section-head">
            <h1 class="t-heading" style="font-size:30px">${icon('play', 'h-ico')} سینمای حروف</h1>
            <button class="btn btn-quiet" data-act="nav" data-hash="#/">${icon('arrow-left')} بازگشت به خانه</button>
          </div>
          <p class="t-label" style="margin-bottom:18px">انیمیشن «ماجرای حروف»؛ شعر، موزیک پیانوی ملایم و تلفظ کامل الفبا · مدت: ۱:۴۲</p>
          <figure class="video-frame">
            <video controls playsinline preload="metadata" poster="videos/majara-horof-poster.jpg">
              <source src="videos/majara-horof.mp4" type="video/mp4">
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </figure>
          <div class="stage-actions" style="margin-top:18px">
            <a class="btn btn-primary" href="videos/majara-horof.mp4" download>${icon('play')} دانلود ویدیو</a>
            <button class="btn btn-secondary" data-act="nav" data-hash="#/lessons/farsi">${icon('book')} تمرین حروف</button>
          </div>
        </section>

        <section class="section" aria-label="شعر داستان">
          <div class="section-head">
            <h2 class="t-heading">شعر ماجرای حروف</h2>
            <p class="t-label">هر بخش از شعر را جداگانه بشنو</p>
          </div>
          <div class="poem-row">
            ${[
              { n: 1, label: 'سحر بیدار می‌شود', text: 'سحر کوچولو از خواب پاشد. ستاره‌ی خندان گفت: سلام! بیا، بیایید ببینیم.' },
              { n: 2, label: 'الف، به، په، ته', text: 'الف، به، په، ته. آفتاب آمد و خندید. برف بارید. پرواز کردیم. توپ قرمز را انداختیم.' },
              { n: 3, label: 'ثه تا دال', text: 'ثه، جیم، چه، حا، خا، دال. هر حرف یک قصه‌ی قشنگ دارد.' },
              { n: 4, label: 'رقص حروف و شب‌به‌خیر', text: 'ره، زه، ژه رقصیدند. الفبا خوابید زیر نور ماه. شب به خیر حرف‌های مهربان.' }
            ].map(p => `
              <button class="audio-btn" data-act="speak" data-text="${escapeHtml(p.text)}" data-audio="stories/poem-${p.n}" aria-label="شنیدن ${escapeHtml(p.label)}">
                ${icon('speaker')} <span>${faDigits(p.n)} · ${p.label}</span>
              </button>`).join('')}
          </div>
        </section>

        <section class="section" aria-label="تلفظ کامل الفبا">
          <div class="section-head">
            <h2 class="t-heading">الفبای فارسی را شمرده بشنویم</h2>
            <p class="t-label">هر گروه از حروف را با تلفظ دقیق و شمرده تکرار کن</p>
          </div>
          <div class="poem-row">
            ${[
              { n: 1, label: 'الف تا حا', text: 'الف. به. په. ته. ثه. جیم. چه. حا.' },
              { n: 2, label: 'خا تا شین', text: 'خا. دال. ذال. ره. زه. ژه. سین. شین.' },
              { n: 3, label: 'صاد تا قاف', text: 'صاد. ضاد. طا. ظا. عین. غین. فه. قاف.' },
              { n: 4, label: 'کاف تا یه', text: 'کاف. گاف. لام. میم. نون. واو. هِ. یه.' }
            ].map(p => `
              <button class="audio-btn" data-act="speak" data-text="${escapeHtml(p.text)}" data-audio="stories/abc-${p.n}" aria-label="شنیدن ${escapeHtml(p.label)}">
                ${icon('speaker')} <span>${faDigits(p.n)} · ${p.label}</span>
              </button>`).join('')}
          </div>
        </section>

        <section class="section" aria-label="ویدیوهای آموزشی">
          <div class="section-head">
            <h2 class="t-heading">ویدیوهای آموزشی</h2>
            <p class="t-label">برای تماشا در آپارات · الفبا، شعر، لالایی، علوم و ریاضی</p>
          </div>
          <div class="activity-row">
            ${APARAT_VIDEOS.map(videoCardHTML).join('')}
          </div>
        </section>

        <section class="section" aria-label="درباره‌ی داستان">
          <div class="section-head">
            <h2 class="t-heading">داستان از چه قرار است؟</h2>
          </div>
          <div class="activity-row">
            ${[
              { title: 'سحر و ستاره', desc: 'سحر کوچولو با ستاره‌ی خندان همراه می‌شود تا حروف را پیدا کند.', art: 'seasons' },
              { title: 'شعر آموزشی', desc: 'شعر کودکانه «آفتاب، برف، پرواز، توپ» حرف‌ها را به خاطرماندنی می‌کند.', art: 'lettercard' },
              { title: 'موزیک ملایم', desc: 'آهنگ لالایی با حال‌وهوای موسیقی ایرانی، همراه آرام کودکان.', art: 'sound' }
            ].map(a => `
              <div class="act-card reveal">
                <div class="act-ill">${bigArtSVG(a.art)}</div>
                <div class="act-title">${a.title}</div>
                <div class="act-desc">${a.desc}</div>
              </div>`).join('')}
          </div>
        </section>

        <footer class="foot-note">
          <span class="foot-group">
            <span>مدرسه‌ی من · سینمای حروف</span>
            ${karenCreditHTML()}
          </span>
          <span>شعر و موزیک کودکانه برای یادگیری الفبا</span>
        </footer>
      </div>`;
  }

  /* ---------------------------------------------------------
     نما: فهرست درس‌ها
     --------------------------------------------------------- */
  function renderLessonsIndex(subjectId) {
    const s = SUBJECTS[subjectId] || SUBJECTS.math;
    const lessons = CURRICULUM[s.id];
    const cards = lessons.map((l, i) => {
      const p = state.progress.lessons[l.id];
      const done = p && p.done;
      return `
      <button class="lesson-card reveal ${done ? 'is-done' : ''}" data-act="lesson" data-lesson="${l.id}">
        <div class="lesson-meta">
          <span class="num-badge">${faDigits(i + 1)}</span>
          <span class="chip ${done ? 'is-done' : ''}">${done ? icon('check') + ' تکمیل‌شده' : faDigits(l.minutes || 8) + ' دقیقه'}</span>
        </div>
        <h3>${escapeHtml(l.title)}</h3>
        <p>${escapeHtml(l.objective)}</p>
        <div class="act-link">شروع درس ${icon('arrow-left')}</div>
      </button>`;
    }).join('');

    const subjectTabs = Object.keys(SUBJECTS).map(sid => `
      <button class="btn ${sid === s.id ? 'btn-primary' : 'btn-secondary'}" data-act="subject" data-subject="${sid}">
        ${SUBJECTS[sid].title}
      </button>`).join('');

    return `
      <div class="main-inner">
        <header class="page-head">
          <button class="back-link" data-act="nav" data-hash="#/">${icon('arrow-right')} بازگشت به خانه</button>
          <div class="page-hero">
            <div class="page-hero-copy">
              <h1 class="t-display">درس‌های ${s.title}</h1>
              <p class="t-body measure">${s.intro}</p>
              <div class="stage-actions">${subjectTabs}</div>
            </div>
            <figure class="img-frame page-hero-art">
              ${subjectArt(s.id, { eager: true })}
            </figure>
          </div>
        </header>
        <div class="lesson-grid">${cards}</div>
        ${(() => {
          const vids = APARAT_VIDEOS.filter(v => (v.subjects || []).includes(s.id));
          if (!vids.length) return '';
          return `
        <section class="section" aria-label="ویدیوهای آموزشی ${escapeHtml(s.title)}">
          <div class="section-head">
            <h2 class="t-heading">ویدیوهای آموزشی ${s.title}</h2>
            <button class="btn btn-quiet" data-act="nav" data-hash="#/cinema">همه‌ی ویدیوها</button>
          </div>
          <div class="activity-row">${vids.map(videoCardHTML).join('')}</div>
        </section>`;
        })()}
        <footer class="foot-note">
          <span class="foot-group">
            <span>${faDigits(lessons.length)} درس · ${s.tagline}</span>
            ${karenCreditHTML()}
          </span>
          <button class="btn btn-quiet" data-act="adult">${icon('wrench')} ورود بزرگ‌ترها</button>
        </footer>
      </div>`;
  }

  /* ---------------------------------------------------------
     نما: صفحه‌ی درس (سه ستونه)
     --------------------------------------------------------- */
  function buildSteps(lesson) {
    const steps = [{ id: 'teach', label: 'آموزش' }];
    (lesson.activities || []).forEach((a, i) => {
      steps.push({ id: 'act-' + i, label: 'تمرین ' + faDigits(i + 1), actIndex: i });
    });
    steps.push({ id: 'done', label: 'جمع‌بندی' });
    return steps;
  }

  function renderLesson(lessonId) {
    const found = findLesson(lessonId);
    if (!found) {
      return `<div class="main-inner"><h1 class="t-display">درس پیدا نشد</h1>
        <p class="t-body">این درس وجود ندارد. <button class="btn btn-secondary" data-act="nav" data-hash="#/lessons/math">بازگشت به درس‌ها</button></p></div>`;
    }
    const { lesson, subject } = found;
    const s = SUBJECTS[subject];

    if (!state.session || state.session.lessonId !== lesson.id) {
      state.session = {
        lessonId: lesson.id,
        stepIndex: 0,
        stars: 0,
        answered: {}
      };
    }
    const sess = state.session;
    const steps = buildSteps(lesson);
    const step = steps[Math.min(sess.stepIndex, steps.length - 1)];

    /* --- ستون راست: فهرست گام‌ها --- */
    const stepItems = steps.map((st, i) => `
      <button class="step-item ${i === sess.stepIndex ? 'is-current' : ''} ${i < sess.stepIndex ? 'is-done' : ''}" data-act="step" data-step="${i}">
        <span class="step-dot">${i < sess.stepIndex ? '✓' : faDigits(i + 1)}</span>
        <span>${st.label}</span>
      </button>`).join('');

    /* --- مرکز: محتوا --- */
    let center = '';
    if (step.id === 'teach') {
      center = renderTeach(lesson, s);
    } else if (step.id === 'done') {
      center = renderLessonDone(lesson, s);
    } else {
      center = renderActivityCard(lesson, step.actIndex);
    }

    /* --- ستون چپ: پیشرفت --- */
    const totalSteps = steps.length;
    const pct = Math.round((sess.stepIndex / (totalSteps - 1)) * 100);
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(`<svg class="star-mini" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="${i < sess.stars ? '#FFD45A' : '#E7DCCB'}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
    }
    const nextLesson = findNextLesson(lesson.id);

    return `
      <div class="main-inner">
        <header class="page-head">
          <button class="back-link" data-act="subject" data-subject="${subject}">${icon('arrow-right')} درس‌های ${s.title}</button>
          <figure class="img-frame lesson-band">
            ${subjectArt(subject, { alt: '' })}
          </figure>
          <h1 class="t-heading">${escapeHtml(lesson.title)}</h1>
          <div class="objective-banner">${icon('target')} <span>هدف یادگیری: ${escapeHtml(lesson.objective)}</span></div>
        </header>

        <div class="lesson-layout">
          <aside class="lesson-side contents" aria-label="فهرست درس">
            <div class="side-card">
              <h3>گام‌های درس</h3>
              <div class="step-list">${stepItems}</div>
            </div>
          </aside>

          <main class="lesson-center" id="lesson-center">
            ${center}
          </main>

          <aside class="lesson-side progress-panel" aria-label="پیشرفت">
            <div class="side-card">
              <h3>پیشرفت من</h3>
              <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
              <p class="t-label" style="margin-top:8px">${faDigits(pct)}٪ از درس رفتی!</p>
              <div class="star-row" aria-label="ستاره‌ها">${stars.join('')}</div>
            </div>
            <div class="side-card">
              <h3>قدم بعدی</h3>
              <p class="t-label" style="margin-bottom:10px">${nextLesson ? escapeHtml(nextLesson.title) : 'آفرین! این آخرین درس بود.'}</p>
              ${nextLesson ? `<button class="btn btn-secondary" data-act="lesson" data-lesson="${nextLesson.id}" style="width:100%">درس بعدی ${icon('arrow-left')}</button>` : `<button class="btn btn-secondary" data-act="nav" data-hash="#/progress" style="width:100%">پیشرفت من</button>`}
            </div>
            <div class="side-card">
              <h3>کمک بزرگ‌ترها</h3>
              <p class="t-label">کنار کودک بنشینید و اجازه دهید خودش انتخاب کند. اشتباه کردن بخشی از یادگیری است.</p>
            </div>
          </aside>
        </div>
      </div>`;
  }

  function findNextLesson(id) {
    const order = [].concat(CURRICULUM.math, CURRICULUM.farsi, CURRICULUM.science);
    const i = order.findIndex(l => l.id === id);
    return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
  }

  function renderTeach(lesson, s) {
    const figs = (lesson.teach || []).map((t, i) => {
      if (t.kind === 'text') {
        return `<div class="teach-step"><span class="step-dot">${faDigits(i + 1)}</span><p class="t-body">${escapeHtml(t.text)}</p></div>`;
      }
      if (t.kind === 'objects') {
        return `<div class="teach-figs">${objectsBoard(t.object, t.count)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      if (t.kind === 'letters') {
        const tiles = t.letters.map(l => `
          <div class="teach-fig">
            <div style="font-size:52px;font-weight:800;line-height:1.1">${l}</div>
            <button class="audio-btn mini" data-act="speak" data-text="${escapeHtml(l)}" aria-label="شنیدن حرف ${escapeHtml(l)}">${icon('speaker')}</button>
          </div>`).join('');
        const words = (t.words || []).map(w => `
          <div class="teach-fig">
            <div class="cap" style="font-size:20px">${escapeHtml(w[1])}</div>
            <button class="audio-btn mini" data-act="speak" data-text="${escapeHtml(w[1])}" aria-label="شنیدن کلمه‌ی ${escapeHtml(w[1])}">${icon('speaker')}</button>
          </div>`).join('');
        return `<div class="teach-figs">${tiles}</div><div class="teach-figs">${words}</div>`;
      }
      if (t.kind === 'story') {
        return `<div class="story-text"><strong>${escapeHtml(t.title)}</strong><br>${escapeHtml(t.text)}
          ${t.audio ? `<div style="margin-top:12px"><button class="audio-btn" data-act="speak" data-text="${escapeHtml(t.text)}" data-audio="${escapeHtml(t.audio)}" aria-label="شنیدن داستان ${escapeHtml(t.title)}">${icon('speaker')} <span>شنیدن داستان</span></button></div>` : ''}
        </div>`;
      }
      if (t.kind === 'equation') {
        return `<div class="center-stage">${equationSVG(t.a, t.op, t.b)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      if (t.kind === 'numline') {
        return `<div class="center-stage">${numlineSVG(t.from, t.to)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      if (t.kind === 'tenframe') {
        return `<div class="center-stage">${tenframeSVG(t.value)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      if (t.kind === 'placevalue') {
        return `<div class="center-stage">
          <div class="equation">
            <span class="eq-box" style="background:var(--surface-blue)">${faDigits(t.value)}</span>
            <span class="eq-op">＝</span>
            <span class="eq-box">۱۰</span><span class="eq-op">＋</span><span class="eq-box">${faDigits(t.value - 10)}</span>
          </div>
          <p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      if (t.kind === 'pattern') {
        return `<div class="center-stage">${patternRowSVG(t.seq)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
      }
      /* نماهای تصویری */
      return `<div class="center-stage">${bigArtSVG(t.kind)}<p class="t-label">${escapeHtml(t.caption || '')}</p></div>`;
    }).join('');

    return `
      <article class="teach-card is-focus reveal">
        <h2>${escapeHtml(lesson.title)}</h2>
        <div class="teach-steps">${figs}</div>
        <div class="stage-actions">
          <button class="btn btn-primary" data-act="step-next">${icon('play')} برویم سراغ تمرین</button>
          <button class="audio-btn" data-act="speak" data-text="${escapeHtml(lesson.objective)}">${icon('speaker')} <span>شنیدن هدف درس</span></button>
        </div>
      </article>`;
  }

  function renderLessonDone(lesson, s) {
    const p = state.progress.lessons[lesson.id];
    const stars = (state.session && state.session.stars) || (p && p.stars) || 0;
    const nextLesson = findNextLesson(lesson.id);
    return `
      <article class="teach-card is-focus reveal">
        <div class="center-stage">
          <figure class="img-frame done-art">
            ${artImg('celebrate', {
      fallback: `<svg width="120" height="120" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="#FFD45A" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/></svg>`,
      fallbackDisplay: 'flex'
    })}
          </figure>
          <h2>آفرین! درس تمام شد</h2>
          <p class="t-body measure">تو «${escapeHtml(lesson.title)}» را یاد گرفتی. ${faDigits(stars)} ستاره گرفتی.</p>
          <div class="star-row" aria-hidden="true">
            ${[0, 1, 2].map(i => `<svg class="star-mini" viewBox="0 0 24 24"><polygon points="${STAR_POINTS}" fill="${i < stars ? '#FFD45A' : '#E7DCCB'}" stroke="${INK}" stroke-width="1.4"/></svg>`).join('')}
          </div>
        </div>
        <div class="stage-actions">
          ${nextLesson ? `<button class="btn btn-primary" data-act="lesson" data-lesson="${nextLesson.id}">${icon('arrow-left')} درس بعدی</button>` : ''}
          <button class="btn btn-secondary" data-act="restart">${icon('play')} دوباره این درس</button>
          <button class="btn btn-secondary" data-act="subject" data-subject="${s.id}">همه‌ی درس‌ها</button>
        </div>
      </article>`;
  }

  /* ---------------------------------------------------------
     فعالیت‌ها
     --------------------------------------------------------- */
  function patternRowSVG(seq, opts) {
    const cells = seq.map(name => {
      if (name === 'unknown') {
        return `<div class="pattern-cell is-unknown" aria-label="شکل نامعلوم">؟</div>`;
      }
      return `<div class="pattern-cell">${shapeSVG(name)}</div>`;
    }).join('');
    return `<div class="pattern-row" role="img" aria-label="الگوی شکل‌ها">${cells}</div>`;
  }

  function optionsFor(type, act) {
    /* گزینه‌ها را با پاسخ درست می‌سازد */
    if (type === 'count' || type === 'tenframe') {
      const answer = act.count !== undefined ? act.count : act.value;
      const set = new Set([answer]);
      const spread = [answer - 1, answer + 1, answer - 2, answer + 2, answer + 3, answer - 3];
      for (const d of spread) {
        if (set.size >= 4) break;
        if (d >= 1 && d <= (act.max || 20)) set.add(d);
      }
      return { answer, options: shuffle(Array.from(set), answer * 7 + set.size) };
    }
    if (type === 'math') {
      const answer = act.op === '+' ? act.a + act.b : act.a - act.b;
      const set = new Set([answer]);
      const spread = [answer + 1, answer - 1, answer + 2, answer - 2, answer + 3];
      for (const d of spread) {
        if (set.size >= 4) break;
        if (d >= 0 && d <= (act.max || 20)) set.add(d);
      }
      return { answer, options: shuffle(Array.from(set), answer * 5 + act.a) };
    }
    if (type === 'compareChoose') {
      return {
        answer: act.answer,
        options: shuffle(['left', 'right'], (act.left || 1) * 3 + (act.right || 1)),
        labels: { left: 'گروه ۱', right: 'گروه ۲' }
      };
    }
    if (type === 'symbol') {
      return {
        answer: act.answer,
        options: shuffle(['>', '<', '='], (act.left || 1) + (act.right || 1) * 7),
        labels: { '>': 'بیشتر (>)', '<': 'کمتر (<)', '=': 'برابر (=)' }
      };
    }
    if (type === 'letter') {
      return { answer: act.letter, options: act.options || [act.letter] };
    }
    if (type === 'sound') {
      return { answer: act.first, options: act.options || [act.first] };
    }
    if (type === 'pattern') {
      const present = Array.from(new Set((act.seq || []).filter(s => s !== 'unknown')));
      const extras = ['circle', 'square', 'triangle', 'star'].filter(s => s !== act.answer && present.indexOf(s) === -1);
      const set = present.slice();
      if (set.indexOf(act.answer) === -1) set.push(act.answer);
      for (const e of extras) {
        if (set.length >= 4) break;
        set.push(e);
      }
      return { answer: act.answer, options: shuffle(set, (act.seq || []).length * 3 + 2) };
    }
    return { answer: act.answer, options: act.options || [] };
  }

  function renderActivityCard(lesson, idx) {
    const act = lesson.activities[idx];
    const kind = act.type;
    const optData = optionsFor(kind, act);
    const answered = state.session && state.session.answered[idx];

    let body = '';
    let prompt = act.prompt || 'تمرین';

    if (kind === 'count') {
      body = objectsBoard(act.object, act.count) + numberOptions(optData);
    } else if (kind === 'tenframe') {
      body = `<div class="center-stage">${tenframeSVG(act.value)}</div>` + numberOptions(optData);
    } else if (kind === 'math') {
      const dots = act.op === '+' ? objectsBoard('ball', Math.min(act.a, 8)) + objectsBoard('apple', Math.min(act.b, 8)) : objectsBoard('ball', Math.min(act.a, 8));
      body = `<div class="center-stage">${equationSVG(act.a, act.op, act.b)}</div>${dots}` + numberOptions(optData);
    } else if (kind === 'letter') {
      body = `
        <div class="center-stage">
          <button class="audio-btn" data-act="speak" data-text="${escapeHtml(act.letter)}" aria-label="شنیدن حرف ${escapeHtml(act.letter)}">${icon('speaker')} <span>شنیدن حرف</span></button>
        </div>` + letterOptions(optData);
    } else if (kind === 'sound') {
      body = `
        <div class="center-stage">
          <div class="t-numeral" style="font-size:44px">${escapeHtml(act.word)}</div>
          <button class="audio-btn" data-act="speak" data-text="${escapeHtml(act.word)}">${icon('speaker')} <span>شنیدن کلمه</span></button>
        </div>` + letterOptions(optData);
    } else if (kind === 'pattern') {
      body = `<div class="center-stage">${patternRowSVG(act.seq)}</div>
        <div class="options-grid">${shuffle(optData.options, act.seq.length * 3 + 1).map(o => `
          <button class="opt" data-act="answer" data-value="${o}" aria-label="${SHAPE_NAMES[o] || o}">
            ${shapeSVG(o)}
          </button>`).join('')}</div>`;
    } else if (kind === 'shape') {
      body = `<div class="options-grid">${shuffle(optData.options, 11).map(o => `
        <button class="opt" data-act="answer" data-value="${o}" aria-label="${SHAPE_NAMES[o] || o}" style="flex-direction:column;gap:6px;min-height:110px">
          ${shapeSVG(o)}<span style="font-size:15px;font-weight:700">${SHAPE_NAMES[o] || o}</span>
        </button>`).join('')}</div>`;
    } else if (kind === 'compareChoose' || kind === 'symbol' || kind === 'placeChoose' || kind === 'choose' || kind === 'match' || kind === 'read' || kind === 'clock' || kind === 'observe') {
      body = renderCompareOrText(kind, act) + textOptions(optData);
    } else {
      body = textOptions(optData);
    }

    return `
      <article class="activity-card is-focus reveal" id="activity-card">
        <div class="act-prompt">
          <span class="bubble" aria-hidden="true">${icon('question')}</span>
          <span>${escapeHtml(prompt)}</span>
        </div>
        ${body}
        <div id="feedback-slot" class="live-region" aria-live="polite"></div>
      </article>`;
  }

  function numberOptions(optData) {
    return `<div class="numline" role="group" aria-label="انتخاب عدد">
      ${optData.options.map(o => `<button class="opt" data-act="answer" data-value="${o}" style="min-width:64px;min-height:64px;font-size:26px">${faDigits(o)}</button>`).join('')}
    </div>`;
  }

  function letterOptions(optData) {
    return `<div class="options-grid" role="group" aria-label="انتخاب حرف">
      ${optData.options.map(o => `<button class="opt" data-act="answer" data-value="${escapeHtml(o)}" aria-label="حرف ${escapeHtml(o)}"><span class="letter-glyph">${escapeHtml(o)}</span></button>`).join('')}
    </div>`;
  }

  function textOptions(optData) {
    const labels = optData.labels || {};
    return `<div class="options-grid" role="group" aria-label="انتخاب پاسخ">
      ${optData.options.map(o => {
      const raw = String(o);
      const shown = labels[raw] !== undefined ? labels[raw] : (/^\d+$/.test(raw) ? faDigits(raw) : raw);
      return `<button class="opt" data-act="answer" data-value="${escapeHtml(raw)}">${escapeHtml(shown)}</button>`;
    }).join('')}
    </div>`;
  }

  function renderCompareOrText(kind, act) {
    if (kind === 'compareChoose' || kind === 'symbol') {
      const left = objectsBoard('apple', act.left);
      const right = objectsBoard('apple', act.right);
      return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;direction:ltr">
        <div><div class="t-label" style="text-align:center">گروه ۱</div>${left}</div>
        <div><div class="t-label" style="text-align:center">گروه ۲</div>${right}</div>
      </div>
      ${kind === 'symbol' ? `<div class="equation"><span class="eq-box">${faDigits(act.left)}</span><span class="eq-box" style="background:var(--yellow);min-width:88px">؟</span><span class="eq-box">${faDigits(act.right)}</span></div>` : ''}`;
    }
    if (kind === 'clock') {
      return `<div class="clock-wrap">${clockSVG(act.hour)}</div>`;
    }
    if (kind === 'read') {
      return `<div class="story-text">${escapeHtml(act.text)}</div>
        <p class="t-sub" style="text-align:center">${escapeHtml(act.question)}</p>`;
    }
    if (kind === 'observe') {
      return `<div class="center-stage">${sceneSVG(act.scene)}</div>`;
    }
    return '';
  }

  /* ---------------------------------------------------------
     ارزیابی پاسخ و بازخورد
     --------------------------------------------------------- */
  function norm(v) {
    return String(v).trim();
  }

  function currentActivity() {
    if (state.route.view === 'game' && state.game) {
      const game = GAMES.find(g => g.id === state.game.gameId);
      if (!game) return null;
      return {
        act: game.make(state.game.round),
        idx: 0,
        lesson: { id: '__game__' },
        subject: game.subject,
        isGame: true
      };
    }
    const found = findLesson(state.route.lessonId || (state.session && state.session.lessonId));
    if (!found) return null;
    const idx = (state.session && state.session.stepIndex) - 1;
    if (idx < 0) return null;
    const act = found.lesson.activities[idx];
    return act ? { act, idx, lesson: found.lesson, subject: found.subject } : null;
  }

  function handleAnswer(value, btn) {
    const ctx = currentActivity();
    if (!ctx) return;
    const { act, idx, lesson, isGame } = ctx;
    const optData = optionsFor(act.type, act);
    const correct = norm(value) === norm(optData.answer);

    /* قفل گزینه‌ها */
    const card = $('#activity-card');
    if (!card) return;
    const buttons = $$('.opt', card);
    buttons.forEach(b => {
      b.classList.add('is-locked');
      b.disabled = true;
      if (norm(b.dataset.value) === norm(optData.answer)) {
        b.classList.add('is-right');
      }
    });
    if (!correct && btn) btn.classList.add('is-wrong');
    if (correct && btn) {
      btn.classList.add('pop');
      setTimeout(() => btn.classList.remove('pop'), 380);
      confettiAt(btn);
    }

    if (isGame) {
      if (correct && state.game) state.game.score += 1;
    } else {
      if (correct && state.session) state.session.stars = Math.min(3, (state.session.stars || 0) + 1);
      if (state.session) state.session.answered[idx] = correct;
      recordActivity(lesson.id, idx, correct);
    }

    const explanation = explanationFor(act, optData);
    const slot = $('#feedback-slot');
    if (slot) {
      slot.classList.remove('live-region');
      slot.innerHTML = `
        <div class="feedback ${correct ? 'is-right' : 'is-again'}" role="status">
          <div class="fb-badge">${correct ? icon('star-yellow') : icon('star')}</div>
          <div>
            <h3>${correct ? 'آفرین!' : 'دوباره تلاش کن'}</h3>
            <p>${explanation}</p>
            <div class="fb-actions">
              ${correct
        ? `<button class="btn btn-primary" data-act="step-next">${icon('arrow-left')} ادامه</button>`
        : `<button class="btn btn-primary" data-act="retry">تلاش دوباره</button>
                     <button class="btn btn-secondary" data-act="step-next">پاسخ را نشان بده و ادامه</button>`}
            </div>
          </div>
        </div>`;
      if (typeof slot.scrollIntoView === 'function') {
        slot.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  function explanationFor(act, optData) {
    const a = optData.answer;
    switch (act.type) {
      case 'count':
      case 'tenframe':
        return `درست است: <strong>${faDigits(a)}</strong> تا. با دقت یکی‌یکی شمردیم.`;
      case 'math': {
        const sign = act.op === '+' ? 'به‌علاوه‌ی' : 'منهای';
        return `${faDigits(act.a)} ${sign} ${faDigits(act.b)} می‌شود <strong>${faDigits(a)}</strong>.`;
      }
      case 'letter':
        return `حرف درست <strong>${escapeHtml(a)}</strong> است.`;
      case 'sound':
        return `کلمه‌ی «${escapeHtml(act.word)}» با حرف <strong>${escapeHtml(a)}</strong> شروع می‌شود.`;
      case 'pattern':
        return `الگو تکرار می‌شود؛ شکل بعدی <strong>${SHAPE_NAMES[a] || a}</strong> است.`;
      case 'shape':
        return `این شکل <strong>${SHAPE_NAMES[a] || a}</strong> نام دارد.`;
      case 'compareChoose':
        return `گروه ${a === 'left' ? '۱' : '۲'} پاسخ درست است؛ چون تعدادش ${act.answer === 'left' ? (act.left > act.right ? 'بیشتر' : 'کمتر') : (act.right > act.left ? 'بیشتر' : 'کمتر')} است.`;
      case 'symbol': {
        const sym = a === '=' ? 'برابر' : (a === '>' ? 'بیشتر' : 'کمتر');
        return `نشانه‌ی درست «${escapeHtml(a)}» یعنی ${sym} است.`;
      }
      case 'clock':
        return `عقربه‌ی کوتاه روی ${escapeHtml(String(a))} است؛ یعنی ساعت ${escapeHtml(String(a))}.`;
      case 'read':
      case 'choose':
      case 'match':
      case 'placeChoose':
      default:
        return `پاسخ درست: <strong>${escapeHtml(String(a))}</strong>.`;
    }
  }

  function confettiAt(el) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const colors = ['#FF6B5E', '#FFD45A', '#4D9BE6'];
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div');
      d.className = 'confetti';
      d.style.position = 'fixed';
      d.style.left = (rect.left + rect.width / 2) + 'px';
      d.style.top = (rect.top + rect.height / 2) + 'px';
      d.style.background = colors[i];
      d.style.setProperty('--cx', (i * 26 - 26) + 'px');
      d.style.setProperty('--cy', (-34 - i * 10) + 'px');
      d.style.zIndex = 90;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 700);
    }
  }

  /* ---------------------------------------------------------
     نما: بازی‌ها
     --------------------------------------------------------- */
  function renderGames() {
    const cards = GAMES.map(g => `
      <button class="act-card reveal" data-act="game" data-game="${g.id}">
        <div class="act-ill">${bigArtSVG(g.subject === 'math' ? 'pattern' : (g.subject === 'farsi' ? 'lettercard' : 'beanjar'))}</div>
        <div class="act-title">${g.title}</div>
        <div class="act-desc">${g.description}</div>
        <div class="act-link">شروع بازی ${icon('arrow-left')}</div>
      </button>`).join('');
    return `
      <div class="main-inner">
        <header class="page-head">
          <button class="back-link" data-act="nav" data-hash="#/">${icon('arrow-right')} بازگشت به خانه</button>
          <div class="page-hero">
            <div class="page-hero-copy">
              <h1 class="t-display">بازی‌های آموزشی</h1>
              <p class="t-body measure">بازی کن، یاد بگیر و ستاره جمع کن. هر بازی چند مرحله‌ی کوتاه دارد.</p>
            </div>
            <figure class="img-frame page-hero-art">
              ${artImg('hero', {})}
            </figure>
          </div>
        </header>
        <div class="activity-row">${cards}</div>
      </div>`;
  }

  function renderGame(gameId) {
    const game = GAMES.find(g => g.id === gameId);
    if (!game) return `<div class="main-inner"><h1 class="t-display">بازی پیدا نشد</h1></div>`;

    if (!state.game || state.game.gameId !== gameId) {
      state.game = { gameId, round: 0, score: 0 };
    }
    const g = state.game;

    if (g.round >= 5) {
      return `
        <div class="main-inner">
          <article class="teach-card is-focus reveal">
            <div class="center-stage">
              <figure class="img-frame done-art">
                ${artImg('celebrate', {
      fallback: `<svg width="110" height="110" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="#FFD45A" stroke="${INK}" stroke-width="1.1"/></svg>`,
      fallbackDisplay: 'flex'
    })}
              </figure>
              <h2 class="t-heading">بازی تمام شد!</h2>
              <p class="t-body">تو ${faDigits(g.score)} از ۵ پاسخ را درست دادی. آفرین!</p>
              <div class="stage-actions">
                <button class="btn btn-primary" data-act="game-restart">${icon('play')} دوباره بازی</button>
                <button class="btn btn-secondary" data-act="nav" data-hash="#/games">بازی‌های دیگر</button>
              </div>
            </div>
          </article>
        </div>`;
    }

    /* ساخت تمرین جاری و تزریق آن به کارت فعالیت */
    const act = game.make(g.round);
    const savedLesson = state.route.lessonId;
    const savedSession = state.session;

    /* از موتور فعالیت با یک درس موقت استفاده می‌کنیم */
    state.session = {
      lessonId: '__game__',
      stepIndex: 1,
      stars: 0,
      answered: {}
    };
    state.gameTempLesson = {
      id: '__game__',
      title: game.title,
      objective: game.description,
      activities: [act]
    };

    const html = `
      <div class="main-inner">
        <header class="page-head">
          <button class="back-link" data-act="nav" data-hash="#/games">${icon('arrow-right')} بازی‌های دیگر</button>
          <h1 class="t-heading">${game.title}</h1>
          <div class="strip-meta">
            <span class="chip">مرحله ${faDigits(g.round + 1)} از ۵</span>
            <span class="chip">پاسخ درست: ${faDigits(g.score)}</span>
          </div>
        </header>
        ${renderActivityCard(state.gameTempLesson, 0)}
      </div>`;

    state.session = savedSession;
    state.route.lessonId = savedLesson;
    return html;
  }

  /* ---------------------------------------------------------
     نما: پیشرفت من
     --------------------------------------------------------- */
  function renderProgress() {
    const subjects = ['math', 'farsi', 'science'];
    let doneTotal = 0, allTotal = 0, stars = 0;
    const rows = subjects.map(sid => {
      const lessons = CURRICULUM[sid];
      const done = lessons.filter(l => state.progress.lessons[l.id] && state.progress.lessons[l.id].done).length;
      doneTotal += done;
      allTotal += lessons.length;
      lessons.forEach(l => {
        const p = state.progress.lessons[l.id];
        if (p && p.stars) stars += p.stars;
      });
      const pct = Math.round((done / lessons.length) * 100);
      return `
        <div class="sp-row">
          <div class="sp-head">
            <strong>${SUBJECTS[sid].title}</strong>
            <span class="t-label">${faDigits(done)} از ${faDigits(lessons.length)} درس</span>
          </div>
          <div class="sp-bar ${sid === 'math' ? 'm' : sid === 'farsi' ? 'f' : 's'}" aria-hidden="true"><span style="width:${pct}%"></span></div>
        </div>`;
    }).join('');

    return `
      <div class="main-inner">
        <header class="page-head">
          <button class="back-link" data-act="nav" data-hash="#/">${icon('arrow-right')} بازگشت به خانه</button>
          <h1 class="t-display">پیشرفت من</h1>
          <p class="t-body measure">هر قدم کوچک، یک یادگیری تازه است. به کارت نگاه کن!</p>
        </header>

        <div class="stat-grid" style="margin-bottom:24px">
          <div class="stat-card">
            <span class="t-label">درس‌های تمام‌شده</span>
            <span class="t-numeral">${faDigits(doneTotal)}<span style="font-size:22px"> از ${faDigits(allTotal)}</span></span>
          </div>
          <div class="stat-card">
            <span class="t-label">ستاره‌های جمع‌شده</span>
            <span class="t-numeral">${faDigits(stars)} ★</span>
          </div>
          <div class="stat-card">
            <span class="t-label">یادداشت برای بزرگ‌ترها</span>
            <p class="t-label" style="line-height:1.9">روزی ۱۰ تا ۱۵ دقیقه تمرین کوتاه، بهتر از تمرین طولانی است.</p>
          </div>
        </div>

        <div class="subject-progress">${rows}</div>

        <div class="section">
          <div class="section-head"><h2 class="t-heading">کارنامه‌ی درس‌ها</h2></div>
          <div class="lesson-grid">
            ${[].concat(CURRICULUM.math, CURRICULUM.farsi, CURRICULUM.science).map(l => {
      const p = state.progress.lessons[l.id];
      const done = p && p.done;
      return `
              <button class="lesson-card ${done ? 'is-done' : ''}" data-act="lesson" data-lesson="${l.id}">
                <div class="lesson-meta">
                  <span class="chip ${done ? 'is-done' : ''}">${done ? icon('check') + ' تکمیل‌شده' : 'شروع‌نشده'}</span>
                </div>
                <h3>${escapeHtml(l.title)}</h3>
                <p>${escapeHtml(l.objective)}</p>
              </button>`;
    }).join('')}
          </div>
        </div>

        <footer class="foot-note">
          <span class="foot-group">
            <span>پیشرفت روی همین دستگاه ذخیره می‌شود.</span>
            ${karenCreditHTML()}
          </span>
          <button class="btn btn-quiet" data-act="adult">${icon('wrench')} ورود بزرگ‌ترها</button>
        </footer>
      </div>`;
  }

  /* ---------------------------------------------------------
     ورود بزرگ‌ترها
     --------------------------------------------------------- */
  function openAdultModal() {
    closeModal();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'modal-root';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="adult-title">
        <div class="modal-head">
          <h2 class="t-sub" id="adult-title">فضای بزرگ‌ترها</h2>
          <button class="icon-btn" data-act="modal-close" aria-label="بستن">${icon('close')}</button>
        </div>
        <p class="t-body">برای ورود، جمع زیر را حساب کنید:</p>
        <p class="t-numeral" style="text-align:center">۷ ＋ ۵ ＝ ؟</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <input id="gate-input" inputmode="numeric" placeholder="پاسخ" aria-label="پاسخ جمع"
            style="flex:1;min-width:120px;min-height:52px;border-radius:14px;border:2px solid var(--ink);padding:10px 16px;font-family:var(--font);font-size:20px;font-weight:700">
          <button class="btn btn-primary" data-act="gate-check">ورود</button>
        </div>
        <p class="t-label" id="gate-msg" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(wrap);
    const input = $('#gate-input');
    if (input) input.focus();
  }

  function openAdultDashboard() {
    const subjects = ['math', 'farsi', 'science'];
    const summary = subjects.map(sid => {
      const lessons = CURRICULUM[sid];
      const done = lessons.filter(l => state.progress.lessons[l.id] && state.progress.lessons[l.id].done).length;
      return `<div class="sp-row">
        <div class="sp-head"><strong>${SUBJECTS[sid].title}</strong><span class="t-label">${faDigits(done)} / ${faDigits(lessons.length)}</span></div>
      </div>`;
    }).join('');
    const wrap = $('#modal-root');
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="adult-title">
        <div class="modal-head">
          <h2 class="t-sub" id="adult-title">گزارش یادگیری</h2>
          <button class="icon-btn" data-act="modal-close" aria-label="بستن">${icon('close')}</button>
        </div>
        <div class="subject-progress">${summary}</div>
        <p class="t-body">پیشنهادها:</p>
        <ul style="display:flex;flex-direction:column;gap:8px">
          <li class="t-label" style="line-height:1.9">• هر روز یک درس کوتاه را با کودک مرور کنید.</li>
          <li class="t-label" style="line-height:1.9">• از او بخواهید صدای حروف و اعداد را بلند بگوید.</li>
          <li class="t-label" style="line-height:1.9">• پاسخ اشتباه را با مهربانی به فرصت یادگیری تبدیل کنید.</li>
        </ul>
        <div class="stage-actions">
          <button class="btn btn-secondary" data-act="nav" data-hash="#/progress">صفحه‌ی پیشرفت</button>
          <button class="btn btn-secondary" data-act="install-open">نصب برنامه روی دستگاه</button>
          <button class="btn btn-quiet" data-act="reset-progress">پاک کردن پیشرفت</button>
        </div>
      </div>`;
  }

  function closeModal() {
    const m = $('#modal-root');
    if (m) m.remove();
    const sheet = $('#sheet-root');
    if (sheet) sheet.remove();
  }

  /* ---------------------------------------------------------
     شیت موبایل
     --------------------------------------------------------- */
  function openSheet() {
    closeModal();
    const wrap = document.createElement('div');
    wrap.id = 'sheet-root';
    wrap.innerHTML = `
      <div class="sheet-backdrop" data-act="modal-close"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-label="منو">
        ${NAV.map(n => `
          <button class="rail-link" data-act="nav" data-hash="${n.hash}">
            ${icon(n.icon)}<span>${n.label}</span>
          </button>`).join('')}
        <button class="adult-link" data-act="adult">${icon('wrench')}<span>ورود بزرگ‌ترها</span></button>
      </div>`;
    document.body.appendChild(wrap);
  }

  /* ---------------------------------------------------------
     رندر اصلی
     --------------------------------------------------------- */
  function render() {
    const app = $('#app');
    const r = state.route;
    let activeNav = 'home';
    let html = '';

    if (r.view === 'home') {
      html = renderHome();
    } else if (r.view === 'lessons') {
      activeNav = 'lessons';
      html = renderLessonsIndex(r.subject);
    } else if (r.view === 'lesson') {
      activeNav = 'lessons';
      html = renderLesson(r.lessonId);
    } else if (r.view === 'games') {
      activeNav = 'games';
      html = renderGames();
    } else if (r.view === 'game') {
      activeNav = 'games';
      html = renderGame(r.gameId);
    } else if (r.view === 'progress') {
      activeNav = 'progress';
      html = renderProgress();
    } else if (r.view === 'cinema') {
      html = renderCinema();
    }

    app.innerHTML = `
      <header class="topbar">${topbarHTML()}</header>
      <div class="shell">
        <main class="main" id="main">${html}</main>
        <aside class="rail" aria-label="ناوبری کناری">${railHTML(activeNav)}</aside>
      </div>`;

    afterRender();
  }

  /* ---------------------------------------------------------
     خط تقدیم — زیر فوتر همه‌ی صفحات
     --------------------------------------------------------- */
  function dedicationHTML() {
    return `
      <div class="dedication-line" role="note">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="#FFD45A" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/></svg>
        تقدیم به دبستان شهید قاسمی مهرگان
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}" fill="#FFD45A" stroke="#17213A" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </div>`;
  }

  function afterRender() {
    /* خط تقدیم زیر هر فوتر */
    $$('.foot-note').forEach(f => {
      const nxt = f.nextElementSibling;
      if (!nxt || !nxt.classList.contains('dedication-line')) {
        f.insertAdjacentHTML('afterend', dedicationHTML());
      }
    });
    /* انیمیشن ورود */
    const reveals = $$('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      reveals.forEach(el => io.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('is-in'));
    }

    /* لحظه‌ی امضا: کشیدن شاخه‌های درخت + پرواز تکه‌های ستاره */
    const art = $('#stage-art');
    if (art) {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        requestAnimationFrame(() => {
          art.classList.add('is-drawing', 'is-flying');
        });
      } else {
        art.classList.add('is-drawing');
      }
    }
  }

  /* ---------------------------------------------------------
     PWA: ثبت Service Worker + پیشنهاد نصب
     --------------------------------------------------------- */
  const INSTALL_KEY = 'madrese-install-prompt-v1';
  let deferredInstall = null;
  let installOfferTimer = null;

  function isStandalone() {
    try {
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
    } catch (e) { return false; }
  }

  function isIOS() {
    const ua = navigator.userAgent || '';
    return /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
  }

  function installDismissedRecently() {
    try {
      const ts = Number(localStorage.getItem(INSTALL_KEY) || 0);
      return !!ts && (Date.now() - ts) < 7 * 24 * 3600 * 1000;
    } catch (e) { return false; }
  }

  function rememberInstallDismiss() {
    try { localStorage.setItem(INSTALL_KEY, String(Date.now())); } catch (e) {}
  }

  window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    deferredInstall = ev;
    /* اگر مودال نصب الان باز است، نسخه‌ی دکمه‌دار را جایگزین کن */
    const open = document.getElementById('modal-root');
    if (open && open.querySelector('#install-title')) openInstallModal();
    scheduleInstallOffer();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    closeModal();
  });

  function scheduleInstallOffer() {
    if (isStandalone() || installDismissedRecently()) return;
    if (installOfferTimer) return;
    installOfferTimer = setTimeout(() => {
      installOfferTimer = null;
      if (document.getElementById('modal-root')) return;
      openInstallModal();
    }, 2500);
  }

  function openInstallModal() {
    closeModal();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'modal-root';
    let title, body;
    if (isStandalone()) {
      title = 'برنامه نصب شده است';
      body = `
        <p class="t-body">مدرسه‌ی من روی همین دستگاه نصب است و از صفحه‌ی اصلی باز می‌شود.</p>
        <div class="stage-actions"><button class="btn btn-primary" data-act="modal-close">باشه</button></div>`;
    } else if (isIOS()) {
      title = 'مدرسه‌ی من را روی آیفون نصب کن';
      body = `
        <p class="t-body">برای نصب روی آیفون یا آیپد:</p>
        <ul style="display:flex;flex-direction:column;gap:8px;margin:12px 0">
          <li class="t-label" style="line-height:2">۱. روی دکمه‌ی <strong>اشتراک‌گذاری</strong> (مربع با فلش) بزن.</li>
          <li class="t-label" style="line-height:2">۲. گزینه‌ی <strong>Add to Home Screen</strong> را انتخاب کن.</li>
          <li class="t-label" style="line-height:2">۳. دکمه‌ی <strong>Add</strong> را بزن.</li>
        </ul>
        <div class="stage-actions"><button class="btn btn-primary" data-act="install-dismiss">متوجه شدم</button></div>`;
    } else if (deferredInstall) {
      title = 'مدرسه‌ی من را نصب کن';
      body = `
        <p class="t-body">با نصب برنامه، از صفحه‌ی اصلی گوشی یا کامپیوتر بازش کن و بدون مرورگر ادامه بده — حتی آفلاین!</p>
        <div class="stage-actions">
          <button class="btn btn-primary" data-act="install-now">${icon('play')} نصب برنامه</button>
          <button class="btn btn-quiet" data-act="install-dismiss">بعداً</button>
        </div>`;
    } else {
      title = 'مدرسه‌ی من را نصب کن';
      body = `
        <p class="t-body">برای نصب «مدرسه‌ی من»، در مرورگر خود گزینه‌ی «نصب برنامه» یا «افزودن به صفحه‌ی اصلی» را از منوی مرورگر انتخاب کن.</p>
        <div class="stage-actions"><button class="btn btn-primary" data-act="install-dismiss">باشه</button></div>`;
    }
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <div class="modal-head">
          <h2 class="t-sub" id="install-title">${title}</h2>
          <button class="icon-btn" data-act="modal-close" aria-label="بستن">${icon('close')}</button>
        </div>
        ${body}
      </div>`;
    document.body.appendChild(wrap);
  }

  function showInstallDone() {
    closeModal();
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'modal-root';
    wrap.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="install-title">
        <div class="modal-head">
          <h2 class="t-sub" id="install-title">نصب شد!</h2>
          <button class="icon-btn" data-act="modal-close" aria-label="بستن">${icon('close')}</button>
        </div>
        <p class="t-body">آفرین! «مدرسه‌ی من» به صفحه‌ی اصلی دستگاه اضافه شد. ${icon('star-yellow')}</p>
        <div class="stage-actions"><button class="btn btn-primary" data-act="modal-close">عالی</button></div>
      </div>`;
    document.body.appendChild(wrap);
  }

  async function runInstallNow() {
    if (!deferredInstall) { openInstallModal(); return; }
    const ev = deferredInstall;
    deferredInstall = null;
    try {
      ev.prompt();
      const choice = await ev.userChoice;
      if (choice && choice.outcome === 'accepted') {
        showInstallDone();
      } else {
        rememberInstallDismiss();
        closeModal();
      }
    } catch (e) {
      openInstallModal();
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
  window.addEventListener('load', () => {
    scheduleInstallOffer();
  });

  /* ---------------------------------------------------------
     رویدادها (event delegation)
     --------------------------------------------------------- */
  document.addEventListener('click', (ev) => {
    const t = ev.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act;

    switch (act) {
      case 'nav':
        closeModal();
        go(t.dataset.hash);
        break;
      case 'subject':
        closeModal();
        go('#/lessons/' + t.dataset.subject);
        break;
      case 'lesson': {
        closeModal();
        state.session = null;
        state.progress.last = t.dataset.lesson;
        saveProgress();
        go('#/lesson/' + t.dataset.lesson);
        break;
      }
      case 'game':
        state.game = null;
        go('#/game/' + t.dataset.game);
        break;
      case 'game-restart':
        state.game = null;
        render();
        break;
      case 'step': {
        const i = Number(t.dataset.step);
        if (state.session) {
          state.session.stepIndex = i;
          render();
        }
        break;
      }
      case 'step-next':
        if (state.route.view === 'game') {
          if (state.game) {
            state.game.round += 1;
            render();
          }
        } else if (state.session) {
          const found = findLesson(state.session.lessonId);
          if (found) {
            const steps = buildSteps(found.lesson);
            if (state.session.stepIndex < steps.length - 1) {
              state.session.stepIndex += 1;
            }
            /* اگر به جمع‌بندی رسیدیم، درس را کامل کن */
            if (state.session.stepIndex === steps.length - 1) {
              markLessonDone(found.lesson.id, state.session.stars, found.lesson.activities.length);
            }
            render();
          }
        }
        break;
      case 'restart':
        state.session = null;
        render();
        break;
      case 'answer':
        handleAnswer(t.dataset.value, t);
        break;
      case 'retry':
        render();
        break;
      case 'speak': {
        const ok = playSound(t.dataset.text || '', t.dataset.audio || '');
        if (!ok) {
          const label = t.querySelector('span');
          if (label) {
            const old = label.textContent;
            label.textContent = 'صدا در این مرورگر آماده نیست';
            setTimeout(() => { label.textContent = old; }, 2200);
          }
        }
        break;
      }
      case 'adult':
        openAdultModal();
        break;
      case 'video':
        openVideoModal(t.dataset.video);
        break;
      case 'install-open':
        openInstallModal();
        break;
      case 'install-now':
        runInstallNow();
        break;
      case 'install-dismiss':
        rememberInstallDismiss();
        closeModal();
        break;
      case 'sheet-open':
        openSheet();
        break;
      case 'modal-close':
        closeModal();
        break;
      case 'gate-check': {
        const input = $('#gate-input');
        const msg = $('#gate-msg');
        const val = (input && input.value || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
        if (Number(val) === 12) {
          openAdultDashboard();
        } else if (msg) {
          msg.textContent = 'پاسخ درست نیست. جمع ۷ و ۵ را دوباره حساب کنید.';
        }
        break;
      }
      case 'reset-progress': {
        if (window.confirm('همه‌ی پیشرفت‌ها پاک شود؟')) {
          state.progress = { lessons: {}, games: {}, last: null };
          saveProgress();
          closeModal();
          go('#/');
          render();
        }
        break;
      }
      default:
        break;
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeModal();
    if (ev.key === 'Enter' && ev.target && ev.target.id === 'gate-input') {
      const btn = document.querySelector('[data-act="gate-check"]');
      if (btn) btn.click();
    }
  });

  /* ---------------------------------------------------------
     راه‌اندازی
     --------------------------------------------------------- */
  function init() {
    document.body.insertAdjacentHTML('afterbegin', sprite());
    state.route = parseHash();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
