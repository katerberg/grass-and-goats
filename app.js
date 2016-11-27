(function() {
  'use strict';
  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const port = process.env.PORT || 3000;

  const state = require('./state');

  app.get('/', function(req, res) {
    console.log('got called on base');
    res.sendFile(__dirname + '/public/default.html');
  });

  app.get('/age', function(req, res) {
    console.log('requesting age');
    res.send(state.age + '');
  });

  app.post('/spawn', function(req, res) {
    if (req.body && req.body.type) {
      if (req.body.type === 'goat') {
        console.log('spawning new goat');
        state.spawnGoat();
        res.send('created');
      }
    } else {
      res.status(400).send('requires type of spawn');
    }
  });

  app.patch('/config', function(req, res) {
    if (req.body && req.body.TICK_TIME) {
      const tickTime = req.body.TICK_TIME;
      console.log('Changing config tick time to ' + tickTime);
      state.TICK_TIME = tickTime;
      res.send({TICK_TIME: tickTime});
    } else {
      res.status(400).send('requires TICK_TIME to update');
    }
  });

  app.get('/world', function(req, res) {
    console.log('requesting world');
    res.send(state.board.cells);
  });

  function attachSocket(socket) {
    state.watchers.push(socket);
  }

  io.on('connection', function(socket) {
      console.log('new connection ' + socket.id);
      attachSocket(socket);
  });

  http.listen(port, function() {
      console.log('listening on *: ' + port);
  });
})();
