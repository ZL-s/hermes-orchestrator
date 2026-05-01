# API 文档

## 概述

Hermes AI Orchestrator 提供 RESTful API 和 WebSocket 接口。

- **Base URL**: `http://localhost:3000`
- **Version**: v1
- **Content-Type**: `application/json`

## 认证

目前认证是可选的，在生产环境中请配置 API Key。

## REST API

### Agents API

#### 获取所有 Agents

```http
GET /api/agents
```

响应:

```json
{
  "agents": [
    {
      "id": "agent-uuid",
      "type": "planner",
      "status": "idle",
      "config": { "name": "Planner" }
    }
  ]
}
```

#### 创建新 Agent

```http
POST /api/agents
Content-Type: application/json

{
  "type": "researcher",
  "config": { "name": "Research Agent" }
}
```

#### 删除 Agent

```http
DELETE /api/agents/:id
```

### Workflows API

#### 获取所有 Workflows

```http
GET /api/workflows
```

#### 创建 Workflow

```http
POST /api/workflows
Content-Type: application/json

{
  "nodes": [
    { "id": "node-1", "type": "planner", "position": { "x": 100, "y": 150 } }
  ],
  "connections": [
    { "source": "node-1", "target": "node-2" }
  ]
}
```

#### 执行 Workflow

```http
POST /api/workflows/:id/execute
Content-Type: application/json

{
  "input": "Initial input data"
}
```

响应:

```json
{
  "status": "started",
  "workflowId": "workflow-uuid"
}
```

#### 获取执行日志

```http
GET /api/workflows/:id/logs
```

### 健康检查

```http
GET /api/health
```

响应:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## WebSocket API

### 连接

```javascript
const socket = io('http://localhost:3000');
```

### 事件

#### 工作流更新

```javascript
socket.on('workflow:updated', (data) => {
  console.log('Workflow updated:', data);
});
```

#### 执行日志

```javascript
socket.on('workflow:log', (data) => {
  console.log('Log entry:', data);
});
```

#### 执行完成

```javascript
socket.on('workflow:completed', (data) => {
  console.log('Execution complete:', data);
});
```

#### Agent 状态更新

```javascript
socket.on('agents:update', (agents) => {
  console.log('Agents updated:', agents);
});
```

## 错误处理

所有错误响应格式:

```json
{
  "success": false,
  "error": "Error message",
  "details": { /* additional context */ }
}
```

HTTP 状态码:
- 200: 成功
- 400: 请求参数错误
- 404: 资源未找到
- 500: 服务器内部错误

## 示例

### 使用 JavaScript Fetch

```javascript
// 创建工作流
const response = await fetch('http://localhost:3000/api/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nodes: [], connections: [] })
});

const data = await response.json();
const workflowId = data.workflow.id;

// 执行工作流
await fetch(`http://localhost:3000/api/workflows/${workflowId}/execute`, {
  method: 'POST'
});
```

### 使用 WebSocket

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('workflow:log', ({ workflowId, entry }) => {
  console.log(`[${entry.level}] ${entry.message}`);
});
```

## 速率限制

- 默认限制: 100 请求/分钟
- 可在配置中调整
