/**
 * Workflow Node Component
 * 工作流节点组件
 */

export class WorkflowNode {
  constructor(nodeData, canvas) {
    this.id = nodeData.id;
    this.type = nodeData.type;
    this.x = nodeData.x || 100;
    this.y = nodeData.y || 100;
    this.status = nodeData.status || 'idle';
    this.config = nodeData.config || {};
    this.canvas = canvas;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.agentTypes = [
      { id: 'planner', name: '规划智能体', icon: '📋', role: '任务规划' },
      { id: 'researcher', name: '研究智能体', icon: '🔍', role: '信息搜集' },
      { id: 'coder', name: '编码智能体', icon: '💻', role: '代码生成' },
      { id: 'reviewer', name: '审核智能体', icon: '✅', role: '质量检查' },
      { id: 'writer', name: '写作智能体', icon: '✍️', role: '内容创作' },
      { id: 'designer', name: '设计智能体', icon: '🎨', role: 'UI设计' },
      { id: 'tester', name: '测试智能体', icon: '🧪', role: '功能测试' },
      { id: 'analyst', name: '分析智能体', icon: '📊', role: '数据分析' }
    ];
    
    this.render();
    this.bindEvents();
  }

  getAgentInfo() {
    return this.agentTypes.find(a => a.id === this.type) || this.agentTypes[0];
  }

  render() {
    const agent = this.getAgentInfo();
    
    const node = document.createElement('div');
    node.className = 'workflow-node';
    node.id = this.id;
    node.style.left = this.x + 'px';
    node.style.top = this.y + 'px';
    
    const statusColor = this.getStatusColor();
    
    node.innerHTML = `
      <div class="node-icon">${agent.icon}</div>
      <div class="node-title">${agent.name}</div>
      <div class="node-status" style="border-color: ${statusColor}; background: ${statusColor}33;">
        ${this.getStatusLabel()}
      </div>
      <div class="port input-port" data-port="input"></div>
      <div class="port output-port" data-port="output"></div>
      <button class="delete-btn">×</button>
    `;
    
    this.canvas.appendChild(node);
    this.element = node;
  }

  getStatusColor() {
    switch(this.status) {
      case 'running': return '#ffff00';
      case 'completed': return '#00ff88';
      default: return '#00f5ff';
    }
  }

  getStatusLabel() {
    switch(this.status) {
      case 'idle': return '空闲';
      case 'pending': return '等待中';
      case 'running': return '运行中';
      case 'completed': return '已完成';
      default: return this.status;
    }
  }

  updateStatus(status) {
    this.status = status;
    const statusEl = this.element.querySelector('.node-status');
    statusEl.textContent = this.getStatusLabel();
    statusEl.style.borderColor = this.getStatusColor();
    statusEl.style.background = this.getStatusColor() + '33';
  }

  bindEvents() {
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.querySelector('.delete-btn').addEventListener('click', this.handleDelete.bind(this));
    this.element.querySelector('.output-port').addEventListener('mousedown', this.handlePortDown.bind(this));
  }

  handleMouseDown(e) {
    if (e.target.classList.contains('port') || e.target.classList.contains('delete-btn')) {
      return;
    }
    
    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();
    this.offsetX = e.clientX - rect.left;
    this.offsetY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    const canvasRect = this.canvas.getBoundingClientRect();
    this.x = e.clientX - canvasRect.left - this.offsetX;
    this.y = e.clientY - canvasRect.top - this.offsetY;
    
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    
    this.onMove && this.onMove(this);
  }

  handleMouseUp() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handlePortDown(e) {
    e.stopPropagation();
    this.onPortDragStart && this.onPortDragStart(this, e.target.dataset.port);
  }

  handleDelete(e) {
    e.stopPropagation();
    this.onDelete && this.onDelete(this);
  }

  getPortPosition(portType) {
    const rect = this.element.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();
    
    if (portType === 'input') {
      return { x: rect.left - canvasRect.left, y: rect.top + rect.height/2 - canvasRect.top };
    } else {
      return { x: rect.right - canvasRect.left, y: rect.top + rect.height/2 - canvasRect.top };
    }
  }

  destroy() {
    this.element.remove();
  }
}

export default WorkflowNode;
