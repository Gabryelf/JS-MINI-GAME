<details> <summary><strong>📁 Часть 1: Подготовка проекта</strong></summary>
  
- [ ] Шаг 1.1: Изучаем структуру
  
````text
word-wonders/
├── index.html              # Основной HTML файл
├── css/
│   ├── main.css           # Основные глобальные стили
│   └── components.css     # Стили отдельных компонентов
├── js/
│   ├── config.js          # Конфигурационные константы
│   ├── utils.js           # Вспомогательные функции
│   ├── game.js            # Игровая логика (ядро)
│   └── ui.js              # Управление интерфейсом
└── data/
    └── words.js           # Словарь слов и данные
````

- [ ] Шаг 1.2: Создание основной структуры в index.html
  
````html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word Wonders</title>
</head>
````
**Добавляем в ui.js в метод updateGameScreen()**
````javascript
<body>
    <!-- Главное меню -->
    <div id="mainScreen" class="screen active">
        
    </div>
    <!-- Игровой экран -->
    <div id="gameScreen" class="screen">
        
    </div>
    <!-- Экран результатов -->
    <div id="resultScreen" class="screen">
       
    </div>
</body>
</html>
````
- [ ] Шаг 1.3: Подключение ссылок на остальные скрипты в index.html

````html
<!-- Сначала стили -->
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/components.css">

<!-- Потом скрипты в правильном порядке -->
<script src="data/words.js"></script>  <!-- 1. Данные -->
<script src="js/config.js"></script>   <!-- 2. Конфигурация -->
<script src="js/utils.js"></script>    <!-- 3. Утилиты -->
<script src="js/game.js"></script>     <!-- 4. Логика -->
<script src="js/ui.js"></script>       <!-- 5. Интерфейс -->
````

- [ ] Шаг 1.4: Наполняем index.html содержимым контейнеров

**Главное меню - стартовый экран**
````html
<!-- Главное меню -->
    <div id="mainScreen" class="screen active">
        <!-- Header -->
        <div class="logo">
            <h1>WORD WONDERS</h1>
            <p>Собирай слова из букв</p>
        </div>
        <!-- Start Buttons -->
        <div class="mode-buttons">
            <button id="infiniteMode" class="mode-btn">
                <div>Бесконечная игра</div>
                <div class="subtitle">Уровни со сложностью</div>
            </button>
            
            <button id="dailyMode" class="mode-btn">
                <div>Слово дня</div>
                <div class="subtitle">Новая тема каждый день</div>
            </button>
        </div>
    </div>
````

**Игровой контейнер**
````html
<!-- Игровой экран -->
    <div id="gameScreen" class="screen">
        <!-- Header ststs -->
        <div class="game-header">
            <button id="backBtn" class="icon-btn">←</button>
            <div class="stats">
                <div class="stat">🎯 <span id="currentLevel">1</span></div>
                <div class="stat">⭐ <span id="score">0</span></div>
                <div class="stat">❤️ <span id="attempts">5</span></div>
            </div>
            <button id="resetBtn" class="icon-btn">↺</button>
        </div>
        <!-- Word area -->
        <div class="words-area">
            <div id="wordsGrid"></div>
            <div class="word-info" id="wordInfo">Найди все слова</div>
        </div>
        <!-- Input area -->
        <div class="input-area">
            <div id="currentInput" class="current-input"></div>
            <div class="circle-input" id="circleInput"></div>
        </div>
    </div>
````

**Событийный контейнер сообщений**
````html
<!-- Экран результатов -->
    <div id="resultScreen" class="screen">
        <div id="resultIcon" class="result-icon">🎉</div>
        <h2 id="resultTitle">Уровень пройден!</h2>
        <p id="resultMessage">Отлично!</p>

        <div class="result-stats">
            <div>Найдено слов: <span id="resultFound">0/0</span></div>
            <div>Заработано очков: <span id="resultScore">0</span></div>
            <div>Новый уровень: <span id="resultNextLevel">2</span></div>
        </div>

        <div class="result-buttons">
            <button id="nextLevelBtn" class="btn btn-primary">Следующий уровень</button>
            <button id="backToMenuBtn" class="btn btn-secondary">В меню</button>
        </div>
    </div>
````
- [ ] Шаг 1.5: Проверяем результат в браузере с запуском index.html
</details>

<details> <summary><strong>🎨 Часть 2: Создание базовых стилей</strong></summary>

- [ ] Шаг 2.1: Открываем и заполняем файл main.css основными стилями
````css
/* Основные стили */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #2d4263 100%);
    color: #f8fafc;
    height: 100vh;
    overflow: hidden;
    touch-action: manipulation;
}

/* Стили экранов */
.screen {
    display: none;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    flex-direction: column;
}

.screen.active {
    display: flex;
}
````

- [ ] Шаг 2.2: Открываем файл components.css и заполняем стилями для элементов

````css
/* Задайте свои стили для главных кнопок*/
.mode-btn {
    ...
}

.mode-btn:first-child {
    animation-delay: 0.1s;
}

.mode-btn:last-child {
    animation-delay: 0.2s;
}

.mode-btn:active {
    transform: scale(0.98);
}

.mode-btn:hover {
    background-color: #6f18c0;
}
/* Остальные кнопки потом зададим ниже*/
````

- [ ] Шаг 2.3: Проверка и отладка стилей - запускаем index.html в браузере

**Смотрим на результат стилизации**

**Редактируем если надо**

**Проверяем работоспособность стилевых событий**

</details>

<details> <summary><strong>⚙️ Часть 3: Настройка конфигурации</strong></summary>

- [ ] Шаг 3.1: Создание глобальных настроек для приложения config.js

````javascript
// Конфигурация игры
const CONFIG = {
    // Настройки игры
    INITIAL_LEVEL: 1,
    INITIAL_SCORE: 0,
    INITIAL_ATTEMPTS: 5,
    MAX_LEVEL: 50,
    
    // Настройки генерации уровней
    MIN_WORDS_PER_LEVEL: 3,
    MAX_WORDS_PER_LEVEL: 5,
    MAX_LETTERS_IN_CIRCLE: 8,
    CIRCLE_RADIUS: 75,
    CIRCLE_CENTER_X: 110,
    CIRCLE_CENTER_Y: 110,
    
    // Настройки очков
    POINTS_PER_LETTER: 10,
    BONUS_PER_LEVEL: 100,
    
    // Настройки сложности
    LEVEL_MULTIPLIER: 0.1,
    ATTEMPTS_PER_LEVEL: 1,
    
    // Настройки интерфейса
    LETTER_CELL_SIZE: 40,
    INPUT_LETTER_SIZE: 45,
    CIRCLE_LETTER_SIZE: 45
};
````

