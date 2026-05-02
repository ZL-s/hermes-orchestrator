# Agent Communication Protocol

Hermes AI Orchestrator 使用结构化消息协议实现 Agent 之间的可靠通信。

---

## 通信架构

### 消息总线
```
┌─────────────┐
│   Orchestrator  │
└────────┬────┘
         │
         ├────────────────┬────────────────┐
         │                │                │
    ┌────▼───┐      ┌────▼───┐      ┌────▼───┐
    │ Planner  │      │Researcher│      │  Coder   │
    └────┬───┘      └────┬───┘      └────┬───┘
         │                │                │
         └────────────────┴────────────────┘
                   │
              ┌────▼────┐
              │  Message  │
              │    Bus    │
              └──────────┘
```

---

## 消息格式

### 标准消息结构
```typescript
interface Message {
  id: string;                    // UUID
  type: MessageType;             // 消息类型
  sender: AgentAddress;          // 发送方
  recipient: AgentAddress;       // 接收方
  timestamp: ISO8601Timestamp;   // 时间戳
  correlation_id?: string;       // 关联ID
  priority: Priority;            // 优先级
  payload: any;                  // 消息内容
  metadata?: Record<string, any>;// 元数据
}

enum MessageType {
  TASK_REQUEST = "task_request",
  TASK_RESPONSE = "task_response",
  DATA_REQUEST = "data_request",
  DATA_RESPONSE = "data_response",
  STATUS_UPDATE = "status_update",
  ERROR = "error",
  HEARTBEAT = "heartbeat",
  ACK = "acknowledgment"
}

enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

interface AgentAddress {
  agent_id: string;
  agent_type: string;
  instance: number;
}
```

### 任务请求示例
```json
{
  "id": "msg-550e8400-e29b-41d4-a716-446655440000",
  "type": "task_request",
  "sender": {
    "agent_id": "planner-001",
    "agent_type": "planner",
    "instance": 1
  },
  "recipient": {
    "agent_id": "researcher-001",
    "agent_type": "researcher",
    "instance": 1
  },
  "timestamp": "2026-05-02T10:30:00.000Z",
  "correlation_id": "workflow-abc-123",
  "priority": 3,
  "payload": {
    "task_id": "task-research-001",
    "query": "Latest AI research on multi-agent systems",
    "requirements": {
      "max_sources": 10,
      "include_citations": true,
      "summary_length": "detailed"
    }
  },
  "metadata": {
    "workflow_id": "wf-001",
    "step": 2,
    "deadline": "2026-05-02T11:00:00Z"
  }
}
```

### 任务完成示例
```json
{
  "id": "msg-123e4567-e89b-12d3-a456-426614174000",
  "type": "task_response",
  "sender": {
    "agent_id": "researcher-001",
    "agent_type": "researcher",
    "instance": 1
  },
  "recipient": {
    "agent_id": "planner-001",
    "agent_type": "planner",
    "instance": 1
  },
  "timestamp": "2026-05-02T10:45:30.000Z",
  "correlation_id": "workflow-abc-123",
  "priority": 2,
  "payload": {
    "task_id": "task-research-001",
    "status": "success",
    "result": {
      "sources": [...],
      "summary": "...",
      "citations": [...]
    },
    "duration_seconds": 45.3,
    "token_usage": {
      "prompt": 1500,
      "completion": 3200,
      "total": 4700
    }
  },
  "metadata": {
    "workflow_id": "wf-001"
  }
}
```

---

## 通信模式

### 1. 请求-响应模式
```
Planner → [TASK_REQUEST] → Researcher
Researcher → [ACK] → Planner
... processing ...
Researcher → [TASK_RESPONSE] → Planner
```

### 2. 广播模式
```
Orchestrator → [STATUS_UPDATE] → All Agents
```

### 3. 流式通信
```
Coder → [PARTIAL_RESPONSE, ...] → Reviewer (streaming)
```

### 4. 组播模式
```
Planner → [TASK_REQUEST] → [Coder, Designer] (parallel)
```

---

## 状态机

### Agent 生命周期状态
```
INITIALIZING → READY → BUSY → WAITING → READY
                     ↓
                   ERROR → RECOVERING → READY
```

---

## 消息队列与可靠性

### 确认机制
- 所有消息必须确认 (ACK)
- 超时重传 (默认 30s)
- 幂等设计

### 消息持久化
- 在途消息持久化
- 日志记录
- 重播能力

---

## 错误处理

### 错误类型
- `timeout` - 超时
- `invalid_message` - 无效消息
- `agent_unavailable` - Agent 不可用
- `execution_error` - 执行错误
- `resource_exhausted` - 资源耗尽

### 重试策略
- 指数退避
- 最大重试次数
- 死信队列

---

## 监控与指标

### 通信指标
- 消息吞吐量
- 延迟分布
- 错误率
- 队列深度

### Agent 健康监控
- 心跳 (默认 10s)
- 资源使用
- 任务成功率
