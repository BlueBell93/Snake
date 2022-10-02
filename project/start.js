const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.clientWidth;
const height = canvas.clientHeight;

let foodAvailable = false;
const pixels = 20;

const apple = {
    x: 0,
    y: 0,
    points: 5,
    /**
     * Spawns an apple of an empty field of the map. E.g. it cannot be spawned on a field 
     * where the snake is.
     */
    spawnApple(){
        let collision = true;
        while(collision){
            this.x = Math.random() * 780;//width
            this.y = Math.random() * 380 ;//height
            let xSnake;
            let ySnake;
            
            //let distance;
            for (let index = 0; index < snake.snakePosition.length; index++) {
                xSnake = snake.snakePosition[index][0];
                ySnake = snake.snakePosition[index][1];
                if(this.x < xSnake + 1){
                    if(this.x + 1 > xSnake){
                        if(this.y < ySnake + 20){
                            if(this.y + 20 > ySnake){
                                collision = true;
                                return;
                            } 
                        }
                    }
                
                }
                collision = false;
    
            }
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

function generateSnakePositions(){
    let snakePos = [];
    for (let index = 0; index < 6*pixels; index++) {
        snakePos.push([width/2 + index, height/2]);
    }
    return snakePos;
}

const snake = {
    pixel: 20,
    speed: 1,
    snakePosition: generateSnakePositions(),
    score: 0,
    view: 0, //0 west, 1 north, 2 east, 3 south

    draw(ctx) {
        ctx.fillStyle = 'lime';
        for (let i = 0; i < this.snakePosition.length; i++) {
            if(i==20){
                ctx.fillStyle = 'aquamarine';
            }
            ctx.fillRect(this.snakePosition[i][0], this.snakePosition[i][1], this.pixel, this.pixel);
        }

    },
    /**
     * Updates the position of the snake by deleting the last position in {@code snakePosition} and by pushing
     * a new first element in {@code snakePosition} based on the viewing direction of the snake.
     */
    update(){
        this.snakePosition.pop();
        switch(this.view){
            case 0: //left
                if(this.snakePosition[0][0] <= 0){
                    this.snakePosition.unshift([width,this.snakePosition[0][1]]);
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0] - this.speed,this.snakePosition[0][1]]);
                }
                break;
            case 1: // up
                if(this.snakePosition[0][1] <= 0){
                    this.snakePosition.unshift([this.snakePosition[0][0],height]);
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0], this.snakePosition[0][1] - this.speed]);
                }  
                break;
            case 2: //right
                if(this.snakePosition[0][0] >= width){
                    this.snakePosition.unshift([0,this.snakePosition[0][1]]);
                } else{
                this.snakePosition.unshift([this.snakePosition[0][0] + this.speed, this.snakePosition[0][1]]);
                }
                break;
            default: //down
                if(this.snakePosition[0][1] >= height){
                    this.snakePosition.unshift([this.snakePosition[0][0],0]);
                    //this.snakePosition[i][1] = 0;
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0],this.snakePosition[0][1] + this.speed]);
                    //this.snakePosition[i][1] = this.snakePosition[i][1] + this.speed;
                }  
                break;
        }
    },
    
   /*
    update(){
        //letztes Element löschen
        this.snakePosition.pop();
        //erstes Element abhängig von der view hinzufügen
        switch (this.view) {
            case 0: //left - west
                if(this.snakePosition[0][0] <= 0){
                    this.snakePosition.unshift([width,this.snakePosition[0][1]]);
                    //this.snakePosition[i][0] = width;
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0] - this.pixel,this.snakePosition[0][1]]);
                    //this.snakePosition[i][0] = this.snakePosition[i][0] - this.speed;
                }
                for (let i = 0; i < this.snakePosition.length; i++) {
                    this.snakePosition[i][0] = this.snakePosition[i][0] + this.pixel - this.speed; 
                }
                break;
            case 1: //up - north
                if(this.snakePosition[0][1] <= 0){
                    this.snakePosition.unshift([this.snakePosition[0][0],height]);
                    //this.snakePosition[i][1] = height;
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0], this.snakePosition[0][1] - this.pixel]);
                    //this.snakePosition[i][1] = this.snakePosition[i][1] - this.speed;
                }   
                for (let i = 0; i < this.snakePosition.length; i++) {
                    this.snakePosition[i][1] = this.snakePosition[i][1] + this.pixel - this.speed; 
                }
                break;
            case 2: //right - east
                if(this.snakePosition[0][0] >= width){
                    this.snakePosition.unshift([0,this.snakePosition[0][1]]);
                    //this.snakePosition[i][0] = 0;
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0] + this.pixel, this.snakePosition[0][1]]);
                    //this.snakePosition[i][0] = this.snakePosition[i][0] + this.speed;
                }
                for (let i = 0; i < this.snakePosition.length; i++) {
                    this.snakePosition[i][0] = this.snakePosition[i][0] - this.pixel + this.speed; 
                }
                break;
            default: //down - south
                if(this.snakePosition[0][1] >= height){
                    this.snakePosition.unshift([this.snakePosition[0][0],0]);
                    //this.snakePosition[i][1] = 0;
                } else{
                    this.snakePosition.unshift([this.snakePosition[0][0],this.snakePosition[0][1] + this.pixel]);
                    //this.snakePosition[i][1] = this.snakePosition[i][1] + this.speed;
                }  
                for (let i = 0; i < this.snakePosition.length; i++) {
                    this.snakePosition[i][1] = this.snakePosition[i][1] - this.pixel + this.speed; 
                }
                break;
        }
    },
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
    grow(){
        let lastIndex = this.snakePosition.length -1;
        let lastPosition = this.snakePosition[lastIndex];
        let beforeLastPosition = this.snakePosition[lastIndex-1];
        let xDifference = lastPosition[0] - beforeLastPosition[0]; // >0:left   <0:right   ==0:keine Veränderung der x Position; up oder down 
        let yDifference = lastPosition[1] - beforeLastPosition[1]; // >0:up   <0:down   ==0: keine Veränderung der y Position, also right or left
        if(xDifference == 0){ // up or down
            if(yDifference>0){ // Bewegung geht nach up
                for (let index = 1; index <= 20; index++) {
                    this.snakePosition.push([this.snakePosition[lastIndex][0], this.snakePosition[lastIndex][1]+index]);
                }
            } else { // Bewegung geht nach down
                for (let index = 1; index <= 20; index++) {
                    this.snakePosition.push([this.snakePosition[lastIndex][0], this.snakePosition[lastIndex][1]-index]);
                }
            }
        } else{ //left or right
            if(xDifference>0){ // Bewegung geht nach left
                for (let index = 1; index <= 20; index++) {
                    this.snakePosition.push([this.snakePosition[lastIndex][0]+index, this.snakePosition[lastIndex][1]]);
                }
            }else { // Bewegung geht nach right
                for (let index = 1; index <= 20; index++) {
                    this.snakePosition.push([this.snakePosition[lastIndex][0]-index, this.snakePosition[lastIndex][1]]);
                }
            }
        }
        switch (this.view) {
            case 0:
                
                break;
            case 1:
                
                break;
            case 2:
                
                break;    
            default:
                break;
        }
        
    }

};

/**
 * Detects a collision between the snake and the food like apple
 */
