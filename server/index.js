const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const workflows = new Map();
const agents = new Map();
const taskQueue = [];

class Agent {
  constructor(id, type, config) {
    this.id = id;
    this.type = type;
    this.config = config;
    this.status = 'idle';
    this.lastActive = Date.now();
  }

  async execute(input) {
    this.status = 'running';
    this.lastActive = Date.now();
    
    try {
      const result = await this.process(input);
      this.status = 'idle';
      return result;
    } catch (error) {
      this.status = 'error';
      throw error;
    }
  }

  async process(input) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    return {
      agentId: this.id,
      type: this.type,
      input: input,
      output: `Processed by ${this.type} agent`,
      timestamp: new Date().toISOString()
    };
  }
}

class WorkflowEngine {
  constructor(id, nodes, edges) {
    this.id = id;
    this.nodes = nodes;
    this.edges = edges;
    this.status = 'idle';
    this.executionLog = [];
    this.results = new Map();
  }

  async execute() {
    this.status = 'running';
    this.log('info', 'Workflow execution started');

    try {
      const startNodes = this.nodes.filter(n => 
        !this.edges.some(e => e.target === n.id)
      );

      for (const node of startNodes) {
        await this.executeNode(node);
      }

      this.status = 'completed';
      this.log('success', 'Workflow execution completed');
    } catch (error) {
      this.status = 'error';
      this.log('error', `Workflow failed: ${error.message}`);
    }

    return this.results;
  }

  async executeNode(node) {
    this.log('info', `Executing node: ${node.label}`);
    
    const agent = agents.get(node.agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${node.agentId}`);
    }

    const input = this.getInputForNode(node);
    const result = await agent.execute(input);
    
    this.results.set(node.id, result);
    this.log('success', `Node ${node.label} completed`);

    const nextNodes = this.getNextNodes(node);
    for (const nextNode of nextNodes) {
      await this.executeNode(nextNode);
    }
  }

  getInputForNode(node) {
    const incomingEdges = this.edges.filter(e => e.target === node.id);
    if (incomingEdges.length === 0) return null;
    
    const inputs = incomingEdges.map(e => this.results.get(e.source));
    return inputs.length === 1 ? inputs[0] : inputs;
  }

  getNextNodes(node) {
    const outgoingEdges = this.edges.filter(e => e.source === node.id);
    return outgoingEdges.map(e => this.nodes.find(n => n.id === e.target)).filter(Boolean);
  }

  log(level, message) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString()
    };
    this.executionLog.push(entry);
    io.emit('workflow:log', { workflowId: this.id, entry });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/agents', (req, res) => {
  res.json({ agents: Array.from(agents.values()) });
});

app.post('/api/agents', (req, res) => {
  const { type, config } = req.body;
  const id = uuidv4();
  const agent = new Agent(id, type, config);
  agents.set(id, agent);
  res.json({ agent });
});

app.delete('/api/agents/:id', (req, res) => {
  agents.delete(req.params.id);
  res.json({ success: true });
});

app.get('/api/workflows', (req, res) => {
  res.json({ workflows: Array.from(workflows.values()) });
});

app.post('/api/workflows', (req, res) => {
  const { nodes, edges } = req.body;
  const id = uuidv4();
  const workflow = new WorkflowEngine(id, nodes, edges);
  workflows.set(id, workflow);
  res.json({ workflow });
});

app.post('/api/workflows/:id/execute', async (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  workflow.execute().then(results => {
    io.emit('workflow:completed', { workflowId: workflow.id, results });
  });

  res.json({ message: 'Workflow execution started' });
});

app.get('/api/workflows/:id/logs', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json({ logs: workflow.executionLog });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.emit('agents:update', Array.from(agents.values()));
  socket.emit('workflows:update', Array.from(workflows.values()));

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const defaultAgents = [
  { type: 'planner', config: { name: 'Planner Agent', role: 'Task Planning' } },
  { type: 'researcher', config: { name: 'Researcher Agent', role: 'Information Gathering' } },
  { type: 'coder', config: { name: 'Coder Agent', role: 'Code Generation' } },
  { type: 'reviewer', config: { name: 'Reviewer Agent', role: 'Quality Assurance' } }
];

defaultAgents.forEach(agentConfig => {
  const id = uuidv4();
  const agent = new Agent(id, agentConfig.type, agentConfig.config);
  agents.set(id, agent);
});

server.listen(PORT, () => {
  console.log(`🚀 Hermes Orchestrator Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready`);
});
