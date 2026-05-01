/**
 * Local Storage Utility
 * 本地存储工具
 */

export const Storage = {
  KEYS: {
    WORKFLOW: 'hermes-workflow',
    CONFIG: 'hermes-config',
    HISTORY: 'hermes-history'
  },

  save(key, value) {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  },

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data);
    } catch (error) {
      console.error('Storage load error:', error);
      return defaultValue;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
  },

  saveWorkflow(workflowData) {
    return this.save(this.KEYS.WORKFLOW, {
      ...workflowData,
      savedAt: new Date().toISOString()
    });
  },

  loadWorkflow() {
    return this.load(this.KEYS.WORKFLOW);
  },

  saveConfig(config) {
    return this.save(this.KEYS.CONFIG, config);
  },

  loadConfig() {
    return this.load(this.KEYS.CONFIG, {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 2048
    });
  }
};

export default Storage;
