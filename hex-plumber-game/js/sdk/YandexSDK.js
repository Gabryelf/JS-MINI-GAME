/**
 * Адаптер для Яндекс SDK
 * Работает как в браузере (заглушка), так и в Яндекс.Играх
 * @namespace YandexSDK
 */
 window.YandexSDK = (function() {
    'use strict';

    // Состояние SDK
    let sdkInitialized = false;
    let isYandexEnvironment = false;
    let sdkInstance = null;
    let playerData = {};

    // Очередь вызовов до инициализации
    let pendingCalls = [];

    /**
     * Проверка, запущено ли в Яндекс.Играх
     */
    function detectYandexEnvironment() {
        return typeof window.ysdk !== 'undefined' || 
               (typeof window.YaGames !== 'undefined' && typeof window.YaGames.init === 'function');
    }

    /**
     * Инициализация SDK
     */
    function init(callback) {
        if (sdkInitialized) {
            if (callback) callback(true);
            return;
        }

        isYandexEnvironment = detectYandexEnvironment();

        if (isYandexEnvironment) {
            // Реальная инициализация Яндекс SDK
            try {
                const yaGames = window.YaGames || window.ysdk;
                if (yaGames && typeof yaGames.init === 'function') {
                    yaGames.init()
                        .then(function(sdk) {
                            sdkInstance = sdk;
                            sdkInitialized = true;
                            console.log('[YandexSDK] Инициализирован в Яндекс.Играх');
                            // Выполняем отложенные вызовы
                            executePendingCalls();
                            if (callback) callback(true);
                        })
                        .catch(function(err) {
                            console.warn('[YandexSDK] Ошибка инициализации:', err);
                            // Переключаемся в режим заглушки
                            sdkInitialized = true;
                            isYandexEnvironment = false;
                            if (callback) callback(false);
                        });
                } else {
                    // Заглушка
                    sdkInitialized = true;
                    isYandexEnvironment = false;
                    console.log('[YandexSDK] Работа в режиме заглушки (браузер)');
                    if (callback) callback(false);
                }
            } catch (e) {
                sdkInitialized = true;
                isYandexEnvironment = false;
                console.warn('[YandexSDK] Ошибка, работа в режиме заглушки:', e);
                if (callback) callback(false);
            }
        } else {
            // Заглушка
            sdkInitialized = true;
            isYandexEnvironment = false;
            console.log('[YandexSDK] Работа в режиме заглушки (браузер)');
            if (callback) callback(false);
        }
    }

    /**
     * Выполнение отложенных вызовов
     */
    function executePendingCalls() {
        while (pendingCalls.length > 0) {
            const call = pendingCalls.shift();
            call();
        }
    }

    /**
     * Получение данных игрока
     */
    function getPlayerData() {
        return new Promise(function(resolve, reject) {
            if (!sdkInitialized) {
                pendingCalls.push(function() {
                    getPlayerData().then(resolve).catch(reject);
                });
                return;
            }

            if (!isYandexEnvironment) {
                // Заглушка
                const defaultData = {
                    level: 1,
                    tools: 1,
                    score: 0,
                    maxLevel: 1
                };
                // Загружаем из localStorage
                try {
                    const saved = localStorage.getItem('hexPlumber_data');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        Object.assign(defaultData, parsed);
                    }
                } catch (e) {}
                resolve(defaultData);
                return;
            }

            // Реальное SDK
            try {
                if (sdkInstance && sdkInstance.getPlayer) {
                    sdkInstance.getPlayer()
                        .then(function(player) {
                            return player.getData();
                        })
                        .then(function(data) {
                            resolve(data || {});
                        })
                        .catch(reject);
                } else {
                    reject(new Error('SDK не инициализирован'));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Сохранение данных игрока
     */
    function setPlayerData(data) {
        return new Promise(function(resolve, reject) {
            if (!sdkInitialized) {
                pendingCalls.push(function() {
                    setPlayerData(data).then(resolve).catch(reject);
                });
                return;
            }

            if (!isYandexEnvironment) {
                // Заглушка - сохраняем в localStorage
                try {
                    const current = JSON.parse(localStorage.getItem('hexPlumber_data') || '{}');
                    Object.assign(current, data);
                    localStorage.setItem('hexPlumber_data', JSON.stringify(current));
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
                return;
            }

            // Реальное SDK
            try {
                if (sdkInstance && sdkInstance.getPlayer) {
                    sdkInstance.getPlayer()
                        .then(function(player) {
                            return player.setData(data);
                        })
                        .then(function() {
                            resolve(true);
                        })
                        .catch(reject);
                } else {
                    reject(new Error('SDK не инициализирован'));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Показать рекламу
     */
    function showRewardedVideo() {
        return new Promise(function(resolve, reject) {
            if (!sdkInitialized) {
                pendingCalls.push(function() {
                    showRewardedVideo().then(resolve).catch(reject);
                });
                return;
            }

            if (!isYandexEnvironment) {
                // Заглушка - имитация просмотра
                console.log('[YandexSDK] Имитация просмотра рекламы');
                setTimeout(function() {
                    resolve(true);
                }, 1500);
                return;
            }

            try {
                if (sdkInstance && sdkInstance.showRewardedVideo) {
                    sdkInstance.showRewardedVideo()
                        .then(function() {
                            resolve(true);
                        })
                        .catch(reject);
                } else {
                    reject(new Error('SDK не поддерживает рекламу'));
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Показать баннерную рекламу
     */
    function showBanner() {
        if (!isYandexEnvironment) return;
        try {
            if (sdkInstance && sdkInstance.showBanner) {
                sdkInstance.showBanner();
            }
        } catch (e) {
            console.warn('[YandexSDK] Ошибка показа баннера:', e);
        }
    }

    /**
     * Скрыть баннерную рекламу
     */
    function hideBanner() {
        if (!isYandexEnvironment) return;
        try {
            if (sdkInstance && sdkInstance.hideBanner) {
                sdkInstance.hideBanner();
            }
        } catch (e) {
            console.warn('[YandexSDK] Ошибка скрытия баннера:', e);
        }
    }

    /**
     * Получить язык пользователя
     */
    function getLanguage() {
        if (!isYandexEnvironment) {
            return navigator.language || 'ru';
        }
        try {
            if (sdkInstance && sdkInstance.getLanguage) {
                return sdkInstance.getLanguage();
            }
        } catch (e) {}
        return 'ru';
    }

    return {
        init: init,
        getPlayerData: getPlayerData,
        setPlayerData: setPlayerData,
        showRewardedVideo: showRewardedVideo,
        showBanner: showBanner,
        hideBanner: hideBanner,
        getLanguage: getLanguage,
        isYandexEnvironment: function() { return isYandexEnvironment; },
        isInitialized: function() { return sdkInitialized; }
    };
})();