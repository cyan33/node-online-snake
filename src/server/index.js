const path = require('path');
const express = require('express');
const app = express();

const http = require('http').Server(app);

const { createIO } = require('./network')

// static files
app.use('/dist', express.static('dist'))

app.use('/src', express.static('src'))
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// io stuff
createIO(http).listen()

http.listen(3000, function(){
  console.log('listening on *:3000');
});
