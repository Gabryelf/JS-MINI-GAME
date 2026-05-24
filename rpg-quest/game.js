const Game = {

    init(ctx, index){
        const heroImage = new Image();
        heroImage.src = GALLERY_CONFIG.fullbody[index];

        heroImage.onload = () => {
            gameCanvas.width = gameCanvas.clientWidth;
            gameCanvas.height = gameCanvas.clientHeight;

            ctx.clearRect( 0, 0, gameCanvas.width, gameCanvas.height);
            ctx.drawImage(heroImage, 0, 0, 100, 100);
        }
    }
    
}
