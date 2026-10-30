/* ====================== BOOTSTRAP ====================== */

function buildPreview() {
    const previewList = document.getElementById('previewList');
    previewList.innerHTML = '';
    const size = 44;
  
    for (const t of TARGET_TYPES) {
      const span = document.createElement('span');
      span.title = t.name;
  
      const c = document.createElement('canvas');
      c.width  = size * 2;
      c.height = size * 2;
      c.style.width  = size + 'px';
      c.style.height = size + 'px';
  
      const cctx = c.getContext('2d');
      cctx.scale(2, 2);
      cctx.translate(size / 2, size / 2);
      const scale = 20 / t.r;
      cctx.scale(scale, scale);
  
      // временно подменяем глобальный ctx (он объявлен через let)
      const realCtx = ctx;
      ctx = cctx;
      try {
        const fakeItem = t.id === 'candy' ? { candyColor: '#ff4d6d' } : {};
        t.draw(t.r, fakeItem);
      } catch (e) {
        console.warn('preview draw failed', t.id, e);
      }
      ctx = realCtx;
  
      span.appendChild(c);
      previewList.appendChild(span);
    }
  }
  
  function init() {
    // Инициализация глобалов из game.js
    Game.canvas = document.getElementById('game');
    ctx = Game.canvas.getContext('2d');
    Game.ctx = ctx;
  
    // preview
    buildPreview();
    resizeCanvas();
    drawBackground();
    updateHUD();
  
    // кнопки
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);
  
    // клик по канвасу
    Game.canvas.addEventListener('click', onCanvasClick);
  
    // touch
    Game.canvas.addEventListener('touchstart', (e) => {
      if (Game.state !== 'playing') return;
      e.preventDefault();
      const touch = e.changedTouches[0];
      onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: false });
  
    // resize (с дебаунсом)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        if (Game.state === 'playing') {
          // перегенерируем сцену, чтобы предметы остались в пределах экрана
          Game.items = generateScene(Game.sceneW, Game.sceneH);
        } else {
          drawBackground();
        }
      }, 150);
    });
  
    // prevent context menu
    Game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  // Глобальный ctx для функций рисования (подменяется в buildPreview)
  let ctx = null;
  
  document.addEventListener('DOMContentLoaded', init);