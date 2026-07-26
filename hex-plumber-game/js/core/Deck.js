// ===== core/Deck.js =====
window.Deck = (function() {
    'use strict';

    class Deck {
        constructor(params = {}) {
            // Расширенный генератор карт с комбинациями
            this.cardTemplates = params.cardTemplates || this._generateCardTemplates();
            this.baseHandSize = params.baseHandSize || 3;
            this.hand = [];
            this.discardPile = [];
            this.allCards = [];
            this._initDeck();
            this.refillHand();
        }

         /**
         * Генерация всех возможных комбинаций карт
         */
          _generateCardTemplates() {
            const templates = [];
            const allEdges = [0, 1, 2, 3, 4, 5];
            
            // Карты с 1 выходом (6 комбинаций)
            for (let i = 0; i < 6; i++) {
                templates.push({
                    outputs: 1,
                    edges: [[i]],
                    weight: 1 // вес для случайного выбора
                });
            }
            
            // Карты с 2 выходами (15 комбинаций)
            for (let i = 0; i < 5; i++) {
                for (let j = i + 1; j < 6; j++) {
                    templates.push({
                        outputs: 2,
                        edges: [[i, j]],
                        weight: 2
                    });
                }
            }
            
            // Карты с 3 выходами (20 комбинаций)
            for (let i = 0; i < 4; i++) {
                for (let j = i + 1; j < 5; j++) {
                    for (let k = j + 1; k < 6; k++) {
                        templates.push({
                            outputs: 3,
                            edges: [[i, j, k]],
                            weight: 3
                        });
                    }
                }
            }
            
            // Карты с 4 выходами (15 комбинаций)
            for (let i = 0; i < 3; i++) {
                for (let j = i + 1; j < 4; j++) {
                    for (let k = j + 1; k < 5; k++) {
                        for (let l = k + 1; l < 6; l++) {
                            templates.push({
                                outputs: 4,
                                edges: [[i, j, k, l]],
                                weight: 3
                            });
                        }
                    }
                }
            }
            
            // Карты с 5 выходами (6 комбинаций)
            for (let i = 0; i < 6; i++) {
                const edges = allEdges.filter(e => e !== i);
                templates.push({
                    outputs: 5,
                    edges: [edges],
                    weight: 2
                });
            }
            
            // Карта с 6 выходами (1 комбинация)
            templates.push({
                outputs: 6,
                edges: [allEdges],
                weight: 1
            });
            
            return templates;
        }

        _initDeck() {
            this.allCards = [];
            const deckSize = 30 + Math.floor(Math.random() * 10);
            
            // Создаем колоду с учетом весов
            const weightedTemplates = [];
            this.cardTemplates.forEach(template => {
                const weight = template.weight || 1;
                for (let i = 0; i < weight; i++) {
                    weightedTemplates.push(template);
                }
            });
            
            for (let i = 0; i < deckSize; i++) {
                const template = weightedTemplates[Math.floor(Math.random() * weightedTemplates.length)];
                const edgePattern = template.edges[0];
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
            console.log('[Deck] Создано карт с комбинациями:', this.allCards.length);
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