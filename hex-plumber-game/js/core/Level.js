// ===== core/Level.js =====
window.Level = (function() {
    'use strict';

    class Level {
        constructor(params = {}) {
            this.level = params.level || 1;
            this.boardRadius = params.boardRadius || 4;
            this.startCoords = params.startCoords || [[0, 0]];
            this.blockedCoords = params.blockedCoords || [];
            this.targetFlood = params.targetFlood || 0;
            this.cardTemplates = params.cardTemplates || this._generateCardTemplates(params.level || 1);
            this.baseHandSize = params.baseHandSize || 3;
            this.isComplete = false;
            this.maxFloodAllowed = params.maxFloodAllowed || 10;
        }

        _generateCardTemplates(level) {
            const templates = [
                { outputs: 1, edges: [[0]] },
                { outputs: 2, edges: [[0, 3], [0, 2], [0, 4]] },
                { outputs: 3, edges: [[0, 2, 4], [0, 2, 3], [0, 3, 5]] },
                { outputs: 4, edges: [[0, 1, 3, 4], [0, 2, 3, 5], [0, 1, 2, 4]] },
                { outputs: 5, edges: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 5]] },
                { outputs: 6, edges: [[0, 1, 2, 3, 4, 5]] }
            ];
            
            // Добавляем больше сложных карт на высоких уровнях
            const result = [];
            const repeatCount = Math.min(level + 2, 6);
            for (let i = 0; i < repeatCount; i++) {
                templates.forEach(t => result.push(t));
            }
            return result;
        }

        static createLevel(levelNumber) {
            const radius = Math.min(3 + Math.floor(levelNumber / 1.5), 7);
            const startCoords = Level._generateStartCoords(levelNumber);
            const blockedCoords = Level._generateBlockedCoords(levelNumber, radius);
            
            return new Level({
                level: levelNumber,
                boardRadius: radius,
                startCoords: startCoords,
                blockedCoords: blockedCoords,
                targetFlood: 0,
                baseHandSize: Math.min(3 + Math.floor(levelNumber / 3), 5),
                maxFloodAllowed: 8 + levelNumber * 2
            });
        }

        static _generateStartCoords(level) {
            const coords = [[0, 0]];
            if (level > 2) coords.push([1, -1]);
            if (level > 3) coords.push([-1, 1]);
            if (level > 4) coords.push([2, -2]);
            if (level > 5) coords.push([-2, 2]);
            if (level > 6) coords.push([3, -3]);
            return coords;
        }

        static _generateBlockedCoords(level, radius) {
            const blocked = [];
            if (level < 3) return blocked;
            
            const count = Math.min(Math.floor(level / 2), radius);
            const positions = [];
            for (let q = -radius; q <= radius; q++) {
                for (let r = -radius; r <= radius; r++) {
                    if (Math.abs(q + r) <= radius && !(q === 0 && r === 0)) {
                        positions.push([q, r]);
                    }
                }
            }
            
            Helpers.shuffleArray(positions);
            for (let i = 0; i < Math.min(count, positions.length); i++) {
                blocked.push(positions[i]);
            }
            return blocked;
        }

        checkCompletion(board) {
            if (!board) return false;
            const flood = board.calculateFlood();
            this.isComplete = flood <= this.targetFlood;
            return this.isComplete;
        }

        getData() {
            return {
                level: this.level,
                boardRadius: this.boardRadius,
                startCoords: this.startCoords,
                blockedCoords: this.blockedCoords,
                targetFlood: this.targetFlood,
                maxFloodAllowed: this.maxFloodAllowed
            };
        }

        generateNextLevel() {
            return Level.createLevel(this.level + 1);
        }
    }

    return Level;
})();