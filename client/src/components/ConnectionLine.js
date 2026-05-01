/**
 * Connection Line Component
 * 连线组件
 */

export class ConnectionLine {
  constructor(fromNode, toNode, svgElement) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.svg = svgElement;
    this.render();
  }

  render() {
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.classList.add('connection-line');
    this.svg.appendChild(this.path);
    this.update();
  }

  update() {
    const fromPos = this.fromNode.getPortPosition('output');
    const toPos = this.toNode.getPortPosition('input');
    
    const d = this.createCurvePath(fromPos, toPos);
    this.path.setAttribute('d', d);
  }

  createCurvePath(from, to) {
    const dx = to.x - from.x;
    const controlOffset = Math.max(Math.abs(dx) / 2, 50);
    
    return `M ${from.x} ${from.y} C ${from.x + controlOffset} ${from.y}, ${to.x - controlOffset} ${to.y}, ${to.x} ${to.y}`;
  }

  destroy() {
    this.path.remove();
  }
}

export default ConnectionLine;
