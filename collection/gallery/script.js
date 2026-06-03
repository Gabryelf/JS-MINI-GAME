//=================== ЭЛЕМЕНТЫ ========================
const mainImage = document.getElementById("mainImage");
const count = document.getElementById("count");
const leftBut = document.getElementById("leftBut");
const rightBut = document.getElementById("rightBut");
const selectBut = document.getElementById("selectBut");
const startBut = document.getElementById("startBut");
const canvasContainer = document.getElementById("canvas-container");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext('2d');

//=================== ПЕРЕМЕННЫЕ ========================
let currentIndex = 0;

//=================== ФУНКЦИИ ========================
function init(){
    count.innerText = `${currentIndex + 1} / ${CONFIG.avatar.length}`;
    mainImage.src = CONFIG.avatar[currentIndex];
}

//=================== КОНТРОЛЛЕР ========================
function prew(){
    if(currentIndex === 0){
        currentIndex = CONFIG.avatar.length - 1;
        init();
        return;
    }
    currentIndex -= 1;
    buttonReset();
    init();
}

function next(){
    if(currentIndex === CONFIG.avatar.length - 1){
        currentIndex = 0;
        init();
        return;
    }
    currentIndex += 1;
    buttonReset();
    init();
}

function selectHero(){
    startBut.style.display = 'flex';
    selectBut.style.display = 'none';
    saveIndex();
}

function buttonReset(){
    startBut.style.display = 'none';
    selectBut.style.display = 'flex';
}

//=================== СОХРАНЕНИЯ ========================
function saveIndex(){
    localStorage.setItem('indexImage', currentIndex);
}

function loadIndex(){
    const key = localStorage.getItem('indexImage');
    if(!key){
        return;
    }
    currentIndex = parseInt(key);
}

function activateCanvas(){
    canvasContainer.style.display = 'flex';
    gameCanvas.style.display = 'flex';
    window.Game.init(ctx, currentIndex);
}

function hideCanvas(){
    canvasContainer.style.display = 'none';
    gameCanvas.style.display = 'none';
}

//=================== ОБРАБОТЧИКИ ========================
leftBut.addEventListener('click', prew);
rightBut.addEventListener('click', next);
selectBut.addEventListener('click', selectHero);
startBut.addEventListener('click', activateCanvas);

document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){ hideCanvas() }
});

//=================== ЗАПУСК ========================
hideCanvas();
loadIndex();
init();