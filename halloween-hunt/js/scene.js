/* ====================== SCENE GENERATION ====================== */

let TARGET_TYPES = [];   // заполняется на каждый раунд (7 из 14)

function pickTargetTypes(count) {
  const pool = [...ALL_TARGET_TYPES];
  // шаффл Фишера-Йетса
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function createItem(type, x, y, isTarget) {
  const item = {
    type,
    x, y,
    r: type.r,
    isTarget,
    found: false,
    rot: rand(-0.15, 0.15),
    bobPhase: rand(0, Math.PI * 2),
    bobAmp: rand(0.8, 2.2),
    bobSpeed: rand(0.8, 1.6),
    scale: 1,
    appear: 0,
    appearDelay: rand(0, 0.5),
    // для динамического бонуса
    isBonus: false,
    bonusLife: 0,
    bonusMaxLife: 0,
  };
  if (type.id === 'candy') {
    item.candyColor = CANDY_COLORS[randInt(0, CANDY_COLORS.length - 1)];
  }
  return item;
}

function generateScene(sceneW, sceneH) {
  // 1. Выбираем 7 случайных праздничных предметов из 14
  TARGET_TYPES = pickTargetTypes(7);

  const items = [];
  const margin = 60;
  const placed = [];

  function tryPlace(r) {
    for (let attempt = 0; attempt < 160; attempt++) {
      const x = rand(margin, sceneW - margin);
      const y = rand(margin, sceneH - margin);
      let ok = true;
      for (const p of placed) {
        if (Math.hypot(p.x - x, p.y - y) < (p.r + r) * 0.82) { ok = false; break; }
      }
      if (ok) return { x, y };
    }
    return { x: rand(margin, sceneW - margin), y: rand(margin, sceneH - margin) };
  }

  // Праздничные
  for (const t of TARGET_TYPES) {
    const pos = tryPlace(t.r);
    const item = createItem(t, pos.x, pos.y, true);
    items.push(item);
    placed.push(item);
  }

  // Обычные
  for (let i = 0; i < CONFIG.NORMAL_COUNT; i++) {
    const t = NORMAL_TYPES[randInt(0, NORMAL_TYPES.length - 1)];
    const pos = tryPlace(t.r);
    const item = createItem(t, pos.x, pos.y, false);
    items.push(item);
    placed.push(item);
  }

  // Порядок отрисовки: праздничные первыми (могут скрываться за обычными)
  items.sort((a, b) => {
    if (a.isTarget !== b.isTarget) return a.isTarget ? -1 : 1;
    return Math.random() - 0.5;
  });

  return items;
}

/* ====================== DYNAMIC BONUS ======================
   Бонус — специальный предмет, который появляется на время
   в случайном месте. Ловишь = +очки, не успел = исчезает.
================================================================ */

function spawnBonus(sceneW, sceneH, existingItems) {
    const margin = 80;
    let x = rand(margin, sceneW - margin);
    let y = rand(margin, sceneH - margin);
  
    // Бонус — отдельный визуал, не привязан к типу предмета
    const bonus = {
      type: { id: 'bonus', name: 'Golden Bonus', r: 30, draw: null },
      x, y,
      r: 30,
      isTarget: true,
      isBonus: true,
      found: false,
      appear: 0,
      appearDelay: 0,
      bonusLife: 5.0,
      bonusMaxLife: 5.0,
      // движение
      vx: (Math.random() < 0.5 ? -1 : 1) * rand(180, 320),
      vy: (Math.random() < 0.5 ? -1 : 1) * rand(180, 320),
      rotation: 0,
      rotSpeed: rand(2, 4) * (Math.random() < 0.5 ? -1 : 1),
      pulsePhase: rand(0, Math.PI * 2),
    };
    return bonus;
  }
  
  /* Обновление позиции бонуса — хаотичное движение с отскоками */
  function updateBonusMovement(bonus, sceneW, sceneH, dt) {
    if (!bonus || bonus.found) return;
  
    const margin = 40;
    bonus.x += bonus.vx * dt;
    bonus.y += bonus.vy * dt;
  
    // отскоки от краёв
    if (bonus.x < margin) { bonus.x = margin; bonus.vx = Math.abs(bonus.vx); }
    if (bonus.x > sceneW - margin) { bonus.x = sceneW - margin; bonus.vx = -Math.abs(bonus.vx); }
    if (bonus.y < margin) { bonus.y = margin; bonus.vy = Math.abs(bonus.vy); }
    if (bonus.y > sceneH - margin) { bonus.y = sceneH - margin; bonus.vy = -Math.abs(bonus.vy); }
  
    // хаотичное изменение направления каждые ~0.4 сек
    if (Math.random() < dt * 2.5) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(180, 320);
      bonus.vx = Math.cos(angle) * speed;
      bonus.vy = Math.sin(angle) * speed;
    }
  
    bonus.rotation += bonus.rotSpeed * dt;
    bonus.pulsePhase += dt * 6;
  }