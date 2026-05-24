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
        startBtn.dissabled = true;
        startBtn.style.opacity = '1';
    } else {
        selectBtn.textContent = 'Выбрать';
        selectBtn.disabled = false;
        selectBtn.style.opacity = '1';
        selectBtn.style.cursor = 'pointer';
        startBtn.dissabled = false;
        startBtn.style.opacity = '0.3';
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

function selectHero(){
    localStorage.setItem('selectHero', currentIndex);
    selectedIndex = currentIndex;
    updateSelectButtonState();
}

function loadData(){
    key = localStorage.getItem('selectHero');
    if(key){
        currentIndex = parseInt(key);
    }
}

function showCanvas(){
    canvasContainer.style.display = 'flex';
    gameCanvas.style.display = 'flex';
    gameCanvas.style.width = '100vw';  //window.width;
    gameCanvas.style.height = '100vh'; //window.height;

    Game.init(ctx, currentIndex);
}

function hideCanvas(){
    canvasContainer.style.display = 'none';
    gameCanvas.style.display = 'none';
}

// ========== СОБЫТИЯ КНОПОК ==========
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);
selectBtn.addEventListener('click', selectHero);
startBtn.addEventListener('click', showCanvas);

// Клавиши навигации
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') prevImage();
    else if (event.key === 'ArrowRight') nextImage();
    if(event.key === 'Escape'){
        hideCanvas();
    }
})

// ========== ЗАПУСК ==========
hideCanvas();
loadData();
updateImage();