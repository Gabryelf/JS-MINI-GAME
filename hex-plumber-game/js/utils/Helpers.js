/**
 * Вспомогательные утилиты
 * @namespace Helpers
 */
 window.Helpers = (function() {
    'use strict';

    /**
     * Генерация случайного целого числа в диапазоне [min, max]
     */
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Перемешивание массива (алгоритм Фишера-Йетса)
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Клонирование объекта
     */
    function cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Дебаунс для оптимизации событий
     */
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Получение координат гекса на канвасе
     */
    function hexToPixel(hexX, hexY, hexSize) {
        const x = hexSize * (Math.sqrt(3) * hexX + Math.sqrt(3)/2 * hexY);
        const y = hexSize * (3/2 * hexY);
        return { x, y };
    }

    /**
     * Получение индекса грани по углу поворота
     */
    function getEdgeIndex(rotation, edge) {
        return (edge + rotation) % 6;
    }

    /**
     * Проверка, является ли число степенью двойки
     */
    function isPowerOfTwo(n) {
        return n > 0 && (n & (n - 1)) === 0;
    }

    return {
        randomInt: randomInt,
        shuffleArray: shuffleArray,
        cloneObject: cloneObject,
        debounce: debounce,
        hexToPixel: hexToPixel,
        getEdgeIndex: getEdgeIndex,
        isPowerOfTwo: isPowerOfTwo
    };
})();