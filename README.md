# Hermes Orchestrator - 赫尔墨斯AI编排器

一个可视化的多智能体工作流编辑工具。

## 特点

- 🎨 赛博朋克风格界面
- 🖱️ 拖拽式节点编辑
- 🔗 可视化节点连线
- 📊 模拟执行过程
- 💾 本地存储工作流

## 快速开始

### 最简单方式

直接打开 `standalone.html`，就可以用了，不需要任何依赖。

### 开发模式（可选）

如果你想折腾一下：

```bash
npm install
npm run dev
```

## 界面截图

![Hermes Orchestrator](./screenshots/demo.png)

（这里应该放截图，你可以自己截一张补上）

## Agent 类型

- 📋 Planner - 任务规划
- 🔍 Researcher - 信息收集
- 💻 Coder - 代码生成
- ✅ Reviewer - 质量检查
- ✍️ Writer - 内容创作
- 🎨 Designer - UI设计
- 🧪 Tester - 功能测试
- 📊 Analyst - 数据分析

## 项目结构

```
hermes-orchestrator/
├── standalone.html      # 单文件版，直接用
├── client/              # 前端代码（概念版）
├── server/              # 后端代码（概念版）
├── docs/                # 文档
├── DEVELOPMENT.md       # 开发记录
├── DESIGN.md            # 设计文档
├── TODO.md              # 待办事项
├── FAQ.md               # 常见问题
└── README.md
```

## 注意事项

- 这个项目主要是为了界面展示
- 没有真实的后端和 LLM 调用
- 数据存在浏览器 LocalStorage
- 刷新前记得保存

## 其他文档

- [开发记录](./DEVELOPMENT.md)
- [设计文档](./DESIGN.md)
- [待办事项](./TODO.md)
- [常见问题](./FAQ.md)

## License

MIT
