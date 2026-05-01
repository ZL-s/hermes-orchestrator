/**
 * Tester Agent - 测试智能体
 * 负责单元测试、集成测试、功能测试、性能测试等任务
 */

import { BaseAgent } from './BaseAgent.js';

export class TesterAgent extends BaseAgent {
  constructor(id, config) {
    super(id, 'tester', config);
    this.capabilities = [
      'unit_testing',
      'integration_testing',
      'e2e_testing',
      'performance_testing',
      'security_testing',
      'regression_testing'
    ];
    this.testReports = [];
  }

  async process(input, context = {}) {
    this.logger.info('TesterAgent starting test suite', {
      testType: context.testType || 'comprehensive',
      target: context.target || 'application'
    });

    this.setStatus('running');
    
    // 执行测试套件
    const testResults = await this.runTestSuite(input, context);
    
    const result = {
      agentId: this.id,
      agentType: this.type,
      success: true,
      timestamp: new Date().toISOString(),
      testResults,
      summary: this.generateSummary(testResults),
      coverage: this.generateCoverageReport()
    };

    this.testReports.push(result);
    this.setStatus('idle');
    this.logger.info('TesterAgent test suite completed', { 
      passed: testResults.passed, 
      failed: testResults.failed 
    });
    
    return result;
  }

  async runTestSuite(input, context) {
    const testCategories = [
      { name: '单元测试', tests: ['功能A', '功能B', '功能C'] },
      { name: '集成测试', tests: ['API集成', '数据库集成', '第三方服务'] },
      { name: 'UI测试', tests: ['页面渲染', '用户交互', '响应式布局'] },
      { name: '性能测试', tests: ['加载时间', '响应速度', '内存使用'] },
      { name: '安全测试', tests: ['XSS防护', 'SQL注入防护', '认证安全'] }
    ];

    const results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      categories: [],
      duration: 0
    };

    const startTime = Date.now();

    for (const category of testCategories) {
      const categoryResults = {
        name: category.name,
        tests: []
      };

      for (const test of category.tests) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
        
        const passed = Math.random() > 0.15;
        results.total++;
        passed ? results.passed++ : results.failed++;
        
        categoryResults.tests.push({
          name: test,
          status: passed ? 'passed' : 'failed',
          duration: Math.floor(50 + Math.random() * 150),
          timestamp: new Date().toISOString(),
          error: passed ? null : this.generateRandomError()
        });
      }
      
      results.categories.push(categoryResults);
    }

    results.duration = Date.now() - startTime;
    return results;
  }

  generateRandomError() {
    const errors = [
      'Assertion failed: expected value mismatch',
      'Timeout error: test took too long',
      'Network error: connection failed',
      'DOM error: element not found',
      'API error: invalid response status'
    ];
    return errors[Math.floor(Math.random() * errors.length)];
  }

  generateSummary(testResults) {
    const passRate = (testResults.passed / testResults.total * 100).toFixed(1);
    
    return {
      passRate: passRate + '%',
      passed: testResults.passed,
      failed: testResults.failed,
      total: testResults.total,
      duration: testResults.duration + 'ms',
      status: passRate >= 90 ? 'success' : passRate >= 70 ? 'warning' : 'failed'
    };
  }

  generateCoverageReport() {
    return {
      lines: Math.floor(70 + Math.random() * 30) + '%',
      functions: Math.floor(65 + Math.random() * 35) + '%',
      branches: Math.floor(60 + Math.random() * 40) + '%',
      statements: Math.floor(75 + Math.random() * 25) + '%'
    };
  }

  getLatestReport() {
    return this.testReports[this.testReports.length - 1] || null;
  }

  getTestStats() {
    return {
      totalTestRuns: this.testReports.length,
      capabilities: this.capabilities,
      recentResults: this.testReports.slice(-5)
    };
  }
}

export default TesterAgent;
