const socket = require('socket.io');
const state = require('./state');

const { update, moveSnake, initSnake, getRandomLocation, initFood, getPlayerCount } = require('./serverSnakeHelper')
const { getRandomNumber } = require('./operations');
const { CHANGE_DIRECTION, RESTART_CLICKED, END_GAME, RENDER, RESTART, TOGGLE_WAIT } = require('./options');

function createIO(http) {
  const io = socket(http)

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
          key: socket.id
        }
        if (state.scene == null) {
            state.scene = {
                food: initFood(),
                spoiledFood: initFood()
            }
        }

        if(getPlayerCount(state) >= 2) {
          io.sockets.emit(TOGGLE_WAIT, false);
        }

        socket.on(CHANGE_DIRECTION, (direction) => {
          state[socket.id].direction = direction
        })
      
        socket.on('disconnect', () => {
          delete state[socket.id];
          io.sockets.emit(RESTART);
          console.log('user disconnected');
        });

        socket.on(RESTART_CLICKED, () => {
          io.sockets.emit(RESTART);
        });
      });

      setInterval(() => {
        let result = update(state);
        if(!result) {
          io.sockets.emit(END_GAME);
        } else {
          io.sockets.emit(RENDER, state);
        }
       }, 250);
    }
  }
}

module.exports = { createIO };
