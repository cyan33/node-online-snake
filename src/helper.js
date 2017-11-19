import Segment from './Segment'
import { 
    SEGMENT_WIDTH, SNAKE_INIT_LENGTH, LEFT, UP, RIGHT, DOWN,
    ROWS, COLS, OBSTACLE_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT,
    FOOD_FROM_OBSTACLE, OBSTACLE_FROM_OBSTACLE, OBSTACLE_PROX,
    SPOILED_FOOD_TIMEOUT, BOUNDARY_PROX, AUDIO, COLLISION_AUDIO,
    POWERUP_AUDIO, POWERDOWN_AUDIO
} from './options'
import Food from "./Food";
import { getRandomNumber, getDistance } from './engine/operations'
import Obstacle from './engine/Obstacle'
import AudioManager from './engine/AudioManager'

export function drawWalls(context, width, height) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'black';
    context.strokeRect(0, 0, width, height);
}

export function initAudio() {
    let audio = new AudioManager();
    audio.loadAudio(AUDIO);
    return audio;
}

export function initSnake() {
    // 600 x 600 => 40 x 40

    let snakeSegments = []
    for (let i = SNAKE_INIT_LENGTH - 1; i >= 0; i--) {
        // the position is the relative index, not the exact pixel
        snakeSegments.push(new Segment({width:1, height:1}, { x: i, y: 0 }));
    }
    return snakeSegments;
}

function drawSingleSegment(context, { x, y }) {
    context.fillStyle = 'green';
    context.fillRect(x * SEGMENT_WIDTH, y * SEGMENT_WIDTH, SEGMENT_WIDTH, SEGMENT_WIDTH);
    context.strokeStyle = 'white';
    context.strokeRect(x * SEGMENT_WIDTH, y * SEGMENT_WIDTH, SEGMENT_WIDTH, SEGMENT_WIDTH);
}

export function drawSnake(context, snakeSegments) {
    context.save();
    snakeSegments.forEach(s => {
        const { x, y } = s.position;
        drawSingleSegment(context, { x, y });
    })
    context.restore();
}

function isCollidesWall(head) {
    // head.x, head.y
    return head.x >= ROWS || head.x < 0 || head.y >= COLS || head.y < 0;
}

function isCollidesFood(head, food, spoiledFood = null) {
    if(head.x === food.x && head.y === food.y){
        return 1;
    } else if (spoiledFood && head.x === spoiledFood.position.x && head.y === spoiledFood.position.y) {
        return -1;
    } else {
        return 0;
    }
}

function isCollidesItself(head, snakeSegments) {
    for (let i = 0; i < snakeSegments.length; i++) {
        if (head.x == snakeSegments[i].position.x && head.y == snakeSegments[i].position.y) {
            return true;
        }
    }
    return false;
}

function isCollidesObstacle(head, obstacles) {
    // do collision check for each obstacle
    let centerX = head.x + (.5 * head.size.width);
    let centerY = head.y + (.5 * head.size.height);
    let pos = {x: centerX, y: centerY};
    let closest = getClosestObstacle(pos, obstacles);
    let obj = new Segment(head.size, pos);
    if(closest.getCollision(obj, OBSTACLE_PROX, BOUNDARY_PROX)) return true;
    return false;
}

function getClosestObstacle(head, obstacles) {
    let smallest_dist = Number.MAX_VALUE;
    let closest_obs = null;
    for(let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        let distance = getDistance(head.x, head.y, obs.center.x, obs.center.y);
        if(distance < smallest_dist) {
            smallest_dist = distance;
            closest_obs = obs;
        }
    }
    return closest_obs;
}

function updateLocalStorage(score) {
    let highestScore = localStorage.getItem('highestScore') || 0;
    if (score > highestScore) {
        localStorage.setItem('highestScore', score);
    }
}

export function showRestartLayer(io) {
    document.querySelector('.restart-layer').style.display = 'block';
    document.querySelector("button").addEventListener("click", () => {
        io.emit('restartClicked');
    });
}

export function reload() {
    location.reload();
}

function nearObstacles(obj, obstacles, offset) {
    // want to check for all obstacles
    let near = false;
    for(let i = 0; i < obstacles.length; i++) {
        let check = obstacles[i];
        // ensure we're not within distance range of check size
        if(check.nearObstacle(obj.center.x, obj.center.y, offset)) near = true;
    }
    return near;
}

