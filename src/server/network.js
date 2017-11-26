const socket = require('socket.io');
const state = require('./state');

const { update, moveSnake, initSnake, getRandomLocation, initFood, getPlayerCount, getRandomColor } = require('./serverSnakeHelper')
const { getRandomNumber } = require('./operations');
const { CHANGE_DIRECTION, RESTART_CLICKED, END_GAME, RENDER, RESTART, TOGGLE_WAIT,
  PLAY_COLLISION_SOUND, PLAY_NORMAL_FOOD_SOUND, PLAY_SPOILED_FOOD_SOUND, GET_SESSION_ID } = require('./options');

function createIO(http) {
  const io = socket(http)
  let gameHasEnded = false;

  return {
    listen() {
      io.on('connection', (socket) => {
        console.log(`a user connected, id: ${socket.id}`);
        // Determine spawn location based on current player spawns
        let yPos;
        let canSpawn = false;
        while(!canSpawn) {
          yPos = getRandomLocation();
          if(getPlayerCount(state) < 1) break;
          for(let key in state) {
            if(key === 'scene') continue;
            let check = state[key].segments[0].position.y;
            yPos !== check? canSpawn = true : canSpawn = false;
          }
        }
        state[socket.id] = {
          direction: 'RIGHT',
          segments: initSnake(yPos),
          color: getRandomColor(),
          score: 0,
          key: socket.id
        }
        if (!state.scene) {
            state.scene = {
                food: initFood(),
                spoiledFood: initFood()
            }
        }

        if(getPlayerCount(state) >= 2) {
          io.sockets.emit(TOGGLE_WAIT, false);
        }
        socket.emit(GET_SESSION_ID, socket.id);

        socket.on(CHANGE_DIRECTION, (direction) => {
          state[socket.id].direction = direction
        })
      
        socket.on('disconnect', () => {
          delete state[socket.id];
          io.sockets.emit(RESTART);
          console.log('user disconnected');
        });

        socket.on(RESTART_CLICKED, () => {
          gameHasEnded = false;
          io.sockets.emit(RESTART);
        });
      });

      setInterval(() => {
        let results;
        if (!gameHasEnded && getPlayerCount(state) > 1) {
          results = update(state);
        }
        io.sockets.emit(RENDER, state);

        // sound control
        if (!gameHasEnded && results) {
          for (let rs of results) {
            const {
              hasCollided,
              hasEatenNormalFood,
              hasEatenSpoiledFood
            } = rs;
  
            if (hasCollided) {
              io.sockets.emit(PLAY_COLLISION_SOUND);
              gameHasEnded = true;
              io.sockets.emit(END_GAME, state);
            }
            if (hasEatenNormalFood) {
              io.sockets.emit(PLAY_NORMAL_FOOD_SOUND);
              state.scene.food = initFood();
            }
            if (hasEatenSpoiledFood) {
              io.sockets.emit(PLAY_SPOILED_FOOD_SOUND);
              state.scene.spoiledFood = initFood();
            }
          }
        }
      }, 250);
    }
  }
}

module.exports = { createIO };
