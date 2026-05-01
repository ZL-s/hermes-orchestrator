/**
 * Agent Card Component
 * 智能体卡片组件
 */

export class AgentCard {
  constructor(agentType, container) {
    this.agentType = agentType;
    this.container = container;
    this.render();
    this.bindEvents();
  }

  render() {
    const { id, name, icon, role } = this.agentType;
    
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.draggable = true;
    card.dataset.agentType = id;
    
    card.innerHTML = `
      <div class="agent-icon">${icon}</div>
      <div class="agent-name">${name}</div>
      <div class="agent-type">${role}</div>
    `;
    
    this.container.appendChild(card);
    this.element = card;
  }

  bindEvents() {
    this.element.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.element.addEventListener('dragend', this.handleDragEnd.bind(this));
  }

  handleDragStart(e) {
    e.dataTransfer.setData('agentType', this.agentType.id);
    this.element.classList.add('dragging');
  }

  handleDragEnd() {
    this.element.classList.remove('dragging');
  }

  destroy() {
    this.element.remove();
  }
}

export default AgentCard;
