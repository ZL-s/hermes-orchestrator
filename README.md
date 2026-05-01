# 🏛️ Hermes AI Orchestrator - 赫尔墨斯AI编排器

[![GitHub stars](https://img.shields.io/github/stars/yourusername/hermes-orchestrator?style=social)](https://github.com/yourusername/hermes-orchestrator)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/hermes-orchestrator?style=social)](https://github.com/yourusername/hermes-orchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://yourwebsite.com)

> 下一代多智能体协同工作流编排平台，让AI协作变得简单高效

---

## ✨ 核心特性

### 🎨 可视化编排
- **拖拽式节点编排** - 直观的拖拽交互，轻松构建复杂工作流
- **智能连线系统** - 自动优化连线路径，支持曲线、直线、折线多种连线模式
- **节点模板库** - 内置10+种预设Agent节点，支持自定义节点类型
- **实时预览** - 即时查看工作流执行过程

### 🚀 多智能体协同
- **Agent类型系统** - 支持规划、研究、编码、审核等多种专业Agent
- **智能路由** - 自动分配任务，优化执行路径，避免资源冲突
- **消息总线** - Agent间高效通信，支持同步/异步消息传递
- **状态管理** - 实时追踪每个Agent的执行状态

### 📊 实时监控
- **执行日志面板** - 详细的实时记录执行过程，支持过滤、搜索
- **性能指标仪表盘** - 实时显示资源使用、执行时间、成功率等核心指标
- **可视化执行动画** - 赛博朋克风格的动态可视化
- **告警系统** - 智能异常检测及时通知

### 🔧 高级功能
- **工作流模板** - 预设研究、开发、内容创作等多场景模板
- **版本管理** - 支持工作流版本控制，支持回滚
- **导出功能** - 支持JSON、YAML、SVG、PNG多种格式导出
- **本地存储** - 本地持久化保存工作流配置

---

## 🎯 快速开始

### 方式一：单文件版本（推荐）

直接下载 `standalone.html` 在浏览器打开即可使用，无需任何依赖！

```bash
# 克隆项目
git clone https://github.com/yourusername/hermes-orchestrator.git

# 打开 standalone.html
# 享受完整功能
```

### 方式二：完整开发版本

```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm start
```

---

## 🏗️ 架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Frontend Layer (Vite + Vanilla JS)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Workflow    │ │   Monitor    │ │   Dashboard  │ │  Settings  │ │
│  │   Editor    │ │    Panel      │ │              │ │          │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕️ Socket.IO + REST API
┌─────────────────────────────────────────────────────────────────────────┐
│                      Backend Layer (Express + Node.js)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Workflow    │ │   Agent     │ │   Model     │ │   Task   │ │
│  │   Engine    │ │  Manager    │ │   Router    │ │  Queue  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↕️ 
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI Model Layer (OpenAI / Claude / Local)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   GPT-4     │ │  Claude 3   │ │  Ollama    │ │ Custom  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 核心模块说明

| 模块 | 功能 | 技术栈 |
|------|------|--------|
| Workflow Engine | 工作流解析、调度、执行 | Express + Socket.IO |
| Agent Manager | Agent生命周期管理、资源调度 | Node.js + EventEmitter |
| Model Router | LLM API统一接口、负载均衡 | Axios + Retry机制 |
| Task Queue | 任务队列管理、优先级调度 | Bull Queue |

---

## 📁 项目结构

```
hermes-orchestrator/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentCard.js          # Agent卡片组件
│   │   │   ├── WorkflowNode.js    # 工作流节点组件
│   │   │   ├── ConnectionLine.js  # 连线组件
│   │   │   ├── LogPanel.js        # 日志面板组件
│   │   │   ├── MetricCard.js      # 指标卡片组件
│   │   │   └── Toolbar.js          # 工具栏组件
│   │   ├── pages/
│   │   │   ├── WorkflowEditor.js   # 工作流编辑器
│   │   │   ├── Dashboard.js        # 仪表盘页面
│   │   │   └── Settings.js        # 设置页面
│   │   ├── utils/
│   │   │   ├── dragDrop.js         # 拖拽逻辑
│   │   │   ├── workflowParser.js    # 工作流解析器
│   │   │   └── storage.js         # 本地存储工具
│   │   └── main.js               # 入口文件
│   ├── public/
│   │   └── assets/
│   │       ├── styles/
│   │       │   └── main.css
│   │       └── images/
│   └── index.html
├── server/
│   ├── agents/
│   │   ├── BaseAgent.js           # 基类Agent
│   │   ├── PlannerAgent.js        # 规划Agent
│   │   ├── ResearcherAgent.js    # 研究Agent
│   │   ├── CoderAgent.js       # 编码Agent
│   │   ├── ReviewerAgent.js    # 审核Agent
│   │   └── WriterAgent.js      # 写作Agent
│   ├── workflows/
│   │   ├── WorkflowEngine.js    # 工作流引擎
│   │   ├── Executor.js        # 执行器
│   │   └── Scheduler.js       # 调度器
│   ├── models/
│   │   ├── ModelRouter.js      # 模型路由器
│   │   ├── OpenAIClient.js     # OpenAI客户端
│   │   └── ClaudeClient.js     # Claude客户端
│   ├── routes/
│   │   ├── api/
│   │   │   ├── agents.js
│   │   │   ├── workflows.js
│   │   │   └── execute.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── logger.js
│   │   └── errorHandler.js
│   └── index.js
├── docs/
│   ├── API.md
│   ├── Architecture.md
│   ├── GettingStarted.md
│   └── Examples.md
├── tests/
│   ├── unit/
│   │   ├── agents/
│   │   └── workflows/
│   ├── e2e/
│   └── fixtures/
├── standalone.html              # 单文件版本（完整功能）
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 使用示例

### 示例一：内容创作工作流

```yaml
name: "技术博客生成"
steps:
  - name: 规划智能体
    type: planner
    input: "写一篇关于多智能体协作的技术博客"
  - name: 研究智能体
    type: researcher
    depends_on: [0]
  - name: 写作智能体
    type: writer
    depends_on: [1]
  - name: 审核智能体
    type: reviewer
    depends_on: [2]
```

### 示例二：代码开发工作流

```javascript
const workflow = {
  nodes: [
    { id: '0', type: 'planner', name: '需求分析' },
    { id: '1', type: 'coder', name: '代码实现' },
    { id: '2', type: 'reviewer', name: '代码审查' },
    { id: '3', type: 'tester', name: '测试验证' }
  ],
  connections: [
    { source: '0', target: '1' },
    { source: '1', target: '2' },
    { source: '2', target: '3' }
  ]
};
```

---

## 🎨 界面预览

| 功能 | 截图 |
|------|------|
| 工作流编辑器 | 赛博朋克风格的拖拽编排界面 |
| 执行监控 | 实时查看Agent工作状态 |
| 指标面板 | 性能数据可视化展示 |

---

## 🔧 配置说明

复制 `.env.example` 为 `.env` 并配置：

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI API
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# Claude API (Optional)
ANTHROPIC_API_KEY=sk-ant-api-key-here
ANTHROPIC_MODEL=claude-3-opus-20240229

# Ollama (Optional)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 PR！请查看我们的 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

- 感谢 OpenAI、Anthropic、Ollama 提供的 AI 模型 API
- 感谢所有贡献者的努力

---

## 📊 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/hermes-orchestrator&type=Date)

---

## 📮 联系方式

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your@email.com
- Discord: [Join our community](https://discord.gg/yourserver)

---

### 🌟 如果这个项目对你有帮助，请给个 Star！
