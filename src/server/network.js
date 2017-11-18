const socket = require('socket.io')

const state = require('./state')
const { update, moveSnake, initSnake } = require('./serverSnakeHelper')

function createIO(http) {
  const io = socket(http)

  return {
    listen() {
      io.on('connection', (socket) => {
        console.log(`a user connected, id: ${socket.id}`);
      
        state[socket.id] = {
          direction: 'RIGHT',
          segments: initSnake(),
        }
      
        socket.on('change_direction', (direction) => {
          state[socket.id].direction = direction
        })
      
        socket.on('disconnect', () => {
          delete state[socket.id]
          console.log('user disconnected');
        });
      });
      
      setInterval(() => {
        update(state)
        io.sockets.emit('render', state)
      }, 250)
    }
  }
}

module.exports = { createIO };
