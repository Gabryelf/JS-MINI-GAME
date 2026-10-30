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
  
  /* ====================== EXTRA HOLIDAY ITEMS (7 new) ====================== */

function drawCauldron(r) {
    // котёл с зелёным варевом
    const g = ctx.createRadialGradient(-r*0.2, -r*0.1, r*0.1, 0, r*0.2, r);
    g.addColorStop(0, '#3a2a4a');
    g.addColorStop(1, '#0a0512');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, r*0.2, r*0.7, r*0.6, 0, 0, Math.PI*2);
    ctx.fill();
    // ободок
    ctx.fillStyle = '#2a1a3a';
    ctx.beginPath();
    ctx.ellipse(0, -r*0.35, r*0.72, r*0.15, 0, 0, Math.PI*2);
    ctx.fill();
    // варево
    const brew = ctx.createRadialGradient(0, -r*0.3, r*0.05, 0, -r*0.3, r*0.55);
    brew.addColorStop(0, '#aaff88');
    brew.addColorStop(1, '#3a8a2a');
    ctx.fillStyle = brew;
    ctx.shadowColor = '#7CFC00';
    ctx.shadowBlur = r*0.5;
    ctx.beginPath();
    ctx.ellipse(0, -r*0.32, r*0.6, r*0.14, 0, 0, Math.PI*2);
    ctx.fill();
    // пузыри
    ctx.fillStyle = '#ccffaa';
    for (let i = 0; i < 3; i++) {
      const bx = (i - 1) * r*0.3;
      const by = -r*0.45 - Math.abs(Math.sin(i*2)) * r*0.15;
      ctx.beginPath(); ctx.arc(bx, by, r*0.06, 0, Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    // ручки
    ctx.strokeStyle = '#2a1a3a';
    ctx.lineWidth = r*0.08;
    ctx.beginPath(); ctx.arc(-r*0.7, r*0.1, r*0.15, -Math.PI/2, Math.PI/2); ctx.stroke();
    ctx.beginPath(); ctx.arc( r*0.7, r*0.1, r*0.15, Math.PI/2, -Math.PI/2); ctx.stroke();
  }
  
  function drawBroom(r) {
    // метла: ручка + пучок прутьев
    // ручка
    ctx.strokeStyle = '#6b3410';
    ctx.lineWidth = r*0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r*0.7, -r*0.6);
    ctx.lineTo(r*0.5, r*0.5);
    ctx.stroke();
    // прутья
    ctx.strokeStyle = '#c8a05a';
    ctx.lineWidth = r*0.06;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(r*0.45, r*0.45);
      ctx.lineTo(r*0.75 + i*r*0.06, r*0.85 + i*r*0.02);
      ctx.stroke();
    }
    // перевязка
    ctx.fillStyle = '#8b2500';
    ctx.beginPath();
    ctx.ellipse(r*0.45, r*0.48, r*0.12, r*0.08, -0.8, 0, Math.PI*2);
    ctx.fill();
  }
  
  function drawCoffin(r) {
    // гроб
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#4a2a1a');
    g.addColorStop(1, '#1a0a05');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-r*0.35, -r*0.9);
    ctx.lineTo(r*0.35, -r*0.9);
    ctx.lineTo(r*0.55, -r*0.1);
    ctx.lineTo(r*0.25, r*0.9);
    ctx.lineTo(-r*0.25, r*0.9);
    ctx.lineTo(-r*0.55, -r*0.1);
    ctx.closePath();
    ctx.fill();
    // крест
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-r*0.04, -r*0.6, r*0.08, r*0.8);
    ctx.fillRect(-r*0.28, -r*0.35, r*0.56, r*0.08);
    // блик
    ctx.strokeStyle = 'rgba(255,200,100,0.3)';
    ctx.lineWidth = r*0.04;
    ctx.beginPath();
    ctx.moveTo(-r*0.3, -r*0.85);
    ctx.lineTo(-r*0.45, -r*0.1);
    ctx.stroke();
  }
  
  function drawCandle(r) {
    // свеча с пламенем (не путать со свечой-черепом — тут чистый воск)
    // воск
    const g = ctx.createLinearGradient(-r*0.2, 0, r*0.2, 0);
    g.addColorStop(0, '#fff3d0');
    g.addColorStop(1, '#d0b080');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-r*0.2, -r*0.3, r*0.4, r*0.9, r*0.08);
    ctx.fill();
    // потёк воска
    ctx.fillStyle = '#fff8e1';
    ctx.beginPath();
    ctx.ellipse(-r*0.15, -r*0.1, r*0.08, r*0.15, 0, 0, Math.PI*2);
    ctx.fill();
    // фитиль
    ctx.strokeStyle = '#2a1a10';
    ctx.lineWidth = r*0.04;
    ctx.beginPath(); ctx.moveTo(0, -r*0.3); ctx.lineTo(0, -r*0.4); ctx.stroke();
    // пламя
    ctx.fillStyle = '#ffdd44';
    ctx.shadowColor = '#ffaa00';
    ctx.shadowBlur = r*0.6;
    ctx.beginPath();
    ctx.moveTo(0, -r*0.9);
    ctx.quadraticCurveTo(r*0.18, -r*0.6, 0, -r*0.4);
    ctx.quadraticCurveTo(-r*0.18, -r*0.6, 0, -r*0.9);
    ctx.fill();
    // внутреннее пламя
    ctx.fillStyle = '#fff8e1';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, -r*0.8);
    ctx.quadraticCurveTo(r*0.08, -r*0.6, 0, -r*0.5);
    ctx.quadraticCurveTo(-r*0.08, -r*0.6, 0, -r*0.8);
    ctx.fill();
  }
  
  function drawRaven(r) {
    // ворон
    const g = ctx.createLinearGradient(0, -r, 0, r);
    g.addColorStop(0, '#2a2a3a');
    g.addColorStop(1, '#050510');
    ctx.fillStyle = g;
    // тело
    ctx.beginPath();
    ctx.ellipse(0, r*0.1, r*0.45, r*0.55, 0, 0, Math.PI*2);
    ctx.fill();
    // голова
    ctx.beginPath();
    ctx.arc(-r*0.05, -r*0.45, r*0.28, 0, Math.PI*2);
    ctx.fill();
    // клюв
    ctx.fillStyle = '#3a3a2a';
    ctx.beginPath();
    ctx.moveTo(-r*0.3, -r*0.45);
    ctx.lineTo(-r*0.65, -r*0.35);
    ctx.lineTo(-r*0.28, -r*0.35);
    ctx.closePath();
    ctx.fill();
    // глаз
    ctx.fillStyle = '#ff3355';
    ctx.shadowColor = '#ff3355';
    ctx.shadowBlur = r*0.3;
    ctx.beginPath(); ctx.arc(-r*0.12, -r*0.5, r*0.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // хвост
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath();
    ctx.moveTo(r*0.2, r*0.45);
    ctx.lineTo(r*0.7, r*0.8);
    ctx.lineTo(r*0.15, r*0.65);
    ctx.closePath();
    ctx.fill();
  }
  
  function drawMoon(r) {
    // полная луна
    const g = ctx.createRadialGradient(-r*0.2, -r*0.2, r*0.1, 0, 0, r);
    g.addColorStop(0, '#fffbe0');
    g.addColorStop(0.7, '#f0e0a0');
    g.addColorStop(1, '#c0a060');
    ctx.fillStyle = g;
    ctx.shadowColor = '#fff0a0';
    ctx.shadowBlur = r*0.6;
    ctx.beginPath();
    ctx.arc(0, 0, r*0.85, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // кратеры
    ctx.fillStyle = 'rgba(180, 150, 90, 0.4)';
    ctx.beginPath(); ctx.arc(-r*0.3, -r*0.2, r*0.15, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.25, r*0.1, r*0.12, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(-r*0.1, r*0.4, r*0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.35, -r*0.35, r*0.07, 0, Math.PI*2); ctx.fill();
  }
  
  function drawBone(r) {
    // косточка
    ctx.save();
    ctx.rotate(-0.5);
    const g = ctx.createLinearGradient(0, -r*0.2, 0, r*0.2);
    g.addColorStop(0, '#fff8e1');
    g.addColorStop(1, '#b0a080');
    ctx.fillStyle = g;
    // стержень
    ctx.beginPath();
    ctx.roundRect(-r*0.7, -r*0.12, r*1.4, r*0.24, r*0.12);
    ctx.fill();
    // шишки
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.arc(sx*r*0.7, -r*0.15, r*0.18, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(sx*r*0.7,  r*0.15, r*0.18, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

   /* ====================== ITEM CATALOG ======================
     Каждый тип — объект с методом draw.
     Для конфеты цвет фиксируется один раз (candyColor) — устранено мерцание.
  =========================================================== */
  
  /* ====================== REBUILD TARGETS (14 total) ====================== */
  
  const CANDY_COLORS = ['#ff4d6d', '#7c4dff', '#00c853', '#ffab00'];
  
  const ALL_TARGET_TYPES = [
    { id: 'pumpkin',  name: 'Pumpkin',      r: 34, draw: (r) => drawPumpkin(r) },
    { id: 'bat',      name: 'Bat',          r: 32, draw: (r) => drawBat(r) },
    { id: 'ghost',    name: 'Ghost',        r: 30, draw: (r) => drawGhost(r) },
    { id: 'candy',    name: 'Candy',        r: 26, draw: (r, item) => drawCandy(r, item.candyColor) },
    { id: 'spider',   name: 'Spider',       r: 28, draw: (r) => drawSpider(r) },
    { id: 'skull',    name: 'Skull Candle', r: 30, draw: (r) => drawSkull(r) },
    { id: 'witchhat', name: 'Witch Hat',    r: 32, draw: (r) => drawWitchHat(r) },
    { id: 'cauldron', name: 'Cauldron',     r: 32, draw: (r) => drawCauldron(r) },
    { id: 'broom',    name: 'Broom',        r: 30, draw: (r) => drawBroom(r) },
    { id: 'coffin',   name: 'Coffin',       r: 32, draw: (r) => drawCoffin(r) },
    { id: 'candle',   name: 'Candle',       r: 28, draw: (r) => drawCandle(r) },
    { id: 'raven',    name: 'Raven',        r: 30, draw: (r) => drawRaven(r) },
    { id: 'moon',     name: 'Full Moon',    r: 30, draw: (r) => drawMoon(r) },
    { id: 'bone',     name: 'Bone',         r: 28, draw: (r) => drawBone(r) },
  ];
  
  const NORMAL_TYPES = [
    { id: 'leaf',     name: 'Leaf',     r: 26, draw: (r) => drawLeaf(r) },
    { id: 'acorn',    name: 'Acorn',    r: 24, draw: (r) => drawAcorn(r) },
    { id: 'mushroom', name: 'Mushroom', r: 26, draw: (r) => drawMushroom(r) },
    { id: 'owl',      name: 'Owl',      r: 28, draw: (r) => drawOwl(r) },
    { id: 'apple',    name: 'Apple',    r: 26, draw: (r) => drawApple(r) },
  ];

  /* ====================== BONUS TALISMAN ======================
   Отдельный предмет, не похожий ни на что на сцене.
   Золотая звезда-пентаграмма с пульсацией.
================================================================ */

function drawBonusStar(r, angle = 0, pulse = 1) {
    ctx.save();
    ctx.rotate(angle);
  
    const R = r * pulse;
    // внешний ореол
    const halo = ctx.createRadialGradient(0, 0, R*0.3, 0, 0, R*1.8);
    halo.addColorStop(0, 'rgba(255,215,0,0.5)');
    halo.addColorStop(0.6, 'rgba(255,180,0,0.15)');
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, R*1.8, 0, Math.PI*2);
    ctx.fill();
  
    // лучи
    ctx.save();
    ctx.strokeStyle = 'rgba(255,230,120,0.75)';
    ctx.lineWidth = R*0.04;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = R*0.6;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      const len = R * (1.2 + 0.25 * Math.sin(i * 1.7));
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * R * 0.9, Math.sin(a) * R * 0.9);
      ctx.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      ctx.stroke();
    }
    ctx.restore();
  
    // пятиконечная звезда
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = R*0.8;
    const grad = ctx.createRadialGradient(-R*0.2, -R*0.2, R*0.05, 0, 0, R);
    grad.addColorStop(0, '#fff8e0');
    grad.addColorStop(0.4, '#ffd700');
    grad.addColorStop(1, '#c87800');
    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI/2 + i * Math.PI/5;
      const rr = i % 2 === 0 ? R : R*0.42;
      const x = Math.cos(a) * rr;
      const y = Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  
    // обводка
    ctx.strokeStyle = '#fff8e0';
    ctx.lineWidth = R*0.05;
    ctx.shadowBlur = 0;
    ctx.stroke();
  
    // центральный блик
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(-R*0.12, -R*0.12, R*0.15, 0, Math.PI*2);
    ctx.fill();
  
    ctx.restore();
  }
  
  /* ====================== MENU TALISMANS ======================
     Большие детализированные талисманы для стартового меню.
     Используют уже готовые функции рисования, но с обводкой и свечением.
  ================================================================ */
  
  function drawMenuTalisman(id, r, time) {
    ctx.save();
  
    // пульсирующее свечение под талисманом
    const pulse = 0.5 + 0.5 * Math.sin(time * 2);
    const glowColor = {
      pumpkin:  '#ff8c1a',
      skull:    '#fff1a8',
      witchhat: '#c080ff',
      cauldron: '#7CFC00',
      raven:    '#ff3355',
      moon:     '#fff0a0',
    }[id] || '#ff8c1a';
    const glow = ctx.createRadialGradient(0, 0, r*0.2, 0, 0, r*2.2);
    glow.addColorStop(0, glowColor + 'cc');
    glow.addColorStop(0.5, glowColor + '44');
    glow.addColorStop(1, 'transparent');
    ctx.globalAlpha = 0.3 + 0.4 * pulse;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r*2.2, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  
    // лёгкое покачивание
    const wobble = Math.sin(time * 1.5 + id.length) * 0.06;
    ctx.rotate(wobble);
  
    // сам талисман
    switch (id) {
      case 'pumpkin':  drawPumpkin(r); break;
      case 'skull':    drawSkull(r); break;
      case 'witchhat': drawWitchHat(r); break;
      case 'cauldron': drawCauldron(r); break;
      case 'raven':    drawRaven(r); break;
      case 'moon':     drawMoon(r); break;
    }
  
    // искры вокруг
    for (let i = 0; i < 6; i++) {
      const phase = time * 1.8 + i * 1.05;
      const angle = phase;
      const dist = r * (1.3 + 0.25 * Math.sin(phase * 2));
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist * 0.7;
      const sa = Math.max(0, Math.sin(phase * 3));
      ctx.globalAlpha = sa;
      ctx.fillStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(sx, sy, r*0.06, 0, Math.PI*2);
      ctx.fill();
    }
  
    ctx.restore();
  }
  
  /* ====================== RANKS ======================
     Сбалансированные пороги. Топовые звания труднодостижимы.
     Теоретический максимум ~350 (все 7 + 2 бонуса + 45с времени).
     Реально хорошая игра: 150-200. Идеальная: 250+.
  ================================================================ */
  
  const RANKS = [
    { min: 10,   name: '🕸️ Cursed Wanderer',      color: '#6a4f8a' },
    { min: 20,  name: '💀 Bone Collector',        color: '#9a8a7a' },
    { min: 35,  name: '🎃 Pumpkin Novice',        color: '#c08040' },
    { min: 50,  name: '🦇 Bat Whisperer',         color: '#8a6ab0' },
    { min: 85, name: '🕷️ Web Weaver',            color: '#7a7a9a' },
    { min: 100, name: '👻 Ghost Hunter',          color: '#a0d0e0' },
    { min: 135, name: '🕯️ Candle Keeper',         color: '#ffb347' },
    { min: 160, name: '🍬 Candy Thief',           color: '#ff6b8a' },
    { min: 195, name: '🌙 Moonlit Stalker',       color: '#b0b0ff' },
    { min: 210, name: '⚰️ Grave Robber',          color: '#8a9a8a' },
    { min: 225, name: "🔥 Witch's Apprentice",   color: '#ff7040' },
    { min: 250, name: '🎃 Witch Hunter',         color: '#c080ff' },
    { min: 275, name: '⭐ Halloween Champion',     color: '#ffd700' },
    { min: 290, name: '👑 Nightmare Sovereign',   color: '#ff4500' },
    { min: 310, name: '🏆 Lord of Halloween',     color: '#ff00aa' },
  ];
  
  function getRankForScore(score) {
    let rank = RANKS[0];
    for (const r of RANKS) if (score >= r.min) rank = r;
    return rank;
  }