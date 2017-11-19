const socket = require('socket.io')

const state = require('./state')
const { update, moveSnake, initSnake } = require('./serverSnakeHelper')

function createIO(http) {
  const io = socket(http)

  return {
    listen() {
      io.on('connection', (socket) => {
        console.log(`a user connected, id: ${socket.id}`);
        let isHost = true;
        if(Object.keys(state).length >= 1) isHost = false;
        console.log(`isHost: ${isHost}`);
        state[socket.id] = {
          direction: 'RIGHT',
          segments: initSnake(isHost? 0 : 30),
          isHost: isHost
        }
      
        socket.on('change_direction', (direction) => {
          state[socket.id].direction = direction
        })
      
        socket.on('disconnect', () => {
          delete state[socket.id]
          console.log('user disconnected');
        });

        socket.on('restartClicked', () => {
          io.sockets.emit('restart');
        });
      });

      setInterval(() => {
        let result = update(state);
        console.log(result);
        if(!result) {
          io.sockets.emit('endGame');
        } else {
          io.sockets.emit('render', state);
        }
       }, 250);
    }
  }
}

module.exports = { createIO };
