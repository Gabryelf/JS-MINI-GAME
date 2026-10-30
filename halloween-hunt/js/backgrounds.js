/* ====================== BACKGROUND PATTERNS ======================
   Каждый паттерн — функция (ctx, w, h, time), которая рисует фон.
   Предметы на них прячутся по-разному: где-то контраст выше, где-то ниже.
================================================================ */

function bgBaseGradient(ctx, w, h, stops) {
    const g = ctx.createRadialGradient(w*0.5, h*0.2, h*0.1, w*0.5, h*0.5, h*1.1);
    for (const [pos, col] of stops) g.addColorStop(pos, col);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  
  function bgVignette(ctx, w, h) {
    const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w, h)*0.35, w/2, h/2, Math.max(w, h)*0.75);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }
  
  /* --- 1. Ночной туман (базовый) --- */
  function bgFog(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#1e1030'],[0.5,'#140a22'],[1,'#08040e']]);
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 6; i++) {
      const t = time * 0.15 + i * 1.7;
      const x = w * (0.15 + 0.14 * i) + Math.sin(t) * 50;
      const y = h * (0.25 + 0.12 * (i % 3)) + Math.cos(t * 0.8) * 30;
      const rg = ctx.createRadialGradient(x, y, 10, x, y, 180);
      rg.addColorStop(0, '#7c4dff');
      rg.addColorStop(1, 'transparent');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(x, y, 180, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 2. Звёздное небо --- */
  function bgStars(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#0a0a2a'],[0.5,'#050518'],[1,'#02020a']]);
    // статичные звёзды (с фиксированным seed — генерируем один раз)
    if (!bgStars._stars) {
      bgStars._stars = [];
      for (let i = 0; i < 140; i++) {
        bgStars._stars.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 1.6 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
        });
      }
    }
    ctx.save();
    for (const s of bgStars._stars) {
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * s.speed + s.phase));
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 3. Летящие летучие мыши (силуэты) --- */
  function bgBats(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#1a0e28'],[0.6,'#0d0616'],[1,'#030108']]);
    if (!bgBats._bats) {
      bgBats._bats = [];
      for (let i = 0; i < 18; i++) {
        bgBats._bats.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 8 + Math.random() * 14,
          speed: 0.2 + Math.random() * 0.5,
          dir: Math.random() < 0.5 ? -1 : 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    ctx.save();
    ctx.fillStyle = 'rgba(60, 30, 80, 0.45)';
    for (const b of bgBats._bats) {
      const x = (b.x + time * b.speed * b.dir * 20) % (w + 100) - 50;
      const y = b.y + Math.sin(time * 1.5 + b.phase) * 15;
      const s = b.size;
      const flap = Math.sin(time * 6 + b.phase) * 0.4;
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-s*0.8, -s*0.7*(1+flap), -s*1.4, -s*0.1);
      ctx.quadraticCurveTo(-s*1.0, s*0.1, -s*0.7, s*0.3);
      ctx.quadraticCurveTo(-s*0.4, s*0.05, 0, s*0.2);
      ctx.quadraticCurveTo(s*0.4, s*0.05, s*0.7, s*0.3);
      ctx.quadraticCurveTo(s*1.0, s*0.1, s*1.4, -s*0.1);
      ctx.quadraticCurveTo(s*0.8, -s*0.7*(1+flap), 0, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 4. Паутина по углам --- */
  function bgWeb(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#160a20'],[0.5,'#0a0412'],[1,'#020106']]);
    ctx.save();
    ctx.strokeStyle = 'rgba(140, 120, 180, 0.28)';
    ctx.lineWidth = 1;
    const corners = [[0,0,1,1],[w,0,-1,1],[0,h,1,-1],[w,h,-1,-1]];
    for (const [cx, cy, dx, dy] of corners) {
      const rays = 6, len = Math.min(w, h) * 0.35;
      for (let i = 0; i <= rays; i++) {
        const a = (Math.PI/2) * (i / rays);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * len * dx, cy + Math.sin(a) * len * dy);
        ctx.stroke();
      }
      for (let ring = 1; ring <= 4; ring++) {
        const rr = len * ring / 4.5;
        ctx.beginPath();
        for (let i = 0; i <= rays; i++) {
          const a = (Math.PI/2) * (i / rays);
          const x = cx + Math.cos(a) * rr * dx;
          const y = cy + Math.sin(a) * rr * dy;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 5. Тыквенное поле (частые оранжевые пятна) --- */
  function bgPumpkinField(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#2a1608'],[0.5,'#1a0e08'],[1,'#0a0402']]);
    ctx.save();
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 24; i++) {
      const x = ((i * 137.5) % w);
      const y = ((i * 89.3) % h);
      const r = 25 + (i % 5) * 10;
      const g = ctx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, '#ff8c1a');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 6. Могильные плиты (вертикальные тёмные прямоугольники) --- */
  function bgGraveyard(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#0d1418'],[0.5,'#080a0c'],[1,'#020304']]);
    ctx.save();
    ctx.fillStyle = 'rgba(50, 60, 70, 0.28)';
    for (let i = 0; i < 14; i++) {
      const x = (i * 173.7) % w;
      const y = (i * 241.3) % h;
      const ww = 30 + (i % 3) * 18;
      const hh = 50 + (i % 4) * 20;
      ctx.beginPath();
      ctx.moveTo(x, y + hh);
      ctx.lineTo(x, y + 15);
      ctx.quadraticCurveTo(x + ww/2, y - 10, x + ww, y + 15);
      ctx.lineTo(x + ww, y + hh);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 7. Кровавые разводы --- */
  function bgBlood(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#1a0408'],[0.5,'#0e0204'],[1,'#030001']]);
    ctx.save();
    ctx.globalAlpha = 0.10;
    for (let i = 0; i < 9; i++) {
      const x = (i * 211.3) % w;
      const y = (i * 157.9) % h;
      const r = 60 + (i % 4) * 40;
      const g = ctx.createRadialGradient(x, y, 4, x, y, r);
      g.addColorStop(0, '#8b0000');
      g.addColorStop(0.5, '#5a0000');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  /* --- 8. Сетка (геометрия, сложнее искать круглые предметы) --- */
  function bgGrid(ctx, w, h, time) {
    bgBaseGradient(ctx, w, h, [[0,'#0e1520'],[0.5,'#070a12'],[1,'#02030a']]);
    ctx.save();
    ctx.strokeStyle = 'rgba(90, 60, 140, 0.22)';
    ctx.lineWidth = 1;
    const step = 40;
    ctx.beginPath();
    for (let x = 0; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    // редкие светящиеся точки на пересечениях
    ctx.fillStyle = 'rgba(120, 80, 200, 0.35)';
    for (let x = step; x < w; x += step * 3) {
      for (let y = step; y < h; y += step * 3) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
      }
    }
    ctx.restore();
    bgVignette(ctx, w, h);
  }
  
  const BACKGROUNDS = [
    { id: 'fog',     name: 'Foggy Night',    draw: bgFog },
    { id: 'stars',   name: 'Starry Sky',     draw: bgStars },
    { id: 'bats',    name: 'Bat Swarm',      draw: bgBats },
    { id: 'web',     name: 'Spider Web',     draw: bgWeb },
    { id: 'pumpkin', name: 'Pumpkin Field',  draw: bgPumpkinField },
    { id: 'grave',   name: 'Graveyard',      draw: bgGraveyard },
    { id: 'blood',   name: 'Blood Moon',     draw: bgBlood },
    { id: 'grid',    name: 'Arcane Grid',    draw: bgGrid },
  ];
  
  let currentBackground = BACKGROUNDS[0];
  
  function pickRandomBackground() {
    currentBackground = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    return currentBackground;
  }