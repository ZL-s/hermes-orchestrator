/**
 * Animation Utilities
 * 动画工具
 */

export const Animations = {
  particles: [],
  
  createParticle(container, options = {}) {
    const particle = document.createElement('div');
    particle.className = 'data-particle';
    
    particle.style.left = (options.x || Math.random() * 100) + '%';
    particle.style.opacity = '0';
    
    container.appendChild(particle);
    
    const duration = options.duration || (2000 + Math.random() * 3000);
    const delay = options.delay || 0;
    
    setTimeout(() => {
      particle.style.transition = `all ${duration}ms linear`;
      particle.style.opacity = '1';
      particle.style.transform = 'translateY(-100px)';
      
      setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => particle.remove(), 500);
      }, duration - 500);
    }, delay);
    
    this.particles.push(particle);
    return particle;
  },
  
  pulse(element, duration = 500) {
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), duration);
  },
  
  shake(element, duration = 500) {
    element.style.animation = `shake ${duration}ms`;
    setTimeout(() => element.style.animation = '', duration);
  },
  
  glow(element, color = '#00f5ff', duration = 1000) {
    element.style.boxShadow = `0 0 20px ${color}`;
    setTimeout(() => element.style.boxShadow = '', duration);
  },
  
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms`;
    setTimeout(() => element.style.opacity = '1', 10);
  },
  
  fadeOut(element, duration = 300, remove = true) {
    element.style.transition = `opacity ${duration}ms`;
    element.style.opacity = '0';
    if (remove) {
      setTimeout(() => element.remove(), duration);
    }
  }
};

export default Animations;
