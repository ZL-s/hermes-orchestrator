/**
 * 工作流解析工具
 * 处理工作流的序列化和反序列化
 */

export const workflowParser = {
  serialize(nodes, connections) {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.x, y: node.y },
        config: node.config || {},
      })),
      connections: connections.map(conn => ({
        source: conn.source,
        target: conn.target,
      })),
    };
  },

  deserialize(data) {
    if (!data?.nodes || !data?.connections) {
      throw new Error('Invalid workflow data');
    }

    return {
      nodes: data.nodes.map(node => ({
        id: node.id,
        type: node.type,
        x: node.position?.x || 0,
        y: node.position?.y || 0,
        config: node.config || {},
        status: 'idle',
      })),
      connections: data.connections.map(conn => ({
        source: conn.source,
        target: conn.target,
      })),
    };
  },

  validate(data) {
    if (!data?.nodes?.length) {
      return { valid: false, error: 'No nodes found' };
    }

    const nodeIds = new Set(data.nodes.map(n => n.id));
    
    for (const conn of data.connections) {
      if (!nodeIds.has(conn.source)) {
        return { valid: false, error: `Source node ${conn.source} not found` };
      }
      if (!nodeIds.has(conn.target)) {
        return { valid: false, error: `Target node ${conn.target} not found` };
      }
    }

    return { valid: true };
  },

  toJSON(nodes, connections) {
    return JSON.stringify(this.serialize(nodes, connections), null, 2);
  },

  fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      return this.deserialize(data);
    } catch (e) {
      throw new Error('Failed to parse workflow JSON');
    }
  },
};

export default workflowParser;
