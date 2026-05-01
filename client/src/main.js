const agentTypes = [
  { id: 'planner', name: 'Planner Agent', icon: '📋', role: 'Task Planning' },
  { id: 'researcher', name: 'Researcher Agent', icon: '🔍', role: 'Information Gathering' },
  { id: 'coder', name: 'Coder Agent', icon: '💻', role: 'Code Generation' },
  { id: 'reviewer', name: 'Reviewer Agent', icon: '✅', role: 'Quality Assurance' }
];

let nodes = [];
let connections = [];
let selectedNode = null;
let draggingNode = null;
let dragOffset = { x: 0, y: 0 };
let isConnecting = false;
let connectionStart = null;
let tempLine = null;
let nodeIdCounter = 0;

document.addEventListener('DOMContentLoaded', () => {
  initAgentList();
  initCanvas();
  startMetrics();
});

function initAgentList() {
  const container = document.getElementById('agent-list');
  agentTypes.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'agent-card';
    card.draggable = true;
    card.innerHTML = `
      <div class="agent-icon">${agent.icon}</div>
      <div class="agent-name">${agent.name}</div>
      <div class="agent-type">${agent.role}</div>
    `;
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('agentType', agent.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    container.appendChild(card);
  });
}

function initCanvas() {
  const canvas = document.getElementById('workflow-canvas');
  
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const agentType = e.dataTransfer.getData('agentType');
    if (agentType) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - 90;
      const y = e.clientY - rect.top - 50;
      addNode(agentType, x, y);
    }
  });

  canvas.addEventListener('click', (e) => {
    if (e.target === canvas || e.target.tagName === 'svg') {
      deselectAll();
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (draggingNode) {
      const canvas = document.getElementById('workflow-canvas');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      const node = nodes.find(n => n.id === draggingNode);
      if (node) {
        node.x = Math.max(0, x);
        node.y = Math.max(0, y);
        updateNodePosition(node);
        updateConnections();
      }
    }

    if (isConnecting && tempLine) {
      const canvas = document.getElementById('workflow-canvas');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateTempLine(x, y);
    }
  });

  canvas.addEventListener('mouseup', () => {
    draggingNode = null;
    if (isConnecting) {
      isConnecting = false;
      connectionStart = null;
      if (tempLine) {
        tempLine.remove();
        tempLine = null;
      }
    }
  });
}

function addNode(typeId, x, y) {
  const agentType = agentTypes.find(a => a.id === typeId);
  if (!agentType) return;

  const nodeId = `node-${nodeIdCounter++}`;
  const node = {
    id: nodeId,
    type: typeId,
    name: agentType.name,
    icon: agentType.icon,
    x: x,
    y: y,
    status: 'idle'
  };

  nodes.push(node);
  renderNode(node);
  addLog(`Added ${agentType.name} to workflow`, 'info');
  updateStats();
}

function renderNode(node) {
  const canvas = document.getElementById('workflow-canvas');
  const el = document.createElement('div');
  el.className = 'workflow-node';
  el.id = node.id;
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;
  
  el.innerHTML = `
    <button class="delete-node" onclick="deleteNode('${node.id}')">×</button>
    <div class="node-header">
      <div class="node-icon">${node.icon}</div>
      <div class="node-title">${node.name}</div>
      <div class="node-status">${node.status}</div>
    </div>
    <div class="node-ports">
      <div class="port input" data-node="${node.id}" data-port="input"></div>
      <div class="port output" data-node="${node.id}" data-port="output"></div>
    </div>
  `;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('port') || e.target.classList.contains('delete-node')) return;
    selectNode(node.id);
    draggingNode = node.id;
    const rect = el.getBoundingClientRect();
    const canvas = document.getElementById('workflow-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
  });

  el.querySelector('.port.output').addEventListener('mousedown', (e) => {
    e.stopPropagation();
    startConnection(node.id, e);
  });

  el.querySelector('.port.input').addEventListener('mouseup', (e) => {
    if (isConnecting && connectionStart !== node.id) {
      endConnection(node.id);
    }
  });

  canvas.appendChild(el);
}

function updateNodePosition(node) {
  const el = document.getElementById(node.id);
  if (el) {
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
  }
}

function selectNode(id) {
  deselectAll();
  selectedNode = id;
  const el = document.getElementById(id);
  if (el) el.classList.add('selected');
}

function deselectAll() {
  selectedNode = null;
  document.querySelectorAll('.workflow-node').forEach(el => el.classList.remove('selected'));
}

function deleteNode(id) {
  nodes = nodes.filter(n => n.id !== id);
  connections = connections.filter(c => c.source !== id && c.target !== id);
  const el = document.getElementById(id);
  if (el) el.remove();
  updateConnections();
  addLog(`Removed node from workflow`, 'info');
  updateStats();
}

function startConnection(nodeId, e) {
  isConnecting = true;
  connectionStart = nodeId;
  
  const svg = document.getElementById('connections-svg');
  tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  tempLine.classList.add('connection-line', 'temp-line');
  svg.appendChild(tempLine);
  
  const canvas = document.getElementById('workflow-canvas');
  const rect = canvas.getBoundingClientRect();
  updateTempLine(e.clientX - rect.left, e.clientY - rect.top);
}

function updateTempLine(x, y) {
  if (!tempLine || !connectionStart) return;
  
  const startPos = getPortPosition(connectionStart, 'output');
  const path = createCurvePath(startPos.x, startPos.y, x, y);
  tempLine.setAttribute('d', path);
}

