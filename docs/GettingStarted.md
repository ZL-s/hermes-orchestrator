# 快速开始指南

本指南将帮助您快速上手 Hermes AI Orchestrator。

## 前置要求

- Node.js 18+ 
- npm 或 yarn 或 pnpm
- OpenAI API Key（可选，用于真实模型调用）

## 安装

### 方式一：克隆仓库

```bash
git clone https://github.com/yourusername/hermes-orchestrator.git
cd hermes-orchestrator
npm install
```

### 方式二：使用单文件版本（推荐新手）

直接在浏览器中打开 `standalone.html` 即可体验完整功能。

## 配置

### 环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# OpenAI 配置
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# Claude 配置（可选）
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# CORS 配置
CORS_ORIGIN=http://localhost:5173
```

## 启动项目

### 开发模式

```bash
npm run dev
```

这会同时启动后端服务器（端口 3000）和前端开发服务器（端口 5173）。

### 生产构建

```bash
npm run build
npm start
```

## 基础使用

### 1. 添加 Agent

从左侧边栏拖拽 Agent 到画布上：
- Planner - 任务规划
- Researcher - 信息搜集
- Coder - 代码生成
- Reviewer - 质量检查
- Writer - 内容创作
- Designer - UI设计
- Tester - 功能测试
- Analyst - 数据分析

### 2. 连接 Agent

点击 Agent 右侧的输出端口，拖拽到另一个 Agent 的输入端口，建立连接。

### 3. 执行工作流

点击工具栏的 "执行" 按钮，系统将按顺序执行所有 Agent。

### 4. 保存和加载

- 保存：点击 "保存" 按钮，工作流保存到浏览器本地存储
- 加载：点击 "加载" 按钮，加载之前保存的工作流
- 导出：点击 "导出" 按钮，导出为 JSON 文件

## 快速模板

内置了几个常用模板：

- **研究流程**：Planner → Researcher → Reviewer
- **开发流程**：Planner → Coder → Tester → Reviewer  
- **内容创作**：Planner → Writer → Reviewer
- **完整工作流**：包含所有 Agent 的完整流程

## 监控和日志

在右侧面板查看：

- **Logs**：实时执行日志
- **Metrics**：系统性能指标
- **Config**：模型和参数配置

## 下一步

- 阅读 [API 文档](./API.md)
- 了解 [架构设计](./Architecture.md)
- 查看 [示例](./Examples.md)

## 常见问题

### Q: 单文件版本和完整版有什么区别？

A: 单文件版本包含完整的前端功能，但没有后端和真实的 LLM 调用。完整版则有完整的后端服务和模型集成。

### Q: 如何贡献代码？

A: 请查看 CONTRIBUTING.md 了解详细流程。

### Q: 支持哪些 LLM 模型？

A: 目前支持 OpenAI GPT 系列、Anthropic Claude 系列，以及通过 Ollama 支持本地模型。

### Q: 可以自定义 Agent 吗？

A: 可以！查看 API 文档了解如何创建自定义 Agent。

## 获取帮助

- GitHub Issues: https://github.com/yourusername/hermes-orchestrator/issues
- Discord: https://discord.gg/yourserver
