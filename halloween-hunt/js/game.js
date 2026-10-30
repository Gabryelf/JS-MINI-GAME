/* ====================== GAME STATE ====================== */

const Game = {
    canvas: null,
    ctx: null,
    state: 'idle', // idle | playing | ending | over
    items: [],
    particles: [],
    rings: [],
    score: 0,
    lives: CONFIG.START_LIVES,
    foundCount: 0,
    timeLeft: CONFIG.TARGET_TIME,
    lastTime: 0,
    rafId: null,
    globalTime: 0,
    sceneW: 0,
    sceneH: 0,
    DPR: 1,
    onEnd: null, // callback(win)
  };
  
  function resizeCanvas() {
    const g = Game;
    g.DPR = Math.min(window.devicePixelRatio || 1, 2);
    g.sceneW = window.innerWidth;
    g.sceneH = window.innerHeight;
    g.canvas.width  = Math.round(g.sceneW * g.DPR);
    g.canvas.height = Math.round(g.sceneH * g.DPR);
    g.canvas.style.width  = g.sceneW + 'px';
    g.canvas.style.height = g.sceneH + 'px';
    g.ctx.setTransform(g.DPR, 0, 0, g.DPR, 0, 0);
  }
  
  function drawBackground() {
    const { ctx, sceneW, sceneH, globalTime } = Game;
    const g = ctx.createRadialGradient(sceneW*0.5, sceneH*0.2, sceneH*0.1, sceneW*0.5, sceneH*0.5, sceneH*1.1);
    g.addColorStop(0, '#1e1030');
    g.addColorStop(0.5, '#140a22');
    g.addColorStop(1, '#08040e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sceneW, sceneH);
  
    // fog blobs
    ctx.save();
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 6; i++) {
      const t = globalTime * 0.15 + i * 1.7;
      const x = sceneW * (0.15 + 0.14 * i) + Math.sin(t) * 50;
      const y = sceneH * (0.25 + 0.12 * (i % 3)) + Math.cos(t * 0.8) * 30;
      const rg = ctx.createRadialGradient(x, y, 10, x, y, 180);
      rg.addColorStop(0, '#7c4dff');
      rg.addColorStop(1, 'transparent');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, 180, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  
    // vignette
    const vg = ctx.createRadialGradient(sceneW/2, sceneH/2, Math.min(sceneW, sceneH)*0.35, sceneW/2, sceneH/2, Math.max(sceneW, sceneH)*0.75);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, sceneW, sceneH);
  }
  
  function drawItems() {
    const { ctx, items, globalTime } = Game;
    for (const item of items) {
      if (item.found) continue;
  
      let appearScale = 1;
      if (item.appear < 1) {
        const a = Math.max(0, Math.min(1, (globalTime - item.appearDelay) / 0.5));
        appearScale = a < 1 ? 0.3 + 0.7 * a : 1;
      }
  
      const bobY = Math.sin(globalTime * item.bobSpeed + item.bobPhase) * item.bobAmp;
      const bobX = Math.cos(globalTime * item.bobSpeed * 0.7 + item.bobPhase) * item.bobAmp * 0.5;
  
      ctx.save();
      ctx.translate(item.x + bobX, item.y + bobY);
      ctx.rotate(item.rot + Math.sin(globalTime * 0.6 + item.bobPhase) * 0.06);
      ctx.scale(item.scale * appearScale, item.scale * appearScale);
  
      ctx.shadowColor = item.isTarget ? 'rgba(255,140,66,0.25)' : 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = item.isTarget ? 18 : 10;
      ctx.shadowOffsetY = 4;
  
      item.type.draw(item.r, item);
      ctx.restore();
    }
  }
  
  function drawScene() {
    drawBackground();
    drawItems();
    drawParticles(Game.ctx, Game.particles);
    drawRings(Game.ctx, Game.rings);
  }
  
  function gameLoop(ts) {
    const g = Game;
    if (g.state !== 'playing' && g.state !== 'ending') return;
  
    const dt = Math.min(0.05, (ts - g.lastTime) / 1000 || 0);
    g.lastTime = ts;
    g.globalTime += dt;
  
    for (const item of g.items) {
      if (item.appear < 1) item.appear = Math.min(1, (g.globalTime - item.appearDelay) / 0.5);
    }
  
    updateParticles(g.particles, dt);
    updateRings(g.rings, dt);
  
    drawScene();
  
    if (g.state === 'playing') {
      g.timeLeft -= dt;
      if (g.timeLeft <= 0) {
        g.timeLeft = 0;
        updateHUD();
        endGame(false);
        return;
      }
      updateHUD();
    }
  
    g.rafId = requestAnimationFrame(gameLoop);
  }
  
  /* ====================== INPUT ====================== */
  function onCanvasClick(e) {
    const g = Game;
    if (g.state !== 'playing') return;
  
    const rect = g.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
  
    let hit = null;
    for (let i = g.items.length - 1; i >= 0; i--) {
      const item = g.items[i];
      if (item.found) continue;
      if (Math.hypot(mx - item.x, my - item.y) < item.r * 1.25) { hit = item; break; }
    }
    if (!hit) return;
  
    if (hit.isTarget) {
      hit.found = true;
      g.foundCount++;
      g.score += CONFIG.POINTS_GOOD;
      spawnBurst(g.particles, hit.x, hit.y, '#7CFC00', 20, 5);
      spawnBurst(g.particles, hit.x, hit.y, '#ffb347', 12, 3.5);
      spawnRing(g.rings, hit.x, hit.y, '#7CFC00');
      floatText(`+${CONFIG.POINTS_GOOD}`, hit.x, hit.y, '#7CFC00');
      soundGood();
      updateHUD();
  
      if (g.foundCount >= CONFIG.TOTAL_TARGETS) {
        setTimeout(() => endGame(true), 500);
      }
    } else {
      hit.found = true;
      g.score = Math.max(0, g.score - CONFIG.PENALTY_BAD);
      g.lives--;
      spawnBurst(g.particles, hit.x, hit.y, '#ff5555', 18, 4);
      spawnBurst(g.particles, hit.x, hit.y, '#666', 10, 2.5);
      spawnRing(g.rings, hit.x, hit.y, '#ff5555');
      floatText(`−${CONFIG.PENALTY_BAD}`, hit.x, hit.y, '#ff5555');
      soundBad();
      updateHUD();
  
      if (g.lives <= 0) {
        setTimeout(() => endGame(false), 400);
      }
    }
  }
  
  /* ====================== START / END ====================== */
  function startGame() {
    const g = Game;
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  
    g.score = 0;
    g.lives = CONFIG.START_LIVES;
    g.foundCount = 0;
    g.timeLeft = CONFIG.TARGET_TIME;
    g.particles = [];
    g.rings = [];
    g.globalTime = 0;
  
    resizeCanvas();
    g.items = generateScene(g.sceneW, g.sceneH);
    updateHUD();
  
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('endScreen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.querySelector('.site-footer').classList.add('hidden');
  
    g.state = 'playing';
    g.lastTime = performance.now();
    if (g.rafId) cancelAnimationFrame(g.rafId);
    g.rafId = requestAnimationFrame(gameLoop);
  }
  
  function endGame(win) {
    const g = Game;
    if (g.state === 'ending' || g.state === 'idle' || g.state === 'over') return;
    g.state = 'ending';
  
    setTimeout(() => {
      g.state = 'over';
      if (g.rafId) cancelAnimationFrame(g.rafId);
      g.rafId = null;
  
      if (win) soundWin(); else soundLose();
  
      const endTitle = document.getElementById('endTitle');
      const endStats = document.getElementById('endStats');
      const endScr = document.getElementById('endScreen');
  
      let title, titleColor;
      if (win) {
        title = 'All Items Found!';
        titleColor = '#7CFC00';
      } else if (g.lives <= 0) {
        title = 'Out of Lives...';
        titleColor = '#ff5555';
      } else {
        title = "Time's Up!";
        titleColor = '#ff8c42';
      }
  
      endTitle.textContent = title;
      endTitle.style.color = titleColor;
      endTitle.style.textShadow = `0 0 20px ${titleColor}aa`;
  
      let rank, rankColor;
      if (g.foundCount === CONFIG.TOTAL_TARGETS) {
        rank = '🏆 Halloween Legend!'; rankColor = '#ffd700';
      } else if (g.foundCount >= 5) {
        rank = '🌟 Expert Hunter'; rankColor = '#7CFC00';
      } else if (g.foundCount >= 3) {
        rank = '🎃 Rookie Hunter'; rankColor = '#ff8c42';
      } else {
        rank = '🕸️ Unlucky Hunt'; rankColor = '#ff5555';
      }
  
      endStats.innerHTML = `
        Halloween items found: <b>${g.foundCount} / ${CONFIG.TOTAL_TARGETS}</b><br>
        Final score: <b>${g.score}</b><br>
        Lives left: <b>${'🎃'.repeat(Math.max(0, g.lives)) || '—'}</b><br>
        <span style="color:${rankColor}; font-size:1.25rem; display:inline-block; margin-top:8px;">${rank}</span>
      `;
  
      endScr.classList.remove('hidden');
    }, win ? 600 : 450);
  }
  
  /* ====================== HUD ====================== */
  function updateHUD() {
    const g = Game;
    document.getElementById('found').textContent = g.foundCount;
    document.getElementById('total').textContent = CONFIG.TOTAL_TARGETS;
    document.getElementById('score').textContent = g.score;
    document.getElementById('timer').textContent = Math.ceil(g.timeLeft);
    document.getElementById('lives').textContent =
      '🎃'.repeat(Math.max(0, g.lives)) +
      '💀'.repeat(Math.max(0, CONFIG.START_LIVES - g.lives));
  }