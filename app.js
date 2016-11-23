(function() {
  'use strict';
  const express = require('express');
  const app = express();
  app.use(express.static('public'));
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