- [ ] Шаг 3.2: Создание конструктора приложения game.js главного файла

````javascript
// Основная логика игры
class Game {
    constructor() {
        this.state = {
            mode: 'infinite',
            level: CONFIG.INITIAL_LEVEL,
            score: CONFIG.INITIAL_SCORE,
            attempts: CONFIG.INITIAL_ATTEMPTS,
            currentInput: [],
            foundWords: [],
            levelData: null,
            dailyCompleted: false,
            dailyDate: null
        };
        
        this.init();
    }

    init() {
        console.log('Игра инициализирована');
    }
}

// Создание экземпляра игры
const game = new Game();
````

- [ ] Шаг 3.2: Создание функций в  game.js для последующей реализации

````javascript
// В классе игры Game
...
    // Настройка ежедневной игры
    setupDaily() {
        console.log('Настройка ежедневной игры');
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        console.log('Настройка обработчиков событий');
    }

    // Начать игру
    start(mode) {
        console.log('Начать игру');
    }

    // Генерация обычного уровня
    generateLevel() {
         console.log('Генерация обычного уровня');
    }

    // Генерация ежедневного уровня
    generateDailyLevel() {
         console.log('Генерация ежедневного уровня');
    }

    // Добавить букву
    addLetter(letter) {
        console.log('Добавить букву');
    }

    // Удалить последнюю букву
    removeLastLetter() {
        console.log('Удалить последнюю букву');
    }

    // Сбросить ввод
    resetInput() {
        console.log('Сбросить ввод');
    }

    // Отправить слово
    submitWord() {
       console.log('Отправить слово');
    }

    // Уровень завершен
    levelComplete() {
        console.log('Уровень завершен');
    }

    // Уровень провален
    levelFailed() {
        console.log('Уровень провален');
    }

    // Следующий уровень
    nextLevel() {
       console.log('Следующий уровень');
    }
````

- [ ] Шаг 3.3: Заполнение функций инициализации в game.js для проверки вызовов

````javascript
// В функциях Game класса
...

     init() {
        this.setupDaily();
        this.setupEventListeners();
        console.log('Игра инициализирована');
    }

    // Начать игру
    start(mode) {
        this.state.mode = mode;
        this.state.currentInput = [];
        this.state.foundWords = [];
        this.state.attempts = CONFIG.INITIAL_ATTEMPTS + Math.floor(this.state.level / 3);
        
        // Генерация уровня
        if (mode === 'infinite') {
            this.generateLevel();
        } else {
            this.generateDailyLevel();
            this.state.dailyCompleted = true;
        }
        console.log('Начать игру');
    }


````

- [ ] Шаг 3.4: Тестируем вызов функций в браузере в консоли разработчика


</details>

<details> <summary><strong>🔧 Часть 4: Настройка вспомогательных функций</strong></summary>

- [ ] Шаг 4.1: Создаем набор требуемых утилит в файле utils.js

````javascript
const Utils = {
    // Перемешивание массива
    shuffle(array) {
        const newArray = [...array];
        ...
        return newArray;
    },

    // Уникальные значения
    unique(array) {
        return [...new Set(array)];
    },

    // Получить случайный элемент
    randomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Подсчет повторений букв в слове
    countLetters(word) {
        ...
        return counts;
    },

    // Проверка, можно ли составить слово из букв
    canFormWord(word, availableLetters) {
        const wordCounts = this.countLetters(word);
        const availableCounts = this.countLetters(availableLetters);
        ...
        return true;
    },

    // Получить дату в формате YYYY-MM-DD
    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },
    
    // Получить индекс темы дня
    getDailyThemeIndex() {
        const today = new Date();
        return today.getDate() % WORD_LIST.dailyThemes.length;
    }
};
````

- [ ] Шаг 4.2: Дополняем реализацию функций расчета утилит в файле utils.js

