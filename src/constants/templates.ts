export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

export const STARTER_TEMPLATES: TemplateItem[] = [
  {
    id: 'dashboard-widget',
    name: 'SaaS Metric Widget & Live Action',
    category: 'Application UI',
    description: 'Modern analytics card with interactive progress counters, confetti trigger, and live clock.',
    html: `<div class="container">
  <div class="card">
    <div class="header">
      <div class="brand">
        <div class="logo-box">
          <i class="fa-solid fa-bolt"></i>
        </div>
        <div>
          <h2 class="title">Performance Pulse</h2>
          <p class="subtitle">Live sandbox telemetry</p>
        </div>
      </div>
      <span class="live-indicator">
        <span class="dot"></span> LIVE
      </span>
    </div>

    <div class="metric-grid">
      <div class="metric-box">
        <span class="label">Render Latency</span>
        <div class="value-row">
          <span class="value" id="latency-val">4.2</span>
          <span class="unit">ms</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 28%"></div>
        </div>
      </div>

      <div class="metric-box">
        <span class="label">Live Interactions</span>
        <div class="value-row">
          <span class="value" id="click-counter">0</span>
          <span class="unit">events</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill alt" id="click-progress" style="width: 10%"></div>
        </div>
      </div>
    </div>

    <div class="clock-banner">
      <i class="fa-regular fa-clock"></i>
      <span>Frame Timestamp:</span>
      <strong id="live-clock">--:--:--</strong>
    </div>

    <div class="action-footer">
      <button class="btn btn-primary" id="btn-boost">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        Trigger Confetti
      </button>
      <button class="btn btn-outline" id="btn-log">
        <i class="fa-solid fa-terminal"></i>
        Emit Console Log
      </button>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 0%, #1e1e2f 0%, #0d0e15 100%);
  color: #f1f5f9;
  padding: 1.5rem;
}

.container {
  width: 100%;
  max-width: 480px;
}

.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  border-color: rgba(99, 102, 241, 0.4);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.logo-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.15rem;
}

.title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
}

.subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 4px 10px;
  border-radius: 9999px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.metric-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 1rem;
}

.label {
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
  margin-bottom: 0.35rem;
}

.value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 0.5rem;
}

.value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

.unit {
  font-size: 0.75rem;
  color: #64748b;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6366f1;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.alt {
  background: #06b6d4;
}

.clock-banner {
  background: rgba(99, 102, 241, 0.08);
  border: 1px dashed rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #c7d2fe;
  margin-bottom: 1.5rem;
}

.action-footer {
  display: flex;
  gap: 0.75rem;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}`,
    js: `// Update live clock every second
function updateClock() {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds() / 100);
  const el = document.getElementById('live-clock');
  if (el) el.textContent = timeStr;
}

setInterval(updateClock, 200);
updateClock();

// Interaction counter and confetti
let interactions = 0;
const clickEl = document.getElementById('click-counter');
const progressEl = document.getElementById('click-progress');
const boostBtn = document.getElementById('btn-boost');
const logBtn = document.getElementById('btn-log');

boostBtn?.addEventListener('click', () => {
  interactions++;
  if (clickEl) clickEl.textContent = interactions;
  if (progressEl) {
    const pct = Math.min(100, (interactions * 15) % 100);
    progressEl.style.width = pct + '%';
  }
  
  // Trigger Canvas Confetti if available
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  }
  
  console.log('[HTML Live] Sparkle event fired! Current count:', interactions);
});

logBtn?.addEventListener('click', () => {
  const dummyPayload = {
    event: 'telemetry_sample',
    timestamp: Date.now(),
    heapAllocatedKB: (Math.random() * 2500 + 1200).toFixed(2),
    activeRenderers: 1,
    status: 'OPTIMAL'
  };
  console.info('[Live Preview Bridge] Diagnostic Snapshot:', dummyPayload);
});

console.log('⚡ Live Preview sandbox initialized successfully.');`,
  },
  {
    id: 'particle-canvas',
    name: 'Interactive Canvas Particle Vortex',
    category: 'Creative / Animation',
    description: 'Dynamic HTML5 canvas particle simulation that reacts smoothly to mouse movement.',
    html: `<div class="canvas-wrapper">
  <div class="hud">
    <h1>Particle Field</h1>
    <p>Move mouse or touch to attract particles</p>
  </div>
  <canvas id="stage"></canvas>
</div>`,
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #09090b;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.canvas-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.hud {
  position: absolute;
  top: 24px;
  left: 24px;
  pointer-events: none;
  z-index: 10;
}

.hud h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #fafafa;
}

