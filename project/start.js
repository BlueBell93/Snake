const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.clientWidth;
const height = canvas.clientHeight;


const snake = {
    pixel: 20,
    speed: 2,
    snakePosition: [
        [width/2,height/2],
        [width/2+20,height/2],
        [width/2+2*20,height/2],
        [width/2+3*20,height/2],
        [width/2+4*20,height/2],
        [width/2+5*20,height/2],
    ],
    score: 0,
    view: 0, //0 west, 1 north, 2 east, 3 south

    draw(ctx) {
        ctx.fillStyle = 'black';
        for (let i = 0; i < this.snakePosition.length; i++) {
            if(i==1){
                ctx.fillStyle = 'red';
            }
            ctx.fillRect(this.snakePosition[i][0], this.snakePosition[i][1], this.pixel, this.pixel);
        }

    },

    update(){
        for (let i = 0; i < this.snakePosition.length; i++) {
            switch (this.view) {
                case 0: //left - west
                    if(this.snakePosition[i][0] <= 0){
                        this.snakePosition[i][0] = width;
                    } else{
                        this.snakePosition[i][0] = this.snakePosition[i][0] - this.speed;
                    }
                    break;
                case 1: //up - north
                    if(this.snakePosition[i][1] <= 0){
                        this.snakePosition[i][0] = height;
                    } else{
                        this.snakePosition[i][1] = this.snakePosition[i][1] - this.speed;
                    }    
                    break;
                case 2: //right - east
                    if(this.snakePosition[i][0] >= width){
                        this.snakePosition[i][0] = 0;
                    } else{
                        this.snakePosition[i][0] = this.snakePosition[i][0] + this.speed;
                    }
                    
                    break;
                default: //down - south
                    if(this.snakePosition[i][1] >= height){
                        this.snakePosition[i][0] = 0;
                    } else{
                        this.snakePosition[i][1] = this.snakePosition[i][1] - this.speed;
                    }  
                    break;
            }
        }
    },

    move(event){
        switch (event.keyCode) {
            case 37: //left
                this.view = 0;
                break;
            case 38: //up
                this.view = 1;
                break;
            case 39: //right
                this.view = 2;
                break;
            case 40: //down
                this.view = 3;
                break;
            default: //do nothing
                break;
        }
    }
};

document.addEventListener('keydown',function(event){
    snake.move(event);
});


function loop() {
    ctx.clearRect(0, 0, width, height);
    snake.update();
    snake.draw(ctx);
    window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);