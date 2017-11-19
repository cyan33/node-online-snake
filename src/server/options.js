const SNAKE_INIT_LENGTH = 5;

const RIGHT = 'RIGHT';
const UP = 'UP';
const LEFT = 'LEFT';
const DOWN = 'DOWN';

const SEGMENT_WIDTH = 15;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 620;

const OBSTACLE_SIZE = 45;
const BOUNDARY_PROX = -0.9;
const OBSTACLE_PROX = 1;
const FOOD_FROM_OBSTACLE = 5;
const OBSTACLE_FROM_OBSTACLE = 5;

const ROWS = CANVAS_WIDTH / SEGMENT_WIDTH;
const COLS = CANVAS_HEIGHT / SEGMENT_WIDTH;

const MOVING_SPEED = 250; // 1000ms interval for setTimeout
const ACCELERATING_SPEED = 400;

const COLLISION_AUDIO = 'collision.mp3';
const POWERUP_AUDIO = 'powerup.mp3';
const POWERDOWN_AUDIO = 'powerdown.mp3';
const AUDIO = [COLLISION_AUDIO, POWERUP_AUDIO, POWERDOWN_AUDIO];

const SPOILED_FOOD_TIMEOUT = 7000;

module.exports = { ROWS, COLS };