.hud p {
  font-size: 0.85rem;
  color: #71717a;
  margin-top: 4px;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}`,
    js: `const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const mouse = { x: width / 2, y: height / 2, active: false };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener('mouseleave', () => {
  mouse.active = false;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = Math.random() * 2 + 1;
    this.baseAlpha = Math.random() * 0.5 + 0.3;
    this.hue = Math.random() * 40 + 200; // Cyan/Blue range
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180 && dist > 10) {
        this.x += (dx / dist) * 1.5;
        this.y += (dy / dist) * 1.5;
      }
    }

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = \`hsla(\${this.hue}, 85%, 65%, \${this.baseAlpha})\`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = \`hsl(\${this.hue}, 80%, 50%)\`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());

function loop() {
  ctx.fillStyle = 'rgba(9, 9, 11, 0.2)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(loop);
}

loop();
console.log('Particle simulator running with ' + particles.length + ' nodes');`,
  },
  {
    id: 'interactive-todo',
    name: 'Vanilla JS Task Manager',
    category: 'Productivity UI',
    description: 'Clean task list with live add, complete, delete, and progress indicator.',
    html: `<div class="todo-app">
  <div class="header">
    <div class="title-wrap">
      <h2>Focus Today</h2>
      <p id="stats-text">0 of 0 tasks completed</p>
    </div>
    <div class="badge" id="completion-badge">0%</div>
  </div>

  <form id="todo-form" class="input-form">
    <input 
      type="text" 
      id="todo-input" 
      placeholder="What needs to get done?" 
      autocomplete="off" 
      required 
    />
    <button type="submit" class="add-btn">Add</button>
  </form>

  <ul id="todo-list" class="task-list">
    <!-- Tasks dynamically rendered here -->
  </ul>

  <div class="empty-state" id="empty-state" style="display: none;">
    <p>🎉 All caught up! Add a new task above.</p>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #1e293b;
  padding: 2rem 1rem;
}

.todo-app {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 1.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title-wrap h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.title-wrap p {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.badge {
  background: #e0f2fe;
  color: #0369a1;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.input-form {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.input-form input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-form input:focus {
  border-color: #3b82f6;
}

.add-btn {
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

.task-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.task-item:hover {
  border-color: #cbd5e1;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-item.completed .checkbox {
  background: #10b981;
  border-color: #10b981;
}

.task-item.completed .checkbox::after {
  content: '✓';
  color: white;
  font-size: 11px;
}

.task-text {
  font-size: 0.9rem;
  color: #334155;
  transition: color 0.2s;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

.delete-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #64748b;
  font-size: 0.85rem;
}`,
    js: `let tasks = [
  { id: '1', text: 'Live reload code changes in preview', done: true },
  { id: '2', text: 'Test responsive tablet and mobile views', done: false },
  { id: '3', text: 'Inspect console errors in error drawer', done: false }
];

const list = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const statsText = document.getElementById('stats-text');
const badge = document.getElementById('completion-badge');
const emptyState = document.getElementById('empty-state');

function render() {
  list.innerHTML = '';
  const completed = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  
  statsText.textContent = \`\${completed} of \${tasks.length} tasks completed\`;
  badge.textContent = \`\${pct}%\`;
  emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = \`task-item \${task.done ? 'completed' : ''}\`;
    li.innerHTML = \`
      <div class="task-left" onclick="toggleTask('\${task.id}')">
        <div class="checkbox"></div>
        <span class="task-text">\${task.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask('\${task.id}')">✕</button>
    \`;
    list.appendChild(li);
  });
}

window.toggleTask = function(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  render();
  console.log('Toggled task:', id);
};

window.deleteTask = function(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
  console.log('Deleted task:', id);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now().toString(), text, done: false });
  input.value = '';
  render();
  console.log('Added task:', text);
});

render();`,
  }
];
