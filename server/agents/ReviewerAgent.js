const BaseAgent = require('./BaseAgent');

class ReviewerAgent extends BaseAgent {
  constructor(id, config) {
    super(id, 'reviewer', config);
  }

  async process(input, context) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      agentId: this.id,
      type: this.type,
      input: input,
      output: {
        score: 87,
        issues: [
          { severity: 'low', description: 'Code formatting' },
          { severity: 'info', description: 'Add comments' }
        ],
        suggestions: ['Use more descriptive variable names']
      },
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ReviewerAgent;
