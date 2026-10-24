# درس ۰۷ — سئو برای اسم: «Siavash Izadi» و «سیاوش ایزدی»

## واقعیت اول (بدون تعارف)

- **هیچ کدی گوگل را مجبور نمی‌کند سایتت را بالا بیاورد.** کد فقط مطمئن می‌شود گوگل سایت را **درست بفهمد**. اینکه گوگل سایت را **بشناسد و به آن اعتماد کند**، به کارهای بیرون از سایت بستگی دارد: Search Console، لینک از LinkedIn و GitHub، و گذشت زمان.
- خبر خوب: رقابت سر اسم دقیق تو کم است. جست‌وجوی «Siavash Izadi» و «سیاوش ایزدی» نتیجه‌ای از یک آدم مشخص با همین اسم نشان نمی‌دهد. برای جست‌وجوی اسم، معمولاً **چند روز تا چند هفته بعد از ثبت در Search Console** کافی است.
- **«سیاوش ایزدی» فقط وقتی پیدا می‌شود که این متن واقعاً روی صفحه باشد.** گوگل اسم را بین دو خط ترجمه نمی‌کند. برای همین اسم فارسی حالا روی سایت دیده می‌شود.

## سمت کد (انجام شده، این PR)

| چه                                                                                                 | کجا                        | چرا                                                                             |
| -------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------- |
| عنوان صفحهٔ خانه: `Siavash Izadi (سیاوش ایزدی) — Développeur…`                                     | `layout.tsx`               | عنوان مهم‌ترین سیگنال برای جست‌وجوی اسم است                                     |
| اسم در بالای صفحهٔ خانه، دیدنی                                                                     | `page.tsx`                 | قبلاً اسم فقط در لوگو (با حروف کوچک) و فوتر بود                                 |
| صفحهٔ About: اسم در هر دو خط، با `lang="fa" dir="rtl"`                                             | `a-propos/page.tsx`        | به گوگل و screen reader می‌گوید آن متن فارسی است                                |
| **JSON-LD از نوع `Person`**: name، alternateName (فارسی)، sameAs (GitHub و LinkedIn)، دانشگاه، شغل | `lib/structured-data.ts`   | به گوگل می‌گوید «این سایت، این LinkedIn و این GitHub متعلق به **یک آدم** هستند» |
| `WebSite` و `ProfilePage` (برای About)                                                             | همان                       | اسم سایت در نتایج، و معرفی About به‌عنوان صفحهٔ پروفایل                         |
| `og:url` برابر canonical در هر صفحه                                                                | `lib/metadata.ts`          | دیگر هیچ صفحه‌ای ادعای ضدونقیض ندارد                                            |
| `lastmod` در sitemap، و `Disallow: /api/` در robots                                                | `sitemap.ts` و `robots.ts` | گوگل وقتش را صرف API نمی‌کند                                                    |
| تست‌ها                                                                                             | `e2e/pages.spec.ts`        | اگر روزی این‌ها خراب شوند، CI قرمز می‌شود                                       |

## کار تو (این قسمت از کد مهم‌تر است)

### ۱. Google Search Console (۱۰ دقیقه، **مهم‌ترین قدم**)

1. به search.google.com/search-console برو و **Add property** را بزن.
2. نوع **Domain** را انتخاب کن (نه URL prefix) و `siavashizadi.com` را وارد کن.
3. گوگل یک رکورد **TXT** می‌دهد. در Cloudflare → DNS → **Add record**: Type `TXT`، Name `@`، Content همان متن. بعد Save.
4. در Search Console روی **Verify** بزن. اگر نشد، ۵ دقیقه صبر کن و دوباره بزن.
5. از منوی **Sitemaps**، آدرس `https://siavashizadi.com/sitemap.xml` را بده و Submit کن.
6. از **URL Inspection**، اول `https://siavashizadi.com/` و بعد `https://siavashizadi.com/a-propos` را بررسی کن و برای هرکدام **Request indexing** بزن.

### ۲. Bing Webmaster Tools (۳ دقیقه)

به bing.com/webmasters برو و **Import from Google Search Console** را بزن. DuckDuckGo و چند موتور جست‌وجوی دیگر از نتایج Bing استفاده می‌کنند.

### ۳. لینک‌ها از پروفایل‌های خودت (برای گوگل سیگنال اعتماد هستند)

- **LinkedIn:** Contact info → Website → `https://siavashizadi.com` (نوع Portfolio). در بخش Featured هم لینک سایت را بگذار.
- **LinkedIn، پروفایل به زبان دوم:** Add profile in another language → فارسی → اسم را «سیاوش ایزدی» بنویس. این یک منبع معتبر دیگر برای اسم فارسی است.
- **GitHub:** Settings → Profile → Website → `https://siavashizadi.com`.
- **GitHub Profile README:** یک repo با اسم `TySia-fr` بساز. README آن روی صفحهٔ پروفایلت نشان داده می‌شود. اگر بخواهی، محتوایش را برایت می‌نویسم.

### ۴. چک کردن نتیجه

- در گوگل جست‌وجو کن: `site:siavashizadi.com`. اگر صفحه‌ها آمدند، یعنی ایندکس شده‌اند.
- آزمون Rich Results گوگل: search.google.com/test/rich-results را با آدرس `https://siavashizadi.com/a-propos` اجرا کن. باید **ProfilePage** و **Person** را بدون خطا نشان بدهد.
- در Search Console → Performance می‌بینی با چه کلماتی پیدا شده‌ای.

## کار نکن ❌

- **keyword stuffing**، یعنی تکرار مصنوعی اسم در متن. گوگل جریمه‌اش می‌کند و رکروتر هم آن را می‌بیند.
- **متن مخفی** با رنگ پس‌زمینه یا `display:none` برای اسم فارسی. این تقلب حساب می‌شود.
- **خرید بک‌لینک.** برای جست‌وجوی اسم لازم نیست و ضرر هم دارد.

## تمرین

1. در DevTools → Elements، `<script type="application/ld+json">` را پیدا کن و کپی‌اش کن. در validator.schema.org بچسبان و ببین چه چیزی را تشخیص می‌دهد.
2. توضیح بده چرا `sameAs` برای جست‌وجوی اسم مهم است. (راهنما: entity و Knowledge Graph)
3. چرا روی اسم فارسی `lang="fa"` گذاشتیم؟ دو دلیل بنویس.
