/**
 * Task Executor - 任务执行器
 * 负责任务的具体执行、重试机制、超时处理
 */

import Logger from '../middleware/logger.js';

export class Executor {
  constructor(options = {}) {
    this.logger = Logger.child({ module: 'Executor' });
    this.options = {
      maxRetries: 3,
      timeout: 300000,
      retryDelay: 1000,
      backoffMultiplier: 2,
      ...options
    };
    this.activeTasks = new Map();
  }

  async execute(taskFn, context = {}) {
    const taskId = crypto.randomUUID();
    let attempt = 0;
    let lastError;

    this.logger.info('Starting task execution', { taskId, taskType: context.taskType });

    while (attempt < this.options.maxRetries) {
      try {
        attempt++;
        
        const result = await this.executeWithTimeout(taskFn, context);
        
        this.logger.info('Task completed successfully', { 
          taskId,
          attempt,
          duration: context._startTime ? Date.now() - context._startTime : 'unknown'
        });
        
        return {
          success: true,
          result,
          taskId,
          attempt
        };
      } catch (error) {
        lastError = error;
        this.logger.warn('Task execution failed', { 
          taskId, 
          attempt, 
          error: error.message 
        });
        
        if (attempt < this.options.maxRetries) {
          const delay = this.getRetryDelay(attempt);
          this.logger.debug('Retrying after delay', { taskId, delay, nextAttempt: attempt + 1 });
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    this.logger.error('Task failed permanently', { 
      taskId, 
      attempts: this.options.maxRetries, 
      error: lastError?.message 
    });

    return {
      success: false,
      error: lastError?.message,
      taskId,
      attempts: attempt
    };
  }

  async executeWithTimeout(taskFn, context = {}) {
    context._startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Task timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);

      taskFn(context)
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  getRetryDelay(attempt) {
    const baseDelay = this.options.retryDelay;
    const multiplier = Math.pow(this.options.backoffMultiplier, attempt - 1);
    const jitter = Math.random() * 0.3;
    return Math.floor(baseDelay * multiplier * (1 + jitter));
  }

  async executeBatch(tasks, options = {}) {
    const { parallel = false, maxConcurrency = 5 } = options;
    const results = [];
    
    this.logger.info('Starting batch execution', { 
      totalTasks: tasks.length,
      parallel,
      maxConcurrency
    });

    if (parallel) {
      for (let i = 0; i < tasks.length; i += maxConcurrency) {
        const batch = tasks.slice(i, i + maxConcurrency);
        const batchResults = await Promise.allSettled(
          batch.map(task => this.execute(task.fn, task.context))
        );
        results.push(...batchResults);
      }
    } else {
      for (const task of tasks) {
        const result = await this.execute(task.fn, task.context);
        results.push(result);
      }
    }

    const successful = results.filter(r => r.success === true).length;
    const failed = results.filter(r => r.success === false).length;

    this.logger.info('Batch execution completed', {
      total: tasks.length,
      successful,
      failed
    });

    return { results, successful, failed, total: tasks.length };
  }

  cancelTask(taskId) {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.aborted = true;
      this.logger.info('Task cancelled', { taskId });
      return true;
    }
    return false;
  }

  getActiveTasks() {
    return Array.from(this.activeTasks.values());
  }

  getStats() {
    return {
      activeTasks: this.activeTasks.size,
      maxRetries: this.options.maxRetries,
      timeout: this.options.timeout
    };
  }
}

export default Executor;