function endConnection(targetId) {
  if (!connectionStart || connectionStart === targetId) return;
  
  const exists = connections.some(c => c.source === connectionStart && c.target === targetId);
  if (!exists) {
    connections.push({ source: connectionStart, target: targetId });
    updateConnections();
    addLog(`Connected nodes`, 'info');
  }
  
  if (tempLine) {
    tempLine.remove();
    tempLine = null;
  }
  isConnecting = false;
  connectionStart = null;
}

function getPortPosition(nodeId, portType) {
  const nodeEl = document.getElementById(nodeId);
  const portEl = nodeEl.querySelector(`.port.${portType}`);
  const canvas = document.getElementById('workflow-canvas');
  const canvasRect = canvas.getBoundingClientRect();
  const portRect = portEl.getBoundingClientRect();
  
  return {
    x: portRect.left + portRect.width / 2 - canvasRect.left,
    y: portRect.top + portRect.height / 2 - canvasRect.top
  };
}

function createCurvePath(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function updateConnections() {
  const svg = document.getElementById('connections-svg');
  svg.querySelectorAll('.connection-line:not(.temp-line)').forEach(el => el.remove());
  
  connections.forEach(conn => {
    const startPos = getPortPosition(conn.source, 'output');
    const endPos = getPortPosition(conn.target, 'input');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add('connection-line');
    path.setAttribute('d', createCurvePath(startPos.x, startPos.y, endPos.x, endPos.y));
    svg.appendChild(path);
  });
}

function clearCanvas() {
  nodes = [];
  connections = [];
  document.querySelectorAll('.workflow-node').forEach(el => el.remove());
  updateConnections();
  addLog('Canvas cleared', 'info');
  updateStats();
}

async function executeWorkflow() {
  if (nodes.length === 0) {
    addLog('No nodes in workflow', 'error');
    return;
  }

  addLog('Starting workflow execution...', 'info');
  
  for (const node of nodes) {
    node.status = 'pending';
    updateNodeStatus(node);
  }

  for (const node of nodes) {
    await simulateNodeExecution(node);
  }

  addLog('Workflow execution completed!', 'success');
}

async function simulateNodeExecution(node) {
  node.status = 'running';
  updateNodeStatus(node);
  addLog(`Executing ${node.name}...`, 'info');
  
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  node.status = 'completed';
  updateNodeStatus(node);
  addLog(`${node.name} completed successfully`, 'success');
  
  document.getElementById('metric-tasks').textContent = 
    parseInt(document.getElementById('metric-tasks').textContent) + 1;
}

function updateNodeStatus(node) {
  const el = document.getElementById(node.id);
  if (!el) return;
  
  const statusEl = el.querySelector('.node-status');
  if (statusEl) {
    statusEl.textContent = node.status;
    
    if (node.status === 'running') {
      statusEl.style.background = 'rgba(255, 255, 0, 0.2)';
      statusEl.style.borderColor = 'var(--accent)';
      statusEl.style.color = 'var(--accent)';
      el.classList.add('running');
    } else if (node.status === 'completed') {
      statusEl.style.background = 'rgba(0, 255, 0, 0.2)';
      statusEl.style.borderColor = '#0f0';
      statusEl.style.color = '#0f0';
      el.classList.remove('running');
    } else {
      statusEl.style.background = 'rgba(0, 255, 0, 0.2)';
      statusEl.style.borderColor = '#0f0';
      statusEl.style.color = '#0f0';
      el.classList.remove('running');
    }
  }
}

function saveWorkflow() {
  const workflow = { nodes, connections };
  localStorage.setItem('hermes-workflow', JSON.stringify(workflow));
  addLog('Workflow saved!', 'success');
}

function loadTemplate(template) {
  clearCanvas();
  
  if (template === 'research') {
    addNode('planner', 100, 150);
    addNode('researcher', 400, 150);
    addNode('reviewer', 700, 150);
    setTimeout(() => {
      connections.push({ source: 'node-0', target: 'node-1' });
      connections.push({ source: 'node-1', target: 'node-2' });
      updateConnections();
    }, 100);
  } else if (template === 'coding') {
    addNode('planner', 100, 150);
    addNode('coder', 400, 150);
    addNode('reviewer', 700, 150);
    setTimeout(() => {
      connections.push({ source: 'node-0', target: 'node-1' });
      connections.push({ source: 'node-1', target: 'node-2' });
      updateConnections();
    }, 100);
  }
  
  addLog(`Loaded ${template} template`, 'info');
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('logs-panel').style.display = tab === 'logs' ? 'block' : 'none';
  document.getElementById('metrics-panel').style.display = tab === 'metrics' ? 'block' : 'none';
}

function addLog(message, type = 'info') {
  const panel = document.getElementById('logs-panel');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<strong>[${time}]</strong> ${message}`;
  panel.insertBefore(entry, panel.firstChild);
}

function updateStats() {
  document.getElementById('workflow-count').textContent = `${nodes.length} Nodes`;
}

function startMetrics() {
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('metric-uptime').textContent = `${mins}:${secs}`;
  }, 1000);
}

window.clearCanvas = clearCanvas;
window.saveWorkflow = saveWorkflow;
window.executeWorkflow = executeWorkflow;
window.loadTemplate = loadTemplate;
window.switchTab = switchTab;
window.deleteNode = deleteNode;