````javascript
const Utils = {
    // Перемешивание массива
    shuffle(array) {
        const newArray = [...array];
        // Мешаем меняя местами
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    // Подсчет повторений букв в слове
    countLetters(word) {
        // Итеративный подсчет повторений
        for (const letter of word) {
            counts[letter] = (counts[letter] || 0) + 1;
        }
        return counts;
    },

    // Проверка, можно ли составить слово из букв
    canFormWord(word, availableLetters) {
        const wordCounts = this.countLetters(word);
        const availableCounts = this.countLetters(availableLetters);
        // Цикл для возврата негативного результата - слово нельзя составить
        for (const letter in wordCounts) {
            if (!availableCounts[letter] || availableCounts[letter] < wordCounts[letter]) {
                return false;
            }
        }
        // Возвращаем положительный результат если не зашли в цикл
        return true;
    },
};
````

</details>

<details> <summary><strong>🏟️ Часть 5: Разработка представлений</strong></summary>
  
- [ ] Шаг 5.1: Инициализация интерфейса и его функций в ui.js

````javascript
// Управление интерфейсом
const UI = {
    currentScreen: 'mainScreen',
    
    // Показать экран
    showScreen(screenId) {
         console.log('Показать экран');
    },
    
    // Обновить игровой экран
    updateGameScreen(state) {
        console.log('Обновить игровой экран');
    },
    
    // Отрисовать сетку слов
    renderWordsGrid(state) {
        console.log('Отрисовать сетку слов');
    },
    
    // Отрисовать текущий ввод
    renderCurrentInput(state) {
         console.log('Отрисовать текущий ввод');
    },
    
    // Отрисовать круг с буквами
    renderCircleInput(state) {
         console.log('Отрисовать круг с буквами');
    },
    
    // Показать уровень завершен
    showLevelComplete(state) {
         console.log('Показать уровень завершен');
    },
    
    // Показать уровень провален
    showLevelFailed(state) {
          console.log('Показать уровень провален');
    },
    
    // Показать всплывающее сообщение
    showMessage(text, icon = '') {
         console.log('Показать всплывающее сообщение');
    }
};
````

- [ ] Шаг 5.2: Инициализация интерфейса и его функций в ui.js для экранов

````javascript
// UI класс
// Показать экран
    showScreen(screenId) {
        this.currentScreen = screenId;
        // Показать выбранный экран и его элементы
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        // Присваиваем класс стилей для отображения
        document.getElementById(screenId).classList.add('active');
    },
````

**Добавляем в скрипт ui.js в метод updateGameScreen()**

````javascript
 if (!state.levelData) return;
        
        // Обновить статистику
        document.getElementById('currentLevel').textContent = state.level;
        document.getElementById('score').textContent = state.score;
        document.getElementById('attempts').textContent = state.attempts;
        
        // Обновить информацию
        const foundCount = state.foundWords.length;
        const totalWords = state.levelData.words.length;
        document.getElementById('wordInfo').textContent = 
            `Найдено слов: ${foundCount}/${totalWords}`;
        
        // Отрисовать слова
        this.renderWordsGrid(state);
        
        // Отрисовать текущий ввод
        this.renderCurrentInput(state);
        
        // Отрисовать круг с буквами
        this.renderCircleInput(state);
````

- [ ] Шаг 5.3: Возвращаемся в game.js и вызываем наши новые функции

````javascript
// Настройка обработчиков событий
    setupEventListeners() {
        // Главный экран
        document.getElementById('infiniteMode').addEventListener('click', () => this.start('infinite'));
        document.getElementById('dailyMode').addEventListener('click', () => {
            if (!this.state.dailyCompleted) {
                this.start('daily');
            }
        });
        
        // Игровой экран
        document.getElementById('backBtn').addEventListener('click', () => UI.showScreen('mainScreen'));
        document.getElementById('resetBtn').addEventListener('click', () => this.resetInput());
        
        // Круг с буквами
        document.addEventListener('click', (e) => {
            if (e.target.closest('.circle-letter')) {
                this.addLetter(e.target.textContent);
            }
            if (e.target.closest('.circle-center')) {
                this.submitWord();
            }
        });
        
        // Экран результатов
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            UI.showScreen('mainScreen');
        });
        
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (UI.currentScreen === 'gameScreen') {
                if (e.key === 'Enter') this.submitWord();
                if (e.key === 'Backspace') this.removeLastLetter();
                if (/^[а-яА-Яa-zA-Z]$/.test(e.key)) {
                    this.addLetter(e.key.toUpperCase());
                }
                UI.updateGameScreen(this.state);
            }
        });
    }
````

- [ ] Шаг 5.4: Тестируем в браузере запуск режимов в консоле
      
**Смотрим текстовый вызов**

**Проверяем на наличие ошибок**

**Исправляем если надо**

</details>

<details> <summary><strong>🌟 Часть 6: Стилизация экранов </strong></summary>
  
- [ ] Шаг 6.1: Дополняем main.css новыми стилями

````css
/* выравнивание контейнеров */
#mainScreen {
    justify-content: center;
    align-items: center;
    padding: 20px;
    gap: 40px;
}

#gameScreen {
    padding: 10px;
}

#resultScreen {
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    gap: 20px;
}

/* стилизация логотипа названия */
.logo {
    text-align: center;
}

.logo h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.logo p {
    font-size: 1rem;
    opacity: 0.8;
}

.mode-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
}

/* плавное появление - скрытие */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); display: none; }
}
````

- [ ] Шаг 6.2: Работа с экранами в game.js - вызов и отрисовка

````javascript
start(mode) {
    ...
        // Вызываем события и показ экрана
        UI.showScreen('gameScreen');
        UI.updateGameScreen(this.state);
    }
````
**Тестируем переключение**

**Ожидается смена экрана**

**Кнопка назад должна так же работать**

- [ ] Шаг 6.3: Добавляем стили для игрового экрана
      
````css
.subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 5px;
}

.icon-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
}

.icon-btn:active {
    background: rgba(255, 255, 255, 0.1);
}

/* Игровой экран */
.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 10px;
}

.stats {
    display: flex;
    gap: 15px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 1.1rem;
}

.words-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 0;
}

.words-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
}

.word-row {
    display: flex;
    gap: 5px;
}

.letter-cell {
    width: 40px;
    height: 40px;
    border: 2px solid #4b5563;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    transition: all 0.3s;
}

.letter-cell.revealed {
    background: linear-gradient(45deg, #059669, #10b981);
    border-color: #059669;
    transform: scale(1.05);
}

.word-info {
    text-align: center;
    font-size: 1rem;
    opacity: 0.9;
    margin-top: 10px;
}
````

- [ ] Шаг 6.4: Добавляем новые шрифты

````text
https://fonts.google.com/
````

**Переходим на сайт**

**Выставляем поиск кирилических шрифтов**

**Находим поравившийся**

**Получаем шрифт и импортируе в проект**

````html
/* Пример вставки ссылки в html*/
<style>
        @import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');
</style>
````

````css
/* добавляем на ряду с остальными стилями любого контейнера */
#mainScreen {
    ...
    font-family: "Rampart One", sans-serif;
    font-weight: 400;
    font-style: normal;
}
````

**По аналогии изменяем и остальные шрифты**

**Стилизуем так же кнопки как и название только другим шрифтом**


</details>


<details> <summary><strong>🎇 Часть 7: Встраивание игрового функционала </strong></summary>
  
- [ ] Шаг 7.1: Генерация уровня обычной игры game.js

**Тестируем в консоле разработчика**
**Добавляем в game.js проверку на наличие состояния если есть ошибка**

````javascript
   // Обновить игровой экран
   updateGameScreen(state) {
        if (!state.levelData) return;
        ...
    },
````

**Организуем систему данных - уровень и сложность**

````javascript
// Генерация обычного уровня
    generateLevel() {
        const levelMultiplier = 1 + (this.state.level - 1) * CONFIG.LEVEL_MULTIPLIER;
        const wordCount = Math.min(
            CONFIG.MIN_WORDS_PER_LEVEL + Math.floor(this.state.level / 2),
            CONFIG.MAX_WORDS_PER_LEVEL
        );
        
        ...
    }
