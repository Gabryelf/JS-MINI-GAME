/* ====================== PARTICLES & EFFECTS ====================== */

function rand(min, max) { return min + Math.random() * (max - min); }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

function spawnBurst(list, x, y, color, count = 14, speed = 4) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = rand(speed * 0.4, speed);
    list.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1,
      size: rand(2, 5),
      color,
      life: rand(0.5, 1.0),
      maxLife: 1.0,
      gravity: 0.12,
    });
  }
}

function spawnRing(list, x, y, color) {
  list.push({ x, y, r: 5, color, life: 0.5, maxLife: 0.5 });
}

function updateParticles(particles, dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.98;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateRings(rings, dt) {
  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    ring.r += 120 * dt;
    ring.life -= dt;
    if (ring.life <= 0) rings.splice(i, 1);
  }
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawRings(ctx, rings) {
  for (const ring of rings) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ring.life / ring.maxLife) * 0.8;
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = ring.color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

/* Всплывающий текст в координатах канваса (fullscreen) */
function floatText(text, x, y, color) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.color = color;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

/* ====================== BEST RANK STORAGE ====================== */

const STORAGE_KEY = 'halloween_hunt_best_rank';

function saveBestRank(score, rankName) {
  try {
    const prev = loadBestRank();
    if (!prev || score > prev.score) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        score,
        rankName,
        date: Date.now(),
      }));
      return true; // новый рекорд
    }
  } catch (e) {
    console.warn('localStorage unavailable', e);
  }
  return false;
}

function loadBestRank() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.score === 'number' && typeof data.rankName === 'string') return data;
  } catch (e) {}
  return null;
}