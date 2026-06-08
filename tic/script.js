const but1 = document.getElementById('but1') 
const but2 = document.getElementById('but2') 
const but3 = document.getElementById('but3') 
const but4 = document.getElementById('but4') 
const but5 = document.getElementById('but5') 
const but6 = document.getElementById('but6') 
const but7 = document.getElementById('but7') 
const but8 = document.getElementById('but8') 
const but9 = document.getElementById('but9')
const buttons = [but1, but2, but3, but4, but5, but6, but7, but8, but9]
const p1 = document.getElementById('p1')
let player = true

function playerChoose(){
    if (player){

        player = false
        p1.innerText = "Нолики ходят"
    }
    else{
        player = true
        p1.innerText = "Крестики ходят"
    }
}

for(let i = 0; i < buttons.length;i ++ ){

}
