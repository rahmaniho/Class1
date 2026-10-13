/* مدرسه‌ی من — سرفصل‌ها و محتوای آموزشی پایه‌ی اول */
/* همه‌ی متن‌ها فارسی، اعداد با رقم فارسی نمایش داده می‌شوند. */

const TASHKEEL_FA = 'الفبا از «هـ» تا «ی»';

/** تبدیل ارقام انگلیسی به فارسی */
function faDigits(value) {
  return String(value).replace(/[0-9]/g, function (d) {
    return '۰۱۲۳۴۵۶۷۸۹'[Number(d)];
  });
}

/* ---------------------------------------------------------------- */
/* موضوع‌ها                                                          */
/* ---------------------------------------------------------------- */

const SUBJECTS = {
  math: {
    id: 'math',
    title: 'ریاضی',
    tagline: 'شمارش، جمع و تفریق، شکل‌ها و الگوها',
    fieldClass: 'field-math',
    tone: 'blue',
    art: 'tenframe',
    intro: 'با اشیای آشنا شمارش می‌کنیم، جمع و تفریق می‌آموزیم و با شکل‌ها و الگوها بازی می‌کنیم.'
  },
  farsi: {
    id: 'farsi',
    title: 'فارسی',
    tagline: 'شنیدن، خواندن و درک کلمه‌ها',
    fieldClass: 'field-farsi',
    tone: 'apricot',
    art: 'lettercard',
    intro: 'حروف را می‌شنویم و می‌خوانیم، کلمه می‌سازیم و با داستان‌های کوتاه همراه می‌شویم.'
  },
  science: {
    id: 'science',
    title: 'علوم',
    tagline: 'کشف جانداران، طبیعت و پدیده‌ها',
    fieldClass: 'field-science',
    tone: 'mint',
    art: 'beanjar',
    intro: 'با چشم، گوش و دست کشف می‌کنیم: گیاهان، جانوران، فصل‌ها، نور، صدا و آب.'
  }
};

/* ---------------------------------------------------------------- */
/* ریاضی                                                             */
/* ---------------------------------------------------------------- */

