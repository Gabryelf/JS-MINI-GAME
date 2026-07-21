/**
 * Управление футером (карты в руке)
 * @namespace FooterUI
 */
 window.FooterUI = (function() {
    'use strict';

    /**
     * Класс управления футером
     */
    class FooterUI {
        constructor() {
            this.container = document.getElementById('cards-container');
            this.rotateBtn = document.getElementById('rotate-btn');
            this.deck = null;
            this.onCardSelect = null;
            this.onRotate = null;
            this.selectedIndex = -1;
            this.cards = [];

            this._bindEvents();
        }

        /**
         * Привязка событий
         */
        _bindEvents() {
            if (this.rotateBtn) {
                this.rotateBtn.addEventListener('click', () => {
                    if (this.onRotate) {
                        this.onRotate(this.selectedIndex);
                    }
                });
            }
        }

        /**
         * Установка колоды
         */
        setDeck(deck) {
            this.deck = deck;
            this.render();
        }

        /**
         * Рендеринг карт в футере
         */
        render() {
            if (!this.container) return;
            if (!this.deck) {
                this.container.innerHTML = '<div class="card-slot empty">Нет карт</div>';
                return;
            }

            const hand = this.deck.getHand();
            this.cards = hand;
            this.container.innerHTML = '';

            if (hand.length === 0) {
                this.container.innerHTML = '<div class="card-slot empty">⏳ Загрузка...</div>';
                return;
            }

            hand.forEach((card, index) => {
                const slot = document.createElement('div');
                slot.className = 'card-slot';
                if (index === this.selectedIndex) {
                    slot.classList.add('active');
                }

                // Создаем мини-канвас для карты
                const canvas = document.createElement('canvas');
                canvas.className = 'hex-canvas';
                canvas.width = 70;
                canvas.height = 70;
                slot.appendChild(canvas);

                // Рисуем гекс на мини-канвасе
                this._drawMiniHex(canvas, card);

                // Бейдж с количеством выходов
                const badge = document.createElement('span');
                badge.className = 'card-badge';
                badge.textContent = card.getOutputCount();
                slot.appendChild(badge);

                // Клик для выбора карты
                slot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectCard(index);
                });

                this.container.appendChild(slot);
            });
        }

        /**
         * Отрисовка мини-гекса на канвасе
         */
        _drawMiniHex(canvas, hex) {
            const ctx = canvas.getContext('2d');
            const size = 30;
            const cx = 35;
            const cy = 35;

            ctx.clearRect(0, 0, 70, 70);

            // Фон
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i - 30);
                const px = cx + size * Math.cos(angle);
                const py = cy + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(30, 50, 80, 0.6)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Трубы
            const activeEdges = hex.getActiveEdges();
            activeEdges.forEach(edgeIndex => {
                const angle = Math.PI / 180 * (60 * edgeIndex - 30);
                const startX = cx + size * 0.25 * Math.cos(angle);
                const startY = cy + size * 0.25 * Math.sin(angle);
                const endX = cx + size * 0.85 * Math.cos(angle);
                const endY = cy + size * 0.85 * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = '#4fc3ff';
                ctx.lineWidth = 3;
                ctx.shadowColor = 'rgba(79, 195, 255, 0.3)';
                ctx.shadowBlur = 6;
                ctx.stroke();
                ctx.shadowBlur = 0;

                ctx.beginPath();
                ctx.arc(endX, endY, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#4fc3ff';
                ctx.fill();
            });
        }

        /**
         * Выбор карты
         */
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

        /**
         * Получение выбранной карты
         */
        getSelectedCard() {
            if (this.selectedIndex >= 0 && this.selectedIndex < this.cards.length) {
                return this.cards[this.selectedIndex];
            }
            return null;
        }

        /**
         * Получение индекса выбранной карты
         */
        getSelectedIndex() {
            return this.selectedIndex;
        }

        /**
         * Обновление после использования карты
         */
        refresh() {
            this.selectedIndex = -1;
            this.render();
            if (this.onCardSelect) {
                this.onCardSelect(null);
            }
        }

        /**
         * Сброс
         */
        reset() {
            this.selectedIndex = -1;
            this.cards = [];
            if (this.container) {
                this.container.innerHTML = '';
            }
        }
    }

    return FooterUI;
})();