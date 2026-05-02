# Agents Configuration

Hermes AI Orchestrator 支持 8 种专业 Agent 类型，每种 Agent 都有独特的功能、配置和行为模式。

---

## 1. Planner Agent (📋)

**功能定位**: 任务规划、分解与调度

### 默认配置
```yaml
name: Planner
type: planner
model: gpt-4o
temperature: 0.3
max_tokens: 2048

# Specialized prompts
system_prompt: |
  You are a Task Planning Agent. Your role is to:
  1. Analyze complex tasks and break them down
  2. Create detailed execution plans
  3. Coordinate with other agents
  4. Optimize task execution order
  5. Handle dependencies between tasks

task_decomposition: true
dependency_analysis: true
parallel_execution: false
```

### 能力
- ✅ 任务分解
- ✅ 依赖分析
- ✅ 优先级排序
- ✅ 资源分配建议
- ✅ 重试策略

### 输入输出
- **Input**: 用户任务描述
- **Output**: 结构化执行计划

---

## 2. Researcher Agent (🔍)

**功能定位**: 信息检索、分析与综合

### 默认配置
```yaml
name: Researcher
type: researcher
model: gpt-4o
temperature: 0.2
max_tokens: 4096

search_capabilities:
  - web_search
  - data_analysis
  - source_verification

# Tools
web_search: true
source_citations: true
data_verification: true

research_depth: 3
max_sources: 10
```

### 能力
- 🌐 网络搜索
- 📊 数据分析
- ✅ 来源验证
- 📝 摘要生成
- 🔗 引用管理

### 输入输出
- **Input**: 研究主题/查询
- **Output**: 结构化研究报告

---

## 3. Coder Agent (💻)

**功能定位**: 代码生成、优化与调试

### 默认配置
```yaml
name: Coder
type: coder
model: gpt-4o
temperature: 0.5
max_tokens: 8192

# Supported languages
languages:
  - Python
  - JavaScript/TypeScript
  - Go
  - Rust
  - SQL

# Capabilities
code_generation: true
code_review: true
bug_fixing: true
unit_testing: true

# Settings
code_style: "clean_code"
comment_density: "moderate"
```

### 能力
- 📝 代码生成
- 🔍 代码审查
- 🐛 调试修复
- ✅ 单元测试
- 📚 文档生成

### 输入输出
- **Input**: 功能需求/问题描述
- **Output**: 完整的代码实现

---

## 4. Reviewer Agent (✅)

**功能定位**: 质量保证、代码审查与验证

### 默认配置
```yaml
name: Reviewer
type: reviewer
model: claude-3-opus
temperature: 0.1
max_tokens: 4096

review_criteria:
  - correctness
  - quality
  - security
  - performance
  - style
  - readability

verification_level: "strict"
```

### 能力
- ✅ 正确性检查
- 🔒 安全审计
- ⚡ 性能评估
- 📚 文档审查
- 🎨 风格检查

### 输入输出
- **Input**: 待审查内容
- **Output**: 审查报告 + 修改建议

---

## 5. Writer Agent (✍️)

**功能定位**: 内容创作、文案生成

### 默认配置
```yaml
name: Writer
type: writer
model: gpt-4o
temperature: 0.8
max_tokens: 16384

writing_styles:
  - technical
  - creative
  - professional
  - casual
  - academic

output_formats:
  - markdown
  - html
  - plain_text
  - report

tone: "professional"
```

### 能力
- 📝 文章创作
- 📄 文档编写
- ✉️ 邮件生成
- 📊 报告撰写
- 🎨 风格调整

### 输入输出
- **Input**: 主题/大纲
- **Output**: 完整内容

---

## 6. Designer Agent (🎨)

**功能定位**: UI/UX 设计建议

### 默认配置
```yaml
name: Designer
type: designer
model: gpt-4o
temperature: 0.7
max_tokens: 4096

design_domains:
  - web_ui
  - mobile_ui
  - branding
  - layout

design_tools:
  - figma_integration
  - css_generation
  - component_design
```

### 能力
- 🎨 UI 设计
- 📐 布局规划
- 🎭 品牌设计
- 💅 CSS 生成
- 🔧 组件设计

### 输入输出
- **Input**: 设计需求
- **Output**: 设计规范 + 实现建议

---

## 7. Tester Agent (🧪)

**功能定位**: 测试、QA

### 默认配置
```yaml
name: Tester
type: tester
model: gpt-4o
temperature: 0.4
max_tokens: 4096

test_types:
  - unit_tests
  - integration_tests
  - edge_cases
  - performance_tests

coverage_target: 90
```

### 能力
- ✅ 单元测试
- 🔗 集成测试
- 🧪 边界测试
- ⚡ 性能测试
- 📊 测试报告

### 输入输出
- **Input**: 代码/功能描述
- **Output**: 测试用例 + 报告

---

## 8. Analyst Agent (📊)

**功能定位**: 数据分析与可视化

### 默认配置
```yaml
name: Analyst
type: analyst
model: claude-3-opus
temperature: 0.2
max_tokens: 8192

analysis_types:
  - statistical
  - predictive
  - descriptive
  - exploratory

visualization: true
chart_types:
  - bar
  - line
  - pie
  - scatter

report_format: "markdown"
```

### 能力
- 📈 统计分析
- 🔮 预测分析
- 📊 数据可视化
- 📝 报告生成
- 📉 趋势分析

### 输入输出
- **Input**: 原始数据
- **Output**: 分析报告 + 可视化

---

## Agent 通信协议

### 消息格式
```json
{
  "id": "msg-123",
  "type": "task_request",
  "sender": "planner-0",
  "recipient": "researcher-1",
  "timestamp": "2026-05-02T10:30:00Z",
  "payload": {
    "task": "...",
    "context": {},
    "priority": "high"
  }
}
```

### 消息类型
- `task_request` - 任务请求
- `task_complete` - 任务完成
- `data_request` - 数据请求
- `status_update` - 状态更新
- `error` - 错误报告

---

## 工作流集成
1. Planner 分解任务
2. 并行/串行执行
3. 传递中间结果
4. 汇总最终输出
