/**
 * Точка входа в игру
 */
 (function() {
    'use strict';

    // Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Main] DOM загружен, запуск игры...');

        try {
            // Создаем экземпляр игры
            const game = new Game();
            
            // Инициализируем
            game.init();

            // Обработка ошибок
            window.addEventListener('error', function(e) {
                console.error('[Main] Глобальная ошибка:', e.message, e.filename, e.lineno);
                // Показываем уведомление пользователю
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 9999;
                    max-width: 90%;
                    text-align: center;
                `;
                errorDiv.textContent = 'Произошла ошибка. Перезагрузите страницу.';
                document.body.appendChild(errorDiv);
                setTimeout(() => errorDiv.remove(), 5000);
            });

            // Обработка переполнения стека вызовов (для стабильности)
            console.log('[Main] Игра успешно запущена!');
        } catch (e) {
            console.error('[Main] Критическая ошибка:', e);
            alert('Ошибка запуска игры. Пожалуйста, обновите страницу.');
        }
    });

    // Поддержка PWA и офлайн-режима
    if ('serviceWorker' in navigator) {
        // Регистрация Service Worker (опционально)
        // navigator.serviceWorker.register('/sw.js');
    }

})();