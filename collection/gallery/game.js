class Game{
    constructor(){
        this.hero = null;
    }

    init(ctx, selectIndex){
        this.hero = new Hero(ctx, 64);
        this.hero.heroImage.src = CONFIG.full_body[selectIndex];
    }
}

window.Game = new Game();