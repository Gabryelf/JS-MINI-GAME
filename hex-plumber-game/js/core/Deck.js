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
         * @param {number} params.baseHandSize - Базовое количество карт в руке
         */
        constructor(params = {}) {
            this.cardConfigs = params.cardConfigs || [2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4, 2, 3, 4];
            this.baseHandSize = params.baseHandSize || 3;
            this.hand = [];
            this.discardPile = [];
            this.allCards = [];
            this._initDeck();
            // НЕМЕДЛЕННО заполняем руку
            this.refillHand();
        }

        /**
         * Инициализация колоды
         */
        _initDeck() {
            this.allCards = [];
            // Создаем карты на основе конфигурации
            this.cardConfigs.forEach((outputCount, index) => {
                const hex = Hex.createRandom(0, 0, outputCount);
                hex.id = 'card_' + index + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
                this.allCards.push(hex);
            });
            console.log('[Deck] Создано карт в колоде:', this.allCards.length);
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
            console.log('[Deck] Заполнение руки. Текущий размер:', this.hand.length, 'Цель:', this.baseHandSize);
            
            // Если карт в колоде нет, но есть сброс - перетасовываем
            if (this.allCards.length === 0 && this.discardPile.length > 0) {
                this._reshuffleDiscard();
            }

            // Заполняем руку
            let added = 0;
            while (this.hand.length < this.baseHandSize && this.allCards.length > 0) {
                const card = this.allCards.pop();
                if (card) {
                    // Сбрасываем координаты для карт в руке
                    card.x = 0;
                    card.y = 0;
                    card.isPlaced = false;
                    this.hand.push(card);
                    added++;
                }
            }

            console.log('[Deck] Добавлено карт в руку:', added, 'Всего в руке:', this.hand.length);
            console.log('[Deck] Осталось в колоде:', this.allCards.length);
            console.log('[Deck] В сбросе:', this.discardPile.length);

            // Если рука все еще пуста, создаем аварийные карты
            if (this.hand.length === 0) {
                console.warn('[Deck] Рука пуста! Создаем аварийные карты...');
                for (let i = 0; i < this.baseHandSize; i++) {
                    const outputCount = 2 + Math.floor(Math.random() * 3);
                    const card = Hex.createRandom(0, 0, outputCount);
                    card.id = 'emergency_' + Date.now() + '_' + i;
                    this.hand.push(card);
                }
                console.log('[Deck] Создано аварийных карт:', this.hand.length);
            }

            return this.hand.length;
        }

        /**
         * Перетасовка сброса в колоду
         */
        _reshuffleDiscard() {
            console.log('[Deck] Перетасовка сброса в колоду. Сброс содержит:', this.discardPile.length, 'карт');
            this.allCards = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
        }

        /**
         * Использование карты (перемещение из руки на поле)
         */
        useCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) {
                console.warn('[Deck] Неверный индекс карты:', cardIndex);
                return null;
            }
            
            const card = this.hand[cardIndex];
            console.log('[Deck] Использование карты:', card.id, 'Индекс:', cardIndex);
            
            // Удаляем из руки
            this.hand.splice(cardIndex, 1);
            // Отправляем в сброс
            this.discardPile.push(card);
            
            console.log('[Deck] Карта отправлена в сброс. Теперь в сбросе:', this.discardPile.length);
            
            // Пополняем руку
            this.refillHand();
            
            return card;
        }

        /**
         * Поворот карты в руке
         */
        rotateHandCard(cardIndex, steps = 1) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) {
                console.warn('[Deck] Неверный индекс для поворота:', cardIndex);
                return false;
            }
            const card = this.hand[cardIndex];
            card.rotate(steps);
            console.log('[Deck] Карта повернута:', card.id, 'Новый поворот:', card.rotation);
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
            console.log('[Deck] Сброс колоды');
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
                console.warn('[Deck] Неверный индекс для замены:', cardIndex);
                return null;
            }

            const oldCard = this.hand[cardIndex];
            console.log('[Deck] Замена карты:', oldCard.id);
            
            this.hand.splice(cardIndex, 1);
            this.discardPile.push(oldCard);

            // Если колода пуста, перетасовываем сброс
            if (this.allCards.length === 0) {
                this._reshuffleDiscard();
            }

            if (this.allCards.length > 0) {
                const newCard = this.allCards.pop();
                newCard.x = 0;
                newCard.y = 0;
                newCard.isPlaced = false;
                this.hand.push(newCard);
                console.log('[Deck] Карта заменена на:', newCard.id);
                // Пополняем руку до базового размера
                this.refillHand();
                return newCard;
            }

            // Если нет карт, возвращаем старую
            console.warn('[Deck] Нет карт для замены, возвращаем старую');
            this.hand.push(oldCard);
            return oldCard;
        }

        /**
         * Получение информации о колоде (для отладки)
         */
        getDebugInfo() {
            return {
                handSize: this.hand.length,
                deckSize: this.allCards.length,
                discardSize: this.discardPile.length,
                hand: this.hand.map(c => c.id + ' (выходов:' + c.getOutputCount() + ')'),
                cardConfigs: this.cardConfigs
            };
        }
    }

    return Deck;
})();