export function moveSnake() {
    const { 
        snakeSegments,
        movingDirection,
        food,
        spoiledFood,
        obstacles,
        audio
    } = this;
    // construct a new head segment according to the moving direction
    let head = snakeSegments[0];
    let nx = head.position.x;
    let ny = head.position.y;
    if (movingDirection === LEFT) nx -= 1;
    else if (movingDirection === RIGHT) nx += 1;
    else if (movingDirection === UP) ny -= 1;
    else if (movingDirection === DOWN) ny += 1;
    // check collision with itself, crosses the wall, or hits an obstacle
    if (isCollidesWall({x: nx, y: ny}) || isCollidesItself({x: nx, y: ny}, snakeSegments)
        // || isCollidesObstacle({x: nx, y: ny, size: head.size}, obstacles)
    ) {
        updateLocalStorage(this.currScore);

        // audio.getAudioByName(COLLISION_AUDIO).play();
        clearInterval(this.timer);
        showRestartLayer();
    }
    head = new Segment({width: 1, height: 1}, { x: nx, y: ny });
    // check if it eats food
    var collision = isCollidesFood({x: nx, y: ny}, food.position, spoiledFood);
    if (collision == 1) {
        // score++ and call this.initScorePanel()
        // audio.getAudioByName(POWERUP_AUDIO).play();
        this.currScore++;
        this.initScorePanel();
    } else if (collision == -1){
        // audio.getAudioByName(POWERDOWN_AUDIO).play();
        this.currScore--;
        this.initScorePanel();
        snakeSegments.pop();
        snakeSegments.pop();
    } else {
        snakeSegments.pop();
    }

    snakeSegments.unshift(head);
    return snakeSegments;
}

export function checkFood(food, isSpoiled) {
    if (food == null){
        return null;
    }
    const { snakeSegments, obstacles } = this;
    let pos = snakeSegments[0].position;

    let newFood = food;
    // check if it eats food
    if (isCollidesFood(pos, food.position) != 0) {
        if (isSpoiled) {
            return null;
        }
        newFood = initFood(obstacles);
    }
    return newFood;
}

export function initFood(obstacles) {
    let food = null;
    do {
        let xPos = getRandomNumber(COLS);
        let yPos = getRandomNumber(ROWS);
        food = new Food(1, {x:xPos, y:yPos});
    } while(nearObstacles(food, obstacles, FOOD_FROM_OBSTACLE)
            || food.position.x >= COLS - 2 || food.position.y >= ROWS - 2);
            return food;
}

export function drawFood(context, food, spoiledFood) {
    context.save();
    context.fillStyle = '#de9f5f';
    context.fillRect(food.position.x * SEGMENT_WIDTH, food.position.y * SEGMENT_WIDTH, SEGMENT_WIDTH, SEGMENT_WIDTH);
    if (spoiledFood != null){
        context.fillStyle = '#FF0000';
        context.fillRect(spoiledFood.position.x * SEGMENT_WIDTH, spoiledFood.position.y * SEGMENT_WIDTH, SEGMENT_WIDTH, SEGMENT_WIDTH);
    }
    context.restore();
}

export function removeSpoiledFood(){
    this.spoiledFood = null;
    setTimeout(createSpoiledFood.bind(this), SPOILED_FOOD_TIMEOUT);
}

export function createSpoiledFood() {
    this.spoiledFood = initFood(this.obstacles);
    setTimeout(removeSpoiledFood.bind(this), SPOILED_FOOD_TIMEOUT);
}

export function initObstacles(num_obs) {
    let obstacles = new Array();
    
    for(let i = 0; i < num_obs; i++){
        let x = 0;
        let y = 0;
        let obs = null;
        do {
            x = getRandomNumber(COLS);
            y = getRandomNumber(ROWS);
            obs = new Obstacle('', {width:OBSTACLE_SIZE / SEGMENT_WIDTH, height:OBSTACLE_SIZE / SEGMENT_WIDTH}, { x, y }, 2);
        } while(nearObstacles(obs, obstacles, OBSTACLE_FROM_OBSTACLE)
                || x > COLS - SEGMENT_WIDTH || y > ROWS - SEGMENT_WIDTH 
                || (x <= OBSTACLE_SIZE / SEGMENT_WIDTH && y <= OBSTACLE_SIZE / SEGMENT_WIDTH));
        obstacles.push(obs);
    }

    return obstacles;
}

export function drawObstacles(context, obstacles) {
    for(let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        context.save();
        context.fillStyle = 'black';
        context.fillRect(obstacle.position.x * SEGMENT_WIDTH - SEGMENT_WIDTH, obstacle.position.y * SEGMENT_WIDTH - SEGMENT_WIDTH, 
                         OBSTACLE_SIZE + SEGMENT_WIDTH, OBSTACLE_SIZE + SEGMENT_WIDTH);
        context.restore();
    }
}
