/**
 * Config Panel Component
 * 配置面板组件
 */

export class ConfigPanel {
  constructor(container, onConfigChange) {
    this.container = container;
    this.onConfigChange = onConfigChange;
    this.config = {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048,
      speed: 3
    };
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="config-panel">
        <div class="config-label">模型选择</div>
        <select class="config-input" id="model-select">
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="claude-3">Claude 3 Opus</option>
          <option value="llama3">Llama 3</option>
        </select>
      </div>
      
      <div class="config-panel">
        <div class="config-label">温度设置: <span id="temp-value">0.7</span></div>
        <input type="range" class="config-input" id="temp-range" min="0" max="1" step="0.1" value="0.7">
      </div>
      
      <div class="config-panel">
        <div class="config-label">最大 Token</div>
        <input type="number" class="config-input" id="max-tokens" value="2048">
      </div>
      
      <div class="config-panel">
        <div class="config-label">执行速度: <span id="speed-label">中速</span></div>
        <input type="range" class="config-input" id="speed-range" min="1" max="5" step="1" value="3">
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelector('#model-select').addEventListener('change', (e) => {
      this.config.model = e.target.value;
      this.onConfigChange && this.onConfigChange(this.config);
    });
    
    this.container.querySelector('#temp-range').addEventListener('input', (e) => {
      this.config.temperature = parseFloat(e.target.value);
      this.container.querySelector('#temp-value').textContent = e.target.value;
      this.onConfigChange && this.onConfigChange(this.config);
    });
    
    this.container.querySelector('#max-tokens').addEventListener('change', (e) => {
      this.config.maxTokens = parseInt(e.target.value);
      this.onConfigChange && this.onConfigChange(this.config);
    });
    
    this.container.querySelector('#speed-range').addEventListener('input', (e) => {
      this.config.speed = parseInt(e.target.value);
      const labels = ['极慢', '慢速', '中速', '快速', '极快'];
      this.container.querySelector('#speed-label').textContent = labels[e.target.value - 1];
      this.onConfigChange && this.onConfigChange(this.config);
    });
  }

  getConfig() {
    return this.config;
  }
}

export default ConfigPanel;
