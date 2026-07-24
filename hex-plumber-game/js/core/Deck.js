// ===== core/Deck.js =====
window.Deck = (function() {
    'use strict';

    class Deck {
        constructor(params = {}) {
            // Расширенный набор конфигураций карт: [количество выходов, список граней]
            this.cardTemplates = params.cardTemplates || [
                { outputs: 1, edges: [[0]] },
                { outputs: 2, edges: [[0, 3]] },
                { outputs: 2, edges: [[0, 2]] },
                { outputs: 2, edges: [[0, 4]] },
                { outputs: 3, edges: [[0, 2, 4]] },
                { outputs: 3, edges: [[0, 2, 3]] },
                { outputs: 3, edges: [[0, 3, 5]] },
                { outputs: 4, edges: [[0, 1, 3, 4]] },
                { outputs: 4, edges: [[0, 2, 3, 5]] },
                { outputs: 4, edges: [[0, 1, 2, 4]] },
                { outputs: 5, edges: [[0, 1, 2, 3, 4]] },
                { outputs: 5, edges: [[0, 1, 2, 3, 5]] },
                { outputs: 6, edges: [[0, 1, 2, 3, 4, 5]] }
            ];
            this.baseHandSize = params.baseHandSize || 3;
            this.hand = [];
            this.discardPile = [];
            this.allCards = [];
            this._initDeck();
            this.refillHand();
        }

        _initDeck() {
            this.allCards = [];
            // Генерируем колоду из шаблонов с повторами
            const deckSize = 25 + Math.floor(Math.random() * 10);
            for (let i = 0; i < deckSize; i++) {
                const template = this.cardTemplates[Math.floor(Math.random() * this.cardTemplates.length)];
                const edgePattern = template.edges[Math.floor(Math.random() * template.edges.length)];
                const hex = new Hex({
                    x: 0,
                    y: 0,
                    rotation: 0,
                    edges: edgePattern.slice(),
                    isPlaced: false,
                    isStart: false
                });
                hex.id = 'card_' + i + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
                this.allCards.push(hex);
            }
            console.log('[Deck] Создано карт:', this.allCards.length);
            this.shuffleDeck();
        }

        shuffleDeck() {
            Helpers.shuffleArray(this.allCards);
        }

        refillHand() {
            if (this.allCards.length === 0 && this.discardPile.length > 0) {
                this._reshuffleDiscard();
            }
            let added = 0;
            while (this.hand.length < this.baseHandSize && this.allCards.length > 0) {
                const card = this.allCards.pop();
                if (card) {
                    card.x = 0;
                    card.y = 0;
                    card.isPlaced = false;
                    this.hand.push(card);
                    added++;
                }
            }
            if (this.hand.length === 0) {
                for (let i = 0; i < this.baseHandSize; i++) {
                    const template = this.cardTemplates[Math.floor(Math.random() * this.cardTemplates.length)];
                    const edgePattern = template.edges[Math.floor(Math.random() * template.edges.length)];
                    const card = new Hex({
                        x: 0,
                        y: 0,
                        rotation: 0,
                        edges: edgePattern.slice(),
                        isPlaced: false,
                        isStart: false
                    });
                    card.id = 'emergency_' + Date.now() + '_' + i;
                    this.hand.push(card);
                }
            }
            return this.hand.length;
        }

        _reshuffleDiscard() {
            this.allCards = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
        }

        useCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) return null;
            const card = this.hand[cardIndex];
            this.hand.splice(cardIndex, 1);
            this.discardPile.push(card);
            this.refillHand();
            return card;
        }

        rotateHandCard(cardIndex, steps = 1) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) return false;
            const card = this.hand[cardIndex];
            card.rotate(steps);
            return true;
        }

        getHand() {
            return this.hand;
        }

        getHandSize() {
            return this.hand.length;
        }

        isHandEmpty() {
            return this.hand.length === 0;
        }

        reset() {
            this.hand = [];
            this.discardPile = [];
            this._initDeck();
            this.refillHand();
        }

        swapCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= this.hand.length) return null;
            const oldCard = this.hand[cardIndex];
            this.hand.splice(cardIndex, 1);
            this.discardPile.push(oldCard);
            if (this.allCards.length === 0) this._reshuffleDiscard();
            if (this.allCards.length > 0) {
                const newCard = this.allCards.pop();
                newCard.x = 0;
                newCard.y = 0;
                newCard.isPlaced = false;
                this.hand.push(newCard);
                this.refillHand();
                return newCard;
            }
            this.hand.push(oldCard);
            return oldCard;
        }

        getDebugInfo() {
            return {
                handSize: this.hand.length,
                deckSize: this.allCards.length,
                discardSize: this.discardPile.length
            };
        }
    }

    return Deck;
})();