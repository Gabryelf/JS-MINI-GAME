/* ====================== ITEM DRAWING ======================
   Каждая функция рисует предмет в локальных координатах (0,0 в центре),
   масштаб — "r" (радиус). Используют глобальный ctx, который
   может быть временно подменён (см. buildPreview).
=========================================================== */

function drawPumpkin(r) {
    const body = ctx.createRadialGradient(-r*0.2, -r*0.25, r*0.1, 0, 0, r*1.05);
    body.addColorStop(0, '#ffb84d');
    body.addColorStop(0.6, '#ff8c1a');
    body.addColorStop(1, '#c04d00');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, r*0.1, r*0.95, r*0.8, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,40,0,0.45)';
    ctx.lineWidth = r*0.05;
    for (let k of [-0.45, 0, 0.45]) {
      ctx.beginPath();
      ctx.ellipse(k*r*0.55, r*0.1, r*0.28, r*0.78, 0, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.ellipse(r*0.05, -r*0.72, r*0.09, r*0.18, 0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff1a8';
    ctx.shadowColor = '#ffb000';
    ctx.shadowBlur = r*0.4;
    ctx.beginPath();
    ctx.moveTo(-r*0.4, -r*0.1); ctx.lineTo(-r*0.18, -r*0.1);
    ctx.lineTo(-r*0.29, r*0.12); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo( r*0.4, -r*0.1); ctx.lineTo( r*0.18, -r*0.1);
    ctx.lineTo( r*0.29, r*0.12); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r*0.4, r*0.35);
    ctx.lineTo(-r*0.2, r*0.28);
    ctx.lineTo(0, r*0.42);
    ctx.lineTo(r*0.2, r*0.28);
    ctx.lineTo(r*0.4, r*0.35);
    ctx.lineTo(r*0.28, r*0.52);
    ctx.lineTo(-r*0.28, r*0.52);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  function drawBat(r) {
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#5a3a8a');
    g.addColorStop(1, '#2a1a45');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-r*0.8, -r*0.7, -r*1.1, -r*0.2);
    ctx.quadraticCurveTo(-r*0.95, 0, -r*0.85, r*0.25);
    ctx.quadraticCurveTo(-r*0.7, r*0.05, -r*0.55, r*0.35);
    ctx.quadraticCurveTo(-r*0.4, r*0.1, -r*0.3, r*0.15);
    ctx.lineTo(0, r*0.35);
    ctx.lineTo(r*0.3, r*0.15);
    ctx.quadraticCurveTo(r*0.4, r*0.1, r*0.55, r*0.35);
    ctx.quadraticCurveTo(r*0.7, r*0.05, r*0.85, r*0.25);
    ctx.quadraticCurveTo(r*0.95, 0, r*1.1, -r*0.2);
    ctx.quadraticCurveTo(r*0.8, -r*0.7, 0, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 0, r*0.28, r*0.38, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r*0.22, -r*0.3); ctx.lineTo(-r*0.32, -r*0.62); ctx.lineTo(-r*0.08, -r*0.4);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo( r*0.22, -r*0.3); ctx.lineTo( r*0.32, -r*0.62); ctx.lineTo( r*0.08, -r*0.4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff3355';
    ctx.shadowColor = '#ff3355';
    ctx.shadowBlur = r*0.4;
    ctx.beginPath(); ctx.arc(-r*0.1, -r*0.05, r*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( r*0.1, -r*0.05, r*0.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  function drawGhost(r) {
    const g = ctx.createRadialGradient(0, -r*0.3, r*0.1, 0, 0, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.7, '#c8e6ff');
    g.addColorStop(1, '#7fb8e6');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -r*0.2, r*0.65, Math.PI, 0);
    const waves = 4;
    const w = r*1.3 / waves;
    let x = r*0.65;
    const baseY = r*0.25;
    for (let i = 0; i < waves; i++) {
      const cx = x - w/2;
      const cy = baseY + (i % 2 === 0 ? r*0.35 : 0);
      ctx.quadraticCurveTo(cx, cy, x - w, baseY);
      x -= w;
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2a1a45';
    ctx.beginPath(); ctx.ellipse(-r*0.22, -r*0.15, r*0.1, r*0.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( r*0.22, -r*0.15, r*0.1, r*0.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, r*0.1, r*0.1, r*0.14, 0, 0, Math.PI*2); ctx.fill();
  }
  
  /* ⚠️ Исправление мерцания конфеты:
     цвет передаётся снаружи через item.candyColor, а НЕ генерируется здесь. */
  function drawCandy(r, color) {
    const c1 = color || '#ff4d6d';
    const c2 = '#ffffff';
    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.moveTo(-r*0.35, 0);
    ctx.lineTo(-r*1.0, -r*0.35);
    ctx.lineTo(-r*0.85, 0);
    ctx.lineTo(-r*1.0, r*0.35);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(r*0.35, 0);
    ctx.lineTo(r*1.0, -r*0.35);
    ctx.lineTo(r*0.85, 0);
    ctx.lineTo(r*1.0, r*0.35);
    ctx.closePath(); ctx.fill();
    const g = ctx.createRadialGradient(-r*0.15, -r*0.15, r*0.05, 0, 0, r*0.5);
    g.addColorStop(0, c2);
    g.addColorStop(0.4, c1);
    g.addColorStop(1, c1);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r*0.45, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(-r*0.15, -r*0.15, r*0.12, r*0.08, -0.6, 0, Math.PI*2);
    ctx.fill();
  }
  
  function drawSpider(r) {
    ctx.strokeStyle = '#1a1025';
    ctx.lineWidth = r*0.08;
    ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const a = -0.9 + i*0.6;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side*r*0.6, Math.sin(a)*r*0.5 - r*0.1, side*r*0.95, Math.sin(a)*r*0.9);
        ctx.stroke();
      }
    }
    const g = ctx.createRadialGradient(-r*0.1, -r*0.1, r*0.05, 0, 0, r*0.5);
    g.addColorStop(0, '#6a3fa0');
    g.addColorStop(1, '#0a0512');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, r*0.1, r*0.4, r*0.45, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#0a0512';
    ctx.beginPath();
    ctx.arc(0, -r*0.35, r*0.22, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#ff3355';
    ctx.shadowColor = '#ff3355';
    ctx.shadowBlur = r*0.3;
    ctx.beginPath(); ctx.arc(-r*0.08, -r*0.4, r*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( r*0.08, -r*0.4, r*0.04, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  function drawSkull(r) {
    const g = ctx.createRadialGradient(-r*0.2, -r*0.3, r*0.1, 0, 0, r);
    g.addColorStop(0, '#fff8e1');
    g.addColorStop(1, '#b0a080');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -r*0.1, r*0.6, Math.PI, 0);
    ctx.lineTo(r*0.4, r*0.4);
    ctx.quadraticCurveTo(r*0.5, r*0.6, r*0.25, r*0.6);
    ctx.lineTo(-r*0.25, r*0.6);
    ctx.quadraticCurveTo(-r*0.5, r*0.6, -r*0.4, r*0.4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#1a1025';
    ctx.beginPath(); ctx.ellipse(-r*0.22, r*0.02, r*0.14, r*0.18, 0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse( r*0.22, r*0.02, r*0.14, r*0.18, -0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, r*0.22); ctx.lineTo(-r*0.08, r*0.35); ctx.lineTo(r*0.08, r*0.35);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1a1025';
    ctx.lineWidth = r*0.04;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(i*r*0.1, r*0.45);
      ctx.lineTo(i*r*0.1, r*0.6);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff1a8';
    ctx.shadowColor = '#ffb000';
    ctx.shadowBlur = r*0.6;
    ctx.beginPath();
    ctx.moveTo(0, -r*1.05);
    ctx.quadraticCurveTo(r*0.18, -r*0.85, 0, -r*0.65);
    ctx.quadraticCurveTo(-r*0.18, -r*0.85, 0, -r*1.05);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  
  function drawWitchHat(r) {
    const g = ctx.createLinearGradient(0, -r*0.9, 0, r*0.4);
    g.addColorStop(0, '#7c4dff');
    g.addColorStop(1, '#3a1a6e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r*0.95);
    ctx.quadraticCurveTo(-r*0.15, -r*0.4, -r*0.5, r*0.15);
    ctx.lineTo(r*0.5, r*0.15);
    ctx.quadraticCurveTo(r*0.15, -r*0.4, 0, -r*0.95);
    ctx.fill();
    ctx.fillStyle = '#3a1a6e';
    ctx.beginPath();
    ctx.ellipse(0, r*0.15, r*0.85, r*0.22, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#ffb347';
    ctx.beginPath();
    ctx.moveTo(-r*0.42, r*0.02);
    ctx.lineTo(r*0.42, r*0.02);
    ctx.lineTo(r*0.44, r*0.15);
    ctx.lineTo(-r*0.44, r*0.15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff1a8';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI/2 + i * Math.PI/5;
      const rr = i % 2 === 0 ? r*0.16 : r*0.07;
      const x = Math.cos(a)*rr;
      const y = Math.sin(a)*rr + r*0.08;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  
  /* --- Ordinary items --- */
  function drawLeaf(r) {
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#ff9a3c');
    g.addColorStop(1, '#c0392b');
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI/2 + i * Math.PI/5;
      const rr = i % 2 === 0 ? r : r*0.45;
      const x = Math.cos(a)*rr;
      const y = Math.sin(a)*rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#6b3410';
    ctx.lineWidth = r*0.08;
    ctx.beginPath(); ctx.moveTo(0, r*0.6); ctx.lineTo(0, r*1.0); ctx.stroke();
  }
  
  function drawAcorn(r) {
    const g = ctx.createRadialGradient(-r*0.1, 0, r*0.05, 0, 0, r*0.7);
    g.addColorStop(0, '#d9a066');
    g.addColorStop(1, '#8b5a2b');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, r*0.2, r*0.5, r*0.6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#5a3a1a';
    ctx.beginPath();
    ctx.arc(0, -r*0.1, r*0.55, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3a2010';
    ctx.lineWidth = r*0.08;
    ctx.beginPath(); ctx.moveTo(0, -r*0.65); ctx.lineTo(0, -r*0.9); ctx.stroke();
  }
  
  function drawMushroom(r) {
    const g = ctx.createRadialGradient(-r*0.2, -r*0.3, r*0.1, 0, -r*0.2, r*0.7);
    g.addColorStop(0, '#ff6b6b');
    g.addColorStop(1, '#b71c1c');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, -r*0.15, r*0.65, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f5e6c8';
    ctx.beginPath();
    ctx.moveTo(-r*0.2, r*0.05);
    ctx.lineTo(r*0.2, r*0.05);
    ctx.lineTo(r*0.25, r*0.7);
    ctx.lineTo(-r*0.25, r*0.7);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-r*0.25, -r*0.3, r*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.2, -r*0.4, r*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.05, -r*0.15, r*0.07, 0, Math.PI*2); ctx.fill();
  }
  
  function drawOwl(r) {
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#5a3a8a');
    g.addColorStop(1, '#2a1a45');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, r*0.1, r*0.5, r*0.7, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r*0.4, -r*0.4); ctx.lineTo(-r*0.3, -r*0.75); ctx.lineTo(-r*0.12, -r*0.5);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo( r*0.4, -r*0.4); ctx.lineTo( r*0.3, -r*0.75); ctx.lineTo( r*0.12, -r*0.5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffb347';
    ctx.shadowColor = '#ffb347';
    ctx.shadowBlur = r*0.3;
    ctx.beginPath(); ctx.arc(-r*0.2, -r*0.2, r*0.16, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( r*0.2, -r*0.2, r*0.16, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1a1025';
    ctx.beginPath(); ctx.arc(-r*0.2, -r*0.2, r*0.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc( r*0.2, -r*0.2, r*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff8c1a';
    ctx.beginPath();
    ctx.moveTo(0, -r*0.05); ctx.lineTo(-r*0.08, r*0.08); ctx.lineTo(r*0.08, r*0.08);
    ctx.closePath(); ctx.fill();
  }
  
  function drawApple(r) {
    const g = ctx.createRadialGradient(-r*0.2, -r*0.25, r*0.05, 0, 0, r*0.9);
    g.addColorStop(0, '#ff6b6b');
    g.addColorStop(1, '#8b0000');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, r*0.1, r*0.6, r*0.65, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(-r*0.2, -r*0.15, r*0.12, r*0.08, -0.6, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = '#4a2a10';
    ctx.lineWidth = r*0.08;
    ctx.beginPath();
    ctx.moveTo(0, -r*0.5);
    ctx.lineTo(0, -r*0.85);
    ctx.stroke();
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.ellipse(r*0.2, -r*0.75, r*0.22, r*0.1, -0.5, 0, Math.PI*2);
    ctx.fill();
  }
  
  /* ====================== ITEM CATALOG ======================
     Каждый тип — объект с методом draw.
     Для конфеты цвет фиксируется один раз (candyColor) — устранено мерцание.
  =========================================================== */
  const CANDY_COLORS = ['#ff4d6d', '#7c4dff', '#00c853', '#ffab00'];
  
  const TARGET_TYPES = [
    { id: 'pumpkin',  name: 'Pumpkin',     r: 34, draw: (r) => drawPumpkin(r) },
    { id: 'bat',      name: 'Bat',         r: 32, draw: (r) => drawBat(r) },
    { id: 'ghost',    name: 'Ghost',       r: 30, draw: (r) => drawGhost(r) },
    { id: 'candy',    name: 'Candy',       r: 26, draw: (r, item) => drawCandy(r, item.candyColor) },
    { id: 'spider',   name: 'Spider',      r: 28, draw: (r) => drawSpider(r) },
    { id: 'skull',    name: 'Skull Candle',r: 30, draw: (r) => drawSkull(r) },
    { id: 'witchhat', name: 'Witch Hat',   r: 32, draw: (r) => drawWitchHat(r) },
  ];
  
  const NORMAL_TYPES = [
    { id: 'leaf',     name: 'Leaf',    r: 26, draw: (r) => drawLeaf(r) },
    { id: 'acorn',    name: 'Acorn',   r: 24, draw: (r) => drawAcorn(r) },
    { id: 'mushroom', name: 'Mushroom',r: 26, draw: (r) => drawMushroom(r) },
    { id: 'owl',      name: 'Owl',     r: 28, draw: (r) => drawOwl(r) },
    { id: 'apple',    name: 'Apple',   r: 26, draw: (r) => drawApple(r) },
  ];