(function() {
  'use strict';
  const express = require('express');
  const app = express();
  app.use(express.static('public'));
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const World = require('./world');
  const port = process.env.PORT || 3000;

  const world = new World(60);

  app.get('/', function(req, res) {
    console.log('got called on base');
    res.sendFile(__dirname + '/public/default.html');
  });

  app.get('/age', function(req, res) {
    console.log('requesting age');
    res.send(world.age + '');
  });

  app.get('/world', function(req, res) {
    console.log('requesting world');
    res.send(world.board.cells);
  });

  function tick(ageUntil) {
    var worldTick = world.tick();
    world.watchers.forEach(function(watcher) {
      watcher.emit('tick', worldTick);
    });
    if (world.age <= ageUntil) {
      if (world.age == ageUntil) {
        world.spawnGoat();
      }
      tick(ageUntil);
    } else {
      setTimeout(tick, 1000);
    }
  }

  function kickoffTicker(socket) {
    world.watchers.push(socket);
    if (!world.age) {
      tick(200);
    }
  }

  io.on('connection', function(socket) {
      console.log('new connection ' + socket.id);
      kickoffTicker(socket);
  });

  http.listen(port, function() {
      console.log('listening on *: ' + port);
  });
})();
