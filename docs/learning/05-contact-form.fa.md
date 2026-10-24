# درس ۰۵ — فرم تماس: فعال‌کردن ارسال ایمیل روی سرور

> **وضعیت:** کد فرم کامل و تست‌شده است. تا وقتی مراحل این فایل انجام نشود، فرم با پیام صادقانهٔ «فعلاً در دسترس نیست، مستقیم ایمیل بزنید» جواب می‌دهد و **هیچ‌وقت وانمود نمی‌کند پیام رفته است**.

## فرم چطور کار می‌کند (خلاصه برای مصاحبه)

```
مرورگر ──fetch JSON──► POST /api/contact (Next.js Route Handler)
   1. Origin == Host ؟            وگرنه 403  (CSRF)
   2. Content-Type JSON ؟         وگرنه 415  (فرم HTML سایت دیگر نمی‌تواند JSON بفرستد)
   3. حجم ≤ 32KB ؟                وگرنه 413  (Nginx هم بالای 64KB را رد می‌کند)
   4. هر IP: ۵ تلاش در ۱۰ دقیقه   وگرنه 429 + Retry-After
   5. JSON معتبر ؟                وگرنه 400
   6. honeypot پر شده ؟           → 200 جعلی، هیچ ایمیلی نمی‌رود (ربات چیزی یاد نمی‌گیرد)
   7. Zod                         وگرنه 422 + خطای هر فیلد
   8. کل سایت: ۲۰ ایمیل در ساعت   وگرنه 429 (از سهمیهٔ Resend محافظت می‌کند)
   9. Resend API (timeout 8s)     200 فقط اگر Resend قبول کرد؛ 502 اگر خطا؛ 503 اگر تنظیم نشده
```

- چک‌ها **از ارزان به گران** مرتب شده‌اند: درخواست مخرب قبل از parse و قبل از مصرف سهمیه رد می‌شود.
- ایمیل **plain text** است. چیزی که کاربر نوشته هیچ‌وقت HTML تفسیر نمی‌شود.
- در لاگ فقط کد خطا نوشته می‌شود، نه متن پیام، نه ایمیل، نه کلید.
- rate limit در حافظه است. برای **یک** کانتینر روی **یک** سرور کافی است. اگر روزی دو instance داشتی، باید Redis بگذاری.

## کار تو — یک بار

### ۱. حساب Resend و تأیید دامنه

1. در resend.com ثبت‌نام کن. پلن رایگان کافی است.
2. **Domains → Add Domain** → `siavashizadi.com`. **Region: Ireland (eu-west-1)** را انتخاب کن تا داده‌ها در اتحادیهٔ اروپا بمانند.
3. Resend چند رکورد DNS می‌دهد (TXT برای DKIM، و MX و TXT برای SPF روی زیردامنهٔ `send`). همه را **دقیقاً همان‌طور** در Cloudflare → DNS اضافه کن، با **DNS only** (ابر خاکستری).
   - این رکوردها روی زیردامنهٔ `send` هستند و با MX اصلی Cloudflare Email Routing تداخل ندارند. **MX ریشه را دست نزن.**
4. در Resend روی **Verify** بزن و صبر کن تا وضعیت **Verified** شود.

### ۲. کلید API با کمترین دسترسی

**API Keys → Create** با این تنظیمات:

- Permission: **Sending access**، نه Full access
- Domain: `siavashizadi.com`

کلید را **فقط یک بار** می‌بینی. آن را در چت نفرست و در repo هم نگذار.

### ۳. فایل secret روی سرور

در Termius، با کاربر `deploy`:

```bash
# مالک deployer است چون docker compose با همین کاربر اجرا می‌شود و فایل را می‌خواند
sudo install -m 600 -o deployer -g deployer /dev/null /opt/portfolio/.env
sudo nano /opt/portfolio/.env
```

محتوا را بنویس. مقدار واقعی کلید را خودت جایگذاری کن:

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=siavashizadi62@gmail.com
CONTACT_FROM_EMAIL=Formulaire siavashizadi.com <formulaire@siavashizadi.com>
```

چک:

```bash
sudo ls -l /opt/portfolio/.env      # باید: -rw------- 1 deployer deployer
```

### ۴. compose.yaml جدید روی سرور

فایل `deploy/compose.yaml` در repo حالا `env_file` دارد. **سرور خودش آپدیت نمی‌شود** (این یکی از محدودیت‌های مستند پروژه است)، پس نسخهٔ جدید را دستی کپی کن:

```bash
sudo curl -fsSL -o /opt/portfolio/compose.yaml \
  https://raw.githubusercontent.com/TySia-fr/Portfolio/main/deploy/compose.yaml
grep -A3 env_file /opt/portfolio/compose.yaml   # باید path: .env را ببینی
```

### ۵. اعمال بدون deploy جدید

```bash
# همان نسخهٔ فعلی را دوباره راه می‌اندازد؛ compose چون تنظیمات عوض شده کانتینر را از نو می‌سازد
sudo -u deployer /usr/local/bin/portfolio-deploy "$(cat /opt/portfolio/.current-tag)"
sudo docker exec portfolio printenv RESEND_API_KEY | cut -c1-3   # فقط سه حرف اول: باید re_ ببینی
```

### ۶. تست واقعی

فرم سایت را پر کن. باید «Message envoyé.» ببینی و ایمیل در Gmail برسد. **Reply** در Gmail باید مستقیم به فرستنده جواب بدهد.

## اگر کار نکرد

| علامت                        | علت محتمل                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| «momentanément indisponible» | `.env` خوانده نشده: مرحلهٔ ۴ یا ۵                                                               |
| «n’a pas pu être envoyé»     | Resend رد کرده (دامنه verify نشده یا کلید اشتباه): `sudo docker logs portfolio \| grep contact` |
| «Trop de messages»           | محدودیت rate limit است، نه باگ. ۱۰ دقیقه صبر کن                                                 |

## تمرین

1. چرا مرحلهٔ ۲ (فقط JSON) جلوی CSRF را می‌گیرد؟ «CORS preflight» را توضیح بده.
2. چرا honeypot پاسخ **200** می‌دهد و نه 400؟
3. اگر سایت روی دو سرور اجرا شود، کدام بخش این طراحی خراب می‌شود؟
