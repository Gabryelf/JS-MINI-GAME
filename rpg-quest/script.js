// ========== 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ ==========
const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const selectBtn = document.getElementById('selectBtn');
const startBtn = document.getElementById('startBtn');
const counterSpan = document.getElementById('counter');
const canvasContainer = document.getElementById('canvasContainer');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// ========== 2. ПЕРЕМЕННЫЕ ==========
const portraits = GALLERY_CONFIG.portraits;
const fullbodySprites = GALLERY_CONFIG.fullbody;
let currentIndex = 0;
let selectedIndex = null;

// ========== 3. ЗАГРУЗКА СОХРАНЁННОГО ВЫБОРА ==========
function loadSelectedFromStorage() {
    const saved = localStorage.getItem('selectedHeroIndex');
    if (saved !== null && !isNaN(parseInt(saved))) {
        selectedIndex = parseInt(saved);
        updateSelectButtonState();
    }
}

// ========== 4. ОБНОВЛЕНИЕ КАРТИНКИ ==========
function updateImage() {
    mainImage.src = portraits[currentIndex];
    counterSpan.textContent = `${currentIndex + 1} / ${portraits.length}`;
    updateSelectButtonState();
}

// ========== 5. СОСТОЯНИЕ КНОПКИ "ВЫБРАТЬ" ==========
function updateSelectButtonState() {
    if (selectedIndex === currentIndex) {
        selectBtn.textContent = 'Выбран';
        selectBtn.disabled = true;
        selectBtn.style.opacity = '0.6';
        selectBtn.style.cursor = 'default';
    } else {
        selectBtn.textContent = 'Выбрать';
        selectBtn.disabled = false;
        selectBtn.style.opacity = '1';
        selectBtn.style.cursor = 'pointer';
    }
}

// ========== 6. ВЫБОР ГЕРОЯ С СОХРАНЕНИЕМ ==========
function selectCurrentHero() {
    selectedIndex = currentIndex;
    localStorage.setItem('selectedHeroIndex', selectedIndex);
    updateSelectButtonState();
}

// ========== 7. НАВИГАЦИЯ ==========
function nextImage() {
    currentIndex = (currentIndex + 1) % portraits.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + portraits.length) % portraits.length;
    updateImage();
}

// ========== 8. CANVAS — ПОЛНОРОСТОВОЙ ГЕРОЙ ==========
function showCanvasWithHero() {
    // Показываем контейнер с Canvas
    canvasContainer.style.display = 'flex';
    
    // Загружаем и рисуем полноростового героя
    const heroImage = new Image();

    heroImage.src = fullbodySprites[selectedIndex];
    
    heroImage.onload = () => {
        // Настройка Canvas под размер изображения
        gameCanvas.width = heroImage.width;
        gameCanvas.height = heroImage.height;
        
        // Рисуем героя
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.drawImage(heroImage, 0, 0);
        
    };
    
    heroImage.onerror = () => {
        showMessage('❌ Ошибка загрузки полноростового спрайта', '#f44336');
    };
}

// ========== 9. СКРЫТЬ CANVAS ==========
function hideCanvas() {
    canvasContainer.style.display = 'none';
}


// ========== 11. СОБЫТИЯ КНОПОК ==========
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);
selectBtn.addEventListener('click', selectCurrentHero);
startBtn.addEventListener('click', showCanvasWithHero);

// Закрытие Canvas по клику вне области (опционально)
canvasContainer.addEventListener('click', (e) => {
    if (e.target === canvasContainer) {
        hideCanvas();
    }
});

// Клавиши навигации
document.addEventListener('keydown', (event) => {
    if (canvasContainer.style.display === 'flex') return; // Не мешаем Canvas
    
    if (event.key === 'ArrowLeft') prevImage();
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'Enter') selectCurrentHero();
    if (event.key === 'Escape' && canvasContainer.style.display === 'flex') hideCanvas();
});

// ========== 12. ЗАПУСК ==========
loadSelectedFromStorage();
updateImage();
