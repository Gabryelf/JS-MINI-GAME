/* ====================== GAME STATE ====================== */

const Game = {
    canvas: null,
    ctx: null,
    state: 'idle',
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
    // бонус
    bonusItem: null,
    bonusTimer: 0,          // сколько ещё ждать до следующего бонуса
    bonusOnField: false,    // бонус сейчас на сцене
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
    currentBackground.draw(ctx, sceneW, sceneH, globalTime);
  }
  
  function drawItems() {
    const { ctx, items, globalTime, bonusItem } = Game;
  
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
  
    // Бонус-звезда
    if (bonusItem && !bonusItem.found) {
      const ratio = bonusItem.bonusLife / bonusItem.bonusMaxLife;
      let alpha = 1;
      if (ratio < 0.3) {
        alpha = 0.4 + 0.6 * Math.abs(Math.sin(globalTime * 16));
      }
  
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(bonusItem.x, bonusItem.y);
      const pulse = 1 + Math.sin(bonusItem.pulsePhase) * 0.12;
      drawBonusStar(bonusItem.r, bonusItem.rotation, pulse);
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
  
    // ---- Бонус ----
    if (g.bonusItem && !g.bonusItem.found) {
        g.bonusItem.appear = Math.min(1, g.bonusItem.appear + dt / 0.3);
        g.bonusItem.bonusLife -= dt;
        updateBonusMovement(g.bonusItem, g.sceneW, g.sceneH, dt);
        if (g.bonusItem.bonusLife <= 0) {
          // исчез — упустили
          spawnBurst(g.particles, g.bonusItem.x, g.bonusItem.y, '#666', 10, 2);
          g.bonusItem = null;
          g.bonusOnField = false;
          g.bonusTimer = rand(6, 12);
        }
      } else if (!g.bonusOnField) {
        g.bonusTimer -= dt;
        if (g.bonusTimer <= 0) {
          g.bonusItem = spawnBonus(g.sceneW, g.sceneH, g.items);
          g.bonusOnField = true;
        }
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
  
    // сначала проверяем бонус (он рисуется сверху)
    if (g.bonusItem && !g.bonusItem.found) {
        const b = g.bonusItem;
        if (Math.hypot(mx - b.x, my - b.y) < b.r * 1.5) {
          b.found = true;
          const bonusPoints = 60;
          g.score += bonusPoints;
          spawnBurst(g.particles, b.x, b.y, '#ffd700', 35, 8);
          spawnBurst(g.particles, b.x, b.y, '#fff', 18, 5);
          spawnRing(g.rings, b.x, b.y, '#ffd700');
          spawnRing(g.rings, b.x, b.y, '#fff8e1');
          floatText(`+${bonusPoints} BONUS!`, b.x, b.y, '#ffd700');
          soundWin();
          updateHUD();
          g.bonusItem = null;
          g.bonusOnField = false;
          g.bonusTimer = rand(7, 14);
          return;
        }
      }
  
    // обычный поиск
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
  
      if (g.foundCount >= TARGET_TYPES.length) {
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
    g.bonusItem = null;
    g.bonusOnField = false;
    g.bonusTimer = rand(4, 7);  // первый бонус через 4-7 сек
  
    resizeCanvas();
    pickRandomBackground();
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
      const endScr   = document.getElementById('endScreen');
  
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
  
      /* ---- Бонус/штраф за время ---- */
      const timeLeftSec = Math.max(0, Math.ceil(g.timeLeft));
      const timeBonus   = timeLeftSec * CONFIG.TIME_PENALTY;
      const finalScore  = win ? (g.score + timeBonus) : (g.score - timeBonus);
      const clampedScore = Math.max(0, finalScore);
  
      /* ---- Звание и рекорд ---- */
      const rank = getRankForScore(clampedScore);
      const isNewRecord = saveBestRank(clampedScore, rank.name);
  
      const timeSign  = win ? '+' : '−';
      const timeColor = win ? '#7CFC00' : '#ff5555';
      const best = loadBestRank();
      const bestLine = best
        ? `<div style="margin-top:10px; font-size:0.9rem; color:#b39ddb;">Best: <b style="color:${getRankForScore(best.score).color};">${best.rankName}</b> (${best.score})</div>`
        : '';
  
      endStats.innerHTML = `
        Halloween items found: <b>${g.foundCount} / ${TARGET_TYPES.length}</b><br>
        Base score: <b>${g.score}</b><br>
        Time left: <b>${timeLeftSec}s</b>
        <span style="color:${timeColor}"> (${timeSign}${timeBonus})</span><br>
        <hr style="border:none; border-top:1px dashed #4a2c6b; margin:10px auto; max-width:240px;">
        Final score: <b style="font-size:1.25rem;">${clampedScore}</b>
        ${isNewRecord ? '<span style="color:#ffd700; font-size:1rem; margin-left:8px;">★ NEW RECORD</span>' : ''}<br>
        <span style="color:${rank.color}; font-size:1.3rem; display:inline-block; margin-top:10px; font-weight:900; text-shadow:0 0 14px ${rank.color}88;">${rank.name}</span>
        ${bestLine}
      `;
  
      endScr.classList.remove('hidden');
    }, win ? 600 : 450);
  }
  
  /* ====================== HUD ====================== */
  function updateHUD() {
    const g = Game;
    document.getElementById('found').textContent = g.foundCount;
    document.getElementById('total').textContent = TARGET_TYPES.length;
    document.getElementById('score').textContent = g.score;
    document.getElementById('timer').textContent = Math.ceil(g.timeLeft);
    document.getElementById('lives').textContent =
      '🎃'.repeat(Math.max(0, g.lives)) +
      '💀'.repeat(Math.max(0, CONFIG.START_LIVES - g.lives));
  }