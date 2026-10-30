/* ====================== SCENE GENERATION ====================== */

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
    };
    // конфета: фиксируем цвет один раз — больше не мерцает
    if (type.id === 'candy') {
      item.candyColor = CANDY_COLORS[randInt(0, CANDY_COLORS.length - 1)];
    }
    return item;
  }
  
  function generateScene(sceneW, sceneH) {
    const items = [];
    const margin = 60;
    const placed = [];
  
    function tryPlace(r) {
      for (let attempt = 0; attempt < 160; attempt++) {
        const x = rand(margin, sceneW - margin);
        const y = rand(margin, sceneH - margin);
        let ok = true;
        for (const p of placed) {
          const dist = Math.hypot(p.x - x, p.y - y);
          if (dist < (p.r + r) * 0.82) { ok = false; break; }
        }
        if (ok) return { x, y };
      }
      return { x: rand(margin, sceneW - margin), y: rand(margin, sceneH - margin) };
    }
  
    // Targets first (they are placed, but drawn UNDER normals)
    for (const t of TARGET_TYPES) {
      const pos = tryPlace(t.r);
      const item = createItem(t, pos.x, pos.y, true);
      items.push(item);
      placed.push(item);
    }
  
    // Normals
    for (let i = 0; i < CONFIG.NORMAL_COUNT; i++) {
      const t = NORMAL_TYPES[randInt(0, NORMAL_TYPES.length - 1)];
      const pos = tryPlace(t.r);
      const item = createItem(t, pos.x, pos.y, false);
      items.push(item);
      placed.push(item);
    }
  
    // Render order: targets first, then normals on top (hiding them)
    items.sort((a, b) => {
      if (a.isTarget !== b.isTarget) return a.isTarget ? -1 : 1;
      return Math.random() - 0.5;
    });
  
    return items;
  }