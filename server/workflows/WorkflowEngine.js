/**
 * Workflow Engine - 工作流引擎
 * 核心引擎，负责解析、调度和执行工作流
 */

import EventEmitter from 'events';
import Logger from '../middleware/logger.js';

export class WorkflowEngine extends EventEmitter {
  constructor(options = {}) {
    super();
    this.agents = new Map();
    this.connections = [];
    this.nodes = [];
    this.isRunning = false;
    this.currentExecutionId = null;
    this.executionHistory = [];
    this.logger = Logger.child({ module: 'WorkflowEngine' });
    this.options = {
      maxRetries: 3,
      timeout: 300000,
      parallelExecution: false,
      ...options
    };
  }

  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    this.logger.info('Agent registered', { agentId: agent.id, type: agent.type });
    this.emit('agent:registered', agent);
  }

  unregisterAgent(agentId) {
    this.agents.delete(agentId);
    this.logger.info('Agent unregistered', { agentId });
    this.emit('agent:unregistered', agentId);
  }

  loadWorkflow(workflowData) {
    this.validateWorkflow(workflowData);
    this.nodes = workflowData.nodes;
    this.connections = workflowData.connections;
    this.logger.info('Workflow loaded', { nodes: this.nodes.length, connections: this.connections.length });
    this.emit('workflow:loaded', { nodes: this.nodes, connections: this.connections });
  }

  validateWorkflow(workflowData) {
    if (!workflowData) {
      throw new Error('Workflow data is required');
    }
    if (!Array.isArray(workflowData.nodes)) {
      throw new Error('Workflow must have nodes array');
    }
    if (!Array.isArray(workflowData.connections)) {
      throw new Error('Workflow must have connections array');
    }
    
    const nodeIds = new Set(workflowData.nodes.map(n => n.id));
    for (const conn of workflowData.connections) {
      if (!nodeIds.has(conn.source)) {
        throw new Error(`Source node ${conn.source} not found`);
      }
      if (!nodeIds.has(conn.target)) {
        throw new Error(`Target node ${conn.target} not found`);
      }
    }
  }

  topologicalSort() {
    const inDegree = new Map();
    const graph = new Map();
    
    for (const node of this.nodes) {
      inDegree.set(node.id, 0);
      graph.set(node.id, []);
    }
    
    for (const conn of this.connections) {
      inDegree.set(conn.target, (inDegree.get(conn.target) || 0) + 1);
      graph.get(conn.source)?.push(conn.target);
    }

    const queue = [];
    const result = [];
    
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    while (queue.length > 0) {
      const nodeId = queue.shift();
      result.push(nodeId);
      
      const neighbors = graph.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const newDegree = inDegree.get(neighbor) - 1;
        inDegree.set(neighbor, newDegree);
        
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (result.length !== this.nodes.length) {
      throw new Error('Circular dependency detected in workflow');
    }

    return result;
  }

  async execute(input = {}, context = {}) {
    if (this.isRunning) {
      throw new Error('Workflow is already running');
    }

    this.isRunning = true;
    this.currentExecutionId = crypto.randomUUID();
    
    const execution = {
      id: this.currentExecutionId,
      startedAt: new Date().toISOString(),
      input,
      context,
      status: 'running',
      results: {},
      logs: []
    };

    this.logger.info('Starting workflow execution', { executionId: execution.id });
    this.emit('execution:started', execution);

    try {
      const executionOrder = this.topologicalSort();
      this.logger.debug('Execution order', { order: executionOrder });
      
      await this.executeNodes(executionOrder, execution, context);
      
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      execution.duration = Date.now() - new Date(execution.startedAt);
      
      this.logger.info('Workflow execution completed', { 
        executionId: execution.id,
        duration: execution.duration 
      });
      
      this.emit('execution:completed', execution);
    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.failedAt = new Date().toISOString();
      
      this.logger.error('Workflow execution failed', { error: error.message });
      this.emit('execution:failed', execution);
    } finally {
      this.isRunning = false;
      this.executionHistory.push(execution);
    }

    return execution;
  }

  async executeNodes(executionOrder, execution, context) {
    const results = {};
    
    for (const nodeId of executionOrder) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (!node) continue;

      const agent = this.agents.get(node.agentId);
      if (!agent) {
        this.logger.warn('Agent not found for node', { nodeId, agentId: node.agentId });
        continue;
      }

      this.logger.info('Executing node', { nodeId, agentId: agent.id });
      this.emit('node:started', { nodeId, agentId: agent.id });

      try {
        const nodeInput = this.collectInputs(nodeId, results);
        const result = await agent.process(nodeInput, context);
        results[nodeId] = result;
        
        execution.results[nodeId] = result;
        execution.logs.push({
          nodeId,
          status: 'success',
          timestamp: new Date().toISOString()
        });
        
        this.emit('node:completed', { nodeId, result });
      } catch (error) {
        execution.logs.push({
          nodeId,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        this.emit('node:failed', { nodeId, error: error.message });
        
        if (!this.options.continueOnError) {
          throw error;
        }
      }
    }
  }

  collectInputs(nodeId, results) {
    const inputs = {};
    const incomingConnections = this.connections.filter(c => c.target === nodeId);
    
    for (const conn of incomingConnections) {
      inputs[conn.source] = results[conn.source];
    }
    
    return inputs;
  }

  async stop() {
    if (!this.isRunning) {
      this.logger.warn('Workflow is not running');
      return;
    }
    
    this.logger.info('Stopping workflow execution', { executionId: this.currentExecutionId });
    this.isRunning = false;
    this.emit('execution:stopped', { executionId: this.currentExecutionId });
  }

  getExecutionHistory(limit = 10) {
    return this.executionHistory.slice(-limit);
  }

  getStats() {
    return {
      totalAgents: this.agents.size,
      totalNodes: this.nodes.length,
      totalConnections: this.connections.length,
      isRunning: this.isRunning,
      currentExecutionId: this.currentExecutionId,
      totalExecutions: this.executionHistory.length,
      successfulExecutions: this.executionHistory.filter(e => e.status === 'completed').length
    };
  }
}

export default WorkflowEngine;
