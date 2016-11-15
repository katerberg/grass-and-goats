(function() {
  'use strict';
  const express = require('express');
  const app = express();
  app.use(express.static('public'));
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const port = process.env.PORT || 3000;

  const world = {
    age: 0,
    board: buildWorld(30),
    watchers: [],
    checkForGrowth: function() {
      const result = [];
      world.board.forEach(function(row) {
        row.forEach(function(cell) {
          const neighbors = numberOfGrassNeighbors(world.board, cell.x, cell.y);
          if (!cell.grass && Math.random() <  neighbors * 0.05) {
            result.push(cell);
          }
        });
      });
      result.forEach(function(cell) {
        cell.grass = 1;
        world.board[cell.x][cell.y].grass = 1;
      });
      return result;
    }
  };

  app.get('/', function(req, res) {
    console.log('got called on base');
    res.sendFile(__dirname + '/public/default.html');
  });

  app.get('/age', function(req, res) {
    console.log('requesting age');
    res.send(world.age);
  });

  app.get('/world', function(req, res) {
    console.log('requesting world');
    res.send(world.board);
  });

  function numberOfGrassNeighbors(board, cellX, cellY) {
    let result = 0;
    if (cellX !== 0) {
      result += board[cellX - 1][cellY].grass;
    }
    if (cellX !== board.length - 1) {
      result += board[cellX + 1][cellY].grass;
    }
    if (cellY !== 0) {
      result += board[cellX][cellY - 1].grass;
    }
    if (cellY !== board[cellX].length - 1) {
      result += board[cellX][cellY + 1].grass;
    }
    return result;
  }

  function tick(socket) {
    world.age++;
    const growthDelta = world.checkForGrowth();
    world.watchers.forEach(function(watcher) {
      watcher.emit('tick', growthDelta);
    });
    setTimeout(tick, 1000);
  }

  function kickoffTicker(socket) {
    world.watchers.push(socket);
    if (!world.age) {
      tick();
    }
  }

  function randomIntFromInterval(min,max)
  {
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  
  function buildWorld(boardSize) {
    const board = [];
    for (let x = 0; x < boardSize; x++) {
      board.push([]);
      for (let y = 0; y < boardSize; y++) {
        board[x].push({
          grass: 0,
          x: x,
          y: y,
        });
      }
    }
    const startX = randomIntFromInterval(0, boardSize - 1),
      startY = randomIntFromInterval(0, boardSize - 1);
    board[startX][startY].grass = 1;
    return board;
  }

  io.on('connection', function(socket) {
      console.log('new connection ' + socket.id);
      kickoffTicker(socket);
  });

  http.listen(port, function() {
      console.log('listening on *: ' + port);
  });
})();
