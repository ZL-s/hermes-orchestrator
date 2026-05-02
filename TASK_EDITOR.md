# Task Editor & Configuration

Hermes AI Orchestrator 提供强大的任务编辑和配置功能。

---

## 任务定义

### YAML 格式
```yaml
task:
  id: "task-custom-001"
  name: "Build Landing Page"
  description: "Create a modern landing page"
  
  workflow:
    nodes:
      - id: planner
        type: planner
        config:
          goal: "Plan landing page creation"
      
      - id: designer
        type: designer
        config:
          style: "modern"
          theme: "tech"
      
      - id: coder
        type: coder
        config:
          stack: ["react", "tailwind"]
      
      - id: reviewer
        type: reviewer
    
    connections:
      - source: planner
        target: designer
      - source: designer
        target: coder
      - source: coder
        target: reviewer

  inputs:
    - name: "company_name"
      type: "string"
      required: true
    - name: "primary_color"
      type: "color"
      default: "#5B8FF9"

  outputs:
    - name: "html_code"
      type: "file"
    - name: "css_code"
      type: "file"
    - name: "deploy_url"
      type: "string"

  execution:
    timeout: 1800
    max_retries: 3
    priority: "high"
```

---

## 可视化编辑

### 拖拽编辑功能
- 节点添加/删除
- 连接管理
- 配置面板
- 实时预览

### 配置属性
```typescript
interface NodeConfig {
  // Model
  model?: string;
  temperature?: number;
  max_tokens?: number;
  
  // Behavior
  timeout?: number;
  retry_attempts?: number;
  
  // Custom Prompts
  system_prompt?: string;
  user_prompt?: string;
  
  // Tools
  enabled_tools?: string[];
  
  // Input/Output
  inputs?: PortConfig[];
  outputs?: PortConfig[];
}
```

---

## 变量与插值

### 模板语法
```
{{ variable.name }}
{{ node.output.field }}
{{ config.setting }}
```

### 使用示例
```yaml
nodes:
  - id: writer
    type: writer
    config:
      user_prompt: |
        Write a blog post about {{ topic }} targeting {{ audience }}.
        Use the following research: {{ researcher.output.summary }}
```

---

## 保存与加载

### 导出格式
- JSON
- YAML
- 独立 HTML（可分享）

### 模板市场
- 保存为模板
- 社区分享
- 版本管理
