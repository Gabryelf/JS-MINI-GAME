/* ====================== BOOTSTRAP ====================== */
let ctx = null;

/* --- Большой талисман в меню --- */
const MenuTalisman = {
  id: 'pumpkin',
  x: 0, y: 0, r: 80,
  time: 0,
  active: false,
  rafId: null,
  lastTs: 0,
};

const TALISMAN_IDS = ['pumpkin', 'skull', 'witchhat', 'cauldron', 'raven', 'moon'];

function pickRandomTalisman() {
  MenuTalisman.id = TALISMAN_IDS[Math.floor(Math.random() * TALISMAN_IDS.length)];
}

function drawMenuScene(ts) {
  if (!MenuTalisman.active) return;
  const m = MenuTalisman;
  const dt = Math.min(0.05, (ts - m.lastTs) / 1000 || 0);
  m.lastTs = ts;
  m.time += dt;

  drawBackground();

  // плавающий талисман по центру
  ctx.save();
  ctx.translate(m.x, m.y + Math.sin(m.time * 0.9) * 10);
  drawMenuTalisman(m.id, m.r, m.time);
  ctx.restore();

  m.rafId = requestAnimationFrame(drawMenuScene);
}

function layoutMenuTalisman() {
  const m = MenuTalisman;
  m.x = Game.sceneW / 2;
  m.y = Game.sceneH * 0.4;
  m.r = Math.min(Game.sceneW, Game.sceneH) * 0.13;
}

function startMenuAnim() {
  const m = MenuTalisman;
  m.active = true;
  m.lastTs = performance.now();
  m.time = 0;
  layoutMenuTalisman();
  cancelAnimationFrame(m.rafId);
  m.rafId = requestAnimationFrame(drawMenuScene);
}

function stopMenuAnim() {
  MenuTalisman.active = false;
  cancelAnimationFrame(MenuTalisman.rafId);
  MenuTalisman.rafId = null;
}

/* --- Показ лучшего ранга в меню --- */
function updateBestRankDisplay() {
  const el = document.getElementById('bestRank');
  if (!el) return;
  const best = loadBestRank();
  if (best) {
    const rank = getRankForScore(best.score);
    el.innerHTML = `Best Rank: <b style="color:${rank.color}; text-shadow:0 0 10px ${rank.color}88;">${rank.name}</b> <span style="color:#b39ddb;">(${best.score})</span>`;
  } else {
    el.innerHTML = `<span style="color:#6a4f8a;">No record yet — be the first!</span>`;
  }
}

/* ====================== INIT ====================== */
function init() {
  Game.canvas = document.getElementById('game');
  ctx = Game.canvas.getContext('2d');
  Game.ctx = ctx;

  resizeCanvas();
  pickRandomBackground();
  pickRandomTalisman();
  updateHUD();
  updateBestRankDisplay();

  startMenuAnim();

  document.getElementById('startBtn').addEventListener('click', () => {
    stopMenuAnim();
    startGame();
  });
  document.getElementById('restartBtn').addEventListener('click', () => {
    stopMenuAnim();
    startGame();
  });

  Game.canvas.addEventListener('click', onCanvasClick);
  Game.canvas.addEventListener('touchstart', (e) => {
    if (Game.state !== 'playing') return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
  }, { passive: false });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      if (Game.state === 'playing') {
        Game.items = generateScene(Game.sceneW, Game.sceneH);
        Game.bonusItem = null;
        Game.bonusOnField = false;
      } else if (Game.state === 'idle' && MenuTalisman.active) {
        layoutMenuTalisman();
      } else {
        drawBackground();
      }
    }, 150);
  });

  Game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

document.addEventListener('DOMContentLoaded', init);