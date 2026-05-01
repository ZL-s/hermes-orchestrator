/**
 * PlannerAgent 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlannerAgent } from '../../../server/agents/PlannerAgent.js';

describe('PlannerAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new PlannerAgent('test-planner-001', { name: 'Test Planner' });
  });

  describe('初始化', () => {
    it('应该正确创建实例', () => {
      expect(agent).toBeDefined();
      expect(agent.id).toBe('test-planner-001');
      expect(agent.type).toBe('planner');
    });

    it('应该有正确的能力列表', () => {
      expect(agent.capabilities).toContain('task_planning');
      expect(agent.capabilities).toContain('workflow_design');
    });

    it('初始状态应该为 idle', () => {
      expect(agent.status).toBe('idle');
    });
  });

  describe('任务处理', () => {
    it('应该能够处理简单任务', async () => {
      const result = await agent.process('Test task', {});
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.content.tasks).toBeDefined();
    });

    it('应该生成任务列表', async () => {
      const result = await agent.process('Write code', {});
      
      expect(result.content.tasks).toBeInstanceOf(Array);
      expect(result.content.tasks.length).toBeGreaterThan(0);
    });

    it('应该包含时间估算', async () => {
      const result = await agent.process('Write code', {});
      
      expect(result.content.estimatedTime).toBeDefined();
    });

    it('应该正确设置状态', async () => {
      agent.status = 'running';
      await agent.process('Test', {});
      
      expect(agent.status).toBe('idle');
    });
  });

  describe('错误处理', () => {
    it('应该处理无效输入', async () => {
      const result = await agent.process(null, {});
      
      expect(result).toBeDefined();
    });

    it('应该记录执行历史', async () => {
      await agent.process('Test 1', {});
      await agent.process('Test 2', {});
      
      expect(agent.memory.length).toBeGreaterThan(1);
    });
  });
});
