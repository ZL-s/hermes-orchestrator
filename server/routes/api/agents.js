/**
 * Agents API Routes
 * 智能体 API 路由
 */

import express from 'express';
import Logger from '../../middleware/logger.js';

const router = express.Router();
const logger = Logger.child({ module: 'AgentsAPI' });

const agentTypes = [
  { id: 'planner', name: '规划智能体', icon: '📋', role: '任务规划' },
  { id: 'researcher', name: '研究智能体', icon: '🔍', role: '信息收集' },
  { id: 'coder', name: '编码智能体', icon: '💻', role: '代码生成' },
  { id: 'reviewer', name: '审核智能体', icon: '✅', role: '质量检查' },
  { id: 'writer', name: '写作智能体', icon: '✍️', role: '内容创作' },
  { id: 'designer', name: '设计智能体', icon: '🎨', role: 'UI设计' },
  { id: 'tester', name: '测试智能体', icon: '🧪', role: '功能测试' },
  { id: 'analyst', name: '分析智能体', icon: '📊', role: '数据分析' }
];

const agents = new Map();

router.get('/', (req, res) => {
  const allAgents = Array.from(agents.values());
  
  res.json({
    success: true,
    data: allAgents,
    meta: {
      total: allAgents.length,
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: agentTypes
  });
});

router.get('/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  res.json({
    success: true,
    data: agent
  });
});

router.post('/', (req, res) => {
  const { type, config = {}, id } = req.body;
  
  if (!type) {
    return res.status(400).json({
      success: false,
      error: 'Agent type is required'
    });
  }

  const agentType = agentTypes.find(a => a.id === type);
  if (!agentType) {
    return res.status(400).json({
      success: false,
      error: 'Invalid agent type'
    });
  }

  const agentId = id || crypto.randomUUID();
  const agent = {
    id: agentId,
    type,
    name: config.name || agentType.name,
    icon: agentType.icon,
    role: agentType.role,
    status: 'idle',
    config,
    createdAt: new Date().toISOString()
  };

  agents.set(agentId, agent);
  logger.info('Agent created', { agentId, type });

  res.status(201).json({
    success: true,
    data: agent
  });
});

router.put('/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  const { config, name, status } = req.body;
  
  if (name) agent.name = name;
  if (config) agent.config = { ...agent.config, ...config };
  if (status) agent.status = status;
  agent.updatedAt = new Date().toISOString();

  logger.info('Agent updated', { agentId: req.params.id });

  res.json({
    success: true,
    data: agent
  });
});

router.delete('/:id', (req, res) => {
  const deleted = agents.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  logger.info('Agent deleted', { agentId: req.params.id });

  res.json({
    success: true,
    message: 'Agent deleted successfully'
  });
});

router.post('/:id/process', async (req, res) => {
  const agent = agents.get(req.params.id);
  
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }

  const { input, context } = req.body;
  
  agent.status = 'running';
  logger.info('Agent processing', { agentId: req.params.id });

  try {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const result = {
      agentId: req.params.id,
      agentType: agent.type,
      success: true,
      timestamp: new Date().toISOString(),
      output: {
        result: `Processed successfully by ${agent.name}`,
        input: input?.slice(0, 100),
        metadata: context
      }
    };

    agent.status = 'idle';
    logger.info('Agent processed completed', { agentId: req.params.id });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    agent.status = 'idle';
    logger.error('Agent processing failed', { error: error.message });
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
