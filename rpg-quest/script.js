// ========== ПОЛУЧАЕМ ЭЛЕМЕНТЫ ==========
const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const selectBtn = document.getElementById('selectBtn');
const startBtn = document.getElementById('startBtn');
const counterSpan = document.getElementById('counter');
const canvasContainer = document.getElementById('canvasContainer');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

// ========== ПЕРЕМЕННЫЕ ==========
const portraits = GALLERY_CONFIG.portraits;
const fullbodySprites = GALLERY_CONFIG.fullbody;
let currentIndex = 0;
let selectedIndex = null;

// ========== ОБНОВЛЕНИЕ КАРТИНКИ ==========
function updateImage() {
    mainImage.src = portraits[currentIndex];
    counterSpan.textContent = `${currentIndex + 1} / ${portraits.length}`;
    updateSelectButtonState();
}

// ========== СОСТОЯНИЕ КНОПКИ "ВЫБРАТЬ" ==========
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

// ========== НАВИГАЦИЯ ==========
function nextImage() {
    currentIndex = (currentIndex + 1) % portraits.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + portraits.length) % portraits.length;
    updateImage();
}

// ========== СОБЫТИЯ КНОПОК ==========
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

// Клавиши навигации
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') prevImage();
    else if (event.key === 'ArrowRight') nextImage();
})

// ========== ЗАПУСК ==========
updateImage();