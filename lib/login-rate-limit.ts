/** Simple in-memory login rate limiter (best-effort on serverless). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

type AttemptBucket = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, AttemptBucket>();

function pruneExpired(now: number) {
  if (attempts.size < 200) return;
  for (const [key, bucket] of attempts) {
    if (bucket.resetAt <= now) attempts.delete(key);
  }
}

export function checkLoginRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  pruneExpired(now);

  const bucket = attempts.get(key);
  if (!bucket || bucket.resetAt <= now) {
    return { allowed: true };
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  existing.count += 1;
  attempts.set(key, existing);
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
