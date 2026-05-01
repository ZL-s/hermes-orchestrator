# 开发记录

## 项目想法

这个项目是做一个可视化的多智能体协同工作流编辑器，主要是：
1. 界面好看，赛博朋克风格
2. 可以拖拽节点
3. 可以连接节点
4. 模拟执行过程

## 当前状态

### 已完成
- ✅ 单文件版 HTML 界面
- ✅ 拖拽节点功能
- ✅ 连线功能
- ✅ 模拟执行动画
- ✅ 8种 Agent 类型
- ✅ 4个快速模板
- ✅ 保存/加载功能

### 未完成（可能永远不会完成）
- ❌ 真实的后端服务
- ❌ 真实的 LLM API 调用
- ❌ 真实的 Agent 通信
- ❌ 数据库存储
- ❌ 用户登录

## 技术说明

### 前端技术
- 纯原生 JS，没有用 Vue/React
- CSS 变量 + flex 布局
- Canvas 连线（SVG）
- LocalStorage 存数据

### Agent 类型定义
```javascript
const agentTypes = [
  { id: 'planner', name: '规划智能体', icon: '📋', role: '任务规划' },
  { id: 'researcher', name: '研究智能体', icon: '🔍', role: '信息收集' },
  { id: 'coder', name: '编码智能体', icon: '💻', role: '代码生成' },
  { id: 'reviewer', name: '审核智能体', icon: '✅', role: '质量检查' },
  { id: 'writer', name: '写作智能体', icon: '✍️', role: '内容创作' },
  { id: 'designer', name: '设计智能体', icon: '🎨', role: 'UI设计' },
  { id: 'tester', name: '测试智能体', icon: '🧪', role: '功能测试' },
  { id: 'analyst', name: '分析智能体', icon: '📊', role: '数据分析' }
];
```

## 为什么这样设计

因为主要是为了展示用，所以：
- 单文件版方便直接打开
- 不需要装依赖
- 可以快速演示界面
- 不用管真实的后端逻辑

## 如何使用

1. 打开 `standalone.html`
2. 从左边拖 Agent
3. 连接节点
4. 点执行
5. 截图发朋友圈/开源平台

## 注意事项

- 这不是真实的项目，主要是界面展示
- 没有真实的 LLM 调用
- 数据存在浏览器 LocalStorage 里
- 刷新页面如果没保存会丢失
