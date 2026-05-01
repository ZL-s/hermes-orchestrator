class BaseAgent {
  constructor(id, type, config) {
    this.id = id;
    this.type = type;
    this.config = config;
    this.status = 'idle';
    this.lastActive = Date.now();
    this.memory = [];
  }

  async execute(input, context = {}) {
    this.status = 'running';
    this.lastActive = Date.now();
    
    try {
      const result = await this.process(input, context);
      this.memory.push({ input, output: result, timestamp: new Date() });
      this.status = 'idle';
      return result;
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  async process(input, context) {
    throw new Error('process() must be implemented by subclass');
  }

  getStatus() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      lastActive: this.lastActive,
      config: this.config
    };
  }
}

module.exports = BaseAgent;
