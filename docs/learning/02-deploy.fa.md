# درس ۲ — Deploy روی `siavashizadi.com`

> **قانون این درس:** هر بخش را کامل اجرا کن و خروجی‌اش را با «✅ باید ببینی» مقایسه کن. بعد برو بخش بعد.
> اگر خروجی فرق داشت، **همان‌جا متوقف شو** و متن کامل خطا را بفرست. حدس نزن و رد نشو.
>
> **از کجا؟** دستورات سرور را از **Kali** (همان‌جا که کلید SSH‌ات هست) یا **Termius** اجرا کن:
> `ssh deploy@<IP-سرور>`
>
> **زمان تقریبی:** ۴۵ تا ۶۰ دقیقه.

## تصویر کلی

```
بازدیدکننده ─HTTPS─▶ DNS (Cloudflare) ─▶ TySia :443
                                          │
                                       Nginx  (گواهی TLS + reverse proxy)
                                          │  http://127.0.0.1:3001
                                          ▼
                               Docker container "portfolio"
                               (کاربر غیر root، فقط‌خواندنی)

git push ─▶ GitHub Actions: چک کد ─▶ Docker image ─▶ ۴۷ تست روی همان image ─▶ GHCR
                                                                                │
                       SSH با کلید قفل‌شده ─▶ deploy.sh <SHA> ─▶ pull · start · health · rollback
```

---

## بخش ۱ — DNS در Cloudflare (از مرورگر لپ‌تاپ)

Cloudflare → `siavashizadi.com` → **DNS** → **Records**

1. اگر از قبل رکورد `A`، `AAAA` یا `CNAME` با اسم `@`، `siavashizadi.com` یا `www` وجود دارد، **پاکش کن**. رکوردهای قدیمی با رکوردهای جدید تداخل می‌کنند.
2. **Add record**:
   - Type: `A` · Name: `@` · IPv4: **IP سرور** · Proxy status: **DNS only** (ابر خاکستری)
3. **Add record**:
   - Type: `CNAME` · Name: `www` · Target: `siavashizadi.com` · Proxy status: **DNS only**

**چرا IPv6 (`AAAA`) نه؟** Let's Encrypt اگر رکورد IPv6 ببیند، اول از IPv6 تست می‌کند. اگر فایروال Hetzner روی IPv6 بسته باشد، گرفتن گواهی شکست می‌خورد. امروز فقط IPv4 را راه می‌اندازیم و IPv6 را بعداً اضافه می‌کنیم.

**چرا ابر خاکستری؟** با ابر نارنجی، Cloudflare وسط مسیر قرار می‌گیرد و چیزی که می‌سازیم پیچیده‌تر می‌شود. فعلاً مسیر ساده و مستقیم.

تست روی سرور (ممکن است چند دقیقه طول بکشد):

```bash
dig +short siavashizadi.com
dig +short www.siavashizadi.com
```

✅ **باید ببینی:** خط اول IP سرور. خط دوم `siavashizadi.com.` و بعد IP سرور.
(اگر `dig` نصب نیست: `sudo apt install -y dnsutils`)

---

## بخش ۲ — ایمیل `contact@siavashizadi.com` (از مرورگر)

سایت در صفحه‌ی Contact این آدرس را نشان می‌دهد، پس باید واقعاً کار کند.

Cloudflare → `siavashizadi.com` → **Email** → **Email Routing** → **Get started / Enable**

1. **Destination address:** Gmail خودت. Cloudflare یک ایمیل تأیید می‌فرستد که باید روی لینکش بزنی.
2. **Custom address:** `contact` → **Send to** Gmail خودت.
3. Cloudflare می‌پرسد رکوردهای `MX` و `TXT` را اضافه کند یا نه. **قبول کن.**

✅ **تست:** از یک ایمیل دیگر (مثلاً ایمیل دانشگاه) به `contact@siavashizadi.com` پیام بده. باید در Gmail برسد.

---

## بخش ۳ — پیش‌نیازهای سرور (فقط چک)

```bash
lsb_release -ds
sudo nginx -t
sudo ufw status
free -h
```

✅ **باید ببینی:** `Ubuntu 26.04...` · `syntax is ok` و `test is successful` · برای `22`، `80` و `443` کلمه‌ی `ALLOW` · ستون `available` بیشتر از `1.0Gi`.

---

## بخش ۴ — Docker

```bash
docker --version 2>/dev/null || echo "NOT INSTALLED"
```

