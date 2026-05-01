/**
 * Toolbar Component
 * 工具栏组件
 */

export class Toolbar {
  constructor(container, handlers = {}) {
    this.container = container;
    this.handlers = handlers;
    this.render();
  }

  render() {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
      <button class="btn" data-action="clear">🗑️ 清空</button>
      <button class="btn" data-action="save">💾 保存</button>
      <button class="btn" data-action="load">📂 加载</button>
      <button class="btn" data-action="export">📤 导出</button>
      <button class="btn" data-action="undo">↩️ 撤销</button>
      <button class="btn" data-action="redo">↪️ 重做</button>
      <button class="btn btn-primary" data-action="execute">▶️ 执行</button>
      <button class="btn" data-action="stop">🛑 停止</button>
    `;
    this.container.appendChild(toolbar);
    this.element = toolbar;
    this.bindEvents();
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      
      const action = btn.dataset.action;
      if (this.handlers[action]) {
        this.handlers[action]();
      }
    });
  }

  setEnabled(action, enabled) {
    const btn = this.element.querySelector(`[data-action="${action}"]`);
    if (btn) {
      btn.disabled = !enabled;
    }
  }
}

export default Toolbar;
