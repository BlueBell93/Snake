const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.clientWidth;
const height = canvas.clientHeight;

let foodAvailable = false;
const pixels = 20;
let speed = 2;

const apple = {
    x: 0,
    y: 0,
    points: 1,
    /**
     * Spawns an apple of an empty field of the map. E.g. it cannot be spawned on a field 
     * where the snake is.
     */
    spawnApple(){
        let collision = true;
        while(collision){
            this.x = Math.random() * 780;//width
            this.y = Math.random() * 380 ;//height
            collision = collisionDetectionRectangles(pixels, this.x,this.y);
        }
    },
    /**
     * Draws the apple at the specified position.
     */
    draw(){
        if(foodAvailable){
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, pixels, pixels);
        }
    }
}

/**
 * Initializes the starting positions of the snake
 * 
 * @returns snakePos an array of positions of the snake
 */
function generateSnakePositions(){
    let snakePos = [];
    for (let index = 0; index < 6*pixels/speed; index++) {
        snakePos.push([width/2 + speed*index, height/2]);
    }
    return snakePos;
}

const snake = {
    snakePosition: generateSnakePositions(),
    score: 0,
    view: 0, //0 west, 1 north, 2 east, 3 south
    /**
     * Draws the snake. The head of the snake is highlighted by another color.
     * 
     * @param {*} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = 'lime';
        for (let i = 0; i < this.snakePosition.length; i++) {
            if(i==pixels/speed){
                ctx.fillStyle = 'aquamarine';
            }
            ctx.fillRect(this.snakePosition[i][0], this.snakePosition[i][1], pixels, pixels);
        }

    },
    setScore(number){
        this.score += number;
    },
    /**
     * Draws the score of the snake.
     * @param {*} ctx 
     */
    drawScore(ctx){
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(this.score.toString(), 10,50);
    },
    /**
     * Updates the position of the snake by deleting the last position in {@code snakePosition} and by pushing
     * a new first element in {@code snakePosition} based on the viewing direction of the snake.
     */
    update(){
        this.snakePosition.pop();
        switch(this.view){
            case 0: //left
                if(this.snakePosition[0][0] <= pixels-1){
                    this.snakePosition.unshift([width,this.snakePosition[0][1]]);
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0] - speed,this.snakePosition[0][1]]);
                }
                break;
            case 1: // up
                if(this.snakePosition[0][1] <= pixels-1){
                    this.snakePosition.unshift([this.snakePosition[0][0],height]);
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0], this.snakePosition[0][1] - speed]);
                }  
                break;
            case 2: //right
                if(this.snakePosition[0][0] >= width -pixels +1){
                    this.snakePosition.unshift([0,this.snakePosition[0][1]]);
                } else{
                this.snakePosition.unshift([this.snakePosition[0][0] + speed, this.snakePosition[0][1]]);
                }
                break;
            default: //down
                if(this.snakePosition[0][1] >= height - pixels + 1){
                    this.snakePosition.unshift([this.snakePosition[0][0],0]);
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0],this.snakePosition[0][1] + speed]);
                }  
                break;
        }
    },
    /**
     * Changes the viewing direction of the snake based on pressed arrow key.
     * It is not possible to move in the vice versa direction. Then the snake will 
     * keep its viewing direction. 
     * 
     * @param {*} event 
     */
    move(event){
        switch (event.keyCode) {
            case 37: //left
                if(this.view != 2)
                    this.view = 0;
                break;
            case 38: //up
                if(this.view != 3)
                    this.view = 1;
                break;
            case 39: //right
                if(this.view != 0)
                    this.view = 2;
                break;
            case 40: //down
                if(this.view != 1)
                    this.view = 3;
                break;
            default: //do nothing
                break;
        }
    },
    /**
     * After eating food the snake will grow in the length by the amount of {@code pixels}. 
     */
    grow(){
        let lastIndex = this.snakePosition.length -1;
        let lastPosition = this.snakePosition[lastIndex];
        let beforeLastPosition = this.snakePosition[lastIndex-1];
        let xDifference = lastPosition[0] - beforeLastPosition[0]; // >0:left   <0:right   ==0:keine Veränderung der x Position; up oder down 
        let yDifference = lastPosition[1] - beforeLastPosition[1]; // >0:up   <0:down   ==0: keine Veränderung der y Position, also right or left
        
        if(yDifference>0){ // Bewegung geht nach up
            for (let index = 1; index <= pixels/speed; index++) {
                this.snakePosition.push([this.snakePosition[lastIndex][0], this.snakePosition[lastIndex][1]+speed*index]);
            }
        } else if (yDifference < 0){ // Bewegung geht nach down
                    for (let index = 1; index <= pixels; index++) {
                        this.snakePosition.push([this.snakePosition[lastIndex][0], this.snakePosition[lastIndex][1]-speed*index]);
                    }
                } else if (xDifference>0){
                    for (let index = 1; index <= pixels; index++) {
                        this.snakePosition.push([this.snakePosition[lastIndex][0]+speed*index, this.snakePosition[lastIndex][1]]);
                    }
                } else{
                    for (let index = 1; index <= pixels; index++) {
                        this.snakePosition.push([this.snakePosition[lastIndex][0]-speed*index, this.snakePosition[lastIndex][1]]);
                    }
                }
    }

};

/**
 * Detects a collision between the snake and apple. If the snakes collidates with an apple, the score will be increased, the
 * apple vanishes and the length of the snake grows.
 */
function checkCollisionFood(apple, snake){
    // Kollision vorhanden? Kopf von Snake mit Apfel
    let xApple = apple.x;
    let yApple = apple.y;
    let xSnake = snake.snakePosition[0][0];
    let ySnake = snake.snakePosition[0][1];
    let distance = Math.sqrt(Math.pow(Math.abs(xApple-xSnake),2) + Math.pow(Math.abs(yApple-ySnake),2) );
    if(distance <= pixels){
        // wenn ja: score auf Snake addieren
        snake.score += apple.points;
        console.log(snake.score);
        // und Apfel verschwinden lassen
        foodAvailable = false;
        // und Snake wachsen lassen
        snake.grow();
    }
    
}

/**
 * Detects a collision of snakes head with its body
 * The first 20 pixel of the snake are the head, the rest is the body
 */
function checkCollisionSnakeBody(){
    return collisionDetectionRectangles(pixels, snake.snakePosition[0][0],snake.snakePosition[0][1]);
}

function collisionDetectionRectangles(startIndex, x1,y1){
    let x;
    let y;
    for (let index = startIndex; index < snake.snakePosition.length; index++) {
        x = snake.snakePosition[index][0];
        y = snake.snakePosition[index][1];
        if(x <= x1 + speed){
            if(x + speed >= x1){
                if(y <= y1 + pixels){
                    if(y + pixels >= y1){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

/**
 * Event listeners that reacts when an arrow key is pressed to realize the movement of the snake.
 */
document.addEventListener('keydown',function(event){
    snake.move(event);
});

/**
 * Game Loop.
 */
function loop() {
    ctx.clearRect(0, 0, width, height);
    snake.update();
    if(!foodAvailable){
        apple.spawnApple();
        foodAvailable = true;
    }
    checkCollisionFood(apple,snake);
    if(checkCollisionSnakeBody()){
        window.cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = undefined;
        return;
    }
    snake.draw(ctx);
    apple.draw();
    snake.drawScore(ctx);
    window.requestAnimationFrame(loop);
};

animationFrameHandle = window.requestAnimationFrame(loop);