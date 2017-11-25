import socket from 'socket.io-client'

import KeyBus from './engine/KeyBus'
import Game from './engine/Game'
import { drawWalls, drawObstacles, initAudio, initObstacles, initSnake, drawSnake, moveSnake,
    initFood, drawFood, checkFood, removeSpoiledFood, createSpoiledFood, initSpoiledFood,
    showRestartLayer, reload, drawHUD } from './helper'
import { 
    UP, DOWN, RIGHT, LEFT,
    MOVING_SPEED, 
    CANVAS_WIDTH, CANVAS_HEIGHT,
    SPOILED_FOOD_TIMEOUT, COLLISION_AUDIO, POWERDOWN_AUDIO, POWERUP_AUDIO,
    PLAY_COLLISION_SOUND, PLAY_SPOILED_FOOD_SOUND, PLAY_NORMAL_FOOD_SOUND,
    END_GAME, RENDER, TOGGLE_WAIT, CHANGE_DIRECTION, RESTART
} from './options'

const NUM_OBSTACLES = 6;

class SnakeGame extends Game {
    constructor() {
        super();
        this.canvas = document.querySelector('#snake');
        this.context = this.canvas.getContext('2d');

        this.canvas.height = CANVAS_HEIGHT;
        this.canvas.width = CANVAS_WIDTH;

        this.snakeSegments = initSnake();
        this.obstacles = [];
        // this.obstacles = initObstacles(NUM_OBSTACLES);
        this.food = initFood(this.obstacles);
        this.spoiledFood = initFood(this.obstacles);
        this.audio = initAudio();

        setTimeout(removeSpoiledFood.bind(this), SPOILED_FOOD_TIMEOUT, this.obstacles);
        
        this.direction = RIGHT;
    }

    setMovingDirection(e) {
        if (e.keyCode === 37 && this.direction !== RIGHT) {
            this.direction = LEFT;
        } else if (e.keyCode === 38 && this.direction !== DOWN) {
            this.direction = UP;
        } else if (e.keyCode === 39 && this.direction !== LEFT) {
            this.direction = RIGHT;
        } else if (e.keyCode === 40 && this.direction !== UP) {
            this.direction = DOWN;
        }
    }

    addKeyboardHandlers() {
        document.addEventListener('keydown', (e) => this.setMovingDirection(e))
    }

    update() {
        // make the snake move one more step every 1 second
        // according to the direction
        this.food = checkFood.call(this, this.food, false);
        this.spoiledFood = checkFood.call(this, this.spoiledFood, true);
    }

    toggleWaitScreen(wait) {
        if(wait) {
            document.querySelector('.wait-layer').style.display = 'block';
        } else {
            document.querySelector('.wait-layer').style.display = 'none';
        }
    }

    render(state) {
        const { width, height } = this.canvas;
        const { scene } = state

        // background
        drawWalls(this.context, width, height);

        // obstacles
        drawObstacles(this.context, this.obstacles);

        // could be multiple snakes
        for (let key in state) {
            if (key === 'scene') continue
            drawSnake(this.context, state[key].segments, state[key].color)
        }

        // the food
        drawFood(this.context, scene.food, scene.spoiledFood);

        // draw HUD
        drawHUD(state);
    }

    debug() {
        window.snakeSegments = this.snakeSegments;
        window.update = this.update.bind(this);
        window.render = this.render.bind(this);
        window.gameloop = this.gameloop.bind(this);
    }
    
    init() {
        this.io = socket()
        this.timer = setInterval(() => {
            this.io.emit(CHANGE_DIRECTION, this.direction)
        }, MOVING_SPEED);

        this.debug();
        this.addKeyboardHandlers();

        this.io.on(TOGGLE_WAIT, (wait) => {
            this.toggleWaitScreen(wait);
        });

        this.io.on(RENDER, (state) => {
            console.log('state', state);
            this.render(state)
        });

        this.io.on(END_GAME, () => {
            clearInterval(this.timer);
            showRestartLayer(this.io); // needs to broadcast to both players
        });

        this.io.on(RESTART, () => {
            reload();
        });

        this.io.on(PLAY_COLLISION_SOUND, () => {
            this.audio.getAudioByName(COLLISION_AUDIO).play();
        })
        this.io.on(PLAY_NORMAL_FOOD_SOUND, () => {
            this.audio.getAudioByName(POWERUP_AUDIO).play();
        })
        this.io.on(PLAY_SPOILED_FOOD_SOUND, () => {
            this.audio.getAudioByName(POWERDOWN_AUDIO).play();
        })
    }
}

export default SnakeGame;