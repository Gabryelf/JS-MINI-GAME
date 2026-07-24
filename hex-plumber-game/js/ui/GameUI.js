// ===== ui/GameUI.js =====
window.GameUI = (function() {
    'use strict';

    class GameUI {
        constructor() {
            this.header = new HeaderUI();
            this.footer = new FooterUI();
            this.boardRenderer = null;
            this.onCardPlace = null;
            this.onCardRotate = null;

            this.footer.onCardSelect = (card) => {
                if (this.boardRenderer) {
                    this.boardRenderer.setSelectedCard(card);
                }
            };

            this.footer.onRotate = (index) => {
                if (this.onCardRotate && index >= 0) {
                    this.onCardRotate(index);
                    const card = this.footer.getSelectedCard();
                    if (this.boardRenderer) {
                        this.boardRenderer.setSelectedCard(card);
                    }
                }
            };
        }

        init(board, deck) {
            const canvas = document.getElementById('board-canvas');
            if (canvas) {
                if (this.boardRenderer) {
                    // Полный сброс существующего рендерера
                    this.boardRenderer.fullReset();
                    // Обновляем ссылку на доску
                    this.boardRenderer.board = board;
                    this.boardRenderer._setupCanvas();
                    this.boardRenderer._centerCamera();
                } else {
                    this.boardRenderer = new BoardRenderer(canvas, board);
                }
                this.boardRenderer.onHexClick = (hex) => {
                    this._handleHexClick(hex);
                };
            }

            this.footer.setDeck(deck);
            // Принудительное обновление
            setTimeout(() => {
                this.update(board, deck);
            }, 50);
        }

        _handleHexClick(hex) {
            if (!hex) return;
            if (hex.isPlaced) return;

            const card = this.footer.getSelectedCard();
            if (!card) return;

            if (this.boardRenderer) {
                const isAvailable = this.boardRenderer.availableCellsForCard.some(
                    h => h.x === hex.x && h.y === hex.y
                );
                if (!isAvailable) return;
            }

            if (this.onCardPlace) {
                this.onCardPlace(hex.x, hex.y, card);
            }
        }

        update(board, deck) {
            if (!board) return;

            const flood = board.calculateFlood();
            const progress = board.calculateProgress();

            this.header.setFlood(flood);
            this.header.setProgress(progress);

            if (deck) {
                this.footer.render();
                const card = this.footer.getSelectedCard();
                if (this.boardRenderer) {
                    this.boardRenderer.setSelectedCard(card);
                }
            }

            if (this.boardRenderer) {
                this.boardRenderer.render();
            }

            if (board.isLevelComplete()) {
                this._showLevelComplete();
            }
        }

        _showLevelComplete() {
            if (document.querySelector('.level-complete-overlay')) return;
            
            const overlay = document.createElement('div');
            overlay.className = 'level-complete-overlay';
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

        setTools(count) {
            this.header.setTools(count);
        }

        getTools() {
            return this.header.getTools();
        }

        useTool() {
            return this.header.useTool();
        }

        addTool(count) {
            this.header.addTool(count);
        }

        reset() {
            this.header.reset();
            this.footer.reset();
            if (this.boardRenderer) {
                this.boardRenderer.fullReset();
            }
        }

        resize() {
            if (this.boardRenderer) {
                this.boardRenderer.resize();
            }
        }
    }

    return GameUI;
})();