const mainImage = document.getElementById('mainImage');
const prewBut = document.getElementById('prewBut');
const nextBut = document.getElementById('nextBut');
const selectBut = document.getElementById('selectBut');
const count = document.getElementById('count');
const canvasContainer = document.getElementById('canvasContainer');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

let currentIndex = 0;

function init(){
    mainImage.src = CONFIG.avatars[currentIndex];
    count.innerText = `${currentIndex + 1} / ${CONFIG.avatars.length}`;
}

function left(){
    if(currentIndex === 0){
        currentIndex = CONFIG.avatars.length - 1;
        init();
        return;
    }
    currentIndex -= 1;
    init();
}

function right(){
    if(currentIndex === CONFIG.avatars.length - 1){
        currentIndex = 0;
        init();
        return;
    }
    currentIndex += 1;
    init();
}

function selectHero(){
    localStorage.setItem('selectHero', currentIndex);
    showCanvas();
}

function loadIndex(){
    let key = localStorage.getItem('selectHero');
    if(key === null){
        return;
    }
    currentIndex = parseInt(key);
}

function hideCanvas(){
    canvasContainer.style.display = 'none';
    gameCanvas.style.display = 'none';
}

function showCanvas(){
    canvasContainer.style.display = 'flex';
    gameCanvas.style.display = 'flex';

    Game.init(ctx, currentIndex);
}

//=============== ОБРАБОТЧИКИ =======================
prewBut.addEventListener('click', left);
nextBut.addEventListener('click', right);
selectBut.addEventListener('click', selectHero);

document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){hideCanvas()};
});

//=============== ЗАПУСК =======================
hideCanvas();
loadIndex();
init();