/**
 * Model Router - 模型路由器
 * 统一管理和路由多个 LLM 模型
 */

import Logger from '../middleware/logger.js';
import OpenAIClient from './OpenAIClient.js';
import ClaudeClient from './ClaudeClient.js';

export class ModelRouter {
  constructor(options = {}) {
    this.logger = Logger.child({ module: 'ModelRouter' });
    this.models = new Map();
    this.routingRules = [];
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      modelUsage: {}
    };
    
    this.options = {
      defaultModel: 'openai:gpt-4o',
      autoFallback: true,
      loadBalancing: 'round_robin',
      ...options
    };

    this.roundRobinIndex = 0;
  }

  registerModel(id, client, config = {}) {
    this.models.set(id, { client, config, available: true });
    this.stats.modelUsage[id] = 0;
    this.logger.info('Model registered', { modelId: id });
  }

  unregisterModel(id) {
    this.models.delete(id);
    delete this.stats.modelUsage[id];
    this.logger.info('Model unregistered', { modelId: id });
  }

  addRoutingRule(rule) {
    this.routingRules.push(rule);
    this.logger.debug('Routing rule added', { rule });
  }

  selectModel(context = {}) {
    for (const rule of this.routingRules) {
      if (rule.match(context)) {
        const model = this.getAvailableModelById(rule.modelId);
        if (model) {
          this.logger.debug('Selected model by rule', { ruleId: rule.id, modelId: rule.modelId });
          return { id: rule.modelId, ...model };
        }
      }
    }

    switch (this.options.loadBalancing) {
      case 'round_robin':
        return this.selectRoundRobin();
      case 'least_usage':
        return this.selectLeastUsed();
      default:
        return this.getDefaultModel();
    }
  }

  selectRoundRobin() {
    const availableModels = this.getAvailableModels();
    if (availableModels.length === 0) {
      throw new Error('No available models');
    }

    const model = availableModels[this.roundRobinIndex % availableModels.length];
    this.roundRobinIndex++;
    return model;
  }

  selectLeastUsed() {
    const availableModels = this.getAvailableModels();
    if (availableModels.length === 0) {
      throw new Error('No available models');
    }

    return availableModels.reduce((min, model) => {
      const currentUsage = this.stats.modelUsage[model.id] || 0;
      const minUsage = this.stats.modelUsage[min.id] || 0;
      return currentUsage < minUsage ? model : min;
    });
  }

  getDefaultModel() {
    const model = this.models.get(this.options.defaultModel);
    if (model && model.available) {
      return { id: this.options.defaultModel, ...model };
    }
    
    const firstAvailable = this.getAvailableModels()[0];
    if (firstAvailable) {
      return firstAvailable;
    }

    throw new Error('No models available');
  }

  getAvailableModels() {
    return Array.from(this.models.entries())
      .filter(([_, model]) => model.available)
      .map(([id, model]) => ({ id, ...model }));
  }

  getAvailableModelById(id) {
    const model = this.models.get(id);
    return model && model.available ? { id, ...model } : null;
  }

  async chat(messages, options = {}) {
    this.stats.totalRequests++;
    const startTime = Date.now();
    
    let model;
    try {
      model = options.modelId 
        ? this.getAvailableModelById(options.modelId) 
        : this.selectModel(options.context);
    } catch (error) {
      this.stats.failedRequests++;
      this.logger.error('Model selection failed', { error: error.message });
      return { success: false, error: error.message };
    }

    const modelId = model.id;
    this.stats.modelUsage[modelId] = (this.stats.modelUsage[modelId] || 0) + 1;
    
    try {
      this.logger.debug('Chat request', { modelId, messageCount: messages.length });
      
      const result = await model.client.chat(messages, {
        ...options,
        model: options.modelName
      });

      if (result.success) {
        this.stats.successfulRequests++;
      } else {
        this.stats.failedRequests++;
        
        if (this.options.autoFallback) {
          this.logger.warn('Falling back to next model', { modelId });
          model.available = false;
          return this.chat(messages, { ...options, modelId: null });
        }
      }

      result.modelId = modelId;
      result.latency = Date.now() - startTime;
      return result;
    } catch (error) {
      this.stats.failedRequests++;
      this.logger.error('Chat request failed', { modelId, error: error.message });
      
      if (this.options.autoFallback) {
        model.available = false;
        return this.chat(messages, { ...options, modelId: null });
      }
      
      return { success: false, error: error.message, modelId };
    }
  }

  async stream(messages, onChunk, options = {}) {
    let model;
    try {
      model = options.modelId 
        ? this.getAvailableModelById(options.modelId) 
        : this.selectModel(options.context);
    } catch (error) {
      return { success: false, error: error.message };
    }

    this.stats.modelUsage[model.id] = (this.stats.modelUsage[model.id] || 0) + 1;
    
    try {
      return await model.client.stream(messages, onChunk, options);
    } catch (error) {
      return { success: false, error: error.message, modelId: model.id };
    }
  }

  async checkAllModels() {
    const results = {};
    for (const [id, model] of this.models) {
      try {
        if (model.client.checkModelAvailability) {
          const result = await model.client.checkModelAvailability();
          model.available = result.available;
          results[id] = result;
        } else {
          results[id] = { available: model.available };
        }
      } catch (error) {
        model.available = false;
        results[id] = { available: false, error: error.message };
      }
    }
    return results;
  }

  resetModelAvailability() {
    for (const model of this.models.values()) {
      model.available = true;
    }
  }

  getStats() {
    const successRate = this.stats.totalRequests > 0 
      ? ((this.stats.successfulRequests / this.stats.totalRequests) * 100).toFixed(1) 
      : 0;
    
    return {
      ...this.stats,
      successRate: successRate + '%',
      registeredModels: this.models.size,
      availableModels: this.getAvailableModels().length
    };
  }

  resetStats() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      modelUsage: Object.fromEntries(
        Array.from(this.models.keys()).map(id => [id, 0])
      )
    };
  }
}

export default ModelRouter;
