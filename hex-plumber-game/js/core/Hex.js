/**
 * Модель гекса
 * @namespace Hex
 */
 window.Hex = (function() {
    'use strict';

    // Направления граней (0 - верх, 1 - верх-право, 2 - низ-право, 3 - низ, 4 - низ-лево, 5 - верх-лево)
    const EDGE_OFFSETS = [
        { dx: 0, dy: -1 },  // 0: верх
        { dx: 1, dy: -1 },  // 1: верх-право
        { dx: 1, dy: 0 },   // 2: низ-право
        { dx: 0, dy: 1 },   // 3: низ
        { dx: -1, dy: 1 },  // 4: низ-лево
        { dx: -1, dy: 0 }   // 5: верх-лево
    ];

    /**
     * Класс гекса
     */
    class Hex {
        /**
         * @param {Object} params
         * @param {number} params.x - Координата X на поле
         * @param {number} params.y - Координата Y на поле
         * @param {number} params.rotation - Поворот (0-5)
         * @param {number[]} params.edges - Массив граней с выходами (0-5)
         * @param {boolean} params.isPlaced - Установлен ли на поле
         * @param {boolean} params.isStart - Стартовый ли гекс
         */
        constructor(params = {}) {
            this.x = params.x || 0;
            this.y = params.y || 0;
            this.rotation = params.rotation || 0;
            this.edges = params.edges || [];
            this.isPlaced = params.isPlaced || false;
            this.isStart = params.isStart || false;
            this.id = Hex._generateId();
        }

        /**
         * Генерация уникального ID
         */
        static _generateId() {
            return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
        }

        /**
         * Получение актуальных граней с учетом поворота
         */
        getActiveEdges() {
            return this.edges.map(edge => (edge + this.rotation) % 6);
        }

        /**
         * Проверка, есть ли выход на конкретной грани
         */
        hasEdge(edgeIndex) {
            const activeEdges = this.getActiveEdges();
            return activeEdges.indexOf(edgeIndex) !== -1;
        }

        /**
         * Проверка, есть ли выход на грани, смежной с соседом
         */
        hasEdgeTo(neighborHex, direction) {
            // direction - направление от текущего гекса к соседу
            const edgeIndex = direction;
            return this.hasEdge(edgeIndex);
        }

        /**
         * Поворот гекса
         * @param {number} steps - Количество шагов поворота (по часовой стрелке)
         */
        rotate(steps = 1) {
            this.rotation = (this.rotation + steps) % 6;
        }

        /**
         * Клонирование гекса
         */
        clone() {
            return new Hex({
                x: this.x,
                y: this.y,
                rotation: this.rotation,
                edges: [...this.edges],
                isPlaced: this.isPlaced,
                isStart: this.isStart
            });
        }

        /**
         * Получение соседних координат
         */
        getNeighborCoords(direction) {
            const offset = EDGE_OFFSETS[direction];
            return {
                x: this.x + offset.dx,
                y: this.y + offset.dy
            };
        }

        /**
         * Получение всех соседних координат
         */
        getAllNeighborCoords() {
            const neighbors = [];
            for (let i = 0; i < 6; i++) {
                neighbors.push(this.getNeighborCoords(i));
            }
            return neighbors;
        }

        /**
         * Количество выходов
         */
        getOutputCount() {
            return this.edges.length;
        }

        /**
         * Создание случайного гекса с заданным количеством выходов
         */
        static createRandom(x, y, outputCount, rotation = 0) {
            // Генерируем случайные грани
            const allEdges = [0, 1, 2, 3, 4, 5];
            const shuffled = [...allEdges];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const edges = shuffled.slice(0, outputCount).sort();

            return new Hex({
                x: x,
                y: y,
                rotation: rotation,
                edges: edges,
                isPlaced: false,
                isStart: false
            });
        }

        /**
         * Создание стартового гекса (все 6 выходов)
         */
        static createStart(x, y) {
            return new Hex({
                x: x,
                y: y,
                rotation: 0,
                edges: [0, 1, 2, 3, 4, 5],
                isPlaced: true,
                isStart: true
            });
        }

        /**
         * Проверка, совместимы ли два гекса (нет течи между ними)
         */
        static areCompatible(hex1, hex2, direction) {
            // direction - направление от hex1 к hex2
            const edge1 = direction;
            const edge2 = (direction + 3) % 6; // противоположная грань

            const has1 = hex1.hasEdge(edge1);
            const has2 = hex2.hasEdge(edge2);

            // Совместимы, если оба имеют выход или оба не имеют
            return has1 === has2;
        }

        /**
         * Получение количества течей между двумя гексами
         */
        static getLeakCount(hex1, hex2, direction) {
            const edge1 = direction;
            const edge2 = (direction + 3) % 6;

            const has1 = hex1.hasEdge(edge1);
            const has2 = hex2.hasEdge(edge2);

            // Течь, если у одного есть выход, а у другого нет
            if (has1 && !has2) return 1;
            if (!has1 && has2) return 1;
            return 0;
        }
    }

    // Экспортируем константы
    Hex.EDGE_OFFSETS = EDGE_OFFSETS;
    Hex.ALL_EDGES = [0, 1, 2, 3, 4, 5];

    return Hex;
})();