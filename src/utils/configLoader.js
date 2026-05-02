/**
 * Hermes Configuration Loader
 * Loads and merges configuration from YAML files and environment variables
 */

class ConfigLoader {
  constructor(configDir = './config') {
    this.configDir = configDir;
    this.config = null;
  }

  /**
   * Load main configuration
   */
  async load() {
    // Load main config
    const mainConfig = await this.loadYaml('config.yaml');
    
    // Load agent configs
    const agentConfigs = await this.loadAgentConfigs();
    
    // Load workflow templates
    const workflowTemplates = await this.loadWorkflowTemplates();
    
    // Load environment variables
    const envConfig = this.loadEnv();
    
    // Merge all
    this.config = this.mergeConfigs(
      mainConfig,
      { agents: agentConfigs },
      { workflows: workflowTemplates },
      { env: envConfig }
    );
    
    return this.config;
  }

  /**
   * Load agent configurations from config/agents/
   */
  async loadAgentConfigs() {
    const agents = {};
    // In real implementation, load all YAML files
    // For now, return the concept
    return {
      planner: this.getDefaultAgentConfig('planner'),
      researcher: this.getDefaultAgentConfig('researcher'),
      coder: this.getDefaultAgentConfig('coder'),
      reviewer: this.getDefaultAgentConfig('reviewer'),
      writer: this.getDefaultAgentConfig('writer'),
      designer: this.getDefaultAgentConfig('designer'),
      tester: this.getDefaultAgentConfig('tester'),
      analyst: this.getDefaultAgentConfig('analyst')
    };
  }

  getDefaultAgentConfig(type) {
    return {
      type,
      model: 'gpt-4o',
      temperature: type === 'writer' ? 0.8 : type === 'reviewer' ? 0.1 : 0.5,
      enabled: true
    };
  }

  /**
   * Load workflow templates
   */
  async loadWorkflowTemplates() {
    return ['default', 'research', 'development', 'content'];
  }

  /**
   * Load environment variables
   */
  loadEnv() {
    return {
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      serverPort: parseInt(process.env.SERVER_PORT || '8000')
    };
  }

  /**
   * Merge multiple config objects
   */
  mergeConfigs(...configs) {
    return configs.reduce((acc, config) => {
      return { ...acc, ...config };
    }, {});
  }
}

module.exports = { ConfigLoader };
