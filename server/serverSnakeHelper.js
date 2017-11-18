class Segment {
  constructor(size, { x, y }) {
      this.size = size
      this.position = { x, y }
  }
}

function initSnake() {
  // 600 x 600 => 40 x 40
  const SNAKE_INIT_LENGTH = 5;
  let segments = []
  for (let i = SNAKE_INIT_LENGTH - 1; i >= 0; i--) {
      // the position is the relative index, not the exact pixel
      segments.push(new Segment({width:1, height:1}, { x: i, y: 0 }));
  }
  return segments;
}

function moveSnake(player, scene) {
  const { 
      segments,
      direction,
      // food,
      // spoiledFood,
      // obstacles,
      // audio
  } = player;

  // const { food } = scene;

  // construct a new head segment according to the moving direction
  let head = segments[0];
  let nx = head.position.x;
  let ny = head.position.y;
  if (direction === 'LEFT') nx -= 1;
  else if (direction === 'RIGHT') nx += 1;
  else if (direction === 'UP') ny -= 1;
  else if (direction === 'DOWN') ny += 1;
  // check collision with itself, crosses the wall, or hits an obstacle
  // if (isCollidesWall({x: nx, y: ny}) || isCollidesItself({x: nx, y: ny}, segments)
  //     // || isCollidesObstacle({x: nx, y: ny, size: head.size}, obstacles)
  // ) {
  //     updateLocalStorage(this.currScore);

  //     // audio.getAudioByName(COLLISION_AUDIO).play();
  //     clearInterval(this.timer);
  //     showRestartLayer();
  // }
  head = new Segment({width: 1, height: 1}, { x: nx, y: ny });
  // check if it eats food
  // var collision = isCollidesFood({x: nx, y: ny}, food.position, spoiledFood);
  // if (collision == 1) {
  //     // score++ and call this.initScorePanel()
  //     // audio.getAudioByName(POWERUP_AUDIO).play();
  //     this.currScore++;
  //     this.initScorePanel();
  // } else if (collision == -1){
  //     // audio.getAudioByName(POWERDOWN_AUDIO).play();
  //     this.currScore--;
  //     this.initScorePanel();
  //     segments.pop();
  //     segments.pop();
  // } else {
  //     segments.pop();
  // }
  segments.pop()

  segments.unshift(head);
  return segments;
}

function update(state) {
  const { scene } = state
  for (let key in state) {
    if (key === 'scene')  continue
    moveSnake(state[key], scene)
  }
}

module.exports = {
  update,
  moveSnake,
  initSnake
}
