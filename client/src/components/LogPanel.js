/**
 * Log Panel Component
 * 日志面板组件
 */

export class LogPanel {
  constructor(container) {
    this.container = container;
    this.logs = [];
    this.maxLogs = 100;
  }

  addLog(message, type = 'info') {
    const log = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.logs.unshift(log);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    
    this.render();
    return log;
  }

  clear() {
    this.logs = [];
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    
    this.logs.forEach(log => {
      const entry = document.createElement('div');
      entry.className = `log-entry ${log.type}`;
      
      const typeLabel = this.getTypeLabel(log.type);
      entry.innerHTML = `<strong>[${typeLabel}]</strong> ${log.message}`;
      
      this.container.appendChild(entry);
    });
  }

  getTypeLabel(type) {
    switch(type) {
      case 'info': return '信息';
      case 'success': return '成功';
      case 'error': return '错误';
      case 'warning': return '警告';
      default: return type;
    }
  }
}

export default LogPanel;
