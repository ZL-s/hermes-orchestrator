# Reports & Analytics

Hermes AI Orchestrator 生成详细的执行报告和分析数据。

---

## 报告类型

### 1. 工作流执行报告
```json
{
  "report_id": "report-20260502-abc123",
  "workflow_id": "wf-001",
  "workflow_name": "Research & Development Pipeline",
  "start_time": "2026-05-02T10:00:00Z",
  "end_time": "2026-05-02T10:52:30Z",
  "duration_seconds": 3150,
  "status": "success",
  
  "summary": {
    "total_tasks": 12,
    "completed_tasks": 12,
    "failed_tasks": 0,
    "retried_tasks": 2,
    "success_rate": 100
  },
  
  "token_usage": {
    "total": 52400,
    "by_agent": {
      "planner": 3200,
      "researcher": 18500,
      "coder": 24000,
      "reviewer": 6700
    },
    "cost_estimate": 0.1572
  },
  
  "node_executions": [...],
  "errors": [],
  "output": {...}
}
```

### 2. Agent 性能报告
```json
{
  "agent_type": "coder",
  "period": {
    "start": "2026-05-01T00:00:00Z",
    "end": "2026-05-02T00:00:00Z"
  },
  
  "performance": {
    "tasks_completed": 45,
    "average_duration": 125.3,
    "success_rate": 97.8,
    "average_tokens": 4200
  },
  
  "quality": {
    "review_score": 4.5,
    "bug_rate": 0.04
  }
}
```

---

## 可视化输出

### 执行时间线
```
Time (min) │ 0   5   10   15   20   25   30   35   40   45   50
───────────┼──────────────────────────────────────────────────
Planner    │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
Researcher │░░░░█████████████████████░░░░░░░░░░░░░░░░░░░░░░
Coder      │░░░░░░░░░░░░░░░░░░░█████████████████████████████
Reviewer   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████████████
```

### Token 消耗饼图
```
┌─────────────────────────────────────────┐
│                                         │
│     Planner      6%                    │
│     Researcher  35%  ████████           │
│     Coder       46%  ███████████       │
│     Reviewer    13%  ███                │
│                                         │
│     Total: 52,400 tokens               │
└─────────────────────────────────────────┘
```

---

## 导出格式

### 支持格式
- JSON (完整数据)
- Markdown (人类可读)
- HTML (美观报告)
- CSV (分析数据)

### Markdown 报告示例
```markdown
# Workflow Execution Report: Research & Development

## Summary
- **Status**: ✅ Success
- **Duration**: 52 min 30 sec
- **Tasks**: 12 completed, 0 failed

## Agent Performance

| Agent     | Tasks | Duration | Tokens | Success |
|-----------|-------|----------|--------|---------|
| Planner   | 1     | 2:15     | 3,200  | 100%    |
| Researcher| 3     | 18:40    | 18,500 | 100%    |
| Coder     | 6     | 28:20    | 24,000 | 100%    |
| Reviewer  | 2     | 8:15     | 6,700  | 100%    |

## Key Outputs

... [results here] ...
```

---

## 分析维度

### 1. 性能分析
- 整体耗时
- 瓶颈识别
- 并行效率

### 2. 成本分析
- Token 消耗
- 按 Agent 分布
- 优化建议

### 3. 质量分析
- 成功率
- 评审分数
- 错误类型

---

## 自定义报告

### 添加自定义指标
```yaml
custom_metrics:
  - name: "code_quality"
    source: "reviewer"
    calculation: "average_score"
  
  - name: "research_coverage"
    source: "researcher"
    calculation: "sources_per_topic"
```