اگر نوشت `NOT INSTALLED`، اول **راه رسمی** را امتحان کن: دستورات صفحه‌ی `https://docs.docker.com/engine/install/ubuntu/`، بخش «Install using the apt repository».
اگر با خطای `Release file ... not found` مواجه شدی (یعنی Docker هنوز از Ubuntu 26.04 پشتیبانی نمی‌کند)، پکیج خود Ubuntu را نصب کن:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
```

تست:

```bash
sudo docker run --rm hello-world
docker compose version
```

✅ **باید ببینی:** `Hello from Docker!` و `Docker Compose version v2...`

---

## بخش ۵ — کاربر `deployer` و فایل‌های deploy

```bash
sudo adduser --disabled-password --gecos "" deployer
sudo usermod -aG docker deployer
sudo install -d -o deployer -g deployer -m 750 /opt/portfolio

git clone https://github.com/TySia-fr/Portfolio.git ~/Portfolio
cd ~/Portfolio
sudo install -o deployer -g deployer -m 640 deploy/compose.yaml /opt/portfolio/compose.yaml
sudo install -o root -g root -m 755 deploy/deploy.sh /usr/local/bin/portfolio-deploy
```

✅ **تست:**

```bash
sudo ls -la /opt/portfolio
ls -la /usr/local/bin/portfolio-deploy
```

باید `compose.yaml` با مالک `deployer` و `portfolio-deploy` با مالک `root` و دسترسی `-rwxr-xr-x` ببینی.

⚠️ **دو نکته‌ی امنیتی:**

- عضویت در گروه `docker` عملاً یعنی دسترسی root. برای همین `deployer` یک کاربر جداست و کلیدش در بخش ۸ قفل می‌شود.
- `portfolio-deploy` مال root است. اگر `deployer` می‌توانست آن را ویرایش کند، قفل کلید بی‌ارزش می‌شد.

---

## بخش ۶ — Image عمومی در GitHub Container Registry

GitHub → روی آواتارت → **Your profile** → تب **Packages** → `portfolio` → **Package settings** (پایین سمت راست) → **Danger Zone** → **Change visibility** → **Public**

**چرا public؟** repo عمومی است و image هیچ چیز مخفی ندارد. در عوض، سرور برای دریافت image به رمز نیاز ندارد.

✅ **تست روی سرور، بدون login:**

```bash
sudo -u deployer docker pull ghcr.io/tysia-fr/portfolio:latest
```

باید با `Status: Downloaded newer image` تمام شود. اگر خطای `denied` یا `unauthorized` دیدی، یعنی package هنوز public نیست.

---

## بخش ۷ — اولین deploy دستی

اول مطمئن شو آخرین CI در GitHub سبز است (GitHub → repo → **Actions**). بعد:

```bash
cd ~/Portfolio && git pull
SHA=$(git rev-parse HEAD) && echo "$SHA"
sudo -u deployer /usr/local/bin/portfolio-deploy "$SHA"
```

✅ **باید ببینی:**

```
[deploy] pulling <SHA>
[deploy] starting <SHA>
[deploy] healthy — deployed <SHA>
```

تست محلی روی سرور:

```bash
curl -sI http://127.0.0.1:3001 | head -5
docker ps --filter name=portfolio
```

✅ `HTTP/1.1 200 OK` و در ستون STATUS عبارت `(healthy)`.

---

## بخش ۸ — Nginx و HTTPS

```bash
cd ~/Portfolio
sudo install -m 644 deploy/nginx/siavashizadi.com.conf /etc/nginx/sites-available/siavashizadi.com.conf
sudo ln -s /etc/nginx/sites-available/siavashizadi.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

✅ `syntax is ok`. از **لپ‌تاپ** آدرس `http://siavashizadi.com` را باز کن. باید سایت را ببینی (فعلاً بدون قفل).

