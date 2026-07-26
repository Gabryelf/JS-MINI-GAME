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
            
            // Проверяем, можно ли вращать (течей <= 6)
            const flood = this.board.calculateFlood();
            if (flood > 6) {
                // Показываем уведомление
                this._showNotification('❌ Слишком много течей!', 'error');
                return;
            }
            
            // Вращаем карту
            this.deck.rotateHandCard(index);
            this.ui.footer.render();
            const card = this.deck.getHand()[index];
            if (this.ui.boardRenderer) this.ui.boardRenderer.setSelectedCard(card);
            
            // Обновляем отображение
            this.ui.update(this.board, this.deck);
        }
        
        _useTool() {
            if (!this.isRunning || this.isPaused) return false;
            if (this.tools <= 0) {
                this._showNotification('❌ Нет инструментов!', 'error');
                return false;
            }
            
            const selectedIndex = this.ui.footer.getSelectedIndex();
            if (selectedIndex < 0) {
                this._showNotification('❌ Выберите карту!', 'warning');
                return false;
            }
            
            // Проверяем, можно ли заменить (течей <= 6)
            const flood = this.board.calculateFlood();
            if (flood > 6) {
                this._showNotification('❌ Слишком много течей!', 'error');
                return false;
            }
            
            // Заменяем карту
            const newCard = this.deck.swapCard(selectedIndex);
            if (newCard) {
                this.tools--;
                this.ui.setTools(this.tools);
                this.ui.footer.render();
                this.ui.footer.selectCard(selectedIndex);
                const card = this.ui.footer.getSelectedCard();
                if (this.ui.boardRenderer) this.ui.boardRenderer.setSelectedCard(card);
                this._savePlayerData();
                this._showNotification('✅ Карта заменена!', 'success');
                return true;
            }
            
            return false;
        }

        _showNotification(message, type = 'info') {
            const oldNotification = document.querySelector('.game-notification');
            if (oldNotification) oldNotification.remove();
            
            const notification = document.createElement('div');
            notification.className = 'game-notification';
            const colors = {
                success: '#4caf50',
                error: '#ff6b6b',
                warning: '#ffd93d',
                info: '#4fc3ff'
            };
            notification.style.cssText = `
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.85);
                color: ${colors[type] || '#ffffff'};
                padding: 12px 24px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                z-index: 2000;
                border: 2px solid ${colors[type] || '#ffffff'};
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
                animation: slideDown 0.3s ease;
                max-width: 90%;
                text-align: center;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(-20px)';
                notification.style.transition = 'all 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        _levelComplete() {
            console.log('[Game] Уровень пройден!');
            
            // Проверяем, с первого ли раза пройден уровень
            const isFirstAttempt = this._isFirstAttempt();
            
            let reward = 1; // Базовый бонус
            if (isFirstAttempt) {
                // Бонус за прохождение с первого раза
                reward = 2 + Math.floor(Math.random() * 2);
                this._showNotification(`🌟 Бонус! +${reward} инструментов за идеальное прохождение!`, 'success');
            } else {
                this._showNotification(`✅ Уровень пройден! +1 инструмент`, 'success');
            }
            
            this.tools += reward;
            this.score += 10 + reward * 2;
            this.ui.setTools(this.tools);
            this.currentLevel++;
            this._savePlayerData();
            YandexSDK.showBanner();
        }
        
        _isFirstAttempt() {
            // Проверяем, есть ли сохранение о попытках
            const attemptsKey = 'hexPlumber_attempts_' + this.currentLevel;
            const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
            return attempts === 0;
        }

        _gameOver() {
            console.log('[Game] Игра окончена!');
            this.isRunning = false;
            
            // Удаляем старые оверлеи
            const oldOverlay = document.querySelector('.game-over-overlay');
            if (oldOverlay) oldOverlay.remove();
            
            const overlay = document.createElement('div');
            overlay.className = 'game-over-overlay';
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
            console.log('[Game] Перезапуск уровня', this.currentLevel);
            this.isRunning = false;
            
            // Полностью уничтожаем старый UI и рендерер
            if (this.ui) {
                if (this.ui.boardRenderer) {
                    this.ui.boardRenderer.destroy();
                }
                this.ui = null;
            }
            
            // Создаем новый UI
            this.ui = new GameUI();
            
            // Создаем новый уровень с теми же параметрами
            this.level = Level.createLevel(this.currentLevel);
            
            // Создаем новую доску
            this.board = new Board({ radius: this.level.boardRadius, hexSize: 40 });
            
            // Добавляем стартовые гексы
            this.level.startCoords.forEach(([x, y]) => this.board.addStartHex(x, y));
            
            // Добавляем заблокированные гексы
            if (this.level.blockedCoords) {
                this.board.blockHexes(this.level.blockedCoords);
            }
            
            // Создаем новую колоду
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
            
            // Инициализируем UI с новыми объектами
            this.ui.init(this.board, this.deck);
            this.ui.onCardPlace = (x, y, card) => this._placeCard(x, y, card);
            this.ui.onCardRotate = (index) => this._rotateCard(index);
            this.ui.setTools(this.tools);
            
            // Принудительно обновляем UI
            setTimeout(() => {
                this.ui.update(this.board, this.deck);
            }, 50);
            
            this.isRunning = true;
            console.log('[Game] Уровень', this.currentLevel, 'перезапущен');
        }

        nextLevel() {
            console.log('[Game] Следующий уровень');
            this.isRunning = false;
            
            // Полностью уничтожаем старый UI и рендерер
            if (this.ui) {
                if (this.ui.boardRenderer) {
                    this.ui.boardRenderer.destroy();
                }
                this.ui = null;
            }
            
            // Создаем новый UI
            this.ui = new GameUI();
            
            // Создаем новый уровень
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
            
            setTimeout(() => {
                this.ui.update(this.board, this.deck);
            }, 50);
            
            this.isRunning = true;
            console.log('[Game] Запущен уровень', this.currentLevel);
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