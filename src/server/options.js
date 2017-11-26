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

const PLAY_COLLISION_SOUND = 'play_collision_sound';
const PLAY_NORMAL_FOOD_SOUND = 'play_normal_food_sound';
const PLAY_SPOILED_FOOD_SOUND = 'play_spoiled_food_sound';

const SPOILED_FOOD_TIMEOUT = 7000;

const CHANGE_DIRECTION = 'change_direction';
const RESTART_CLICKED = 'restart_clicked';
const RENDER = 'render';
const END_GAME = 'end_game';
const RESTART = 'restart';
const TOGGLE_WAIT = 'toggle_wait'
const GET_SESSION_ID = 'get_session_id';

const SHRINK_LENGTH = 2;

module.exports = { ROWS, COLS, RESTART_CLICKED, RENDER, END_GAME, RESTART, CHANGE_DIRECTION, SHRINK_LENGTH, TOGGLE_WAIT,
  PLAY_COLLISION_SOUND, PLAY_NORMAL_FOOD_SOUND, PLAY_SPOILED_FOOD_SOUND, GET_SESSION_ID};