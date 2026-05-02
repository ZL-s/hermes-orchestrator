/**
 * Hermes Message Bus
 * Handles agent-to-agent communication
 */

class MessageBus {
  constructor() {
    this.subscribers = new Map();
    this.messageQueue = [];
    this.messageLog = [];
  }

  /**
   * Subscribe an agent to messages
   */
  subscribe(agentId, handler) {
    this.subscribers.set(agentId, handler);
  }

  /**
   * Unsubscribe
   */
  unsubscribe(agentId) {
    this.subscribers.delete(agentId);
  }

  /**
   * Send a message
   */
  async send(message) {
    // Log message
    this.messageLog.push({
      ...message,
      sent_at: new Date().toISOString()
    });

    // Add to queue
    this.messageQueue.push(message);

    // Route message
    return this.route(message);
  }

  /**
   * Route message to recipient
   */
  async route(message) {
    const handler = this.subscribers.get(message.recipient.agent_id);
    if (handler) {
      return handler(message);
    }
    throw new Error(`Agent not found: ${message.recipient.agent_id}`);
  }

  /**
   * Broadcast to all agents
   */
  async broadcast(message) {
    const promises = [];
    for (const [agentId, handler] of this.subscribers) {
      promises.push(handler({ ...message, recipient: { agent_id: agentId } }));
    }
    return Promise.all(promises);
  }

  /**
   * Get message history
   */
  getMessageHistory(filter = {}) {
    return this.messageLog.filter(msg => {
      if (filter.agent_id) {
        return msg.sender.agent_id === filter.agent_id || 
               msg.recipient.agent_id === filter.agent_id;
      }
      if (filter.type) {
        return msg.type === filter.type;
      }
      return true;
    });
  }
}

module.exports = { MessageBus };
