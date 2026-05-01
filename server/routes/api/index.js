/**
 * API Routes Index
 * 聚合所有 API 路由
 */

import express from 'express';
import agentsRouter from './agents.js';
import workflowsRouter from './workflows.js';
import executeRouter from './execute.js';
import Logger from '../../middleware/logger.js';

const router = express.Router();
const logger = Logger.child({ module: 'APIRoutes' });

router.use((req, res, next) => {
  logger.debug('API request received', { method: req.method, path: req.path });
  next();
});

router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

router.use('/agents', agentsRouter);
router.use('/workflows', workflowsRouter);
router.use('/execute', executeRouter);

router.use((error, req, res, next) => {
  logger.error('API error', { error: error.message, stack: error.stack });
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    code: error.code
  });
});

export default router;
