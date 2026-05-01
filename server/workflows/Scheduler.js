/**
 * 工作流调度器
 * 负责任务调度、资源分配和执行控制
 */

import EventEmitter from 'events';

export class Scheduler extends EventEmitter {
  constructor(options = {}) {
    super();
    this.queues = new Map();
    this.workers = new Map();
    this.isRunning = false;
    this.concurrency = options.concurrency || 5;
    this.maxRetries = options.maxRetries || 3;
    this.stats = {
      total: 0,
      completed: 0,
      failed: 0,
      pending: 0,
      processing: 0,
    };
  }

  async schedule(task, queueName = 'default') {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const queue = this.queues.get(queueName);
    const taskWithId = {
      id: crypto.randomUUID(),
      ...task,
      status: 'pending',
      retries: 0,
      createdAt: new Date(),
    };

    queue.push(taskWithId);
    this.stats.total++;
    this.stats.pending++;

    this.emit('task:added', taskWithId);
    this.processQueue(queueName);

    return taskWithId;
  }

  async processQueue(queueName) {
    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) return;

    const availableWorkers = this.concurrency - this.stats.processing;
    if (availableWorkers <= 0) return;

    const tasksToProcess = queue.splice(0, availableWorkers);
    
    for (const task of tasksToProcess) {
      this.executeTask(task, queueName);
    }
  }

  async executeTask(task, queueName) {
    this.stats.pending--;
    this.stats.processing++;
    task.status = 'processing';
    task.startedAt = new Date();

    this.emit('task:started', task);

    try {
      await this.runTask(task);
      task.status = 'completed';
      task.completedAt = new Date();
      this.stats.completed++;
      this.emit('task:completed', task);
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.failedAt = new Date();
      
      if (task.retries < this.maxRetries) {
        task.retries++;
        task.status = 'retrying';
        this.emit('task:retrying', task);
        const queue = this.queues.get(queueName);
        queue.push(task);
        this.stats.pending++;
      } else {
        this.stats.failed++;
        this.emit('task:failed', task);
      }
    } finally {
      this.stats.processing--;
      this.processQueue(queueName);
    }
  }

  async runTask(task) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));
    return { success: true, result: task.data };
  }

  getStats() {
    return {
      ...this.stats,
      queues: Object.fromEntries(Array.from(this.queues.entries()).map(([name, queue]) => [name, queue.length])),
      uptime: Date.now() - this.startedAt,
    };
  }

  start() {
    this.startedAt = Date.now();
    this.isRunning = true;
    this.emit('scheduler:started');
  }

  stop() {
    this.isRunning = false;
    this.emit('scheduler:stopped');
  }
}

export default Scheduler;