const MATH_LESSONS = [
  {
    id: 'm1',
    title: 'شمارش اشیا تا ۵',
    objective: 'با شمارش اشیا تا ۵ آشنا می‌شویم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'برای شمارش، هر شیء را یک بار می‌شماریم: یک، دو، سه…' },
      { kind: 'objects', object: 'apple', count: 3, caption: 'سه سیب داریم: ۱، ۲، ۳' },
      { kind: 'objects', object: 'star', count: 5, caption: 'پنج ستاره: ۱، ۲، ۳، ۴، ۵' }
    ],
    activities: [
      { type: 'count', object: 'apple', count: 2, max: 5, prompt: 'این‌ها چند تا هستند؟' },
      { type: 'count', object: 'star', count: 4, max: 5, prompt: 'چند ستاره می‌بینی؟' },
      { type: 'count', object: 'fish', count: 5, max: 5, prompt: 'ماهی‌ها را بشمار.' }
    ]
  },
  {
    id: 'm2',
    title: 'اعداد ۱ تا ۱۰',
    objective: 'شکل عددی و مقدار اعداد ۱ تا ۱۰ را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'هر عدد یک نشانه دارد و یک مقدار. عدد ۴ یعنی چهار تا.' },
      { kind: 'numline', from: 1, to: 10, caption: 'ردیف اعداد از ۱ تا ۱۰' },
      { kind: 'objects', object: 'ball', count: 4, caption: 'عدد ۴ یعنی چهار توپ' }
    ],
    activities: [
      { type: 'count', object: 'ball', count: 6, max: 10, prompt: 'چند توپ داریم؟' },
      { type: 'match', prompt: 'کدام عدد «هفت» است؟', answer: '7', options: ['5', '7', '9', '3'] },
      { type: 'count', object: 'duck', count: 8, max: 10, prompt: 'اردک‌ها را بشمار.' }
    ]
  },
  {
    id: 'm3',
    title: 'ده‌چارچوب و شمارش تا ۱۰',
    objective: 'با ده‌چارچوب، مقدار اعداد را تا ۱۰ می‌بینیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'ده‌چارچوب دو ردیف پنج‌تایی دارد. هر خانه یک شیء جا می‌گیرد.' },
      { kind: 'tenframe', value: 7, caption: 'هفت خانه پر شده است' }
    ],
    activities: [
      { type: 'tenframe', value: 6, max: 10, prompt: 'چند خانه پر است؟' },
      { type: 'tenframe', value: 9, max: 10, prompt: 'چند نقطه می‌بینی؟' },
      { type: 'count', object: 'leaf', count: 10, max: 10, prompt: 'برگ‌ها را بشمار.' }
    ]
  },
  {
    id: 'm4',
    title: 'بیشتر، کمتر، برابر',
    objective: 'مقدار دو گروه را مقایسه می‌کنیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'وقتی یک گروه بیشتر باشد، نشان «بیشتر» (بزرگ‌تر) می‌گذاریم.' },
      { kind: 'compare', left: 4, right: 2, caption: 'چهار سیب از دو سیب بیشتر است' }
    ],
    activities: [
      { type: 'compareChoose', left: 5, right: 3, prompt: 'کدام گروه بیشتر است؟', answer: 'left' },
      { type: 'compareChoose', left: 2, right: 6, prompt: 'کدام گروه کمتر است؟', answer: 'right' },
      { type: 'symbol', left: 7, right: 7, prompt: 'کدام نشانه درست است؟', answer: '=' }
    ]
  },
  {
    id: 'm5',
    title: 'جمع تا ۱۰',
    objective: 'جمع دو عدد را تا ۱۰ با شیء و عدد می‌آموزیم.',
    minutes: 12,
    teach: [
      { kind: 'text', text: 'جمع یعنی کنار هم گذاشتن. دو سیب و یک سیب می‌شود سه سیب.' },
      { kind: 'equation', a: 3, op: '+', b: 2, caption: 'سه به‌علاوه‌ی دو می‌شود پنج' }
    ],
    activities: [
      { type: 'math', a: 2, op: '+', b: 3, max: 10, prompt: 'چند می‌شود؟' },
      { type: 'math', a: 4, op: '+', b: 4, max: 10, prompt: 'جمع کن.' },
      { type: 'math', a: 6, op: '+', b: 1, max: 10, prompt: 'جواب را پیدا کن.' }
    ]
  },
  {
    id: 'm6',
    title: 'تفریق تا ۱۰',
    objective: 'تفریق دو عدد را تا ۱۰ با شیء و عدد می‌آموزیم.',
    minutes: 12,
    teach: [
      { kind: 'text', text: 'تفریق یعنی برداشتن. پنج توپ، دو تا کم شود، سه توپ می‌ماند.' },
      { kind: 'equation', a: 5, op: '-', b: 2, caption: 'پنج منهای دو می‌شود سه' }
    ],
    activities: [
      { type: 'math', a: 5, op: '-', b: 2, max: 10, prompt: 'چند می‌ماند؟' },
      { type: 'math', a: 9, op: '-', b: 4, max: 10, prompt: 'تفریق کن.' },
      { type: 'math', a: 7, op: '-', b: 7, max: 10, prompt: 'جواب را پیدا کن.' }
    ]
  },
  {
    id: 'm7',
    title: 'اعداد ۱۱ تا ۲۰ و ده‌ها و یکان‌ها',
    objective: 'ساخت اعداد ۱۱ تا ۲۰ را با ده‌ها و یکان‌ها می‌فهمیم.',
    minutes: 12,
    teach: [
      { kind: 'text', text: 'عدد ۱۴ یعنی یک ده و چهار یکان؛ یعنی ۱۰ + ۴.' },
      { kind: 'placevalue', value: 14, caption: 'یک ده و چهار یکان' },
      { kind: 'numline', from: 11, to: 20, caption: 'ردیف اعداد از ۱۱ تا ۲۰' }
    ],
    activities: [
      { type: 'placeChoose', value: 16, prompt: 'عدد ۱۶ چند ده و چند یکان دارد؟', answer: 'یک ده و شش یکان', options: ['یک ده و شش یکان', 'شش ده و یک یکان', 'دو ده و چهار یکان', 'یک ده و یک یکان'] },
      { type: 'count', object: 'ball', count: 13, max: 20, prompt: 'توپ‌ها را بشمار.' },
      { type: 'count', object: 'apple', count: 18, max: 20, prompt: 'چند سیب داریم؟' }
    ]
  },
  {
    id: 'm8',
    title: 'جمع و تفریق تا ۲۰',
    objective: 'جمع و تفریق ساده را تا ۲۰ انجام می‌دهیم.',
    minutes: 12,
    teach: [
      { kind: 'text', text: 'برای جمع تا ۲۰ می‌توانیم از ده‌چارچوب دوتایی کمک بگیریم.' },
      { kind: 'equation', a: 12, op: '+', b: 5, caption: 'دوازده به‌علاوه‌ی پنج می‌شود هفده' }
    ],
    activities: [
      { type: 'math', a: 11, op: '+', b: 6, max: 20, prompt: 'چند می‌شود؟' },
      { type: 'math', a: 18, op: '-', b: 5, max: 20, prompt: 'چند می‌ماند؟' },
      { type: 'math', a: 14, op: '+', b: 4, max: 20, prompt: 'جمع کن.' }
    ]
  },
  {
    id: 'm9',
    title: 'شکل‌های هندسی',
    objective: 'دایره، مربع، مثلث و مستطیل را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'هر شکل پهلو و گوشه دارد. مربع چهار پهلوی برابر دارد.' },
      { kind: 'shapes', caption: 'دایره، مربع، مثلث، مستطیل' }
    ],
    activities: [
      { type: 'shape', prompt: 'کدام شکل «مثلث» است؟', answer: 'triangle', options: ['circle', 'square', 'triangle', 'rectangle'] },
      { type: 'shape', prompt: 'کدام شکل «دایره» است؟', answer: 'circle', options: ['triangle', 'circle', 'rectangle', 'square'] },
      { type: 'choose', prompt: 'پنجره‌ی کلاس بیشتر به کدام شکل شبیه است؟', answer: 'مربع', options: ['مربع', 'دایره', 'مثلث', 'ستاره'] }
    ]
  },
  {
    id: 'm10',
    title: 'الگوها و ترتیب‌ها',
    objective: 'الگوی شکل‌ها را پیدا می‌کنیم و ادامه می‌دهیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'الگو یعنی ترتیب تکرارشونده. دایره، مربع، دایره، مربع…' },
      { kind: 'pattern', seq: ['circle', 'square', 'circle', 'square', 'circle', 'unknown'], caption: 'شکل بعدی چیست؟' }
    ],
    activities: [
      { type: 'pattern', seq: ['circle', 'square', 'circle', 'square', 'unknown'], prompt: 'شکل بعدی الگو کدام است؟', answer: 'circle' },
      { type: 'pattern', seq: ['triangle', 'star', 'triangle', 'star', 'triangle', 'unknown'], prompt: 'الگو را کامل کن.', answer: 'star' },
      { type: 'pattern', seq: ['circle', 'circle', 'square', 'circle', 'circle', 'unknown'], prompt: 'شکل بعدی کدام است؟', answer: 'square' }
    ]
  },
  {
    id: 'm11',
    title: 'ساعت و زمان',
    objective: 'ساعت کامل و ترتیب کارهای روزانه را می‌شناسیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'وقتی عقربه‌ی کوتاه روی ۳ و عقربه‌ی بلند روی ۱۲ است، ساعت ۳ است.' },
      { kind: 'clock', hour: 3, caption: 'ساعت سه‌ی کامل' }
    ],
    activities: [
      { type: 'clock', hour: 2, prompt: 'ساعت چند است؟', options: ['۲', '۴', '۶', '۱۲'], answer: '۲' },
      { type: 'choose', prompt: 'صبحانه را معمولاً چه زمانی می‌خوریم؟', answer: 'صبح', options: ['صبح', 'نصف‌شب', 'آخر شب', 'هیچ‌وقت'] },
      { type: 'clock', hour: 8, prompt: 'ساعت را بخوان.', options: ['۸', '۵', '۷', '۹'], answer: '۸' }
    ]
  },
  {
    id: 'm12',
    title: 'پول و مبادله',
    objective: 'سکه و اسکناس را می‌شناسیم و خرید ساده انجام می‌دهیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'برای خرید از پول استفاده می‌کنیم. قیمت هر چیز را می‌پرسیم.' },
      { kind: 'objects', object: 'coin', count: 3, caption: 'سه سکه' }
    ],
    activities: [
      { type: 'choose', prompt: 'برای خرید یک مداد، به چه چیزی نیاز داریم؟', answer: 'پول', options: ['پول', 'اسباب‌بازی', 'کتاب درس', 'کلاه'] },
      { type: 'math', a: 2, op: '+', b: 1, max: 10, prompt: 'یک سکه‌ی ۲ تومانی و یک سکه‌ی ۱ تومانی می‌شود چند؟' },
      { type: 'choose', prompt: 'اگر ۵ تومان داشته باشم و ۲ تومان خرج کنم، چند می‌ماند؟', answer: '۳ تومان', options: ['۳ تومان', '۵ تومان', '۷ تومان', '۱ تومان'] }
    ]
  }
];

