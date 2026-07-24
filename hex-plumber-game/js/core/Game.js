/**
 * Главный игровой контроллер
 * @namespace Game
 */
 window.Game = (function() {
    'use strict';

    /**
     * Класс игры
     */
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

            // Храним экземпляр для глобального доступа
            window.gameInstance = this;
        }

        /**
         * Инициализация игры
         */
        init() {
            console.log('[Game] Инициализация...');

            // Инициализация SDK
            YandexSDK.init((success) => {
                console.log('[Game] SDK инициализация:', success ? 'успешно' : 'режим заглушки');
                if (success) {
                    this._loadPlayerData();
                }
                this._startGame();
            });
        }

        /**
         * Загрузка данных игрока
         */
        _loadPlayerData() {
            YandexSDK.getPlayerData()
                .then((data) => {
                    if (data) {
                        this.currentLevel = data.level || 1;
                        this.tools = data.tools || 1;
                        this.score = data.score || 0;
                        console.log('[Game] Загружены данные игрока:', data);
                    }
                })
                .catch((err) => {
                    console.warn('[Game] Ошибка загрузки данных:', err);
                });
        }

        /**
         * Сохранение данных игрока
         */
        _savePlayerData() {
            const data = {
                level: this.currentLevel,
                tools: this.tools,
                score: this.score
            };
            YandexSDK.setPlayerData(data)
                .then(() => {
                    console.log('[Game] Данные сохранены');
                })
                .catch((err) => {
                    console.warn('[Game] Ошибка сохранения данных:', err);
                });
        }

        /**
         * Старт игры
         */
        _startGame() {
            console.log('[Game] Запуск игры...');
            
            // Создаем UI
            this.ui = new GameUI();

            // Создаем уровень
            this.level = Level.createLevel(this.currentLevel);
            console.log('[Game] Уровень:', this.currentLevel, 'Радиус:', this.level.boardRadius);
            
            // Создаем поле
            this.board = new Board({
                radius: this.level.boardRadius,
                hexSize: 40
            });

            // Добавляем стартовые гексы
            this.level.startCoords.forEach(([x, y]) => {
                this.board.addStartHex(x, y);
            });
            console.log('[Game] Добавлено стартовых гексов:', this.level.startCoords.length);

            // Создаем колоду
            console.log('[Game] Создание колоды с конфигурацией:', this.level.cardConfigs.length, 'карт');
            this.deck = new Deck({
                cardConfigs: this.level.cardConfigs,
                baseHandSize: this.level.baseHandSize
            });

            // Проверяем, что карты в руке есть
            console.log('[Game] Карт в руке после создания:', this.deck.getHandSize());
            console.log('[Game] Информация о колоде:', this.deck.getDebugInfo());

            // Инициализируем UI
            this.ui.init(this.board, this.deck);

            // Устанавливаем обработчики
            this.ui.onCardPlace = (x, y, card) => {
                this._placeCard(x, y, card);
            };

            this.ui.onCardRotate = (index) => {
                this._rotateCard(index);
            };

            // Устанавливаем инструменты
            this.ui.setTools(this.tools);

            // Показываем баннер в Яндекс.Играх
            YandexSDK.showBanner();

            // Принудительно обновляем UI
            setTimeout(() => {
                this.ui.update(this.board, this.deck);
                console.log('[Game] UI обновлен. Карт в руке:', this.deck.getHandSize());
            }, 100);

            this.isRunning = true;
            console.log('[Game] Игра запущена, уровень', this.currentLevel);
        }

        /**
         * Размещение карты на поле
         */
        _placeCard(x, y, card) {
            if (!this.isRunning || this.isPaused) return;
            if (!this.board) return;

            console.log(`[Game] Попытка разместить карту на (${x},${y})`);

            if (!this.board.canPlaceHex(x, y, card)) {
                console.log('[Game] Нельзя разместить здесь');
                return;
            }

            const hand = this.deck.getHand();
            let cardIndex = -1;
            for (let i = 0; i < hand.length; i++) {
                if (hand[i].id === card.id) {
                    cardIndex = i;
                    break;
                }
            }

            if (cardIndex === -1) {
                console.warn('[Game] Карта не найдена в руке');
                return;
            }

            const success = this.board.placeHex(x, y, card);
            if (!success) {
                console.warn('[Game] Не удалось разместить карту');
                return;
            }

            // Удаляем карту из руки
            this.deck.useCard(cardIndex);

            // Проверяем уровень затопленности
            const flood = this.board.calculateFlood();
            console.log('[Game] Уровень затопленности:', flood);
            
            // УСЛОВИЕ ПОРАЖЕНИЯ: 9 или более течей
            if (flood >= 9) {
                console.log('[Game] Игра проиграна! Течей:', flood);
                this._gameOver();
                return;
            }

            // Обновляем UI
            this.ui.update(this.board, this.deck);

            // Проверяем завершение (0 течей)
            if (this.board.isLevelComplete()) {
                this._levelComplete();
            }
        }

        /**
         * Поворот карты в руке
         */
        _rotateCard(index) {
            if (!this.isRunning || this.isPaused) return;
            
            // Проверяем, можно ли поворачивать (течь <= 3)
            const flood = this.board.calculateFlood();
            if (flood > 3) {
                console.log('[Game] Нельзя повернуть - слишком высокая течь');
                return;
            }

            const success = this.deck.rotateHandCard(index);
            if (success) {
                this.ui.footer.render();
                const card = this.deck.getHand()[index];
                if (this.ui.boardRenderer) {
                    this.ui.boardRenderer.setSelectedCard(card);
                }
            }
        }

        /**
         * Завершение уровня
         */
        _levelComplete() {
            console.log('[Game] Уровень пройден!');
            
            // Награда
            const reward = 1 + Math.floor(Math.random() * 2);
            this.tools += reward;
            this.score += 10;
            this.ui.addTool(reward);
            
            // Сохраняем прогресс
            this.currentLevel++;
            this._savePlayerData();

            // Показываем баннер
            YandexSDK.showBanner();

            // UI покажет уведомление через _showLevelComplete
        }

        /**
         * Игра окончена (проигрыш)
         */
        _gameOver() {
            console.log('[Game] Игра окончена!');
            this.isRunning = false;

            // Показываем сообщение
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
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
                    border: 1px solid rgba(255, 107, 107, 0.2);
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
                ">
                    <div style="font-size: 64px; margin-bottom: 10px;">💧</div>
                    <h2 style="color: #ff6b6b; margin-bottom: 8px;">Потоп!</h2>
                    <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">Слишком много течей!</p>
                    <button id="restart-btn" style="
                        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                        border: none;
                        color: white;
                        padding: 14px 40px;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.2s;
                        width: 100%;
                    ">Попробовать снова</button>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#restart-btn').addEventListener('click', () => {
                overlay.remove();
                this.restartLevel();
            });
        }

        /**
         * Перезапуск уровня
         */
        restartLevel() {
            console.log('[Game] Перезапуск уровня');
            
            // Сбрасываем состояние
            this.isRunning = false;
            
            // Пересоздаем уровень
            this.level = Level.createLevel(this.currentLevel);
            this.board = new Board({
                radius: this.level.boardRadius,
                hexSize: 40
            });
            this.level.startCoords.forEach(([x, y]) => {
                this.board.addStartHex(x, y);
            });
            this.deck = new Deck({
                cardConfigs: this.level.cardConfigs,
                baseHandSize: this.level.baseHandSize
            });

            // Обновляем UI
            this.ui.reset();
            this.ui.init(this.board, this.deck);
            this.ui.setTools(this.tools);
            
            // Принудительное обновление
            setTimeout(() => {
                this.ui.update(this.board, this.deck);
            }, 50);

            this.isRunning = true;
            console.log('[Game] Уровень перезапущен');
        }

        /**
         * Следующий уровень
         */
        nextLevel() {
            console.log('[Game] Следующий уровень');
            
            // Генерируем следующий уровень
            this.level = this.level.generateNextLevel();
            this.board = new Board({
                radius: this.level.boardRadius,
                hexSize: 40
            });
            this.level.startCoords.forEach(([x, y]) => {
                this.board.addStartHex(x, y);
            });
            this.deck = new Deck({
                cardConfigs: this.level.cardConfigs,
                baseHandSize: this.level.baseHandSize
            });

            // Обновляем UI
            this.ui.reset();
            this.ui.init(this.board, this.deck);
            this.ui.setTools(this.tools);
            
            // Принудительное обновление
            setTimeout(() => {
                this.ui.update(this.board, this.deck);
            }, 50);

            this.isRunning = true;
            console.log('[Game] Запущен уровень', this.currentLevel);
        }

        /**
         * Использование бустера (инструмента)
         */
        useBooster() {
            if (!this.isRunning || this.isPaused) return false;
            if (this.tools <= 0) return false;

            // Проверяем, есть ли выбранная карта
            const selectedIndex = this.ui.footer.getSelectedIndex();
            if (selectedIndex < 0) return false;

            // Используем инструмент
            if (!this.ui.useTool()) return false;
            this.tools = this.ui.getTools();

            // Меняем карту на случайную
            const newCard = this.deck.swapCard(selectedIndex);
            if (newCard) {
                this.ui.footer.render();
                this.ui.footer.selectCard(selectedIndex);
                // Обновляем предпросмотр
                const card = this.ui.footer.getSelectedCard();
                if (this.ui.boardRenderer) {
                    this.ui.boardRenderer.setSelectedCard(card);
                }
                this._savePlayerData();
                return true;
            }

            // Возвращаем инструмент, если не удалось
            this.ui.addTool(1);
            this.tools = this.ui.getTools();
            return false;
        }

        /**
         * Пауза
         */
        pause() {
            this.isPaused = true;
        }

        /**
         * Продолжить
         */
        resume() {
            this.isPaused = false;
        }

        /**
         * Уничтожение игры
         */
        destroy() {
            this.isRunning = false;
            YandexSDK.hideBanner();
            window.gameInstance = null;
        }
    }

    return Game;
})();