````

**Подбираем слова из конфига в соответствии со сложностью**

````javascript
// Генерация обычного уровня
    generateLevel() {

        ...

        // Выбираем слова
        const selectedWords = [];
        const usedWords = new Set();
        
        for (let i = 0; i < wordCount; i++) {
            let word;
            do {
                word = Utils.randomElement(WORD_LIST.common);
            } while (usedWords.has(word) || word.length < 3);
            
            selectedWords.push(word);
            usedWords.add(word);
        }
        
        this.state.levelData = {
            words: selectedWords,
        };
    }
````

- [ ] Шаг 7.2: Добавляем метод для отрисовки слов на экране игры в ui.js

````javascript
// Отрисовать сетку слов
    renderWordsGrid(state) {
        const container = document.getElementById('wordsGrid');
        container.innerHTML = '';
        container.className = 'words-grid';
        // Создаем контейнер для каждого слова
        state.levelData.words.forEach(word => {
            const row = document.createElement('div');
            row.className = 'word-row';
            // Добавляем буквы в контейнер слова
            word.split('').forEach((letter, index) => {
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                
                if (state.foundWords.includes(word)) {
                    cell.textContent = letter;
                    cell.classList.add('revealed');
                }
                
                row.appendChild(cell);
            });
            
            container.appendChild(row);
        });
    },
````

- [ ] Шаг 7.3: Создаем базу из слов в виде словаря в words.js

````javascript
// Основной словарь слов
const WORD_LIST = {
    // Общие слова
    common: [
        'КОТ', 'ДОМ', 'МАК', 'РОТ', 'ЛЕС', 'СОН', 'НОС', 'РАК', 'КОЗА', 'ЛИСА',
        'МОРЕ', 'РЕКА', 'ПОЛЕ', 'ГОРА', 'РУКА', 'НОГА', 'ГЛАЗ', 'УХО', 'РОТ', 'НОС',
        'ВОДА', 'ОГОНЬ', 'ВЕТЕР', 'СОЛНЦЕ', 'ЛУНА', 'ЗВЕЗДА', 'ПТИЦА', 'РЫБА', 'ЦВЕТОК', 'ДЕРЕВО',
        'СТОЛ', 'СТУЛ', 'ДВЕРЬ', 'ОКНО', 'КНИГА', 'РУЧКА', 'БУМАГА', 'ЧАСЫ', 'ТЕЛЕФОН', 'КОМПЬЮТЕР',
        'МАШИНА', 'ПОЕЗД', 'САМОЛЕТ', 'ВЕЛОСИПЕД', 'ТЕЛЕВИЗОР', 'РАДИО', 'МУЗЫКА', 'ФИЛЬМ', 'ИГРА', 'ШКОЛА'
    ],
    
    // Русский алфавит
    alphabet: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
};
````

- [ ] Шаг 7.4: Тестирование этапа

**Загружаем игру и выбираем обычный режим**
**Если видим ошибку и нет отображения букв добавляем строку с проверкой ниже в game.js**

````javascript
   // Обновить игровой экран
   updateGameScreen(state) {
        if (!state.levelData) return;
        ...
    },
````

</details>


<details> <summary><strong>🔄 Часть 8: Работа с системой ввода игрока </strong></summary>
  
- [ ] Шаг 8.1: Заполняем метод отрисовки поля ввода в ui.js

**Отрисовываем буквы-кнопки**
**Добавляем кнопку ввода полного набора букв**
**Распологаем буквы по кругу**

