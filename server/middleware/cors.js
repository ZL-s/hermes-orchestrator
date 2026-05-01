/**
 * CORS Middleware
 * 跨域资源共享中间件
 */

export function corsMiddleware(options = {}) {
  const defaultOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'User-Agent',
      'DNT',
      'Cache-Control',
      'X-Request-Id',
      'X-CSRF-Token'
    ],
    exposedHeaders: [
      'X-Request-Id',
      'X-Total-Count',
      'X-Page-Count'
    ],
    credentials: true,
    maxAge: 86400
  };

  const config = { ...defaultOptions, ...options };

  return (req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = Array.isArray(config.origin) 
      ? config.origin 
      : [config.origin];

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Methods', config.methods.join(','));
    res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(','));
    res.setHeader('Access-Control-Expose-Headers', config.exposedHeaders.join(','));
    res.setHeader('Access-Control-Max-Age', config.maxAge);

    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  };
}

export default corsMiddleware;
