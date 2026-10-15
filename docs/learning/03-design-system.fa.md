# درس ۳ — Design system، layout و navigation

## از کجا شروع کنی

```bash
git pull
git log --oneline -4
git show dfa40ed --stat   # tokens و فونت‌ها
git show b914d91 --stat   # header، منو، footer
git show 6d15f81 --stat   # hero و fiche technique
```

بعد `pnpm dev` را بزن و سایت را **روی iPad در دو حالت افقی و عمودی** ببین. در حالت عمودی، عرض صفحه کمتر از `md` است و منوی موبایل ظاهر می‌شود.

## نقشه‌ی فایل‌های جدید

```
src/
├── app/
│   ├── globals.css          ← design tokens (رنگ، فونت، اندازه)
│   ├── layout.tsx           ← skip link + header + main + footer
│   ├── page.tsx             ← صفحه‌ی اصلی
│   ├── not-found.tsx        ← صفحه‌ی 404 فرانسوی
│   └── projets/ a-propos/ contact/ mentions-legales/  ← صفحه‌های موقت
├── components/
│   ├── layout/              ← container, site-header, nav-links, mobile-nav, site-footer
│   ├── home/spec-sheet.tsx  ← «امضای» سایت
│   ├── ui/button-link.tsx
│   └── page-placeholder.tsx
├── content/                 ← همه‌ی متن‌های فرانسوی
│   ├── site.ts
│   └── home.ts
├── fonts/                   ← فونت‌های داخل پروژه
└── lib/build-info.ts        ← اطلاعات build (فقط سمت سرور)
```

## ۶ مفهوم کلیدی

### ۱. Design token: یک منبع حقیقت برای رنگ

در `globals.css` رنگ‌ها **یک بار** تعریف شده‌اند:

```css
--color-signal: #e9b44c;
```

Tailwind از روی همین متغیر کلاس‌هایی مثل `bg-signal`، `text-signal` و `border-signal` می‌سازد.
در کامپوننت‌ها **هیچ کد hex ای وجود ندارد.** اگر فردا بخواهی رنگ تأکید را عوض کنی، فقط **یک خط** را تغییر می‌دهی و کل سایت عوض می‌شود.

نسبت کنتراست هر رنگ را با فرمول WCAG حساب کردم و کنار خودش نوشتم (مثلاً `muted 7.0:1`). حداقل لازم برای متن معمولی 4.5:1 است.

### ۲. فونت variable با محور عرض

Martian Mono دو محور دارد: وزن (`font-weight`) و **عرض** (`font-stretch`).
تیتر صفحه با `[font-stretch:76%]` باریک‌تر شده است. یعنی **یک فایل فونت** هم تیتر باریک می‌سازد و هم برچسب معمولی.
خودم در مرورگر تست کردم: `getComputedStyle(h1).fontStretch` مقدار `"76%"` را برگرداند و فونت `loaded` بود.

### ۳. Server Component و Client Component: مرز دقیق

| فایل              | نوع        | چرا                                                        |
| ----------------- | ---------- | ---------------------------------------------------------- |
| `site-header.tsx` | Server     | فقط HTML ثابت است                                          |
| `nav-links.tsx`   | **Client** | برای `aria-current` باید URL فعلی را بداند (`usePathname`) |
| `mobile-nav.tsx`  | **Client** | state دارد (باز یا بسته) و به کیبورد گوش می‌دهد            |
| `spec-sheet.tsx`  | Server     | اطلاعات build را می‌خواند                                  |

قانون این است: `"use client"` را **تا حد ممکن پایین** در درخت کامپوننت‌ها بگذار. Header خودش سرور است و فقط دو تکه‌ی کوچکش client هستند.

### ۴. `server-only`: دیوار امنیتی

خط اول `build-info.ts` این است:

```ts
import "server-only";
```

اگر روزی یک Client Component این فایل را import کند، **build شکست می‌خورد.**
چرا مهم است؟ فایل‌های سمت سرور ممکن است secret بخوانند. این خط تضمین می‌کند آن‌ها هرگز به مرورگر نرسند.

### ۵. منوی موبایل و یک باگ پنهان Next.js 16

در Next.js 16 (با `cacheComponents`)، layout موقع جابه‌جایی بین صفحه‌ها **unmount نمی‌شود.** یعنی اگر منو باز باشد و روی «Projets» بزنی، صفحه عوض می‌شود ولی **منو باز می‌ماند.**
راه‌حل در `mobile-nav.tsx` این است:

```tsx
<NavLinks onNavigate={() => setOpen(false)} />
```

این را از مستندات خود Next.js 16 پیدا کردم، نه از حافظه.

دسترس‌پذیری منو هم رعایت شده:

- `aria-expanded`: صفحه‌خوان اعلام می‌کند منو باز است یا بسته.
- `aria-controls`: دکمه را به منو وصل می‌کند.
- **Escape** منو را می‌بندد و **focus را به دکمه برمی‌گرداند.** کاربر کیبورد هیچ‌وقت «گم» نمی‌شود.

همه را با یک مرورگر خودکار تست کردم:

```
after click        expanded:true  hidden:false
after Escape       expanded:false focused:true
after link click   expanded:false path:/projets current:Projets
first Tab focuses  "Aller au contenu"
```

### ۶. Fiche technique: محتوایی که نمی‌تواند دروغ بگوید

جدول کنار صفحه‌ی اصلی، نسخه‌ی Next.js، commit و زمان build را **از خود build** می‌خواند:

```
GitHub Actions → GITHUB_SHA → Docker build-arg → next.config.ts env → صفحه
```

CI هم چک می‌کند که commit واقعاً در HTML باشد:

```bash
grep -q "${GITHUB_SHA:0:7}" /tmp/body.html
```

این همان کاری است که recruiter را قانع می‌کند: سایتی که **ادعای** CI/CD نمی‌کند، بلکه **اثباتش** را نشان می‌دهد.

## تصمیم طراحی: چرا این شکل؟

- **تیتر تمام‌عرض:** اولین نسخه تیتر را کنار جدول گذاشته بود. نتیجه ۷ خط تیتر بود و ناخوانا شد. روی اسکرین‌شات دیدم و اصلاحش کردم.
- **فقط یک رنگ تأکید (کهربایی):** فقط برای اکشن، لینک و focus. اگر همه‌چیز رنگی باشد، هیچ‌چیز برجسته نیست.
- **بدون terminal جعلی، gradient یا glow:** «حس مهندسی» از تایپوگرافی و داده‌ی واقعی می‌آید، نه از دکور.

## تمرین‌ها

**۱. Token (دست به کد):** رنگ `--color-signal` را در `globals.css` به `#7cc4e8` (آبی) عوض کن.
چند فایل دیگر را باید تغییر بدهی؟ ببین چه چیزهایی در سایت عوض شد. بعد برگردانش.

**۲. پیش‌بینی:** اگر `"use client"` را از بالای `nav-links.tsx` حذف کنی و `pnpm build` بزنی، چه اتفاقی می‌افتد؟ چرا؟
(اول جواب بده، بعد امتحان کن.)

**۳. دسترس‌پذیری:** صفحه را با کیبورد iPad و فقط با `Tab` مرور کن.

- اولین چیزی که focus می‌گیرد چیست؟
- focus کجاها دیده می‌شود؟
- آیا جایی هست که focus گم شود؟

جواب‌ها را بفرست تا review کنم.
