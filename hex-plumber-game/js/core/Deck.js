/**
 * Колода карт
 * @namespace Deck
 */
 window.Deck = (function() {
    'use strict';

    /**
     * Класс колоды
     */
    class Deck {
        /**
         * @param {Object} params
         * @param {number[]} params.cardConfigs - Массив конфигураций карт (количество выходов)
         * @param {number} params.baseOutputCount - Базовое количество карт в руке
         */
        constructor(params = {}) {
            this.cardConfigs = params.cardConfigs || [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3];
            this.baseHandSize = params.baseHandSize || 3;
            this.hand = []; // Карты в руке (массив Hex)
            this.discardPile = []; // Сброс
            this.allCards = []; // Все карты в игре (для колоды)
            this._initDeck();
        }

        /**
         * Инициализация колоды
         */
        _initDeck() {
            this.allCards = [];
            // Создаем карты на основе конфигурации
            this.cardConfigs.forEach((outputCount, index) => {
                const hex = Hex.createRandom(0, 0, outputCount);
                hex.id = 'card_' + index + '_' + Date.now();
                this.allCards.push(hex);
            });
            this.shuffleDeck();
        }

        /**
         * Перемешивание колоды
         */
        shuffleDeck() {
            Helpers.shuffleArray(this.allCards);
        }

        /**
         * Заполнение руки до базового размера
         */
        refillHand() {
            while (this.hand.length < this.baseHandSize && this.allCards.length > 0) {
                const card = this.allCards.pop();
                if (card) {
                    this.hand.push(card);
                }
            }

            // Если колода пуста, перетасовываем сброс
            if (this.allCards.length === 0 && this.hand.length < this.baseHandSize) {
                this._reshuffleDiscard();
                // Повторная попытка
                while (this.hand.length < this.baseHandSize && this.allCards.length > 0) {
                    const card = this.allCards.pop();
                    if (card) {
                        this.hand.push(card);
                    }
                }
            }

            return this.hand.length;
        }

        /**
         * Перетасовка сброса в колоду
         */
        _reshuffleDiscard() {
            this.allCards = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
        }

        /**
         * Использование карты (перемещение из руки на поле)
         */
        useCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) {
                return null;
            }
            const card = this.hand[cardIndex];
            // Удаляем из руки
            this.hand.splice(cardIndex, 1);
            // Отправляем в сброс (позже может быть перетасована)
            this.discardPile.push(card);
            // Пополняем руку
            this.refillHand();
            return card;
        }

        /**
         * Поворот карты в руке
         */
        rotateHandCard(cardIndex, steps = 1) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) {
                return false;
            }
            const card = this.hand[cardIndex];
            card.rotate(steps);
            return true;
        }

        /**
         * Получение текущей руки
         */
        getHand() {
            return this.hand;
        }

        /**
         * Получение количества карт в руке
         */
        getHandSize() {
            return this.hand.length;
        }

        /**
         * Проверка, пуста ли рука
         */
        isHandEmpty() {
            return this.hand.length === 0;
        }

        /**
         * Сброс колоды
         */
        reset() {
            this.hand = [];
            this.discardPile = [];
            this._initDeck();
            this.refillHand();
        }

        /**
         * Замена карты в руке на случайную из колоды
         */
        swapCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) {
                return null;
            }

            const oldCard = this.hand[cardIndex];
            this.hand.splice(cardIndex, 1);

            // Добавляем старую карту в сброс
            this.discardPile.push(oldCard);

            // Берем новую из колоды
            if (this.allCards.length === 0) {
                this._reshuffleDiscard();
            }

            if (this.allCards.length > 0) {
                const newCard = this.allCards.pop();
                this.hand.push(newCard);
                // Пополняем руку до базового размера
                this.refillHand();
                return newCard;
            }

            // Если нет карт, возвращаем старую
            this.hand.push(oldCard);
            return oldCard;
        }
    }

    return Deck;
})();