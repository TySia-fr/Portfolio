# درس ۲ — Deploy روی TySia

> **این درس عملی است.** تمام دستورات را خودت از Kali روی سرور اجرا می‌کنی.
> هر بخش را کامل انجام بده، خروجی را چک کن و بعد برو بخش بعد.
> اگر جایی خطا گرفتی، **خروجی کامل خطا** را برایم بفرست. حدس نزن.

## تصویر کلی: یک درخواست چطور به سایت می‌رسد

```
مرورگر ─HTTPS─▶ Cloudflare DNS ─▶ TySia :443
                                    │
                                 Nginx  (TLS + reverse proxy)
                                    │  http://127.0.0.1:3001
                                    ▼
                         Docker container "portfolio"
                         (Node، کاربر غیر root، فقط-خواندنی)
```

و جریان deploy:

```
git push ─▶ GitHub Actions: check ─▶ ساخت image ─▶ smoke test ─▶ GHCR
                                                                  │
                     SSH (کلید محدود‌شده) ─▶ deploy.sh <SHA> ─▶ pull + health + rollback
```

**چرا container روی `127.0.0.1:3001` است، نه `0.0.0.0`؟**
چون فقط Nginx باید به آن دسترسی داشته باشد. اگر پورت عمومی بود، هر کسی می‌توانست Nginx را دور بزند: بدون HTTPS، بدون محدودیت اندازه‌ی درخواست، بدون log.

---

## بخش ۰ — پیش‌نیازها (فقط چک کن)

روی سرور:

```bash
ssh deploy@<IP-سرور>
lsb_release -a          # باید Ubuntu باشد
sudo nginx -t           # باید "syntax is ok" بدهد
sudo ufw status         # 22, 80, 443 باید ALLOW باشند
```

---

## بخش ۱ — DNS در Cloudflare

1. Cloudflare → `siavashizadi.com` → **DNS** → **Add record**
2. تنظیمات:
   - Type: `A`
   - Name: `portfolio`
   - IPv4: **IP سرور TySia**
   - Proxy status: **DNS only (ابر خاکستری)**
3. اگر سرور IPv6 دارد، یک رکورد `AAAA` هم با همان نام بساز.

**چرا خاکستری؟** وقتی ابر نارنجی باشد، Cloudflare وسط مسیر قرار می‌گیرد و گرفتن اولین گواهی Let's Encrypt پیچیده‌تر می‌شود. اول ساده شروع می‌کنیم و بعداً نارنجی را با حالت Full (strict) فعال می‌کنیم.

تست از Kali (ممکن است چند دقیقه طول بکشد):

```bash
dig +short portfolio.siavashizadi.com
# باید IP سرورت را برگرداند
```

---

## بخش ۲ — نصب Docker

```bash
docker --version 2>/dev/null || echo "Docker نصب نیست"
```

اگر نصب نیست، از مخزن رسمی Docker نصب کن. دستورات را **از صفحه‌ی رسمی** بردار، نه از حافظه‌ی من:
`https://docs.docker.com/engine/install/ubuntu/`

⚠️ Ubuntu 26.04 خیلی جدید است. اگر مخزن رسمی Docker هنوز از آن پشتیبانی نمی‌کند (خطای `Release file not found`)، پکیج خود Ubuntu را نصب کن:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
```

تست:

```bash
sudo docker run --rm hello-world
docker compose version
```

---

## بخش ۳ — کاربر مخصوص deploy

یک کاربر **جدا** به اسم `deployer` می‌سازیم. با کاربر `deploy` خودت کار نمی‌کنیم، چون آن کاربر sudo دارد.

```bash
sudo adduser --disabled-password --gecos "" deployer
sudo usermod -aG docker deployer
sudo install -d -o deployer -g deployer -m 750 /opt/portfolio
```

⚠️ **حقیقت امنیتی:** عضویت در گروه `docker` عملاً برابر با root است، چون Docker می‌تواند کل دیسک را mount کند. برای همین در بخش ۵ کلید این کاربر را طوری قفل می‌کنیم که **فقط یک اسکریپت** را بتواند اجرا کند.

---

## بخش ۴ — فایل‌ها روی سرور

از Kali، در پوشه‌ای که repo را clone کرده‌ای:

```bash
scp deploy/compose.yaml deploy/deploy.sh deploy@<IP>:/tmp/
scp deploy/nginx/portfolio.siavashizadi.com.conf deploy@<IP>:/tmp/
```

روی سرور:

```bash
sudo install -o deployer -g deployer -m 640 /tmp/compose.yaml /opt/portfolio/compose.yaml
sudo install -o root -g root -m 755 /tmp/deploy.sh /usr/local/bin/portfolio-deploy
```

**سؤال برای فکر کردن:** چرا `portfolio-deploy` مال root است، نه مال deployer؟
(راهنما: اگر deployer می‌توانست اسکریپت را ویرایش کند، قفل بخش ۵ چه ارزشی داشت؟)

---

## بخش ۵ — کلید SSH محدود برای GitHub

روی **Kali** یک کلید جدید فقط برای CI بساز:

```bash
ssh-keygen -t ed25519 -C "github-actions-portfolio" -f ~/.ssh/portfolio_deploy -N ""
cat ~/.ssh/portfolio_deploy.pub
```

روی **سرور**:

```bash
sudo install -d -o deployer -g deployer -m 700 /home/deployer/.ssh
sudo nano /home/deployer/.ssh/authorized_keys
```

در این فایل **یک خط** بنویس. همه‌اش باید در یک خط باشد و به‌جای `ssh-ed25519 AAAA...` کلید عمومی خودت را بگذار:

```
command="/usr/local/bin/portfolio-deploy",no-pty,no-port-forwarding,no-agent-forwarding,no-X11-forwarding ssh-ed25519 AAAA... github-actions-portfolio
```

```bash
sudo chown deployer:deployer /home/deployer/.ssh/authorized_keys
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```

**این خط چه می‌کند؟** گزینه‌ی `command=` یک **forced command** است. یعنی هر کسی با این کلید وصل شود، هر دستوری هم که بفرستد، **فقط** `portfolio-deploy` اجرا می‌شود. متنی که فرستاده هم به‌عنوان `$SSH_ORIGINAL_COMMAND` به اسکریپت داده می‌شود و اسکریپت فقط یک SHA چهل‌کاراکتری را قبول می‌کند.
در نتیجه اگر این کلید از GitHub دزدیده شود، مهاجم فقط می‌تواند نسخه‌ی دیگری از سایت **خودت** را deploy کند.

تست از Kali (این خطا را **باید** بگیری):

```bash
ssh -i ~/.ssh/portfolio_deploy deployer@<IP> "rm -rf /"
# [deploy] refused: expected a 40-character commit SHA
```

اگر این پیام را دیدی، قفل درست کار می‌کند. 🎯

---

## بخش ۶ — Nginx و HTTPS

```bash
sudo install -m 644 /tmp/portfolio.siavashizadi.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/portfolio.siavashizadi.com.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

