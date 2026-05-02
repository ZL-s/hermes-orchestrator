# 🚀 Hermes AI Orchestrator

> 智能多代理协作编排平台 - 构建复杂 AI 工作流的可视化解决方案

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📋 目录
- [简介](#简介)
- [特性](#特性)
- [快速开始](#快速开始)
- [架构](#架构)
- [配置](#配置)
- [Agent 类型](#agent-类型)
- [使用示例](#使用示例)
- [API 文档](#api-文档)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 简介

**Hermes AI Orchestrator** 是一个强大的可视化多代理协作平台，让你可以通过拖拽界面构建复杂的 AI 工作流。从简单的内容创作到复杂的软件开发流程，Hermes 都能帮你编排多个专业 AI 代理协同工作。

### 核心优势
- 🎨 **可视化编排** - 拖拽节点，连线成流，所见即所得
- 🤖 **专业代理** - 8 种专业 Agent 各司其职，各有所长
- 🔗 **灵活配置** - 自定义每个 Agent 的模型、参数、提示词
- 📊 **详细报告** - 完整的执行追踪、Token 统计、性能分析
- 🔌 **多模型支持** - OpenAI、Anthropic、本地 Ollama 一网打尽

---

## 特性

### 🎯 核心功能

| 功能 | 描述 |
|------|------|
| **可视化工作流编辑** | 拖拽式节点编辑，可视化连线，实时预览 |
| **8 种专业 Agent** | Planner, Researcher, Coder, Reviewer, Writer, Designer, Tester, Analyst |
| **多模型支持** | GPT-4o, Claude 3, Llama 3, 等等 |
| **Agent 配置** | 每个 Agent 独立配置，自定义提示词、温度、模型 |
| **任务执行** | 并行/串行执行，自动重试，状态追踪 |
| **消息总线** | Agent 间结构化通信协议 |
| **报表生成** | 详细的执行报告，成本分析，性能评估 |
| **模板系统** | 内置工作流模板，快速开始 |

### 🔧 技术特性

- **配置驱动** - YAML 配置，灵活强大
- **事件驱动架构** - 消息总线，异步处理
- **可扩展性** - 插件系统，自定义 Agent
- **状态持久化** - 工作流保存、加载、恢复
- **监控与指标** - Prometheus 指标，健康检查

---

## 快速开始

### 前置要求

- Node.js 18+
- OpenAI / Anthropic API Key（可选，用于真实调用）
- 现代浏览器（Chrome 100+, Firefox 100+, Edge 100+）

### 安装

```bash
# 克隆仓库
git clone https://github.com/ZL-s/hermes-orchestrator.git
cd hermes-orchestrator

# 安装依赖
npm install

# 配置环境变量
cp config/.env.example config/.env
# 编辑 config/.env，填入你的 API Key

# 启动服务
npm run dev
```

### 快速体验（无后端）

直接在浏览器中打开：
```bash
open standalone-v2.html
```

---

## 架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐│
│  │  Workflow Editor │  │  Execution Panel │  │  Reports View   ││
│  └──────────────────┘  └──────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Express)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐   ┌───────────────────┐
│ Orchestrator  │    │  Message Bus    │   │  Model Router     │
│   Engine      │    │                 │   │                   │
└───────────────┘    └─────────────────┘   └───────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │ Planner  │   │ Researcher│  │  Coder   │
         └──────────┘   └──────────┘   └──────────┘
               │               │              │
         ┌──────────────────────────────────────────┐
         │        8 specialized Agents total        │
         └──────────────────────────────────────────┘
```

### 核心组件

- **Orchestrator Engine** - 工作流执行引擎，任务调度
- **Message Bus** - Agent 间通信总线，消息路由
- **Model Router** - 多模型接口抽象，统一 API
- **Agent Pool** - 8 种专业 Agent 实现
- **Persistence** - 工作流状态持久化
- **Reporting** - 执行报告生成

---

## 配置

### 主配置文件

编辑 `config/config.yaml`:
```yaml
models:
  default: "gpt-4o"
  
  providers:
    openai:
      api_key: "${OPENAI_API_KEY}"
    
    anthropic:
      api_key: "${ANTHROPIC_API_KEY}"

agents:
  max_concurrent: 8
  timeout: 300

workflow:
  state_persistence: true
```

### Agent 配置

每个 Agent 都有独立配置文件：`config/agents/<agent_type>.yaml`

示例 (`config/agents/coder.yaml`):
```yaml
name: Coder
type: coder
model:
  provider: "openai"
  name: "gpt-4o"
  temperature: 0.5
  max_tokens: 8192

capabilities:
  - code_generation
  - debugging
  - testing
```

---

## Agent 类型

| Agent | 图标 | 功能 | 推荐模型 |
|-------|------|------|----------|
| **Planner** | 📋 | 任务规划与分解 | GPT-4o |
| **Researcher** | 🔍 | 信息检索与分析 | GPT-4o |
| **Coder** | 💻 | 代码生成与调试 | GPT-4o |
| **Reviewer** | ✅ | 质量审查与验证 | Claude 3 Opus |
| **Writer** | ✍️ | 内容创作 | GPT-4o |
| **Designer** | 🎨 | UI/UX 设计建议 | GPT-4o |
| **Tester** | 🧪 | 测试与 QA | GPT-4o |
| **Analyst** | 📊 | 数据分析与可视化 | Claude 3 Opus |

详细文档见 [AGENTS.md](AGENTS.md)

---

## 使用示例

### 示例 1: 研究报告生成

```yaml
workflow:
  nodes:
    - id: planner
      type: planner
    - id: researcher
      type: researcher
    - id: writer
      type: writer
    - id: reviewer
      type: reviewer
  
  connections:
    - source: planner → researcher
    - source: researcher → writer
    - source: writer → reviewer
```

### 示例 2: 软件开发流程

```yaml
workflow:
  nodes:
    - planner
    - designer
    - coder
    - tester
    - reviewer
  
  connections:
    - planner → [designer, coder] (并行)
    - designer → coder
    - coder → tester
    - [tester, coder] → reviewer
```

---

## API 文档

详细 API 文档见 [API.md](docs/API.md) 和 [API Reference](docs/api/)。

### 快速 API 示例

```bash
# 创建工作流
POST /api/workflows
{
  "name": "My Workflow",
  "nodes": [...],
  "connections": [...]
}

# 执行工作流
POST /api/workflows/:id/execute

# 获取状态
GET /api/workflows/:id/status

# 获取报告
GET /api/workflows/:id/report
```

---

## 贡献指南

我们欢迎所有贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 开发
```bash
# 安装开发依赖
npm install

# 运行测试
npm test

# 运行 lint
npm run lint

# 启动开发服务器
npm run dev
```

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 相关项目

- [LangChain](https://github.com/langchain-ai/langchain) - LLM 应用开发框架
- [AutoGen](https://github.com/microsoft/autogen) - 微软多代理框架
- [Dify](https://github.com/langgenius/dify) - LLMOps 平台

---

## 联系方式

- GitHub Issues: [问题反馈](https://github.com/ZL-s/hermes-orchestrator/issues)
- 文档: [项目 Wiki](https://github.com/ZL-s/hermes-orchestrator/wiki)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！

---

_Hermes: 信使神，为众神传递消息，也是贸易、旅行与口才之神。_