function checkCollisionFood(){
    // Kollision vorhanden? Kopf von Snake mit Apfel
    let xApple = apple.x;
    let yApple = apple.y;
    let xSnake = snake.snakePosition[0][0];
    let ySnake = snake.snakePosition[0][1];
    let distance = Math.sqrt(Math.pow(Math.abs(xApple-xSnake),2) + Math.pow(Math.abs(yApple-ySnake),2) );
    if(distance <= 20){
    // wenn ja: score auf Snake addieren
    snake.score += apple.score;
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
    let xHead = snake.snakePosition[0][0];
    let yHead = snake.snakePosition[0][1];
    let x;
    let y;
    //let distance;
    for (let index = 20; index < snake.snakePosition.length; index++) {
        x = snake.snakePosition[index][0];
        y = snake.snakePosition[index][1];
        if(x < xHead + 1){
            if(x + 1 > xHead){
                if(y < yHead + 20){
                    if(y + 20 > yHead){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

document.addEventListener('keydown',function(event){
    snake.move(event);
});


function loop() {
    ctx.clearRect(0, 0, width, height);
    snake.update();
    if(!foodAvailable){
        apple.spawnApple();
        foodAvailable = true;
    }
    checkCollisionFood();
    if(checkCollisionSnakeBody()){
        window.cancelAnimationFrame(animationFrameHandle);
        animationFrameHandle = undefined;
        return;
    }
    snake.draw(ctx);
    apple.draw();
    window.requestAnimationFrame(loop);
};

animationFrameHandle = window.requestAnimationFrame(loop);