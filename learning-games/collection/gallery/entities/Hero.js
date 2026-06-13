class Hero{
    constructor(ctx, size){
        this.heroImage = new Image();
        this.ctx = ctx;
        this.size = size;

        this.init();
    }

    init(){
        this.heroImage.width = this.size;
        this.heroImage.height = this.size;
        this.heroImage.onload = () => {  // после загрузки 
            this.ctx.drawImage(this.heroImage, 0, 0, this.heroImage.width, this.heroImage.height);
        }; 
    }
}