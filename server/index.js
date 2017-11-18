const path = require('path');
const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const { update, moveSnake, initSnake } = require('./serverSnakeHelper')

// static files
app.use('/dist', express.static('dist'))

app.use('/src', express.static('src'))
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../index.html'));
});

const state = {
  // scene: {
  //   food: { x, y },
  //   spoiledFood: { }
  // },
  // player1: { segments: [], direction: 'RIGHT' },
  // player2: {},
}

let hasPlayer = false

io.on('connection', (socket) => {
  console.log(`a user connected, id: ${socket.id}`);
  hasPlayer = true

  state[socket.id] = {
    direction: 'RIGHT',
    segments: initSnake(),
  }

  socket.on('change_direction', (direction) => {
    state[socket.id].direction = direction
  })

  socket.on('disconnect', () => {
    // delete state[socket.id]
    console.log('user disconnected');
  });
});

setInterval(() => {
  update(state)
  io.sockets.emit('render', state)
}, 250)

http.listen(3000, function(){
  console.log('listening on *:3000');
});
