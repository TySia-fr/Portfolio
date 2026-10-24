import "server-only";

/**
 * In-memory sliding-window rate limiter.
 *
 * Good enough for this deployment: ONE container on ONE server (ADR-0002).
 * It resets on restart and would not be shared between several instances; a
 * second instance would need a shared store (Redis) instead.
 *
 * Keys are client IP addresses. A timer forgets every key whose attempts are
 * all older than the window, so an address stays in memory at most two windows
 * (the privacy notice promises less than an hour).
 */
export class SlidingWindowLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxKeys = 10_000,
  ) {
    // unref(): this timer alone never keeps the process alive.
    setInterval(() => this.prune(Date.now() - this.windowMs), this.windowMs).unref();
  }

  /** Records an attempt. Returns the seconds to wait if the key is over its limit. */
  consume(
    key: string,
    now = Date.now(),
  ): { allowed: true } | { allowed: false; retryAfterS: number } {
    const since = now - this.windowMs;
    const known = this.hits.get(key);

    // Bounded memory even under a flood of distinct addresses: if the table is
    // full of active keys, new keys are refused (fail closed) until it drains.
    if (!known && this.hits.size >= this.maxKeys) {
      this.prune(since);
      if (this.hits.size >= this.maxKeys) {
        return { allowed: false, retryAfterS: Math.ceil(this.windowMs / 1000) };
      }
    }

    const recent = (known ?? []).filter((time) => time > since);

    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      const oldest = recent[0] ?? now;
      return {
        allowed: false,
        retryAfterS: Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000)),
      };
    }

    recent.push(now);
    this.hits.set(key, recent);
    return { allowed: true };
  }

  private prune(since: number) {
    for (const [key, times] of this.hits) {
      if (times.every((time) => time <= since)) this.hits.delete(key);
    }
  }
}
