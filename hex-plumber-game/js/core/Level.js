/**
 * Система уровней
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
            this.cardConfigs = params.cardConfigs || this._generateCardConfigsForLevel(params.level || 1);
            this.baseHandSize = params.baseHandSize || 3;
            this.isComplete = false;
            this.maxFloodAllowed = params.maxFloodAllowed || 10;
        }

        /**
         * Генерация конфигурации карт для уровня
         */
        _generateCardConfigsForLevel(level) {
            // Создаем много карт для колоды
            const configs = [];
            // Базовое количество карт
            const baseCount = 15 + level * 2;
            
            for (let i = 0; i < baseCount; i++) {
                // Карты с 2, 3 или 4 выходами
                let outputs;
                if (i < 5) {
                    outputs = 2; // начальные карты простые
                } else if (i < 10) {
                    outputs = 3; // средние
                } else {
                    outputs = 2 + Math.floor(Math.random() * 3); // 2-4
                }
                configs.push(outputs);
            }
            
            console.log('[Level] Сгенерировано карт:', configs.length);
            return configs;
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
                baseHandSize: 3,
                maxFloodAllowed: 10
            });
        }

        /**
         * Создание уровня по номеру
         */
        static createLevel(levelNumber) {
            // Простая генерация уровней
            const level = new Level({
                level: levelNumber,
                boardRadius: Math.min(3 + levelNumber, 6),
                startCoords: Level._generateStartCoords(levelNumber),
                targetFlood: 0,
                baseHandSize: Math.min(3 + Math.floor(levelNumber / 2), 4),
                maxFloodAllowed: 8 + levelNumber * 2
            });
            return level;
        }

        /**
         * Генерация стартовых координат
         */
        static _generateStartCoords(level) {
            const coords = [[0, 0]];
            if (level > 2) coords.push([1, -1]);
            if (level > 3) coords.push([-1, 1]);
            if (level > 4) coords.push([2, -2]);
            if (level > 5) coords.push([-2, 2]);
            return coords;
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
         * Генерация следующего уровня
         */
        generateNextLevel() {
            return Level.createLevel(this.level + 1);
        }
    }

    return Level;
})();