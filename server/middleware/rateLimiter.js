/**
 * Rate Limiter Middleware
 * 速率限制中间件
 */

export class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000;
    this.max = options.max || 100;
    this.message = options.message || 'Too many requests';
    this.store = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const key = this.getKey(req);
      const now = Date.now();
      const windowStart = now - this.windowMs;

      let requests = this.store.get(key) || [];
      requests = requests.filter(timestamp => timestamp > windowStart);
      
      if (requests.length >= this.max) {
        return res.status(429).json({
          success: false,
          error: this.message,
          code: 'TOO_MANY_REQUESTS',
          retryAfter: Math.ceil((requests[0] + this.windowMs - now) / 1000)
        });
      }

      requests.push(now);
      this.store.set(key, requests);

      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.max - requests.length));
      res.setHeader('X-RateLimit-Reset', Math.ceil((windowStart + this.windowMs) / 1000));

      next();
    };
  }

  getKey(req) {
    return req.ip || 'anonymous';
  }

  reset()