/**
 * Error Handler Middleware
 * 全局错误处理中间件
 */

import Logger from './logger.js';

const logger = Logger.child({ module: 'ErrorHandler' });

export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let errorCode = 'INTERNAL_ERROR';

  if (err.status || err.statusCode) {
    statusCode = err.status || err.statusCode;
  }

  if (err.message) {
    errorMessage = err.message;
  }

  if (err.code) {
    errorCode = err.code;
  }

  if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    statusCode = 400;
    errorMessage = 'Invalid JSON format';
    errorCode = 'INVALID_JSON';
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    code: errorCode,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
}

export function notFoundHandler(req, res) {
  logger.warn('Route not found', { method: req.method, path: req.path });
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path
  });
}

export function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;
