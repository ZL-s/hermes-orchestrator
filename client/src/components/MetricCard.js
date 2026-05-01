/**
 * Metric Card Component
 * 指标卡片组件
 */

export class MetricCard {
  constructor(label, initialValue = 0, container) {
    this.label = label;
    this.value = initialValue;
    this.container = container;
    this.render();
  }

  render() {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <div class="metric-value">${this.value}</div>
      <div class="metric-label">${this.label}</div>
    `;
    this.container.appendChild(card);
    this.element = card;
    this.valueEl = card.querySelector('.metric-value');
  }

  update(newValue) {
    this.value = newValue;
    this.valueEl.textContent = newValue;
  }

  increment(amount = 1) {
    this.update(this.value + amount);
  }

  setAnimate() {
    this.valueEl.classList.add('animate-pulse');
    setTimeout(() => this.valueEl.classList.remove('animate-pulse'), 500);
  }
}

export default MetricCard;
