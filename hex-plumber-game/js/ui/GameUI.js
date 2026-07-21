/**
 * Главный UI контроллер
 * @namespace GameUI
 */
 window.GameUI = (function() {
    'use strict';

    /**
     * Класс главного UI
     */
    class GameUI {
        constructor() {
            this.header = new HeaderUI();
            this.footer = new FooterUI();
            this.boardRenderer = null;
            this.onCardPlace = null;
            this.onCardRotate = null;

            // Связываем события
            this.footer.onCardSelect = (card) => {
                if (this.boardRenderer) {
                    this.boardRenderer.setSelectedCard(card);
                }
            };

            this.footer.onRotate = (index) => {
                if (this.onCardRotate && index >= 0) {
                    this.onCardRotate(index);
                }
            };
        }

        /**
         * Инициализация с полем и колодой
         */
        init(board, deck) {
            const canvas = document.getElementById('board-canvas');
            if (canvas) {
                this.boardRenderer = new BoardRenderer(canvas, board);
                this.boardRenderer.onHexClick = (hex) => {
                    this._handleHexClick(hex);
                };
            }

            this.footer.setDeck(deck);
            this.update(board, deck);
        }

        /**
         * Обработка клика по гексу на поле
         */
        _handleHexClick(hex) {
            if (!hex) return;
            if (hex.isPlaced) return;

            // Проверяем, доступна ли клетка
            const available = this.boardRenderer.board.getAvailableCells();
            const isAvailable = available.some(h => h.x === hex.x && h.y === hex.y);
            if (!isAvailable) return;

            // Проверяем, выбрана ли карта
            const card = this.footer.getSelectedCard();
            if (!card) return;

            // Размещаем карту
            if (this.onCardPlace) {
                this.onCardPlace(hex.x, hex.y, card);
            }
        }

        /**
         * Обновление UI
         */
        update(board, deck) {
            if (!board) return;

            const flood = board.calculateFlood();
            const progress = board.calculateProgress();

            this.header.setFlood(flood);
            this.header.setProgress(progress);

            if (deck) {
                this.footer.render();
            }

            if (this.boardRenderer) {
                this.boardRenderer.render();
            }

            // Проверка завершения уровня
            if (board.isLevelComplete()) {
                this._showLevelComplete();
            }
        }

        /**
         * Показ сообщения о завершении уровня
         */
        _showLevelComplete() {
            // Простое уведомление
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(8px);
            `;
            overlay.innerHTML = `
                <div style="
                    background: linear-gradient(145deg, #1a1a2e, #16213e);
                    border-radius: 24px;
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                    max-width: 320px;
                    width: 90%;
                    border: 1px solid rgba(79, 195, 255, 0.2);
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
                ">
                    <div style="font-size: 64px; margin-bottom: 10px;">🎉</div>
                    <h2 style="color: #4fc3ff; margin-bottom: 8px;">Уровень пройден!</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">Все течи устранены!</p>
                    <button id="next-level-btn" style="
                        background: linear-gradient(135deg, #4fc3ff, #00bcd4);
                        border: none;
                        color: #1a1a2e;
                        padding: 14px 40px;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 100%;
                    ">Продолжить</button>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#next-level-btn').addEventListener('click', () => {
                overlay.remove();
                if (window.gameInstance && window.gameInstance.nextLevel) {
                    window.gameInstance.nextLevel();
                }
            });
        }

        /**
         * Обновление количества инструментов
         */
        setTools(count) {
            this.header.setTools(count);
        }

        /**
         * Получение количества инструментов
         */
        getTools() {
            return this.header.getTools();
        }

        /**
         * Использование инструмента
         */
        useTool() {
            return this.header.useTool();
        }

        /**
         * Добавление инструмента
         */
        addTool(count) {
            this.header.addTool(count);
        }

        /**
         * Сброс UI
         */
        reset() {
            this.header.reset();
            this.footer.reset();
            if (this.boardRenderer) {
                this.boardRenderer.render();
            }
        }

        /**
         * Обновление размера поля
         */
        resize() {
            if (this.boardRenderer) {
                this.boardRenderer.resize();
            }
        }
    }

    return GameUI;
})();