گواهی HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx   # اگر نصب نیست
sudo certbot --nginx -d portfolio.siavashizadi.com
# گزینه‌ی redirect را انتخاب کن (HTTP → HTTPS)
sudo certbot renew --dry-run   # مطمئن شو تمدید خودکار کار می‌کند
```

---

## بخش ۷ — Image عمومی در GHCR

بعد از اولین CI موفق، image در GitHub ساخته می‌شود:
GitHub → پروفایلت → **Packages** → `portfolio` → **Package settings** → **Change visibility** → **Public**

**چرا public؟** repo که public است، پس image هم چیز مخفی ندارد. در عوض، سرور برای pull کردن به هیچ رمزی نیاز ندارد و یک secret کمتر داری که نگهش داری.

---

## بخش ۸ — Secrets در GitHub

repo → **Settings** → **Secrets and variables** → **Actions**

**Secrets** (تب Secrets):

| نام                  | مقدار          | از کجا                                 |
| -------------------- | -------------- | -------------------------------------- |
| `DEPLOY_SSH_KEY`     | کلید **خصوصی** | `cat ~/.ssh/portfolio_deploy` روی Kali |
| `DEPLOY_HOST`        | IP سرور        |                                        |
| `DEPLOY_KNOWN_HOSTS` | اثرانگشت سرور  | `ssh-keyscan -t ed25519 <IP>` روی Kali |

**Variables** (تب Variables):

| نام              | مقدار  |
| ---------------- | ------ |
| `DEPLOY_ENABLED` | `true` |

**چرا `DEPLOY_KNOWN_HOSTS`؟** بدون آن، اگر کسی بین GitHub و سرورت قرار بگیرد (حمله‌ی MITM)، CI بدون هیچ هشداری به سرور جعلی وصل می‌شود.

⚠️ کلید خصوصی را **هرگز** در چت، فایل یا commit نگذار. فقط در GitHub Secrets.

---

## بخش ۹ — اولین deploy

GitHub → **Actions** → آخرین run → **Re-run all jobs**
یا یک commit کوچک push کن.

بعد از آن:

```bash
curl -I https://portfolio.siavashizadi.com
# HTTP/2 200 + هدرهای امنیتی
```

روی سرور:

```bash
docker ps                                   # STATUS: healthy
docker stats --no-stream portfolio          # مصرف RAM واقعی
cat /opt/portfolio/.current-tag             # SHA نسخه‌ی فعلی
```

---

## تمرین‌ها

1. **امنیت:** در `compose.yaml` هر کدام از این‌ها چه حمله‌ای را محدود می‌کند؟
   `read_only`، `cap_drop: [ALL]`، `no-new-privileges`، `127.0.0.1:3001`
2. **Nginx:** چرا در کانفیگ نوشتیم `X-Forwarded-For $remote_addr`، نه `$proxy_add_x_forwarded_for` که در اکثر آموزش‌ها می‌بینی؟
   (راهنما: کلاینت می‌تواند خودش این هدر را با هر مقداری بفرستد. در فرم تماس rate limit را بر اساس IP می‌گذاریم.)
3. **Rollback:** در `deploy.sh` بخش «2. Pull first» را بخوان. اگر ترتیب را برعکس می‌کردیم، یعنی اول container را خاموش و بعد pull می‌کردیم، و GHCR از دسترس خارج بود، چه اتفاقی برای سایت می‌افتاد؟
