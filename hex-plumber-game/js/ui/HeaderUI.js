/**
 * Управление хедером
 * @namespace HeaderUI
 */
 window.HeaderUI = (function() {
    'use strict';

    /**
     * Класс управления хедером
     */
    class HeaderUI {
        constructor() {
            this.floodElement = document.getElementById('flood-level');
            this.progressFill = document.getElementById('progress-fill');
            this.progressText = document.getElementById('progress-text');
            this.toolsElement = document.getElementById('tools-count');
            this.settingsBtn = document.getElementById('settings-btn');

            this.tools = 1;
            this.flood = 0;
            this.progress = 0;

            this.toolBtn = document.getElementById('use-tool-btn');
            this._bindEvents();
        }

        /**
         * Привязка событий
         */
        _bindEvents() {
            if (this.settingsBtn) {
                this.settingsBtn.addEventListener('click', () => {
                    this._showSettingsModal();
                });
            }

            if (this.toolBtn) {
                this.toolBtn.addEventListener('click', () => {
                    if (window.gameInstance && window.gameInstance._useTool) {
                        window.gameInstance._useTool();
                    }
                });
            }
        }

        /**
         * Обновление инструментов
         */

        setTools(count) {
            this.tools = Math.max(0, count);
            if (this.toolsElement) {
                this.toolsElement.textContent = this.tools;
            }
            // Обновляем состояние кнопки
            if (this.toolBtn) {
                this.toolBtn.disabled = this.tools <= 0;
            }
        }

        /**
         * Обновление уровня затопленности
         */
        setFlood(level) {
            this.flood = level;
            if (this.floodElement) {
                this.floodElement.textContent = level;
                // Визуальное предупреждение при высоком уровне
                if (level > 5) {
                    this.floodElement.parentElement.classList.add('flood-warning');
                } else {
                    this.floodElement.parentElement.classList.remove('flood-warning');
                }
            }
        }

        /**
         * Обновление прогресса
         */
        setProgress(value) {
            this.progress = Math.min(1, Math.max(0, value));
            if (this.progressFill) {
                this.progressFill.style.width = (this.progress * 100) + '%';
            }
            if (this.progressText) {
                this.progressText.textContent = Math.round(this.progress * 100) + '%';
            }
        }

        /**
         * Обновление количества инструментов
         */
        setTools(count) {
            this.tools = Math.max(0, count);
            if (this.toolsElement) {
                this.toolsElement.textContent = this.tools;
            }
        }

        /**
         * Получение количества инструментов
         */
        getTools() {
            return this.tools;
        }

        /**
         * Использование инструмента (уменьшение на 1)
         */
        useTool() {
            if (this.tools > 0) {
                this.setTools(this.tools - 1);
                return true;
            }
            return false;
        }

        /**
         * Добавление инструмента
         */
        addTool(count = 1) {
            this.setTools(this.tools + count);
        }

        /**
         * Показать модальное окно настроек
         */
        _showSettingsModal() {
            // Создаем модальное окно
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay open';
            overlay.innerHTML = `
                <div class="modal">
                    <h2>⚙️ Настройки</h2>
                    <button class="primary" id="modal-restart">🔄 Перезапустить уровень</button>
                    <button id="modal-sdk">📱 Статус SDK</button>
                    <button class="close-btn" id="modal-close">✕ Закрыть</button>
                </div>
            `;
            document.body.appendChild(overlay);

            // Обработчики
            overlay.querySelector('#modal-restart').addEventListener('click', () => {
                if (window.gameInstance && window.gameInstance.restartLevel) {
                    window.gameInstance.restartLevel();
                }
                overlay.remove();
            });

            overlay.querySelector('#modal-sdk').addEventListener('click', () => {
                const isYandex = YandexSDK.isYandexEnvironment();
                const isInit = YandexSDK.isInitialized();
                alert(`Статус SDK:\nЯндекс.Игры: ${isYandex ? '✅ Да' : '❌ Нет'}\nИнициализирован: ${isInit ? '✅ Да' : '❌ Нет'}`);
            });

            overlay.querySelector('#modal-close').addEventListener('click', () => {
                overlay.remove();
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        }

        /**
         * Сброс UI
         */
        reset() {
            this.setFlood(0);
            this.setProgress(0);
            this.setTools(1);
        }
    }

    return HeaderUI;
})();