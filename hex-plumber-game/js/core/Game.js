// ===== core/Game.js =====
window.Game = (function() {
    'use strict';

    class Game {
        constructor() {
            this.board = null;
            this.deck = null;
            this.level = null;
            this.ui = null;
            this.isRunning = false;
            this.isPaused = false;
            this.tools = 1;
            this.score = 0;
            this.currentLevel = 1;
            window.gameInstance = this;
        }

        init() {
            console.log('[Game] Инициализация...');
            YandexSDK.init((success) => {
                console.log('[Game] SDK инициализация:', success ? 'успешно' : 'режим заглушки');
                if (success) this._loadPlayerData();
                this._startGame();
            });
        }

        _loadPlayerData() {
            YandexSDK.getPlayerData()
                .then((data) => {
                    if (data) {
                        this.currentLevel = data.level || 1;
                        this.tools = data.tools || 1;
                        this.score = data.score || 0;
                    }
                })
                .catch((err) => console.warn('[Game] Ошибка загрузки данных:', err));
        }

        _savePlayerData() {
            YandexSDK.setPlayerData({ level: this.currentLevel, tools: this.tools, score: this.score })
                .catch((err) => console.warn('[Game] Ошибка сохранения данных:', err));
        }

        _startGame() {
            console.log('[Game] Запуск игры...');
            this.ui = new GameUI();
            this.level = Level.createLevel(this.currentLevel);
            this.board = new Board({ radius: this.level.boardRadius, hexSize: 40 });
            
            this.level.startCoords.forEach(([x, y]) => this.board.addStartHex(x, y));
            if (this.level.blockedCoords) {
                this.board.blockHexes(this.level.blockedCoords);
            }

            this.deck = new Deck({
                cardTemplates: this.level.cardTemplates || [
                    { outputs: 1, edges: [[0]] },
                    { outputs: 2, edges: [[0, 3], [0, 2], [0, 4]] },
                    { outputs: 3, edges: [[0, 2, 4], [0, 2, 3], [0, 3, 5]] },
                    { outputs: 4, edges: [[0, 1, 3, 4], [0, 2, 3, 5], [0, 1, 2, 4]] },
                    { outputs: 5, edges: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 5]] },
                    { outputs: 6, edges: [[0, 1, 2, 3, 4, 5]] }
                ],
                baseHandSize: this.level.baseHandSize || 3
            });

            this.ui.init(this.board, this.deck);
            this.ui.onCardPlace = (x, y, card) => this._placeCard(x, y, card);
            this.ui.onCardRotate = (index) => this._rotateCard(index);
            this.ui.setTools(this.tools);

            YandexSDK.showBanner();
            setTimeout(() => this.ui.update(this.board, this.deck), 100);
            this.isRunning = true;
            console.log('[Game] Игра запущена, уровень', this.currentLevel);
        }

        _placeCard(x, y, card) {
            if (!this.isRunning || this.isPaused) return;
            if (!this.board) return;

            if (!this.board.canPlaceHex(x, y, card)) return;

            const hand = this.deck.getHand();
            let cardIndex = -1;
            for (let i = 0; i < hand.length; i++) {
                if (hand[i].id === card.id) { cardIndex = i; break; }
            }
            if (cardIndex === -1) return;

            const success = this.board.placeHex(x, y, card);
            if (!success) return;

            this.deck.useCard(cardIndex);
            const flood = this.board.calculateFlood();
            
            if (flood >= 9) {
                this._gameOver();
                return;
            }

            this.ui.update(this.board, this.deck);
            // Сбрасываем выбранную карту
            this.ui.footer.selectCard(-1);
            if (this.ui.boardRenderer) {
                this.ui.boardRenderer.setSelectedCard(null);
            }

            if (this.board.isLevelComplete()) {
                this._levelComplete();
            }
        }

        _rotateCard(index) {
            if (!this.isRunning || this.isPaused) return;
            const flood = this.board.calculateFlood();
            if (flood > 3) return;
            this.deck.rotateHandCard(index);
            this.ui.footer.render();
            const card = this.deck.getHand()[index];
            if (this.ui.boardRenderer) this.ui.boardRenderer.setSelectedCard(card);
        }

        _levelComplete() {
            console.log('[Game] Уровень пройден!');
            const reward = 1 + Math.floor(Math.random() * 2);
            this.tools += reward;
            this.score += 10;
            this.ui.addTool(reward);
            this.currentLevel++;
            this._savePlayerData();
            YandexSDK.showBanner();
        }

        _gameOver() {
            console.log('[Game] Игра окончена!');
            this.isRunning = false;
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.8); display: flex;
                align-items: center; justify-content: center; z-index: 1000;
                backdrop-filter: blur(8px);
            `;
            overlay.innerHTML = `
                <div style="background: linear-gradient(145deg, #1a1a2e, #16213e);
                    border-radius: 24px; padding: 40px 30px; text-align: center;
                    color: white; max-width: 320px; width: 90%;
                    border: 1px solid rgba(255, 107, 107, 0.2);
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);">
                    <div style="font-size: 64px; margin-bottom: 10px;">💧</div>
                    <h2 style="color: #ff6b6b; margin-bottom: 8px;">Потоп!</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">Слишком много течей!</p>
                    <button id="restart-btn" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                        border: none; color: white; padding: 14px 40px; border-radius: 12px;
                        font-size: 18px; font-weight: 700; cursor: pointer; width: 100%;">
                        Попробовать снова
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
            overlay.querySelector('#restart-btn').addEventListener('click', () => {
                overlay.remove();
                this.restartLevel();
            });
        }

        restartLevel() {
            console.log('[Game] Перезапуск уровня');
            this.isRunning = false;
            this.level = Level.createLevel(this.currentLevel);
            this.board = new Board({ radius: this.level.boardRadius, hexSize: 40 });
            this.level.startCoords.forEach(([x, y]) => this.board.addStartHex(x, y));
            if (this.level.blockedCoords) {
                this.board.blockHexes(this.level.blockedCoords);
            }
            this.deck = new Deck({
                cardTemplates: this.level.cardTemplates || [
                    { outputs: 1, edges: [[0]] },
                    { outputs: 2, edges: [[0, 3], [0, 2], [0, 4]] },
                    { outputs: 3, edges: [[0, 2, 4], [0, 2, 3], [0, 3, 5]] },
                    { outputs: 4, edges: [[0, 1, 3, 4], [0, 2, 3, 5], [0, 1, 2, 4]] },
                    { outputs: 5, edges: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 5]] },
                    { outputs: 6, edges: [[0, 1, 2, 3, 4, 5]] }
                ],
                baseHandSize: this.level.baseHandSize || 3
            });
            this.ui.reset();
            this.ui.init(this.board, this.deck);
            this.ui.setTools(this.tools);
            setTimeout(() => this.ui.update(this.board, this.deck), 50);
            this.isRunning = true;
        }

        nextLevel() {
            console.log('[Game] Следующий уровень');
            this.level = Level.createLevel(this.currentLevel);
            this.board = new Board({ radius: this.level.boardRadius, hexSize: 40 });
            this.level.startCoords.forEach(([x, y]) => this.board.addStartHex(x, y));
            if (this.level.blockedCoords) {
                this.board.blockHexes(this.level.blockedCoords);
            }
            this.deck = new Deck({
                cardTemplates: this.level.cardTemplates || [
                    { outputs: 1, edges: [[0]] },
                    { outputs: 2, edges: [[0, 3], [0, 2], [0, 4]] },
                    { outputs: 3, edges: [[0, 2, 4], [0, 2, 3], [0, 3, 5]] },
                    { outputs: 4, edges: [[0, 1, 3, 4], [0, 2, 3, 5], [0, 1, 2, 4]] },
                    { outputs: 5, edges: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 5]] },
                    { outputs: 6, edges: [[0, 1, 2, 3, 4, 5]] }
                ],
                baseHandSize: this.level.baseHandSize || 3
            });
            this.ui.reset();
            this.ui.init(this.board, this.deck);
            this.ui.setTools(this.tools);
            setTimeout(() => this.ui.update(this.board, this.deck), 50);
            this.isRunning = true;
        }

        useBooster() {
            if (!this.isRunning || this.isPaused) return false;
            if (this.tools <= 0) return false;
            const selectedIndex = this.ui.footer.getSelectedIndex();
            if (selectedIndex < 0) return false;
            if (!this.ui.useTool()) return false;
            this.tools = this.ui.getTools();
            const newCard = this.deck.swapCard(selectedIndex);
            if (newCard) {
                this.ui.footer.render();
                this.ui.footer.selectCard(selectedIndex);
                const card = this.ui.footer.getSelectedCard();
                if (this.ui.boardRenderer) this.ui.boardRenderer.setSelectedCard(card);
                this._savePlayerData();
                return true;
            }
            this.ui.addTool(1);
            this.tools = this.ui.getTools();
            return false;
        }

        pause() { this.isPaused = true; }
        resume() { this.isPaused = false; }
        destroy() { this.isRunning = false; YandexSDK.hideBanner(); window.gameInstance = null; }
    }

    return Game;
})();