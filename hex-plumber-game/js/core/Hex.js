/**
 * Модель гекса
 * @namespace Hex
 */
 window.Hex = (function() {
    'use strict';

    // ============================================================
    // КОНФИГУРАЦИЯ ОТРИСОВКИ
    // Здесь вы можете вручную настроить углы для каждой грани
    // ============================================================
    
    // Конфигурация для поля (Board)
    // Углы в градусах от центра к середине стороны
    // Формат: [грань0, грань1, грань2, грань3, грань4, грань5]
    const BOARD_DRAW_CONFIG = {
        // Для pointy-top гекса стороны находятся под углами:
        // 0: верх → 270° (-90°)
        // 1: верх-право → 330° (-30°)
        // 2: низ-право → 30°
        // 3: низ → 90°
        // 4: низ-лево → 150°
        // 5: верх-лево → 210°
        edgeAngles: [240, 300, 0, 60, 120, 180],
        
        // Дополнительные параметры отрисовки трубы
        pipeStartOffset: 0.15,  // отступ от центра (0-1)
        pipeEndOffset: 0.85,    // длина трубы (0-1)
        pipeWidth: 4,           // ширина линии
        pipeColor: '#4fc3ff',
        pipeEndRadius: 5,       // радиус круга на конце
    };

    // Конфигурация для руки (Footer)
    const HAND_DRAW_CONFIG = {
        edgeAngles: [240, 300, 0, 60, 120, 180],
        pipeStartOffset: 0.2,
        pipeEndOffset: 0.85,
        pipeWidth: 3,
        pipeColor: '#4fc3ff',
        pipeEndRadius: 3.5,
    };

    // Направления граней для pointy-top гекса (вершина вверх)
    const EDGE_OFFSETS = [
        { dx: 0, dy: -1 },   // 0: верх
        { dx: 1, dy: -1 },   // 1: верх-право
        { dx: 1, dy: 0 },    // 2: низ-право
        { dx: 0, dy: 1 },    // 3: низ
        { dx: -1, dy: 1 },   // 4: низ-лево
        { dx: -1, dy: 0 }    // 5: верх-лево
    ];

    class Hex {
        constructor(params = {}) {
            this.x = params.x || 0;
            this.y = params.y || 0;
            this.rotation = params.rotation || 0;
            this.edges = params.edges || [];
            this.isPlaced = params.isPlaced || false;
            this.isStart = params.isStart || false;
            this.id = Hex._generateId();
        }

        static _generateId() {
            return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
        }

        getActiveEdges() {
            return this.edges.map(edge => (edge + this.rotation) % 6);
        }

        hasEdge(edgeIndex) {
            const activeEdges = this.getActiveEdges();
            return activeEdges.indexOf(edgeIndex) !== -1;
        }

        rotate(steps = 1) {
            this.rotation = (this.rotation + steps) % 6;
        }

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

        getNeighborCoords(direction) {
            const offset = EDGE_OFFSETS[direction];
            return {
                x: this.x + offset.dx,
                y: this.y + offset.dy
            };
        }

        getAllNeighborCoords() {
            const neighbors = [];
            for (let i = 0; i < 6; i++) {
                neighbors.push(this.getNeighborCoords(i));
            }
            return neighbors;
        }

        getOutputCount() {
            return this.edges.length;
        }

        static getBoardDrawConfig() {
            return BOARD_DRAW_CONFIG;
        }

        static getHandDrawConfig() {
            return HAND_DRAW_CONFIG;
        }

        static getEdgeAnglesForBoard() {
            return BOARD_DRAW_CONFIG.edgeAngles;
        }

        static getEdgeAnglesForHand() {
            return HAND_DRAW_CONFIG.edgeAngles;
        }

        /**
         * Получить угол для отрисовки грани (в радианах) для поля
         */
        static getBoardAngle(edgeIndex) {
            const angles = BOARD_DRAW_CONFIG.edgeAngles;
            return Math.PI / 180 * angles[edgeIndex % 6];
        }

        /**
         * Получить угол для отрисовки грани (в радианах) для руки
         */
        static getHandAngle(edgeIndex) {
            const angles = HAND_DRAW_CONFIG.edgeAngles;
            return Math.PI / 180 * angles[edgeIndex % 6];
        }

        static createRandom(x, y, outputCount, rotation = 0) {
            const allEdges = [0, 1, 2, 3, 4, 5];
            const shuffled = [...allEdges];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            const edges = shuffled.slice(0, Math.min(outputCount, 6)).sort();

            return new Hex({
                x: x,
                y: y,
                rotation: rotation,
                edges: edges,
                isPlaced: false,
                isStart: false
            });
        }

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

        static areCompatible(hex1, hex2, direction) {
            const edge1 = direction;
            const edge2 = (direction + 3) % 6;
            const has1 = hex1.hasEdge(edge1);
            const has2 = hex2.hasEdge(edge2);
            return has1 === has2;
        }

        getDebugInfo() {
            return {
                id: this.id,
                x: this.x,
                y: this.y,
                rotation: this.rotation,
                edges: this.edges,
                activeEdges: this.getActiveEdges(),
                isPlaced: this.isPlaced,
                isStart: this.isStart
            };
        }
    }

    Hex.EDGE_OFFSETS = EDGE_OFFSETS;
    Hex.ALL_EDGES = [0, 1, 2, 3, 4, 5];

    return Hex;
})();