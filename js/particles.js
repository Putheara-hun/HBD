/* Interactive Celestial Particle System & Confetti */
class ParticleCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = window.innerWidth < 768 ? 60 : 130;
    this.mouse = { x: null, y: null, radius: 120 };
    
    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        baseSize: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.15, // slight upward float
        alpha: Math.random() * 0.7 + 0.2,
        color: Math.random() > 0.3 ? '#e5b972' : '#ffffff',
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      // update position
      p.x += p.speedX;
      p.y += p.speedY;

      // wrap edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // mouse interaction
      if (this.mouse.x !== null) {
        let dx = this.mouse.x - p.x;
        let dy = this.mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          let force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }
      }

      // twinkle
      p.alpha += Math.sin(Date.now() * p.twinkleSpeed) * 0.01;
      p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));

      // render
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

// Confetti burst for easter eggs & celebrations
function triggerCelebrationConfetti() {
  if (window.confetti) {
    // Canvas confetti CDN if available
    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#e5b972', '#ffd591', '#f59e0b', '#ffffff', '#f43f5e']
    });
  } else {
    // Built-in fallback DOM celebration burst
    const container = document.body;
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      conf.className = 'dom-confetti';
      conf.style.cssText = `
        position: fixed;
        left: ${50 + (Math.random() - 0.5) * 40}vw;
        top: ${60 + (Math.random() - 0.5) * 20}vh;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${['#e5b972', '#f59e0b', '#fff', '#f43f5e'][Math.floor(Math.random()*4)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 30000;
        transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s;
      `;
      container.appendChild(conf);
      setTimeout(() => {
        conf.style.transform = `translate(${(Math.random() - 0.5) * 500}px, ${Math.random() * 400 + 100}px) rotate(${Math.random() * 720}deg)`;
        conf.style.opacity = '0';
      }, 20);
      setTimeout(() => conf.remove(), 1300);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ParticleCanvas('space-canvas');
});
