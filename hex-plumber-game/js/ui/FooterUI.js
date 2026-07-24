/**
 * Управление футером (карты в руке)
 * @namespace FooterUI
 */
 window.FooterUI = (function() {
    'use strict';

    class FooterUI {
        constructor() {
            this.container = document.getElementById('cards-container');
            this.rotateBtn = document.getElementById('rotate-btn');
            this.deck = null;
            this.onCardSelect = null;
            this.onRotate = null;
            this.selectedIndex = -1;
            this.cards = [];
            this.drawConfig = Hex.getHandDrawConfig();

            this._bindEvents();
        }

        _bindEvents() {
            if (this.rotateBtn) {
                this.rotateBtn.addEventListener('click', () => {
                    if (this.onRotate) {
                        this.onRotate(this.selectedIndex);
                    }
                });
            }
        }

        setDeck(deck) {
            this.deck = deck;
            console.log('[FooterUI] Установлена колода, карт в руке:', deck ? deck.getHandSize() : 0);
            this.render();
        }

        render() {
            console.log('[FooterUI] Рендеринг...');
            
            if (!this.container) {
                console.warn('[FooterUI] Контейнер не найден');
                return;
            }
            
            if (!this.deck) {
                console.warn('[FooterUI] Колода не установлена');
                this.container.innerHTML = '<div class="card-slot empty">Нет колоды</div>';
                return;
            }

            const hand = this.deck.getHand();
            this.cards = hand;
            this.container.innerHTML = '';

            console.log('[FooterUI] Карт в руке:', hand.length);

            if (!hand || hand.length === 0) {
                this.container.innerHTML = '<div class="card-slot empty">⏳ Загрузка карт...</div>';
                return;
            }

            hand.forEach((card, index) => {
                const slot = document.createElement('div');
                slot.className = 'card-slot';
                if (index === this.selectedIndex) {
                    slot.classList.add('active');
                }

                const canvas = document.createElement('canvas');
                canvas.className = 'hex-canvas';
                canvas.width = 70;
                canvas.height = 70;
                slot.appendChild(canvas);

                this._drawMiniHex(canvas, card);

                const badge = document.createElement('span');
                badge.className = 'card-badge';
                badge.textContent = card.getOutputCount();
                slot.appendChild(badge);

                slot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('[FooterUI] Выбрана карта:', index);
                    this.selectCard(index);
                });

                this.container.appendChild(slot);
            });

            console.log('[FooterUI] Отображено карт:', this.container.children.length);
        }

        /**
         * Отрисовка мини-гекса на канвасе
         */
        _drawMiniHex(canvas, hex) {
            const ctx = canvas.getContext('2d');
            const size = 28;
            const cx = 35;
            const cy = 35;
            const config = this.drawConfig;

            ctx.clearRect(0, 0, 70, 70);

            // Рисуем шестиугольник - pointy-top (вершина вверх)
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i + 30);
                const px = cx + size * Math.cos(angle);
                const py = cy + size * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(30, 50, 80, 0.6)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Рисуем трубы используя конфигурацию для руки
            const activeEdges = hex.getActiveEdges();
            activeEdges.forEach(edgeIndex => {
                const angleDeg = config.edgeAngles[edgeIndex % 6];
                const angle = Math.PI / 180 * angleDeg;
                
                const startX = cx + size * config.pipeStartOffset * Math.cos(angle);
                const startY = cy + size * config.pipeStartOffset * Math.sin(angle);
                const endX = cx + size * config.pipeEndOffset * Math.cos(angle);
                const endY = cy + size * config.pipeEndOffset * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = config.pipeColor;
                ctx.lineWidth = config.pipeWidth;
                ctx.shadowColor = 'rgba(79, 195, 255, 0.3)';
                ctx.shadowBlur = 6;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(endX, endY, config.pipeEndRadius, 0, Math.PI * 2);
                ctx.fillStyle = config.pipeColor;
                ctx.fill();
            });
        }

        selectCard(index) {
            if (index < 0 || index >= this.cards.length) {
                this.selectedIndex = -1;
                this.render();
                if (this.onCardSelect) {
                    this.onCardSelect(null);
                }
                return;
            }

            this.selectedIndex = index;
            this.render();
            if (this.onCardSelect) {
                this.onCardSelect(this.cards[index]);
            }
        }

        getSelectedCard() {
            if (this.selectedIndex >= 0 && this.selectedIndex < this.cards.length) {
                return this.cards[this.selectedIndex];
            }
            return null;
        }

        getSelectedIndex() {
            return this.selectedIndex;
        }

        refresh() {
            this.selectedIndex = -1;
            this.render();
            if (this.onCardSelect) {
                this.onCardSelect(null);
            }
        }

        reset() {
            this.selectedIndex = -1;
            this.cards = [];
            if (this.container) {
                this.container.innerHTML = '<div class="card-slot empty">⏳ Загрузка...</div>';
            }
        }
    }

    return FooterUI;
})();