/**
 * Execute API Routes
 * 执行 API 路由
 */

import express from 'express';
import Logger from '../../middleware/logger.js';

const router = express.Router();
const logger = Logger.child({ module: 'ExecuteAPI' });

const executions = new Map();

router.post('/', async (req, res) => {
  const { workflowId, input = {}, context = {} } = req.body;
  
  if (!workflowId) {
    return res.status(400).json({
      success: false,
      error: 'Workflow ID is required'
    });
  }

  const executionId = crypto.randomUUID();
  
  const execution = {
    id: executionId,
    workflowId,
    status: 'pending',
    input,
    context,
    logs: [],
    results: {},
    createdAt: new Date().toISOString()
  };

  executions.set(executionId, execution);
  logger.info('Execution created', { executionId, workflowId });

  res.status(202).json({
    success: true,
    data: {
      executionId,
      status: execution.status,
      workflowId
    }
  });

  await simulateExecution(executionId, execution);
});

async function simulateExecution(executionId, execution) {
  execution.status = 'running';
  execution.startedAt = new Date().toISOString();
  
  execution.logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Starting workflow execution'
  });

  try {
    const steps = [
      '初始化工作流引擎',
      '加载工作流配置',
      '执行任务规划',
      '执行研究分析',
      '执行代码生成',
      '执行质量检查',
      '收集并汇总结果'
    ];

    for (let i = 0; i < steps.length; i++) {
      if (!executions.has(executionId)) break;

      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      execution.logs.push({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: steps[i],
        progress: ((i + 1) / steps.length * 100).toFixed(0) + '%'
      });
    }

    execution.status = 'completed';
    execution.completedAt = new Date().toISOString();
    execution.duration = Date.now() - new Date(execution.startedAt);
    execution.results = {
      finalOutput: 'Workflow executed successfully',
      stepResults: steps.map(step => ({ step, status: 'completed' })),
      metadata: {
        executionTime: execution.duration,
        nodesExecuted: 5,
        successRate: '100%'
      }
    };

    execution.logs.push({
      timestamp: new Date().toISOString(),
      level: 'success',
      message: 'Workflow completed successfully'
    });

    logger.info('Execution completed', { executionId });
  } catch (error) {
    execution.status = 'failed';
    execution.failedAt = new Date().toISOString();
    execution.error = error.message;

    execution.logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message
    });

    logger.error('Execution failed', { executionId, error: error.message });
  }
}

router.get('/:id', (req, res) => {
  const execution = executions.get(req.params.id);
  
  if (!execution) {
    return res.status(404).json({
      success: false,
      error: 'Execution not found'
    });
  }

  res.json({
    success: true,
    data: execution
  });
});

router.get('/:id/logs', (req, res) => {
  const execution = executions.get(req.params.id);
  
  if (!execution) {
    return res.status(404).json({
      success: false,
      error: 'Execution not found'
    });
  }

  res.json({
    success: true,
    data: execution.logs,
    meta: {
      total: execution.logs.length
    }
  });
});

router.get('/:id/status', (req, res) => {
  const execution = executions.get(req.params.id);
  
  if (!execution) {
    return res.status(404).json({
      success: false,
      error: 'Execution not found'
    });
  }

  res.json({
    success: true,
    data: {
      id: execution.id,
      status: execution.status,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      failedAt: execution.failedAt,
      duration: execution.duration
    }
  });
});

router.post('/:id/cancel', (req, res) => {
  const execution = executions.get(req.params.id);
  
  if (!execution) {
    return res.status(404).json({
      success: false,
      error: 'Execution not found'
    });
  }

  if (execution.status !== 'running' && execution.status !== 'pending') {
    return res.status(400).json({
      success: false,
      error: 'Execution is not in cancellable state'
    });
  }

  execution.status = 'cancelled';
  execution.cancelledAt = new Date().toISOString();
  
  execution.logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Execution cancelled by user'
  });

  logger.info('Execution cancelled', { executionId: req.params.id });

  res.json({
    success: true,
    message: 'Execution cancelled successfully',
    data: execution
  });
});

router.delete('/:id', (req, res) => {
  const deleted = executions.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Execution not found'
    });
  }

  logger.info('Execution deleted', { executionId: req.params.id });

  res.json({
    success: true,
    message: 'Execution deleted successfully'
  });
});

export default router;