````javascript
   // Отрисовать круг с буквами
    renderCircleInput(state) {
        const container = document.getElementById('circleInput');
        container.innerHTML = '';
        
        // Центральная кнопка
        const center = document.createElement('div');
        center.className = 'circle-center';
        center.textContent = '✓';
        center.title = 'Проверить слово';
        container.appendChild(center);
        
        // Буквы по кругу
        const letters = state.levelData.letters;
        const radius = CONFIG.CIRCLE_RADIUS;
        const centerX = CONFIG.CIRCLE_CENTER_X;
        const centerY = CONFIG.CIRCLE_CENTER_Y;
        
        letters.forEach((letter, index) => {
            const angle = (index / letters.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const btn = document.createElement('div');
            btn.className = 'circle-letter';
            btn.textContent = letter;
            btn.style.left = `${x - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
            btn.style.top = `${y - CONFIG.CIRCLE_LETTER_SIZE / 2}px`;
            btn.title = `Добавить букву ${letter}`;
            
            container.appendChild(btn);
        });
    },
````

- [ ] Шаг 8.2: Заполняем метод отрисовки поля ввода

**Размещение и стилизация компонентов ввода**

````javascript
   // Генерация обычного уровня
    generateLevel() {
        ...
        
        // Собираем все буквы
        const allLetters = selectedWords.join('').split('');
        
        // Берем уникальные буквы для круга
        let circleLetters = Utils.unique(allLetters);
        if (circleLetters.length > CONFIG.MAX_LETTERS_IN_CIRCLE) {
            // Выбираем самые частые буквы
            const letterCounts = Utils.countLetters(allLetters);
            circleLetters = Object.keys(letterCounts)
                .sort((a, b) => letterCounts[b] - letterCounts[a])
                .slice(0, CONFIG.MAX_LETTERS_IN_CIRCLE);
        }
        
        // Перемешиваем буквы
        circleLetters = Utils.shuffle(circleLetters);
        
        this.state.levelData = {
            ...
            letters: circleLetters,
            allLetters: allLetters
        };
    }
````

- [ ] Шаг 8.3: Возвращаемся в components.css и реализуем стили ввода

````css
/* Ввод */
.input-area {
    padding: 20px 0;
}

.circle-input {
    position: relative;
    width: 220px;
    height: 220px;
    margin: 0 auto;
}

.circle-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.circle-center:active {
    transform: translate(-50%, -50%) scale(0.95);
}

.circle-letter {
    position: absolute;
    width: 45px;
    height: 45px;
    background: linear-gradient(45deg, #374151, #4b5563);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s;
}

.circle-letter:active {
    transform: scale(0.9);
    background: #4b5563;
}
````

</details>

<details> <summary><strong>📲 Часть 9: Формируем логику ввода </strong></summary>
  
- [ ] Шаг 9.1: Готовим реализацию для ввода букв в game.js

**Метод для добавления буквы в массив ввода**

````javascript
// Добавить букву
    addLetter(letter) {
        if (this.state.currentInput.length < 15) {
            this.state.currentInput.push(letter);
            UI.updateGameScreen(this.state);
        }
    }
````

**Метод для удаления буквы из массива ввода**

````javascript
// Удалить последнюю букву
    removeLastLetter() {
        if (this.state.currentInput.length > 0) {
            this.state.currentInput.pop();
            UI.updateGameScreen(this.state);
        }
    }
````

**Метод для удаления всех букв из массива ввода**

````javascript
    // Сбросить ввод
    resetInput() {
        this.state.currentInput = [];
        UI.updateGameScreen(this.state);
    }
````

- [ ] Шаг 9.2: Реализуем систему отправки массива на обработку в game.js

````javascript
   // Отправить слово
    submitWord() {
        const word = this.state.currentInput.join('').toUpperCase();
        
        if (this.state.levelData.words.includes(word)) {
            if (!this.state.foundWords.includes(word)) {
                // Слово найдено
                this.state.foundWords.push(word);
                const points = word.length * CONFIG.POINTS_PER_LETTER;
                this.state.score += points;
                
                consol.log(`+${points} очков!`, '✨');
                
                // Проверка завершения уровня
                if (this.state.foundWords.length === this.state.levelData.words.length) {
                    setTimeout(() => this.levelComplete(), 500);
                }
            } else {
                consol.log("Неправильное слово!");
            }
        } else {
            // Неправильное слово
            this.state.attempts--;
            consol.log('Нет такого слова', '❌');
            
            if (this.state.attempts <= 0) {
                setTimeout(() => this.levelFailed(), 500);
            }
        }
        
        this.resetInput();
        UI.updateGameScreen(this.state);
    }
````

- [ ] Шаг 9.3: Создаем отображение вводимых символов

````javascript
// Отрисовать текущий ввод
    renderCurrentInput(state) {
        const container = document.getElementById('currentInput');
        container.innerHTML = '';
        
        state.currentInput.forEach(letter => {
            const div = document.createElement('div');
            div.className = 'input-letter';
            div.textContent = letter;
            container.appendChild(div);
        });
    },
````

**Тестируем в браузере отображение массива и состовление слов**

</details>

<details> <summary><strong>🎲 Часть 10: Введение системы сообщений </strong></summary>
  
- [ ] Шаг 10.1: Готовим стилистическую основу в components.css

````css
/* Всплывающие сообщения */
.floating-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: bold;
    z-index: 1000;
    animation: fadeOut 2s forwards;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
````

- [ ] Шаг 10.2: Формируем отображение в ui.js

````javascript
// Показать всплывающее сообщение
    showMessage(text, icon = '') {
        const message = document.createElement('div');
        message.className = 'floating-message';
        message.innerHTML = icon ? `${icon} ${text}` : text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 1500);
    }
````

- [ ] Шаг 10.3: Заполняем пробелы в game.js для показа по событию

````javascript
// Отправить слово
    submitWord() {
        ...
        if (this.state.levelData.words.includes(word)) {
            if (!this.state.foundWords.includes(word)) {
                ...
                // вместо console.log
                UI.showMessage(`+${points} очков!`, '✨');
                
                ...
            } else {
                // вместо console.log
                UI.showMessage('Уже найдено!', 'ℹ️');
            }
        } else {
            ...
            // вместо console.log
            UI.showMessage('Нет такого слова', '❌');
            
            ...
        }
        
        ...
    }
````

**Тестируем в браузере отображение подсказок**

**Сообщения должны появляться поцентру с анимациями**

</details>


<details> <summary><strong>💡 Часть 11: Реализация событий завершения уровня </strong></summary>
  
- [ ] Шаг 11.1: Дополним систему стилей для окна завершения уровня в components.css

````css
/* Результаты */
.result-icon {
    font-size: 4rem;
    margin-bottom: 10px;
}

.result-title {
    font-size: 1.8rem;
    margin-bottom: 10px;
}

.result-message {
    opacity: 0.9;
    margin-bottom: 20px;
}

.result-stats {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    text-align: left;
}

.result-stats div {
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
}

.result-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 300px;
}
````

- [ ] Шаг 11.2: Заполним пустующие методы с отладкой в game.js

````javascript
 // Уровень завершен
    levelComplete() {
        this.state.level++;
        this.state.score += CONFIG.BONUS_PER_LEVEL;
        
        UI.showLevelComplete(this.state);
        UI.showScreen('resultScreen');
    }
    
    // Уровень провален
    levelFailed() {
        UI.showLevelFailed(this.state);
        UI.showScreen('resultScreen');
    }
    
    // Следующий уровень
    nextLevel() {
        if (this.state.level <= CONFIG.MAX_LEVEL) {
            this.start('infinite');
        } else {
            UI.showScreen('mainScreen');
        }
    }
````

- [ ] Шаг 11.3: Реализуем метод успешного завершения уровня

````javascript
 // Показать уровень завершен
    showLevelComplete(state) {
        document.getElementById('resultIcon').textContent = '🎉';
        document.getElementById('resultTitle').textContent = 'Уровень пройден!';
        document.getElementById('resultMessage').textContent = 
            `Отлично! Вы нашли все ${state.levelData.words.length} слов.`;
        
        document.getElementById('resultFound').textContent = 
            `${state.foundWords.length}/${state.levelData.words.length}`;
        document.getElementById('resultScore').textContent = state.score;
        document.getElementById('resultNextLevel').textContent = state.level + 1;
        
        document.getElementById('nextLevelBtn').style.display = 'block';
    },
````

- [ ] Шаг 11.4: Так же определим метод для провала уровня

````javascript
 // Показать уровень провален
    showLevelFailed(state) {
        document.getElementById('resultIcon').textContent = '😔';
        document.getElementById('resultTitle').textContent = 'Попытки закончились';
        document.getElementById('resultMessage').textContent = 
            'Попробуйте еще раз!';
        
        document.getElementById('resultFound').textContent = 
            `${state.foundWords.length}/${state.levelData.words.length}`;
        document.getElementById('resultScore').textContent = state.score;
        document.getElementById('resultNextLevel').textContent = state.level;
        
        document.getElementById('nextLevelBtn').style.display = 'none';
    },
````

</details>

<details> <summary><strong>🔖 Часть 12: Разработка ежедневных заданий - режим раз в день </strong></summary>

- [ ] Шаг 11.1: Дополним конфиг с данными слов words.js

````javascript
// Ежедневные темы
    dailyThemes: [
        {
            name: 'Животные',
            words: ['КОТ', 'СОБАКА', 'ЛЕВ', 'СЛОН', 'ТИГР'],
            letters: ['К', 'О', 'Т', 'С', 'Б', 'А', 'Л', 'Е', 'В', 'Н', 'И', 'Г', 'Р']
        },
        {
            name: 'Города',
            words: ['МОСКВА', 'ПАРИЖ', 'ЛОНДОН', 'ТОКИО', 'БЕРЛИН'],
            letters: ['М', 'О', 'С', 'К', 'В', 'А', 'П', 'Р', 'И', 'Ж', 'Л', 'Н', 'Д', 'Т', 'Б', 'Е']
        },
        {
            name: 'Профессии',
            words: ['ВРАЧ', 'УЧИТЕЛЬ', 'ПОВАР', 'ИНЖЕНЕР', 'ПРОГРАММИСТ'],
            letters: ['В', 'Р', 'А', 'Ч', 'У', 'И', 'Т', 'Е', 'Л', 'Ь', 'П', 'О', 'Н', 'Ж', 'Г', 'М', 'С']
        },
        {
            name: 'Еда',
            words: ['ЯБЛОКО', 'ХЛЕБ', 'СУП', 'САЛАТ', 'ТОРТ'],
            letters: ['Я', 'Б', 'Л', 'О', 'К', 'Х', 'Е', 'С', 'У', 'П', 'А', 'Т', 'Р']
        }
    ],
````

  
- [ ] Шаг 11.2: Добавляем метод работы игрового экрана в режиме ежедневных заданий

````javascript
// Генерация ежедневного уровня
    generateDailyLevel() {
        const themeIndex = Utils.getDailyThemeIndex();
        const theme = WORD_LIST.dailyThemes[themeIndex];
        
        this.state.levelData = {
            words: theme.words,
            letters: Utils.shuffle(theme.letters.slice(0, CONFIG.MAX_LETTERS_IN_CIRCLE)),
            allLetters: theme.words.join('').split(''),
            theme: theme.name
        };
    }
````
**Тестируем ежедневный уровень**

**Если с него выйти, то войти заново не получится - одна попытка в день**

</details>

<details> <summary><strong>📣 Часть 12: Дополнения и отладка </strong></summary>

- [ ] Шаг 12.1: Стилизовать главный экран, игровой экран и экраны завершения уровня

**Самостоятельно доработать элементы во всех экранах**

**Добавить несколько новых уместных элементов**

**Добавить отдельный новый шрифт для букв в игровом экране**

- [ ] Шаг 12.2: Добавить скрипт animations.js и в него переместить этот код

**Самостоятельно разберите логику скрипта**

**Встройте один или несколько эффектов в события игры**

````javascript
// ==============================
// МЕНЕДЖЕР АНИМАЦИЙ
// ==============================

class AnimationManager {
    constructor() {
        this.initCSSAnimations();
    }
    
    // Инициализация CSS анимаций
    initCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* Основные анимации */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes colorChange {
                0% { background-color: #ef4444; }
                25% { background-color: #f59e0b; }
                50% { background-color: #10b981; }
                75% { background-color: #3b82f6; }
                100% { background-color: #8b5cf6; }
            }
            
            /* Классы анимаций */
            .fade-in { animation: fadeIn 0.5s ease forwards; }
            .pulse { animation: pulse 0.5s ease; }
            .shake { animation: shake 0.5s ease; }
            .bounce { animation: bounce 0.5s ease infinite; }
            .spin { animation: spin 1s linear; }
            .color-change { animation: colorChange 2s linear infinite; }
            
            /* Анимации для игры */
            .letter-found { 
                animation: pulse 0.3s ease, fadeIn 0.3s ease;
            }
            
            .word-complete {
                animation: pulse 0.5s ease, colorChange 1s ease;
            }
            
            .level-up-star {
                animation: bounce 0.5s ease infinite alternate;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ====================
    // ИГРОВЫЕ АНИМАЦИИ
    // ====================
    
    // 1. Анимация добавления буквы
    addLetter(letterElement) {
        if (!letterElement) return;
        
        letterElement.classList.add('pulse');
        setTimeout(() => {
            letterElement.classList.remove('pulse');
        }, 500);
    }
    
    // 2. Анимация удаления буквы
    removeLetter(inputArea) {
        if (!inputArea) return;
        
        inputArea.classList.add('shake');
        setTimeout(() => {
            inputArea.classList.remove('shake');
        }, 500);
    }
    
    // 3. Анимация сброса ввода
    resetInput(inputLetters) {
        if (!inputLetters || inputLetters.length === 0) return;
        
        inputLetters.forEach(letter => {
            letter.style.transition = 'all 0.3s ease';
            letter.style.opacity = '0';
            letter.style.transform = 'scale(0) translateY(20px)';
        });
    }
    
    // 4. Анимация найденного слова
    wordFound(wordText, cells) {
        if (!cells || cells.length === 0) return;
        
        // Анимация каждой буквы слова
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('letter-found');
                
                // Эффект вспышки
                this.createFlash(cell, 'rgba(34, 197, 94, 0.3)');
                
                // Убираем класс через время
                setTimeout(() => {
                    cell.classList.remove('letter-found');
                }, 1000);
            }, index * 100);
        });
    }
    
    // 5. Анимация неправильного слова
    wrongWord(inputArea, circleLetters) {
        // Тряска поля ввода
        if (inputArea) {
            inputArea.classList.add('shake');
            setTimeout(() => inputArea.classList.remove('shake'), 500);
        }
        
        // Красная вспышка на буквах
        if (circleLetters) {
            circleLetters.forEach(letter => {
                this.createFlash(letter, 'rgba(239, 68, 68, 0.3)', 300);
                letter.classList.add('shake');
                setTimeout(() => letter.classList.remove('shake'), 500);
            });
        }
    }
    
    // 6. Анимация очков
    showPoints(points, scoreElement) {
        if (!scoreElement) return;
        
        const pointsElement = document.createElement('div');
        pointsElement.className = 'points-animation';
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #10b981;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            opacity: 1;
        `;
        
        scoreElement.appendChild(pointsElement);
        
        // Анимация всплывания
        let opacity = 1;
        let y = 0;
        
        const animate = () => {
            opacity -= 0.02;
            y -= 2;
            
            pointsElement.style.opacity = opacity;
            pointsElement.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                pointsElement.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // 7. Анимация завершения уровня
    levelComplete() {
        // Создаем эффект завершения уровня
        const effect = document.createElement('div');
        effect.className = 'level-complete-effect';
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            animation: fadeIn 0.5s ease forwards;
        `;
        
        document.body.appendChild(effect);
        
        // Звезды
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.createStar(effect), i * 200);
        }
        
        // Удаляем через 2 секунды
        setTimeout(() => {
            effect.style.opacity = '0';
            effect.style.transition = 'opacity 0.5s';
            setTimeout(() => effect.remove(), 500);
        }, 2000);
    }
    
    // 8. Анимация проигрыша
    levelFailed(gameScreen) {
        if (!gameScreen) return;
        
        // Красная вспышка
        this.createFlash(gameScreen, 'rgba(239, 68, 68, 0.2)', 500);
        
        // Тряска экрана
        gameScreen.classList.add('shake');
        setTimeout(() => gameScreen.classList.remove('shake'), 500);
    }
    
    // 9. Анимация для букв в круге при наведении
    circleLetterHover(letterElement) {
        if (!letterElement) return;
        
        letterElement.classList.add('pulse');
        letterElement.style.transform = 'scale(1.1)';
        letterElement.style.zIndex = '10';
        
        setTimeout(() => {
            letterElement.classList.remove('pulse');
        }, 300);
    }
    
    // 10. Анимация для кнопок
    buttonClick(button) {
        if (!button) return;
        
        button.classList.add('pulse');
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.classList.remove('pulse');
            button.style.transform = '';
        }, 200);
    }
    
    // ====================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ====================
    
    // Создание вспышки
    createFlash(element, color, duration = 200) {
        if (!element) return;
        
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            border-radius: inherit;
            z-index: 1;
            pointer-events: none;
            opacity: 0.5;
        `;
        
        element.appendChild(flash);
        
        // Исчезновение
        let opacity = 0.5;
        const fade = () => {
            opacity -= 0.05;
            flash.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                flash.remove();
            }
        };
        
        requestAnimationFrame(fade);
    }
    
    // Создание звезды
    createStar(container) {
        const star = document.createElement('div');
        star.className = 'level-up-star';
        star.innerHTML = '⭐';
        star.style.cssText = `
            position: absolute;
            font-size: 2rem;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: 0;
            animation: 
                fadeIn 0.5s ease forwards,
                bounce 0.5s ease 0.5s infinite alternate;
        `;
        
        container.appendChild(star);
        
        // Удаляем через время
        setTimeout(() => {
            star.style.opacity = '0';
            star.style.transition = 'opacity 0.3s';
            setTimeout(() => star.remove(), 300);
        }, 1500);
    }
    
    // Анимация прогресс-бара
    animateProgressBar(bar, from, to) {
        if (!bar) return;
        
        const duration = 500;
        const steps = duration / 16;
        const step = (to - from) / steps;
        let current = from;
        let stepCount = 0;
        
        const animate = () => {
            if (stepCount < steps) {
                current += step;
                bar.style.width = `${current}%`;
                stepCount++;
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    // Анимация перехода экранов
    screenTransition(screenElement, direction = 'in') {
        if (!screenElement) return;
        
        if (direction === 'in') {
            screenElement.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            screenElement.style.animation = 'fadeIn 0.5s ease reverse forwards';
        }
    }
}

// Создаем глобальный экземпляр
const Animations = new AnimationManager();
````

**Пример подключения animation.js в game.js**

````javascript
class Game{
    constructor() {
        // Инициализация систем
        ...
        // Инициализируем менеджер анимаций
        this.anim = Animations; 
        ...
    }

}
````

**Пример вызова анимаций из animation.js в game.js при добавлении буквы**

````javascript
 // Добавить букву
    addLetter(letter) {
        if (this.state.currentInput.length < 15) {
            this.state.currentInput.push(letter);
            UI.updateGameScreen(this.state);

            // ВЫЗОВ АНИМАЦИИ
            const lastInputLetter = document.querySelector('.input-letter:last-child');
            if (lastInputLetter) {
                this.anim.addLetter(lastInputLetter);
            }

            // Проигрываем звук
            if (typeof GameSoundGenerator !== 'undefined') {
                GameSoundGenerator.playClick();
            }
        }
    }
````

**Аналогичные вызовы анимаций можно и в других методах добавить**


- [ ] Шаг 12.3: Добавляем скрипт sound_generator.js и в него переместите этот код

**Самостоятельно разберите логику скрипта**

**Соедините файлы игры с генератором**

**Инициализируйте генератор в game.js**

**Добавить вызов звуков в игре**

````javascript
// ============ ГЕНЕРАТОР ЗВУКОВ ДЛЯ ИГРЫ ============
// Этот файл ТОЛЬКО для работы со звуками
// Он ничего не знает об игре, только создает звуки

const GameSoundGenerator = {
    audioContext: null,
    isInitialized: false,
    
    // Инициализация аудиоконтекста
    init: function() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('🎵 Аудиоконтекст инициализирован');
        } catch (error) {
            console.error('Не удалось создать аудиоконтекст:', error);
        }
    },
    
    // ===== ОСНОВНОЙ МЕТОД ГЕНЕРАЦИИ =====
    createSound: function(options = {}) {
        if (!this.audioContext) this.init();
        if (!this.audioContext) return;
        
        const {
            type = 'sine',           // Форма волны
            frequency = 440,         // Частота в Гц
            duration = 0.1,          // Длительность в секундах
            volume = 0.3,            // Громкость 0-1
            fadeOut = true,          // Плавное затухание
            vibrato = false,         // Вибрато эффект
        } = options;
        
        try {
            // Основной осциллятор
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Настройки
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // Вибрато (дрожание частоты)
            if (vibrato) {
                oscillator.frequency.setValueAtTime(frequency * 0.9, this.audioContext.currentTime + duration * 0.3);
                oscillator.frequency.setValueAtTime(frequency * 1.1, this.audioContext.currentTime + duration * 0.6);
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + duration * 0.9);
            }
            
            // Управление громкостью
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            
            // Плавное затухание
            if (fadeOut) {
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            }
            
            // Запуск
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn('Ошибка создания звука:', error);
        }
    },
    
    // ===== ПУБЛИЧНЫЕ МЕТОДЫ (доступны извне) =====
    
    // Звук клика
    playClick: function() {
        this.createSound({
            type: 'sine',
            frequency: 800,
            duration: 0.1,
            volume: 0.2,
            fadeOut: true
        });
    },
    
    // Звук повышения уровня
    playLevelUp: function() {
        // Первая нота
        this.createSound({
            type: 'sine',
            frequency: 523.25,
            duration: 0.15,
            volume: 0.3
        });
        
        // Вторая нота (с задержкой)
        setTimeout(() => {
            this.createSound({
                type: 'sine',
                frequency: 659.25,
                duration: 0.15,
                volume: 0.3
            });
        }, 150);
        
        // Третья нота
        setTimeout(() => {
            this.createSound({
                type: 'sine',
                frequency: 783.99,
                duration: 0.2,
                volume: 0.4,
                vibrato: true
            });
        }, 300);
    },
    
    // 8-BIT звук клика
    play8BitClick: function() {
        this.createSound({
            type: 'square',
            frequency: 1200,
            duration: 0.08,
            volume: 0.15,
            fadeOut: false
        });
    },
    
    // Звук тача
    playTouchSound: function() {
        const sounds = {
            electric: () => {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createSound({
                            type: 'square',
                            frequency: 800 + (i * 200),
                            duration: 0.05,
                            volume: 0.1
                        });
                    }, i * 50);
                }
            },
            fire: () => {
                this.createSound({
                    type: 'sawtooth',
                    frequency: 300,
                    duration: 0.4,
                    volume: 0.2,
                    vibrato: true
                });
            },
            water: () => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.createSound({
                            type: 'sine',
                            frequency: 200 + (i * 100),
                            duration: 0.1,
                            volume: 0.15
                        });
                    }, i * 100);
                }
            }
        };
        
        if (sounds[pokemonType]) {
            sounds[pokemonType]();
        } else {
            this.createSound({
                type: 'sine',
                frequency: Math.random() * 400 + 200,
                duration: 0.2,
                volume: 0.25,
                vibrato: true
            });
        }
    },
    
    // Достижение
    playAchievement: function() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createSound({
                    type: index === notes.length - 1 ? 'square' : 'sine',
                    frequency: freq,
                    duration: 0.2,
                    volume: 0.25 + (index * 0.05),
                    vibrato: index === notes.length - 1
                });
            }, index * 200);
        });
    },
    
    // Ошибка
    playError: function() {
        this.createSound({
            type: 'sawtooth',
            frequency: 600,
            duration: 0.3,
            volume: 0.2
        });
        
        setTimeout(() => {
            this.createSound({
                type: 'sawtooth',
                frequency: 400,
                duration: 0.3,
                volume: 0.2
            });
        }, 100);
    },
    
    // Активация звуков (после первого клика пользователя)
    activate: function() {
        if (!this.audioContext || this.audioContext.state === 'suspended') {
            this.init();
            if (this.audioContext) {
                this.audioContext.resume();
            }
        }
    }
};

