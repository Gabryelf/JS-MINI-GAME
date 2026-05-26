class Game{
    constructor(){
        this.hero = null;
        this.map_width = 800;
        this.map_height = 600;
        this.heroSize = 64;
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.animationId = null;
    }

    init(ctx, index, canvasWidth, canvasHeight){
        this.mapWidth = canvasWidth;
        this.mapHeight = canvasHeight;

        const heroImage = new Image();
        heroImage.src = GALLERY_CONFIG.fullbody[index];

        this.hero = new Hero(
            canvasWidth/2 - this.heroSize/2,
            canvasHeight/2 - this.heroSize/2,
            this.heroSize,
            GALLERY_CONFIG.fullbody[index]
        );
        this.startLoop(ctx)
    }

    startLoop(ctx){
        const loop = () => {
            this.draw(ctx);
            this.animationId = requestAnimationFrame(loop);
        };
        loop();
    }

    draw(ctx){
        ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.mapWidth, this.mapHeight);

        if (this.hero) {
            this.hero.draw(ctx);
        }
    }
    
}

window.Game = new Game();
