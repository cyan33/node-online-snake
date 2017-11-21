const socket = require('socket.io');
const state = require('./state');

const { update, moveSnake, initSnake, getRandomLocation } = require('./serverSnakeHelper')
const { getRandomNumber } = require('./operations');
const { CHANGE_DIRECTION, RESTART_CLICKED, END_GAME, RENDER, RESTART } = require('./options');

var timer;

function createIO(http) {
  const io = socket(http)

  return {
    listen() {
      io.on('connection', (socket) => {
        console.log(`a user connected, id: ${socket.id}`);
        // let isHost = true;
        // if(Object.keys(state).length >= 1) isHost = false;
        // console.log(`isHost: ${isHost}`);
        state[socket.id] = {
          direction: 'RIGHT',
          segments: initSnake(getRandomLocation()),
          key: socket.id
        }
      
        socket.on(CHANGE_DIRECTION, (direction) => {
          state[socket.id].direction = direction
        })
      
        socket.on('disconnect', () => {
          delete state[socket.id]
          console.log('user disconnected');
        });

        socket.on(RESTART_CLICKED, () => {
          io.sockets.emit(RESTART);
        });
      });

      timer = setInterval(() => {
        let result = update(state);
        if(!result) {
          io.sockets.emit(END_GAME, timer);
        } else {
          io.sockets.emit(RENDER, state);
        }
       }, 250);
    }
  }
}

module.exports = { createIO };
