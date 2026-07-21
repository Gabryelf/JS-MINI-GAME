/**
 * Система уровней (заглушка для будущей реализации)
 * @namespace Level
 */
 window.Level = (function() {
    'use strict';

    /**
     * Класс уровня
     */
    class Level {
        /**
         * @param {Object} params
         * @param {number} params.level - Номер уровня
         * @param {number} params.boardRadius - Радиус поля
         * @param {Array} params.startCoords - Координаты стартовых гексов
         * @param {number} params.targetFlood - Целевой уровень затопленности (0 для победы)
         */
        constructor(params = {}) {
            this.level = params.level || 1;
            this.boardRadius = params.boardRadius || 4;
            this.startCoords = params.startCoords || [[0, 0]];
            this.targetFlood = params.targetFlood || 0;
            this.cardConfigs = params.cardConfigs || [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3];
            this.baseHandSize = params.baseHandSize || 3;
            this.isComplete = false;
            this.maxFloodAllowed = params.maxFloodAllowed || 10;
        }

        /**
         * Создание уровня по умолчанию (уровень 1)
         */
        static createLevel1() {
            return new Level({
                level: 1,
                boardRadius: 4,
                startCoords: [[0, 0]],
                targetFlood: 0,
                cardConfigs: [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4],
                baseHandSize: 3,
                maxFloodAllowed: 10
            });
        }

        /**
         * Создание уровня по номеру (для будущей реализации)
         */
        static createLevel(levelNumber) {
            // Заглушка - возвращаем уровень 1
            return Level.createLevel1();
        }

        /**
         * Проверка, пройден ли уровень
         */
        checkCompletion(board) {
            if (!board) return false;
            const flood = board.calculateFlood();
            this.isComplete = flood <= this.targetFlood;
            return this.isComplete;
        }

        /**
         * Получение данных уровня для сохранения
         */
        getData() {
            return {
                level: this.level,
                boardRadius: this.boardRadius,
                startCoords: this.startCoords,
                targetFlood: this.targetFlood,
                maxFloodAllowed: this.maxFloodAllowed
            };
        }

        /**
         * Генерация следующего уровня (для будущей реализации)
         */
        generateNextLevel() {
            // Увеличиваем сложность
            const nextLevel = new Level({
                level: this.level + 1,
                boardRadius: Math.min(this.boardRadius + 1, 6),
                startCoords: this._generateStartCoords(this.level + 1),
                targetFlood: 0,
                cardConfigs: this._generateCardConfigs(this.level + 1),
                baseHandSize: Math.min(this.baseHandSize + 1, 4),
                maxFloodAllowed: this.maxFloodAllowed + 2
            });
            return nextLevel;
        }

        /**
         * Генерация стартовых координат (для будущей реализации)
         */
        _generateStartCoords(level) {
            // Простая генерация
            const coords = [[0, 0]];
            if (level > 2) {
                coords.push([1, -1]);
            }
            if (level > 4) {
                coords.push([-1, 1]);
            }
            return coords;
        }

        /**
         * Генерация конфигурации карт (для будущей реализации)
         */
        _generateCardConfigs(level) {
            const configs = [];
            const count = 8 + level * 2;
            for (let i = 0; i < count; i++) {
                const outputs = 2 + Math.floor(Math.random() * 3);
                configs.push(outputs);
            }
            return configs;
        }
    }

    return Level;
})();