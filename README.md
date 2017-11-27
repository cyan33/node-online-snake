# node-online-snake

The network multi-player version of the snake. To play the game, you need to host a server on your computer. So make sure you follow the instructions below. To play the local version (without network), click [here](https://thomasyimgit.github.io/csc481-591-assignments/assignment2_snake/index.html) to play directly.

## Installation

First, make sure you have [Node.js](https://nodejs.org/en/) installed.

Then, run the command below:

```sh
> git clone git@github.com:thomasyimgit/node-online-snake.git
> cd ./node-online-snake
> npm install
> npm run build
> npm run server

[nodemon] 1.12.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./src/server/index.js`
listening on *:3000
```

Open your browser and try to open multiple tabs of http://localhost:3000 and then you can play the game.

> Note:
> 1. If there is only one page open, you should wait until another player join, then the game will start.
> 2. To restart the game, do NOT refresh the browser directly, you should close the tab and reopen a new one, or just click the **"restart"** button when the game ends.
> 3. If you come across some anomalies (probably due to you refreshed your page), go to the command line where the server is hosting, and type `rs` and hit Enter, which will restart the server.

## Features

1. Basic snake game with food, spoiled food, etc.
2. Multi-player with network, implemented with Express.js and Socket.io.