// Экспортируем объект для использования в других файлах
// В браузере используем window, в Node.js был бы module.exports
if (typeof window !== 'undefined') {
    window.GameSoundGenerator = GameSoundGenerator;
}
````

**Пример инициализации в index.html в самом конце перед закрывающимся </body>**

````html
<script>
        // Инициализация игры после загрузки страницы
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация звуков
            if (typeof GameSoundGenerator !== 'undefined') {
                GameSoundGenerator.init();
                
                // Активируем звуки после первого клика пользователя
                document.addEventListener('click', function activateSound() {
                    GameSoundGenerator.activate();
                    document.removeEventListener('click', activateSound);
                }, { once: true });
            }
            
            // Создаем игру
            const game = new Game();
            
            // Сохраняем в window для глобального доступа
            window.game = game;
            console.log('Игра загружена. Используйте window.game для отладки');
        });
    </script>
````

**Пример вызова функций в методе события**

````javasipt
// ИСПОЛЬЗУЕМ GameSoundGenerator из отдельного файла
    if (typeof GameSoundGenerator !== 'undefined') {
        GameSoundGenerator.playClick();
        // или GameSoundGenerator.play8BitClick();
    }
````

- [ ] Шаг 12.4: Добавляем в скрипт game.js код для реалиии сохранений

**Инициализируем менеджер сохранений**

**Добавляем вызов метода для сохранения данных**

**Пример реализации менеджера в основном файле игры**

````javasipt
const SaveManager = {
    key: 'word_wonders_simple',
    
    save(game) {
        const data = {
            l: game.state.level,    // level
            s: game.state.score,    // score
            d: game.state.dailyDate, // daily date
            c: game.state.dailyCompleted // daily completed
        };
        localStorage.setItem(this.key, JSON.stringify(data));
    },
    
    load(game) {
        const saved = localStorage.getItem(this.key);
        if (!saved) return;
        
        const data = JSON.parse(saved);
        game.state.level = data.l || 1;
        game.state.score = data.s || 0;
        game.state.dailyDate = data.d;
        game.state.dailyCompleted = data.c || false;
    },
    
    delete() {
        localStorage.removeItem(this.key);
    }
};
````
**Пример инициализации**

````javasipt
// При запуске
        SaveManager.load(this);
````

**Пример вызова функции**
````javasipt
// В любом логичном месте
       SaveManager.save(this);
````

</details>
