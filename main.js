/* ============================================================
   Narinder Singh MD Inc — Addiction Medicine
   main.js
   ============================================================ */

/* ── CUSTOM CURSOR ── */
const cd  = document.getElementById('cd');
const cr  = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function tick() {
  // dot follows instantly
  cd.style.left = mx + 'px';
  cd.style.top  = my + 'px';
  // ring follows with smooth lag
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cr.style.left = rx + 'px';
  cr.style.top  = ry + 'px';
  requestAnimationFrame(tick);
})();

// Scale ring on interactive elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cr.style.transform   = 'translate(-50%,-50%) scale(1.8)';
    cr.style.borderColor = 'rgba(212,168,83,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cr.style.transform   = 'translate(-50%,-50%) scale(1)';
    cr.style.borderColor = 'rgba(212,168,83,0.5)';
  });
});

/* ── PARTICLE CANVAS ── */
const canvas = document.getElementById('bgc');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.28;
    this.vy = (Math.random() - 0.5) * 0.28;
    this.a  = Math.random() * 0.28 + 0.04;
    this.r  = Math.random() * 1.4  + 0.4;
    this.c  = Math.random() > 0.7 ? '#d4a853' : '#0fa990';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.fillStyle   = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = [];
for (let i = 0; i < 110; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx.save();
        ctx.globalAlpha = (1 - d / 90) * 0.035;
        ctx.strokeStyle = '#0fa990';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

(function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
})();

/* ── NAV SCROLL — transparent → frosted glass ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 50);
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.rv');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('on');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));
