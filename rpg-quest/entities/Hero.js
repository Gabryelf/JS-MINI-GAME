class Hero{
    constructor(x, y, size, imageUrl){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 5;
        this.image = new Image();
        this.image.src = imageUrl;
    }

    move(dx, dy, maxX, maxY){
        this.x = Math.max(0, Math.min(this.x + dx, maxX - this.size));
        this.y = Math.max(0, Math.min(this.y + dy, maxY - this.size));
    }

    draw(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}
