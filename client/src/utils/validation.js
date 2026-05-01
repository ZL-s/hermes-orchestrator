/**
 * Validation Utilities
 * 验证工具
 */

export const Validator = {
  isNodeValid(node) {
    if (!node || typeof node !== 'object') return false;
    if (!node.id || typeof node.id !== 'string') return false;
    if (!node.type || typeof node.type !== 'string') return false;
    if (typeof node.x !== 'number' || typeof node.y !== 'number') return false;
    return true;
  },

  isConnectionValid(connection, nodes) {
    if (!connection || typeof connection !== 'object') return false;
    if (!connection.source || !connection.target) return false;
    
    const sourceExists = nodes.some(n => n.id === connection.source);
    const targetExists = nodes.some(n => n.id === connection.target);
    
    return sourceExists && targetExists;
  },

  isWorkflowValid(workflow) {
    if (!workflow || typeof workflow !== 'object') return false;
    if (!Array.isArray(workflow.nodes)) return false;
    if (!Array.isArray(workflow.connections)) return false;
    
    const allNodesValid = workflow.nodes.every(node => this.isNodeValid(node));
    const allConnectionsValid = workflow.connections.every(conn => 
      this.isConnectionValid(conn, workflow.nodes)
    );
    
    return allNodesValid && allConnectionsValid;
  },

  isConfigValid(config) {
    if (!config || typeof config !== 'object') return false;
    if (!config.model || typeof config.model !== 'string') return false;
    if (typeof config.temperature !== 'number') return false;
    if (config.temperature < 0 || config.temperature > 1) return false;
    return true;
  },

  sanitizeWorkflow(workflow) {
    return {
      nodes: workflow.nodes.filter(n => this.isNodeValid(n)),
      connections: workflow.connections.filter(c => this.isConnectionValid(c, workflow.nodes))
    };
  },

  safeStringify(obj, indent = 2) {
    try {
      return JSON.stringify(obj, null, indent);
    } catch (error) {
      console.error('Stringify error:', error);
      return '{}';
    }
  },

  safeParse(jsonString, defaultValue = {}) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Parse error:', error);
      return defaultValue;
    }
  }
};

export default Validator;
