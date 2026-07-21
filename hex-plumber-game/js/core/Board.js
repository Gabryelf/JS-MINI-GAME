/**
 * Игровое поле
 * @namespace Board
 */
 window.Board = (function() {
    'use strict';

    /**
     * Класс игрового поля
     */
    class Board {
        /**
         * @param {Object} params
         * @param {number} params.radius - Радиус поля в гексах
         * @param {number} params.hexSize - Размер гекса в пикселях
         */
        constructor(params = {}) {
            this.radius = params.radius || 4;
            this.hexSize = params.hexSize || 40;
            this.hexes = new Map(); // key: "x,y", value: Hex
            this.startHexes = []; // Стартовые гексы
            this.placedHexes = []; // Все установленные гексы
            this.isLocked = false; // Блокировка поля (при анимации)
            this._initBoard();
        }

        /**
         * Инициализация поля
         */
        _initBoard() {
            this.hexes.clear();
            this.startHexes = [];
            this.placedHexes = [];

            // Создаем сетку гексов в форме ромба
            for (let q = -this.radius; q <= this.radius; q++) {
                for (let r = -this.radius; r <= this.radius; r++) {
                    if (Math.abs(q + r) <= this.radius) {
                        const key = q + ',' + r;
                        // Пустые гексы (без труб)
                        const hex = new Hex({
                            x: q,
                            y: r,
                            rotation: 0,
                            edges: [],
                            isPlaced: false,
                            isStart: false
                        });
                        this.hexes.set(key, hex);
                    }
                }
            }

            // Добавляем стартовый гекс в центре
            this.addStartHex(0, 0);
        }

        /**
         * Добавление стартового гекса
         */
        addStartHex(x, y) {
            const key = x + ',' + y;
            if (this.hexes.has(key)) {
                const hex = this.hexes.get(key);
                // Создаем стартовый гекс
                const startHex = Hex.createStart(x, y);
                startHex.id = 'start_' + Date.now() + '_' + this.startHexes.length;
                this.hexes.set(key, startHex);
                this.startHexes.push(startHex);
                this.placedHexes.push(startHex);
                return startHex;
            }
            return null;
        }

        /**
         * Добавление нескольких стартовых гексов (для будущих уровней)
         */
        addStartHexes(coords) {
            const results = [];
            coords.forEach(([x, y]) => {
                const hex = this.addStartHex(x, y);
                if (hex) results.push(hex);
            });
            return results;
        }

        /**
         * Проверка, можно ли разместить гекс
         */
        canPlaceHex(x, y, hex) {
            const key = x + ',' + y;
            if (!this.hexes.has(key)) return false;
            const existing = this.hexes.get(key);
            if (existing.isPlaced) return false;

            // Проверяем, есть ли сосед с выходом в этом направлении
            let hasNeighborWithOutput = false;
            const neighbors = hex.getAllNeighborCoords();
            
            for (let dir = 0; dir < 6; dir++) {
                const neighbor = neighbors[dir];
                const neighborKey = neighbor.x + ',' + neighbor.y;
                if (this.hexes.has(neighborKey)) {
                    const neighborHex = this.hexes.get(neighborKey);
                    if (neighborHex.isPlaced) {
                        // Проверяем, есть ли выход у соседа в направлении к нам
                        const oppositeDir = (dir + 3) % 6;
                        if (neighborHex.hasEdge(oppositeDir)) {
                            hasNeighborWithOutput = true;
                            break;
                        }
                    }
                }
            }

            return hasNeighborWithOutput;
        }

        /**
         * Размещение гекса на поле
         */
        placeHex(x, y, hex) {
            const key = x + ',' + y;
            if (!this.hexes.has(key)) return false;
            if (!this.canPlaceHex(x, y, hex)) return false;

            const existing = this.hexes.get(key);
            // Копируем данные из hex в existing
            existing.edges = [...hex.edges];
            existing.rotation = hex.rotation;
            existing.isPlaced = true;
            existing.isStart = false;
            existing.id = hex.id || 'placed_' + Date.now();

            // Обновляем ссылку
            this.hexes.set(key, existing);
            this.placedHexes.push(existing);

            return true;
        }

        /**
         * Получение гекса по координатам
         */
        getHex(x, y) {
            const key = x + ',' + y;
            return this.hexes.get(key) || null;
        }

        /**
         * Получение всех гексов на поле
         */
        getAllHexes() {
            return Array.from(this.hexes.values());
        }

        /**
         * Получение всех установленных гексов
         */
        getPlacedHexes() {
            return this.placedHexes;
        }

        /**
         * Получение всех пустых гексов
         */
        getEmptyHexes() {
            const empty = [];
            this.hexes.forEach((hex) => {
                if (!hex.isPlaced) {
                    empty.push(hex);
                }
            });
            return empty;
        }

        /**
         * Расчет текущего уровня затопленности
         */
        calculateFlood() {
            let leakCount = 0;
            const placed = this.getPlacedHexes();

            // Проверяем все пары установленных гексов
            for (let i = 0; i < placed.length; i++) {
                for (let j = i + 1; j < placed.length; j++) {
                    const hex1 = placed[i];
                    const hex2 = placed[j];
                    
                    // Проверяем, являются ли они соседями
                    const neighbors1 = hex1.getAllNeighborCoords();
                    for (let dir = 0; dir < 6; dir++) {
                        const neighbor = neighbors1[dir];
                        if (neighbor.x === hex2.x && neighbor.y === hex2.y) {
                            // Нашли соседа
                            leakCount += Hex.getLeakCount(hex1, hex2, dir);
                            break;
                        }
                    }
                }
            }

            // Также проверяем края поля (выходы наружу)
            placed.forEach(hex => {
                const neighbors = hex.getAllNeighborCoords();
                for (let dir = 0; dir < 6; dir++) {
                    const neighbor = neighbors[dir];
                    const key = neighbor.x + ',' + neighbor.y;
                    if (!this.hexes.has(key)) {
                        // Выход за пределы поля
                        if (hex.hasEdge(dir)) {
                            leakCount++;
                        }
                    } else {
                        const neighborHex = this.hexes.get(key);
                        if (!neighborHex.isPlaced && hex.hasEdge(dir)) {
                            leakCount++;
                        }
                    }
                }
            });

            return leakCount;
        }

        /**
         * Расчет прогресса (количество установленных гексов / общее количество)
         */
        calculateProgress() {
            const total = this.hexes.size;
            const placed = this.placedHexes.length;
            return total > 0 ? placed / total : 0;
        }

        /**
         * Проверка, завершен ли уровень (нет течей)
         */
        isLevelComplete() {
            return this.calculateFlood() === 0;
        }

        /**
         * Сброс поля
         */
        reset() {
            this.hexes.clear();
            this.startHexes = [];
            this.placedHexes = [];
            this._initBoard();
        }

        /**
         * Получение соседних координат для гекса
         */
        getNeighbors(x, y) {
            const neighbors = [];
            const hex = this.getHex(x, y);
            if (!hex) return neighbors;

            const coords = hex.getAllNeighborCoords();
            coords.forEach(coord => {
                const neighbor = this.getHex(coord.x, coord.y);
                if (neighbor) {
                    neighbors.push(neighbor);
                }
            });
            return neighbors;
        }

        /**
         * Получение всех доступных для размещения клеток
         */
        getAvailableCells() {
            const available = [];
            this.hexes.forEach(hex => {
                if (!hex.isPlaced) {
                    // Проверяем, есть ли сосед с выходом
                    const neighbors = this.getNeighbors(hex.x, hex.y);
                    for (let i = 0; i < neighbors.length; i++) {
                        const neighbor = neighbors[i];
                        if (neighbor.isPlaced) {
                            const dir = this._getDirection(hex, neighbor);
                            if (dir !== -1 && neighbor.hasEdge(dir)) {
                                available.push(hex);
                                break;
                            }
                        }
                    }
                }
            });
            return available;
        }

        /**
         * Получение направления от hex1 к hex2
         */
        _getDirection(hex1, hex2) {
            const dx = hex2.x - hex1.x;
            const dy = hex2.y - hex1.y;
            const offsets = Hex.EDGE_OFFSETS;
            for (let i = 0; i < offsets.length; i++) {
                if (offsets[i].dx === dx && offsets[i].dy === dy) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Подсчет выходящих течей из гекса на пустые клетки
         */
        getHexLeaks(hex) {
            let leaks = 0;
            const neighbors = hex.getAllNeighborCoords();
            for (let dir = 0; dir < 6; dir++) {
                const neighbor = neighbors[dir];
                const key = neighbor.x + ',' + neighbor.y;
                if (!this.hexes.has(key)) {
                    if (hex.hasEdge(dir)) leaks++;
                } else {
                    const neighborHex = this.hexes.get(key);
                    if (!neighborHex.isPlaced && hex.hasEdge(dir)) {
                        leaks++;
                    }
                }
            }
            return leaks;
        }
    }

    return Board;
})();