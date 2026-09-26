import 'server-only';

/**
 * Limiteur de débit en mémoire (fenêtre glissante).
 *
 * Suffisant pour un site vitrine déployé sur une instance ; sur une
 * infrastructure serverless multi-instances, il est complété par la
 * vérification en base (`countRecentSubmissions` dans le route handler).
 */
interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export interface RateLimitOptions {
  /** Nombre maximal de requêtes dans la fenêtre. */
  limit: number;
  /** Taille de la fenêtre en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_KEYS) {
      // Éviction simple : on purge les clés les plus anciennes.
      const firstKey = buckets.keys().next().value;
      if (firstKey) buckets.delete(firstKey);
    }
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= options.limit) {
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000)),
    };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: options.limit - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}
