# Operations review — siavashizadi.com

Review date: 2026-10-24. Scope: `Dockerfile`, `deploy/`, `.github/workflows/`, and what can
be observed from outside. **The live server was not inspected for this review**: statements
about it are marked _not verified_ and come with the command that verifies them.

## 1. Documented controls vs. configuration

| Control                                   | Where                      | Verified in config | Verified live                                                                               |
| ----------------------------------------- | -------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| Non-root container (uid 1001)             | `Dockerfile`               | ✅                 | ✅ CI smoke test asserts `id -u != 0` on every build                                        |
| Read-only root filesystem                 | `compose.yaml`             | ✅                 | ⚠️ server copy not verified: `docker inspect -f '{{.HostConfig.ReadonlyRootfs}}' portfolio` |
| All capabilities dropped                  | `compose.yaml`             | ✅                 | ⚠️ `docker inspect -f '{{.HostConfig.CapDrop}}' portfolio`                                  |
| `no-new-privileges`                       | `compose.yaml`             | ✅                 | ⚠️ `docker inspect -f '{{.HostConfig.SecurityOpt}}' portfolio`                              |
| Memory / CPU / PID limits                 | `compose.yaml`             | ✅                 | ✅ `docker stats` showed the 384 MiB limit on 2026-10-24                                    |
| Port bound to 127.0.0.1                   | `compose.yaml`             | ✅                 | ⚠️ `ss -ltnp \| grep 3001` must show `127.0.0.1:3001`                                       |
| Deploy key restricted to `deploy.sh`      | `authorized_keys` (server) | n/a                | ✅ forced command answered "refused" to an arbitrary command on 2026-10-24                  |
| `deploy.sh` accepts only a 40-char SHA    | `deploy/deploy.sh`         | ✅                 | ✅ same test                                                                                |
| Automatic rollback on failed health check | `deploy/deploy.sh`         | ✅                 | ❌ never triggered in production                                                            |
| Health check                              | `Dockerfile` `HEALTHCHECK` | ✅                 | ✅ deploys wait for `healthy`                                                               |
| Automatic deploy on push to `main`        | `ci.yml`                   | ✅                 | ✅ first automatic deploy: run for commit `8af246f`                                         |
| TLS renewal                               | certbot (server)           | n/a                | ⚠️ `systemctl list-timers \| grep certbot` and `sudo certbot renew --dry-run`               |

## 2. Discrepancies found and fixed in this change

1. **Server files are not deployed by CI.** `compose.yaml`, `deploy.sh` and the Nginx file
   are copied to the server by hand. A change in the repository does not reach the server.
   This is now stated in the README and in the case study. The contact form (`env_file`)
   and the two `deploy.sh` fixes below **require a manual copy**
   (`docs/learning/05-contact-form.fa.md`, step 4).
2. **`deploy.sh` pruned every unused image on the host**, not only this project's. That would
   have deleted the images of future projects on the same server. The prune now filters on the
   `org.opencontainers.image.source` label that CI sets.
3. **Nothing stopped two deploys from running at once** (CI and a manual run). `deploy.sh` now
   takes an exclusive `flock` and refuses a second run.
4. **The standalone server bundle was about to include the whole repository.** Build-time file
   reads (code excerpts, screenshot checks) made Next.js trace the project root. They are now
   excluded from tracing; the standalone output contains `server.js`, `node_modules`,
   `package.json` and the OG font only, as before.

## 3. Security headers

Set by Next.js (`next.config.ts`) on every route. Nginx adds none, so there are no duplicates
from the repository configuration. _Not verified_: certbot edits the server's Nginx file;
check the live response with `curl -sI https://siavashizadi.com/` after the next deploy.

| Header                              | Value                                            | Note                                                                                             |
| ----------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Content-Security-Policy             | same-origin only, see ADR-0006                   | `'unsafe-inline'` scripts: documented compromise                                                 |
| Strict-Transport-Security           | `max-age=63072000; includeSubDomains`            | every future subdomain must serve HTTPS. No `preload` on purpose: hard to undo                   |
| X-Frame-Options / `frame-ancestors` | `DENY` / `'none'`                                | both, for old and new browsers                                                                   |
| X-Content-Type-Options              | `nosniff`                                        |                                                                                                  |
| Referrer-Policy                     | `strict-origin-when-cross-origin`                |                                                                                                  |
| Permissions-Policy                  | camera, microphone, geolocation, topics disabled |                                                                                                  |
| Cross-Origin-Opener-Policy          | `same-origin`                                    | new                                                                                              |
| `X-Powered-By`                      | removed                                          | `server_tokens off` in Nginx                                                                     |
| Cache-Control (HTML)                | `s-maxage=31536000` from Next.js                 | no shared cache in front, so browsers revalidate. Static assets are content-hashed and immutable |

## 4. Gaps that remain (not changed)

| Area                   | State                                                                                                                                                   | Low-cost option                                                                                                                         | Cost                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Monitoring             | Added: `uptime.yml` checks the site and the certificate every 30 min from GitHub                                                                        | Paid status page not justified                                                                                                          | free                   |
| Backups                | **None.** Code, image (GHCR) and server files are in Git, so the site can be rebuilt; server state (`/etc`, `.env`, certificates, Nginx edits) cannot   | Hetzner backups (+20 % of server price) **or** a weekly `tar` of `/etc/nginx /opt/portfolio /etc/letsencrypt` to another machine        | needs approval         |
| Restore procedure      | Never tested                                                                                                                                            | Rebuild a fresh VPS from `docs/learning/02-deploy.fa.md` once, time it, write down the gaps                                             | a few hours            |
| Single VPS             | Outage = site down                                                                                                                                      | Accept for a portfolio; Cloudflare proxy (orange cloud) would cache static pages during short outages but changes TLS and IP visibility | free, needs a decision |
| Edge rate limiting     | Only in the app                                                                                                                                         | `limit_req_zone` for `/api/` in Nginx (snippet below)                                                                                   | free                   |
| Image retention (GHCR) | Every push keeps an image forever                                                                                                                       | Retention policy or a cleanup workflow keeping the last 20                                                                              | free                   |
| Dependency updates     | Dependabot (npm, Actions, Docker), weekly, CI on every PR. Actions pinned to commit SHAs. `@types/node` majors ignored (must match the Node 22 runtime) | —                                                                                                                                       | free                   |
| SSH brute force        | One IP retries root every ~17 s; root and password logins are off                                                                                       | Check fail2ban: `sudo fail2ban-client status sshd`                                                                                      | free                   |

Suggested Nginx edge limit (not applied: changes production; apply by hand after review):

```nginx
# http {} context, e.g. /etc/nginx/conf.d/ratelimit.conf
limit_req_zone $binary_remote_addr zone=contact:1m rate=6r/m;

# in the siavashizadi.com server block, before `location /`
location = /api/contact {
    limit_req zone=contact burst=3 nodelay;
    limit_req_status 429;
    proxy_pass http://portfolio_app;
    # same proxy_set_header lines as `location /`
}
```

## 5. If the server is lost

1. New VPS → follow `docs/learning/02-deploy.fa.md` (users, Docker, Nginx, certbot).
2. Recreate `/opt/portfolio/.env` from the Resend dashboard (new API key).
3. Point the DNS `A` record to the new IP.
4. Generate a new deploy key and update the `DEPLOY_SSH_KEY` and `DEPLOY_KNOWN_HOSTS`
   secrets, then re-run the last CI run on `main`.