گواهی HTTPS برای هر دو آدرس:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d siavashizadi.com -d www.siavashizadi.com
```

- ایمیل: Gmail خودت (برای هشدار انقضای گواهی)
- شرایط: `Y`

```bash
sudo certbot renew --dry-run
```

✅ **باید ببینی:** `Congratulations! all simulated renewals succeeded`. یعنی گواهی هر ۹۰ روز خودکار تمدید می‌شود.

---

## بخش ۹ — Deploy خودکار از GitHub

### ۹.۱ کلید قفل‌شده (روی سرور، با کاربر `deploy`)

```bash
ssh-keygen -t ed25519 -C "github-actions-portfolio" -f ~/portfolio_deploy -N ""
sudo install -d -o deployer -g deployer -m 700 /home/deployer/.ssh
echo "command=\"/usr/local/bin/portfolio-deploy\",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding $(cat ~/portfolio_deploy.pub)" | sudo tee /home/deployer/.ssh/authorized_keys >/dev/null
sudo chown deployer:deployer /home/deployer/.ssh/authorized_keys
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```

✅ **تست قفل** (این خطا را **باید** ببینی):

```bash
ssh -o StrictHostKeyChecking=accept-new -i ~/portfolio_deploy deployer@localhost "rm -rf /"
```

```
[deploy] refused: expected a 40-character commit SHA
```

اگر به‌جای این پیام یک shell باز شد، **متوقف شو**. یعنی قفل کار نمی‌کند.

### ۹.۲ Secrets در GitHub

repo → **Settings** → **Secrets and variables** → **Actions**

| تب        | نام                  | مقدار                                                                                                  |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| Secrets   | `DEPLOY_SSH_KEY`     | خروجی `base64 -w0 ~/portfolio_deploy; echo` (**یک خط**؛ کپی چندخطی از ترمینال ویندوز کلید را خراب کرد) |
| Secrets   | `DEPLOY_HOST`        | IP سرور                                                                                                |
| Secrets   | `DEPLOY_KNOWN_HOSTS` | خروجی `ssh-keyscan -t ed25519 <IP-سرور> 2>/dev/null`                                                   |
| Variables | `DEPLOY_ENABLED`     | `true`                                                                                                 |

بعد از ذخیره در GitHub، **کلید خصوصی را از سرور پاک کن**. تنها جایی که باید باشد GitHub است:

```bash
shred -u ~/portfolio_deploy && rm ~/portfolio_deploy.pub
```

⚠️ کلید خصوصی را **هرگز** در چت نفرست.

### ۹.۳ تست pipeline

GitHub → **Actions** → آخرین run → **Re-run all jobs**

✅ **باید ببینی:** هر سه job سبز می‌شوند: `Lint, format, types, build` · `Docker image` · `Deploy to VPS`. در لاگ `Verify public URL` هم این خط می‌آید:

```
live site serves <۷ حرف اول commit>
```

---

## بخش ۱۰ — چک نهایی (از لپ‌تاپ)

| تست            | چطور                                            | ✅ نتیجه                                          |
| -------------- | ----------------------------------------------- | ------------------------------------------------- |
| HTTPS          | `https://siavashizadi.com`                      | قفل در مرورگر، سایت باز می‌شود                    |
| HTTP به HTTPS  | `http://siavashizadi.com`                       | خودکار به `https://` می‌رود                       |
| www            | `https://www.siavashizadi.com`                  | به `https://siavashizadi.com` می‌رود              |
| نسخه           | Fiche technique در صفحه‌ی اصلی                  | commit همان آخرین commit در GitHub است            |
| پیش‌نمایش لینک | لینک سایت را در یک چت (WhatsApp/LinkedIn) بفرست | تصویر تیره با اسمت نمایش داده می‌شود              |
| ایمیل          | در صفحه‌ی Contact روی ایمیل بزن                 | اپ ایمیل با `contact@siavashizadi.com` باز می‌شود |

وقتی همه سبز بود به من بگو. وضعیت پروژه را از «En cours» به «En ligne» عوض می‌کنم. همان commit خودکار deploy می‌شود و این **اولین deploy واقعاً خودکار** توست.

---

## اگر چیزی خراب شد

| علامت                                      | علت احتمالی                 | بررسی                                                |
| ------------------------------------------ | --------------------------- | ---------------------------------------------------- |
| `dig` چیزی برنمی‌گرداند                    | DNS هنوز منتشر نشده         | ۵ دقیقه صبر کن                                       |
| certbot: `Timeout during connect`          | پورت 80 بسته است            | `sudo ufw status` و فایروال Hetzner                  |
| مرورگر: `502 Bad Gateway`                  | container اجرا نمی‌شود      | `docker ps -a` و `docker logs portfolio`             |
| `docker pull`: `denied`                    | package هنوز private است    | بخش ۶                                                |
| CI deploy: `Permission denied (publickey)` | secret اشتباه کپی شده       | `DEPLOY_SSH_KEY` را دوباره با خطوط BEGIN و END بگذار |
| CI deploy: `Host key verification failed`  | `DEPLOY_KNOWN_HOSTS` اشتباه | دوباره `ssh-keyscan` بزن                             |

**بازگشت به نسخه‌ی قبلی (اضطراری):**

```bash
sudo cat /opt/portfolio/.current-tag                 # نسخه‌ی فعلی
sudo -u deployer /usr/local/bin/portfolio-deploy <SHA-قبلی>
```

---

## تمرین‌ها (بعد از لانچ)

1. **امنیت:** در `compose.yaml` هر کدام از این‌ها چه حمله‌ای را محدود می‌کند؟ `read_only`، `cap_drop: [ALL]`، `no-new-privileges`، `127.0.0.1:3001`
2. **Nginx:** چرا `X-Forwarded-For $remote_addr` نوشتیم، نه `$proxy_add_x_forwarded_for`؟
3. **Rollback:** اگر در `deploy.sh` اول container را خاموش می‌کردیم و بعد pull، و GHCR در دسترس نبود، چه اتفاقی می‌افتاد؟
4. **HSTS:** هدر `Strict-Transport-Security` گزینه‌ی `includeSubDomains` دارد. برای ساب‌دامنه‌های پروژه‌های بعدی‌ات چه معنایی دارد؟