/* ---------------------------------------------------------------- */
/* فارسی                                                             */
/* ---------------------------------------------------------------- */

function letterLesson(id, letters, words, extra) {
  return Object.assign({
    id: id,
    kind: 'letters',
    letters: letters,
    words: words,
    minutes: 8
  }, extra || {});
}

const FARSI_LESSONS = [
  {
    id: 'f0',
    title: 'مرور حروف «آ ب پ ت»',
    objective: 'حروف «آ ب پ ت» را می‌خوانیم و صدای آن‌ها را تشخیص می‌دهیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'هر حرف یک شکل و یک صدا دارد. «ب» صدای «ب» می‌دهد مثل «بابا».' },
      { kind: 'letters', letters: ['آ', 'ب', 'پ', 'ت'], words: [['آ', 'آب'], ['ب', 'برف'], ['پ', 'پرواز'], ['ت', 'توپ']] }
    ],
    activities: [
      { type: 'letter', letter: 'پ', options: ['ت', 'پ', 'ب', 'آ'], prompt: 'کدام حرف «پ» است؟' },
      { type: 'sound', word: 'برف', first: 'ب', options: ['پ', 'ت', 'ب', 'ث'], prompt: 'کلمه‌ی «برف» با کدام حرف شروع می‌شود؟' },
      { type: 'letter', letter: 'ت', options: ['ث', 'ب', 'ت', 'پ'], prompt: 'کدام حرف «ت» است؟' }
    ]
  },
  letterLesson('f1', ['ث'], [['ث', 'ثوب'], ['ث', 'ثعلب']], {
    title: 'حرف «ث»',
    objective: 'حرف «ث» را می‌شناسیم و در کلمه پیدا می‌کنیم.',
    teach: [
      { kind: 'text', text: 'حرف «ث» صدای «س» می‌دهد و سه نقطه بالایش دارد.' },
      { kind: 'letters', letters: ['ث'], words: [['ث', 'ثوب'], ['ث', 'اثر']] }
    ],
    activities: [
      { type: 'letter', letter: 'ث', options: ['ت', 'ج', 'ث', 'ب'], prompt: 'کدام حرف «ث» است؟' },
      { type: 'sound', word: 'ثوب', first: 'ث', options: ['ت', 'ث', 'س', 'ج'], prompt: 'کلمه‌ی «ثوب» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f2', ['ج', 'چ'], [['ج', 'جوجه'], ['چ', 'چتر']], {
    title: 'حروف «ج» و «چ»',
    objective: 'حروف «ج» و «چ» را می‌خوانیم و از هم تشخیص می‌دهیم.',
    teach: [
      { kind: 'text', text: '«ج» صدای ج می‌دهد مثل «جوجه». «چ» صدای چ دارد مثل «چتر».' },
      { kind: 'letters', letters: ['ج', 'چ'], words: [['ج', 'جوجه'], ['چ', 'چتر'], ['ج', 'جعبه'], ['چ', 'چرخ']] }
    ],
    activities: [
      { type: 'letter', letter: 'چ', options: ['ج', 'چ', 'ح', 'خ'], prompt: 'کدام حرف «چ» است؟' },
      { type: 'sound', word: 'چتر', first: 'چ', options: ['ج', 'چ', 'خ', 'د'], prompt: 'کلمه‌ی «چتر» با کدام حرف شروع می‌شود؟' },
      { type: 'sound', word: 'جوجه', first: 'ج', options: ['چ', 'ح', 'ج', 'خ'], prompt: 'کلمه‌ی «جوجه» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f3', ['ح', 'خ'], [['ح', 'حلزون'], ['خ', 'خورشید']], {
    title: 'حروف «ح» و «خ»',
    objective: 'حروف «ح» و «خ» را می‌شناسیم.',
    teach: [
      { kind: 'text', text: '«ح» صدای نرم «ح» دارد مثل «حلزون». «خ» صدای «خ» دارد مثل «خورشید».' },
      { kind: 'letters', letters: ['ح', 'خ'], words: [['ح', 'حلزون'], ['خ', 'خورشید'], ['ح', 'حبه'], ['خ', 'خانه']] }
    ],
    activities: [
      { type: 'letter', letter: 'خ', options: ['ح', 'ج', 'خ', 'د'], prompt: 'کدام حرف «خ» است؟' },
      { type: 'sound', word: 'خورشید', first: 'خ', options: ['ح', 'خ', 'ه', 'ج'], prompt: 'کلمه‌ی «خورشید» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f4', ['د', 'ذ'], [['د', 'درخت'], ['ذ', 'ذره']], {
    title: 'حروف «د» و «ذ»',
    objective: 'حروف «د» و «ذ» را می‌خوانیم.',
    teach: [
      { kind: 'text', text: '«د» مثل «درخت». «ذ» یک نقطه بالایش دارد مثل «ذره».' },
      { kind: 'letters', letters: ['د', 'ذ'], words: [['د', 'درخت'], ['ذ', 'ذره'], ['د', 'دست'], ['ذ', 'بذر']] }
    ],
    activities: [
      { type: 'letter', letter: 'د', options: ['ذ', 'ر', 'د', 'ز'], prompt: 'کدام حرف «د» است؟' },
      { type: 'sound', word: 'درخت', first: 'د', options: ['ر', 'ذ', 'د', 'ز'], prompt: 'کلمه‌ی «درخت» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f5', ['ر', 'ز'], [['ر', 'رنگین‌کمان'], ['ز', 'زنبور']], {
    title: 'حروف «ر» و «ز»',
    objective: 'حروف «ر» و «ز» را تشخیص می‌دهیم.',
    teach: [
      { kind: 'text', text: '«ر» مثل «رنگین‌کمان». «ز» یک نقطه دارد مثل «زنبور».' },
      { kind: 'letters', letters: ['ر', 'ز'], words: [['ر', 'رنگین‌کمان'], ['ز', 'زنبور'], ['ر', 'روز'], ['ز', 'زیر']] }
    ],
    activities: [
      { type: 'letter', letter: 'ز', options: ['ر', 'ذ', 'ز', 'ژ'], prompt: 'کدام حرف «ز» است؟' },
      { type: 'sound', word: 'زنبور', first: 'ز', options: ['ر', 'ز', 'س', 'ذ'], prompt: 'کلمه‌ی «زنبور» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  {
    id: 'f6',
    title: 'خواندن «گنجشک بازیگوش»',
    objective: 'متن کوتاه را می‌خوانیم و معنی آن را می‌فهمیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'اول کلمه‌ها را آرام می‌خوانیم، بعد جمله را. معنی هر جمله را در ذهنمان تصویر می‌کنیم.' },
      { kind: 'story', title: 'گنجشک بازیگوش', text: 'گنجشک کوچک روی شاخه‌ی درخت نشست. او آواز خواند و پرید. باد آمد و برگ‌ها را تکان داد. گنجشک خندید و دوباره پرید.' }
    ],
    activities: [
      { type: 'read', text: 'گنجشک کوچک روی شاخه‌ی درخت نشست. او آواز خواند و پرید.', question: 'گنجشک کجا نشست؟', answer: 'روی شاخه‌ی درخت', options: ['روی شاخه‌ی درخت', 'زیر آب', 'داخل جعبه', 'روی سقف ماشین'] },
      { type: 'choose', prompt: 'گنجشک چه کاری انجام داد؟', answer: 'آواز خواند', options: ['آواز خواند', 'غذا پخت', 'کتاب خواند', 'لباس شست'] }
    ]
  },
  letterLesson('f7', ['س', 'ش', 'ص', 'ض'], [['س', 'سیب'], ['ش', 'شمع'], ['ص', 'صدا'], ['ض', 'باغ']], {
    title: 'حروف «س ش ص ض»',
    objective: 'حروف «س، ش، ص، ض» را می‌خوانیم.',
    teach: [
      { kind: 'text', text: 'این چهار حرف صدای نزدیک به هم دارند و با نقطه از هم جدا می‌شوند.' },
      { kind: 'letters', letters: ['س', 'ش', 'ص', 'ض'], words: [['س', 'سیب'], ['ش', 'شمع'], ['ص', 'صدا'], ['ض', 'باغ']] }
    ],
    activities: [
      { type: 'letter', letter: 'ش', options: ['س', 'ش', 'ص', 'ث'], prompt: 'کدام حرف «ش» است؟' },
      { type: 'sound', word: 'سیب', first: 'س', options: ['ش', 'ص', 'س', 'ث'], prompt: 'کلمه‌ی «سیب» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f8', ['ط', 'ظ', 'ع', 'غ'], [['ط', 'طوطی'], ['ظ', 'ظرف'], ['ع', 'عسل'], ['غ', 'غروب']], {
    title: 'حروف «ط ظ ع غ»',
    objective: 'حروف «ط، ظ، ع، غ» را می‌شناسیم.',
    teach: [
      { kind: 'text', text: '«ط» و «ظ» از یک خانواده‌اند. «ع» و «غ» هم شکل‌شان شبیه است.' },
      { kind: 'letters', letters: ['ط', 'ظ', 'ع', 'غ'], words: [['ط', 'طوطی'], ['ظ', 'ظرف'], ['ع', 'عسل'], ['غ', 'غروب']] }
    ],
    activities: [
      { type: 'letter', letter: 'ع', options: ['غ', 'ع', 'ف', 'ط'], prompt: 'کدام حرف «ع» است؟' },
      { type: 'sound', word: 'عسل', first: 'ع', options: ['غ', 'ع', 'ف', 'ظ'], prompt: 'کلمه‌ی «عسل» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  {
    id: 'f9',
    title: 'خواندن «من و خانواده‌ام»',
    objective: 'درباره‌ی خانواده می‌خوانیم و درک می‌کنیم.',
    minutes: 10,
    teach: [
      { kind: 'story', title: 'من و خانواده‌ام', text: 'نام من آراد است. من با پدر و مادر و خواهرم زندگی می‌کنم. ما همدیگر را دوست داریم. شب‌ها با هم کتاب می‌خوانیم.' },
      { kind: 'text', text: 'وقتی می‌خوانیم، به نام‌ها و کارها دقت می‌کنیم.' }
    ],
    activities: [
      { type: 'read', text: 'نام من آراد است. من با پدر و مادر و خواهرم زندگی می‌کنم.', question: 'آراد با چه کسانی زندگی می‌کند؟', answer: 'پدر، مادر و خواهرش', options: ['پدر، مادر و خواهرش', 'فقط با مادربزرگ', 'با همسایه‌ها', 'تنها'] },
      { type: 'choose', prompt: 'خانواده‌ی آراد شب‌ها چه می‌کند؟', answer: 'کتاب می‌خواند', options: ['کتاب می‌خواند', 'فوتبال بازی می‌کند', 'خواب است', 'آشپزی می‌کند'] }
    ]
  },
  letterLesson('f10', ['ف', 'ق', 'ک', 'گ'], [['ف', 'فیل'], ['ق', 'قورباغه'], ['ک', 'کتاب'], ['گ', 'گربه']], {
    title: 'حروف «ف ق ک گ»',
    objective: 'حروف «ف، ق، ک، گ» را می‌خوانیم.',
    teach: [
      { kind: 'text', text: '«ف» مثل «فیل». «ق» مثل «قورباغه». «ک» مثل «کتاب». «گ» مثل «گربه».' },
      { kind: 'letters', letters: ['ف', 'ق', 'ک', 'گ'], words: [['ف', 'فیل'], ['ق', 'قورباغه'], ['ک', 'کتاب'], ['گ', 'گربه']] }
    ],
    activities: [
      { type: 'letter', letter: 'گ', options: ['ک', 'گ', 'ق', 'ف'], prompt: 'کدام حرف «گ» است؟' },
      { type: 'sound', word: 'کتاب', first: 'ک', options: ['گ', 'ک', 'ف', 'ق'], prompt: 'کلمه‌ی «کتاب» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f11', ['ل', 'م', 'ن', 'و'], [['ل', 'لک‌لک'], ['م', 'ماهی'], ['ن', 'نان'], ['و', 'والیبال']], {
    title: 'حروف «ل م ن و»',
    objective: 'حروف «ل، م، ن، و» را می‌شناسیم.',
    teach: [
      { kind: 'text', text: 'این حروف را در کلمه‌های آشنا پیدا کن: لک‌لک، ماهی، نان، والیبال.' },
      { kind: 'letters', letters: ['ل', 'م', 'ن', 'و'], words: [['ل', 'لک‌لک'], ['م', 'ماهی'], ['ن', 'نان'], ['و', 'والیبال']] }
    ],
    activities: [
      { type: 'letter', letter: 'م', options: ['ن', 'م', 'ل', 'و'], prompt: 'کدام حرف «م» است؟' },
      { type: 'sound', word: 'ماهی', first: 'م', options: ['ن', 'م', 'ل', 'و'], prompt: 'کلمه‌ی «ماهی» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  letterLesson('f12', ['هـ', 'ی'], [['هـ', 'هندوانه'], ['ی', 'یخ']], {
    title: 'حروف «هـ» و «ی»',
    objective: 'دو حرف پایانی الفبا یعنی «هـ» و «ی» را می‌خوانیم.',
    teach: [
      { kind: 'text', text: '«هـ» صدای «ه» می‌دهد مثل «هندوانه». «ی» صدای «ی» دارد مثل «یخ».' },
      { kind: 'letters', letters: ['هـ', 'ی'], words: [['هـ', 'هندوانه'], ['ی', 'یخ'], ['هـ', 'هویج'], ['ی', 'یادگیری']] }
    ],
    activities: [
      { type: 'letter', letter: 'ی', options: ['و', 'هـ', 'ی', 'ب'], prompt: 'کدام حرف «ی» است؟' },
      { type: 'sound', word: 'هندوانه', first: 'هـ', options: ['ی', 'هـ', 'و', 'ن'], prompt: 'کلمه‌ی «هندوانه» با کدام حرف شروع می‌شود؟' }
    ]
  }),
  {
    id: 'f13',
    title: 'کلمه‌سازی و جمله‌سازی',
    objective: 'با حروف کلمه می‌سازیم و کلمه‌ها را در جمله به کار می‌بریم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'با کنار هم گذاشتن حروف کلمه ساخته می‌شود: «س + ی + ب = سیب».' },
      { kind: 'letters', letters: ['س', 'ی', 'ب'], words: [['سیب', 'سیب'], ['کتاب', 'کتاب']] }
    ],
    activities: [
      { type: 'choose', prompt: 'کدام کلمه درست است؟', answer: 'کتاب', options: ['کتاب', 'کبات', 'بتکا', 'تباک'] },
      { type: 'choose', prompt: '«من به مدرسه می‌روم.» در این جمله چند کلمه هست؟', answer: '۴ کلمه', options: ['۴ کلمه', '۲ کلمه', '۶ کلمه', '۱ کلمه'] }
    ]
  },
  {
    id: 'f14',
    title: 'خواندن «ساعت من» و «رنگین‌کمان»',
    objective: 'دو متن کوتاه را می‌خوانیم و به پرسش‌ها پاسخ می‌دهیم.',
    minutes: 12,
    teach: [
      { kind: 'story', title: 'ساعت من', text: 'ساعت من زنگ می‌زند. من از خواب بیدار می‌شوم، دست‌هایم را می‌شویم و صبحانه می‌خورم. بعد مدرسه می‌روم.' },
      { kind: 'story', title: 'رنگین‌کمان', text: 'بعد از باران، رنگین‌کمان در آسمان پیدا شد. رنگ‌هایش قرمز، نارنجی، زرد و سبز بود.' }
    ],
    activities: [
      { type: 'read', text: 'بعد از باران، رنگین‌کمان در آسمان پیدا شد.', question: 'رنگین‌کمان چه زمانی پیدا شد؟', answer: 'بعد از باران', options: ['بعد از باران', 'نصف‌شب', 'صبح زود', 'زیر درخت'] },
      { type: 'choose', prompt: 'وقتی ساعت زنگ می‌زند، چه می‌کنیم؟', answer: 'از خواب بیدار می‌شویم', options: ['از خواب بیدار می‌شویم', 'شام می‌خوریم', 'دندان‌هایمان را می‌شوییم', 'کارتون می‌بینیم'] }
    ]
  }
];

/* ---------------------------------------------------------------- */
/* علوم                                                              */
/* ---------------------------------------------------------------- */

const SCIENCE_LESSONS = [
  {
    id: 's1',
    title: 'جاندار و بی‌جان',
    objective: 'موجودات جاندار و بی‌جان را از هم تشخیص می‌دهیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'جاندارها رشد می‌کنند، غذا می‌خورند و حرکت می‌کنند. میز و صندلی جاندار نیستند.' },
      { kind: 'living', caption: 'چپ: جاندار — راست: بی‌جان' }
    ],
    activities: [
      { type: 'choose', prompt: 'کدام یک جاندار است؟', answer: 'گربه', options: ['گربه', 'میز', 'کتاب', 'ماشین'] },
      { type: 'choose', prompt: 'کدام یک بی‌جان است؟', answer: 'سنگ', options: ['درخت', 'ماهی', 'سنگ', 'پرنده'] },
      { type: 'choose', prompt: 'گیاهان برای رشد به چه چیزی نیاز دارند؟', answer: 'آب و نور', options: ['آب و نور', 'شکلات', 'اسباب‌بازی', 'کتاب'] }
    ]
  },
  {
    id: 's2',
    title: 'گیاهان و بخش‌هایشان',
    objective: 'ریشه، ساقه، برگ و گل را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'گیاه ریشه دارد که آب می‌گیرد، ساقه که آن را نگه می‌دارد، برگ و گل.' },
      { kind: 'plant', caption: 'ریشه، ساقه، برگ، گل' }
    ],
    activities: [
      { type: 'choose', prompt: 'کدام بخش گیاه آب را از خاک می‌گیرد؟', answer: 'ریشه', options: ['ریشه', 'گل', 'برگ', 'میوه'] },
      { type: 'observe', scene: 'plant', question: 'در این تصویر، گیاه چند برگ دارد؟', answer: '۴ برگ', options: ['۴ برگ', '۱ برگ', '۱۰ برگ', 'هیچ برگی'] },
      { type: 'choose', prompt: 'گل گیاه معمولاً چه رنگی می‌تواند باشد؟', answer: 'هر رنگی', options: ['هر رنگی', 'فقط سبز', 'فقط قهوه‌ای', 'فقط خاکستری'] }
    ]
  },
  {
    id: 's3',
    title: 'دانه و جوانه',
    objective: 'مراحل رشد دانه تا گیاه را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'دانه در خاک، با آب و نور جوانه می‌زند و کم‌کم گیاه می‌شود.' },
      { kind: 'beanjar', caption: 'آزمایش لوبیا در شیشه' }
    ],
    activities: [
      { type: 'choose', prompt: 'برای جوانه زدن دانه به چه چیزی نیاز داریم؟', answer: 'آب و نور', options: ['آب و نور', 'یخ', 'نمک', 'کاغذ'] },
      { type: 'choose', prompt: 'اول چه چیزی از دانه بیرون می‌آید؟', answer: 'ریشه', options: ['ریشه', 'گل', 'میوه', 'برگ خشک'] },
      { type: 'observe', scene: 'seed', question: 'کدام مرحله بعد از «دانه» است؟', answer: 'جوانه', options: ['جوانه', 'درخت بزرگ', 'سنگ', 'ابر'] }
    ]
  },
  {
    id: 's4',
    title: 'جانوران و خانه‌هایشان',
    objective: 'محل زندگی جانوران را می‌شناسیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'هر جانوری خانه‌ای دارد: پرنده در لانه، ماهی در آب، خرگوش در سوراخ.' },
      { kind: 'animals', caption: 'پرنده، ماهی، خرگوش' }
    ],
    activities: [
      { type: 'choose', prompt: 'ماهی کجا زندگی می‌کند؟', answer: 'در آب', options: ['در آب', 'روی درخت', 'در آسمان', 'در بیابان'] },
      { type: 'choose', prompt: 'پرنده لانه‌ی خود را کجا می‌سازد؟', answer: 'روی درخت', options: ['روی درخت', 'زیر آب', 'داخل یخچال', 'روی ماشین'] },
      { type: 'choose', prompt: 'کدام جانور در سوراخ زندگی می‌کند؟', answer: 'خرگوش', options: ['خرگوش', 'دلفین', 'عقاب', 'نهنگ'] }
    ]
  },
  {
    id: 's5',
    title: 'غذای جانوران',
    objective: 'جانوران علف‌خوار، گوشت‌خوار و همه‌چیزخوار را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'گاو علف می‌خورد (علف‌خوار)، شیر گوشت می‌خورد (گوشت‌خوار) و خرس هر دو را (همه‌چیزخوار).' },
      { kind: 'animals', caption: 'هر جانور غذای خودش را دارد' }
    ],
    activities: [
      { type: 'choose', prompt: 'گاو چه می‌خورد؟', answer: 'علف', options: ['علف', 'گوشت', 'ماهی', 'سنگ'] },
      { type: 'choose', prompt: 'شیر چه می‌خورد؟', answer: 'گوشت', options: ['گوشت', 'علف', 'نان', 'برگ'] },
      { type: 'choose', prompt: 'خرس چه نوع جانوری است؟', answer: 'همه‌چیزخوار', options: ['همه‌چیزخوار', 'فقط علف‌خوار', 'فقط گوشت‌خوار', 'هیچ‌کدام'] }
    ]
  },
  {
    id: 's6',
    title: 'فصل‌های چهارگانه',
    objective: 'بهار، تابستان، پاییز و زمستان را می‌شناسیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'سال چهار فصل دارد: بهار سبز، تابستان گرم، پاییز رنگی و زمستان سرد.' },
      { kind: 'seasons', caption: 'چهار فصل سال' }
    ],
    activities: [
      { type: 'choose', prompt: 'در کدام فصل باران می‌بارد و گل‌ها می‌شکفند؟', answer: 'بهار', options: ['بهار', 'زمستان', 'پاییز', 'هیچ‌کدام'] },
      { type: 'choose', prompt: 'در کدام فصل هوا خیلی گرم است و به دریا می‌رویم؟', answer: 'تابستان', options: ['تابستان', 'زمستان', 'پاییز', 'بهار'] },
      { type: 'choose', prompt: 'در کدام فصل برگ‌ها زرد و نارنجی می‌شوند؟', answer: 'پاییز', options: ['پاییز', 'بهار', 'تابستان', 'هیچ‌کدام'] }
    ]
  },
  {
    id: 's7',
    title: 'آب و هوا',
    objective: 'پدیده‌های هوا مثل ابر، باران و باد را می‌شناسیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'ابرها از قطره‌های ریز آب ساخته شده‌اند. وقتی سنگین شوند، باران می‌بارد.' },
      { kind: 'weather', caption: 'خورشید، ابر، باران' }
    ],
    activities: [
      { type: 'choose', prompt: 'باران از کجا می‌آید؟', answer: 'از ابر', options: ['از ابر', 'از درخت', 'از زمین', 'از کوه'] },
      { type: 'choose', prompt: 'وقتی هوا ابری است، چه چیزی ممکن است ببارد؟', answer: 'باران', options: ['باران', 'شکلات', 'برگ', 'کاغذ'] },
      { type: 'observe', scene: 'weather', question: 'در این تصویر هوا چگونه است؟', answer: 'بارانی', options: ['بارانی', 'برفی', 'آفتابی', 'مه'] }
    ]
  },
  {
    id: 's8',
    title: 'نور و سایه',
    objective: 'منابع نور و ایجاد سایه را کشف می‌کنیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'خورشید و چراغ منبع نورند. وقتی جلوی نور چیزی باشد، سایه ساخته می‌شود.' },
      { kind: 'shadow', caption: 'درخت و سایه‌اش' }
    ],
    activities: [
      { type: 'choose', prompt: 'سایه در کدام طرف جسم ساخته می‌شود؟', answer: 'پشت به نور', options: ['پشت به نور', 'روبه‌روی نور', 'بالای سر', 'زیر زمین'] },
      { type: 'choose', prompt: 'کدام یک منبع نور است؟', answer: 'خورشید', options: ['خورشید', 'میز', 'کتاب', 'کفش'] },
      { type: 'choose', prompt: 'شب‌ها با چه چیزی اتاق را روشن می‌کنیم؟', answer: 'چراغ', options: ['چراغ', 'آب', 'خاک', 'باد'] }
    ]
  },
  {
    id: 's9',
    title: 'صدا و شنیدن',
    objective: 'منابع صدا و بلندی و آهستگی آن را می‌شناسیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'صدا با لرزش ساخته می‌شود. گوش‌های ما صدا را می‌شنوند.' },
      { kind: 'sound', caption: 'زنگ، طبل و گوش' }
    ],
    activities: [
      { type: 'choose', prompt: 'با کدام عضو صدا را می‌شنویم؟', answer: 'گوش', options: ['گوش', 'چشم', 'بینی', 'دست'] },
      { type: 'choose', prompt: 'کدام یک صدا درست می‌کند؟', answer: 'طبل', options: ['طبل', 'کتاب بسته', 'سنگ ساکت', 'کاغذ خالی'] },
      { type: 'choose', prompt: 'صدای وزوز زنبور چگونه است؟', answer: 'آهسته', options: ['آهسته', 'خیلی بلند', 'بی‌صدا', 'تصویر'] }
    ]
  },
  {
    id: 's10',
    title: 'مواد و ویژگی‌هایشان',
    objective: 'مواد سخت، نرم، شفاف و مات را مقایسه می‌کنیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'شیشه شفاف است، چوب سخت است، اسفنج نرم است و آب روان است.' },
      { kind: 'materials', caption: 'شیشه، چوب، اسفنج، آب' }
    ],
    activities: [
      { type: 'choose', prompt: 'کدام ماده شفاف است؟', answer: 'شیشه', options: ['شیشه', 'چوب', 'دیوار', 'کاغذ ضخیم'] },
      { type: 'choose', prompt: 'اسفنج چه جنسی دارد؟', answer: 'نرم', options: ['نرم', 'سخت', 'سنگی', 'فلزی'] },
      { type: 'choose', prompt: 'میز مدرسه معمولاً از چه ساخته شده است؟', answer: 'چوب', options: ['چوب', 'آب', 'هوا', 'ابر'] }
    ]
  },
  {
    id: 's11',
    title: 'ایمنی و مراقبت از خود',
    objective: 'کارهای ایمن و ناایمن را تشخیص می‌دهیم.',
    minutes: 8,
    teach: [
      { kind: 'text', text: 'هنگام عبور از خیابان به چراغ و دست پلیس نگاه می‌کنیم. به اشیای داغ و تیز دست نمی‌زنیم.' },
      { kind: 'safety', caption: 'عبور ایمن از خیابان' }
    ],
    activities: [
      { type: 'choose', prompt: 'هنگام عبور از خیابان چه می‌کنیم؟', answer: 'به چراغ نگاه می‌کنیم', options: ['به چراغ نگاه می‌کنیم', 'می‌دویم', 'چشم‌مان را می‌بندیم', 'بازی می‌کنیم'] },
      { type: 'choose', prompt: 'به اجاق داغ دست می‌زنیم؟', answer: 'نه، خطرناک است', options: ['نه، خطرناک است', 'بله، اشکالی ندارد', 'فقط با دست چپ', 'فقط شب‌ها'] },
      { type: 'choose', prompt: 'اگر گم شدیم، چه می‌کنیم؟', answer: 'از یک بزرگ‌سال قابل‌اعتماد کمک می‌گیریم', options: ['از یک بزرگ‌سال قابل‌اعتماد کمک می‌گیریم', 'پنهان می‌شویم', 'گریه می‌کنیم و راه می‌رویم', 'با غریبه می‌رویم'] }
    ]
  },
  {
    id: 's12',
    title: 'کشف با حواس پنج‌گانه',
    objective: 'با چشم، گوش، بینی، زبان و دست کشف می‌کنیم.',
    minutes: 10,
    teach: [
      { kind: 'text', text: 'ما با چشم می‌بینیم، با گوش می‌شنویم، با بینی بو می‌کشیم، با زبان مزه می‌کنیم و با دست لمس می‌کنیم.' },
      { kind: 'senses', caption: 'حواس پنج‌گانه' }
    ],
    activities: [
      { type: 'choose', prompt: 'بوی گل را با کدام حس می‌فهمیم؟', answer: 'بینی', options: ['بینی', 'چشم', 'گوش', 'پا'] },
      { type: 'choose', prompt: 'رنگ‌ها را با کدام حس می‌بینیم؟', answer: 'چشم', options: ['چشم', 'بینی', 'زبان', 'گوش'] },
      { type: 'choose', prompt: 'نرمی و زبری را با کدام حس می‌فهمیم؟', answer: 'دست', options: ['دست', 'چشم', 'گوش', 'بینی'] }
    ]
  }
];

const CURRICULUM = {
  math: MATH_LESSONS,
  farsi: FARSI_LESSONS,
  science: SCIENCE_LESSONS
};

/* ---------------------------------------------------------------- */
/* بازی‌ها                                                            */
/* ---------------------------------------------------------------- */

const GAMES = [
  {
    id: 'g-count',
    title: 'باغ شمارش',
    description: 'میوه‌های باغ را بشمار و عدد درست را انتخاب کن.',
    subject: 'math',
    make: function (round) {
      const objects = ['apple', 'ball', 'fish', 'leaf', 'star'];
      const count = 3 + ((round * 5 + 2) % 7);
      return {
        type: 'count',
        object: objects[round % objects.length],
        count: count,
        max: 10,
        prompt: 'این‌ها چند تا هستند؟'
      };
    }
  },
  {
    id: 'g-letter',
    title: 'شکارچی حروف',
    description: 'حرف درست را از میان حروف پیدا کن.',
    subject: 'farsi',
    make: function (round) {
      const letters = ['ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ر', 'ز', 'س', 'ش', 'م', 'ن', 'و', 'ی'];
      const letter = letters[(round * 7 + 3) % letters.length];
      const pool = letters.filter(function (l) { return l !== letter; }).slice(0, 3);
      const options = pool.concat([letter]).sort(function (a, b) {
        return (a.charCodeAt(0) + round) % 5 - (b.charCodeAt(0) + round) % 5;
      });
      return {
        type: 'letter',
        letter: letter,
        options: options,
        prompt: 'کدام حرف «' + letter + '» است؟'
      };
    }
  },
  {
    id: 'g-pattern',
    title: 'سازنده‌ی الگو',
    description: 'الگوی شکل‌ها را کامل کن.',
    subject: 'math',
    make: function (round) {
      const sets = [
        { seq: ['circle', 'square', 'circle', 'square', 'unknown'], answer: 'circle' },
        { seq: ['triangle', 'star', 'triangle', 'star', 'unknown'], answer: 'triangle' },
        { seq: ['circle', 'circle', 'square', 'circle', 'circle', 'unknown'], answer: 'square' },
        { seq: ['star', 'circle', 'circle', 'star', 'circle', 'circle', 'unknown'], answer: 'star' }
      ];
      const base = sets[round % sets.length];
      return {
        type: 'pattern',
        seq: base.seq,
        prompt: 'شکل بعدی الگو کدام است؟',
        answer: base.answer
      };
    }
  },
  {
    id: 'g-nature',
    title: 'کارآگاه طبیعت',
    description: 'به تصویر نگاه کن و جواب درست را پیدا کن.',
    subject: 'science',
    make: function (round) {
      const items = [
        {
          type: 'choose',
          prompt: 'کدام یک جاندار است؟',
          answer: 'درخت',
          options: ['درخت', 'میز', 'کتاب', 'ماشین']
        },
        {
          type: 'choose',
          prompt: 'آب وقتی گرم شود چه می‌شود؟',
          answer: 'بخار می‌شود',
          options: ['بخار می‌شود', 'یخ می‌زند', 'سنگ می‌شود', 'گل می‌شود']
        },
        {
          type: 'choose',
          prompt: 'پرنده با چه چیزی پرواز می‌کند؟',
          answer: 'بال',
          options: ['بال', 'دم', 'پا', 'گوش']
        },
        {
          type: 'choose',
          prompt: 'خورشید صبح از کدام طرف بالا می‌آید؟',
          answer: 'شرق',
          options: ['شرق', 'غرب', 'شمال', 'زیر زمین']
        }
      ];
      return items[round % items.length];
    }
  }
];
