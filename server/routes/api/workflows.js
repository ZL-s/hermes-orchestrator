/**
 * Workflows API Routes
 * 工作流 API 路由
 */

import express from 'express';
import Logger from '../../middleware/logger.js';

const router = express.Router();
const logger = Logger.child({ module: 'WorkflowsAPI' });

const workflows = new Map();

router.get('/', (req, res) => {
  const allWorkflows = Array.from(workflows.values());
  
  res.json({
    success: true,
    data: allWorkflows,
    meta: {
      total: allWorkflows.length,
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found'
    });
  }

  res.json({
    success: true,
    data: workflow
  });
});

router.post('/', (req, res) => {
  const { name, description, nodes, connections, config = {} } = req.body;
  
  if (!Array.isArray(nodes)) {
    return res.status(400).json({
      success: false,
      error: 'Nodes array is required'
    });
  }

  if (!Array.isArray(connections)) {
    return res.status(400).json({
      success: false,
      error: 'Connections array is required'
    });
  }

  const workflowId = crypto.randomUUID();
  const workflow = {
    id: workflowId,
    name: name || 'Untitled Workflow',
    description: description || '',
    nodes,
    connections,
    config,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  workflows.set(workflowId, workflow);
  logger.info('Workflow created', { workflowId });

  res.status(201).json({
    success: true,
    data: workflow
  });
});

router.put('/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found'
    });
  }

  const { name, description, nodes, connections, config, status } = req.body;
  
  if (name) workflow.name = name;
  if (description !== undefined) workflow.description = description;
  if (nodes) workflow.nodes = nodes;
  if (connections) workflow.connections = connections;
  if (config) workflow.config = { ...workflow.config, ...config };
  if (status) workflow.status = status;
  workflow.updatedAt = new Date().toISOString();

  logger.info('Workflow updated', { workflowId: req.params.id });

  res.json({
    success: true,
    data: workflow
  });
});

router.delete('/:id', (req, res) => {
  const deleted = workflows.delete(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found'
    });
  }

  logger.info('Workflow deleted', { workflowId: req.params.id });

  res.json({
    success: true,
    message: 'Workflow deleted successfully'
  });
});

router.get('/:id/validate', (req, res) => {
  const workflow = workflows.get(req.params.id);
  
  if (!workflow) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found'
    });
  }

  const errors = validateWorkflow(workflow);
  
  res.json({
    success: errors.length === 0,
    data: {
      valid: errors.length === 0,
      errors
    }
  });
});

function validateWorkflow(workflow) {
  const errors = [];
  const nodeIds = new Set(workflow.nodes.map(n => n.id));
  
  for (const conn of workflow.connections) {
    if (!nodeIds.has(conn.source)) {
      errors.push(`Source node ${conn.source} not found`);
    }
    if (!nodeIds.has(conn.target)) {
      errors.push(`Target node ${conn.target} not found`);
    }
  }
  
  if (checkCycles(workflow)) {
    errors.push('Circular dependency detected');
  }
  
  return errors;
}

function checkCycles(workflow) {
  const visited = new Set();
  const recursionStack = new Set();
  
  const graph = new Map();
  for (const node of workflow.nodes) {
    graph.set(node.id, []);
  }
  for (const conn of workflow.connections) {
    graph.get(conn.source)?.push(conn.target);
  }
  
  function hasCycle(nodeId) {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const neighbors = graph.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const node of workflow.nodes) {
    if (!visited.has(node.id) && hasCycle(node.id)) {
      return true;
    }
  }
  
  return false;
}

export default router;
