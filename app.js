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
    board: buildWorld(),
    watchers: [],
    checkForGrowth: function() {
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

  function tick(socket) {
    world.age++;
    console.log('tick: ' + world.age);
    world.watchers.forEach(function(watcher) {
      watcher.emit('tick', world.age);
    });
    const worldDelta = world.checkForGrowth();
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
  
  function buildWorld() {
    const board = [];
    for (let i = 0; i < 10; i++) {
      board.push([]);
      for (let j = 0; j < 10; j++) {
        board[i].push({grass: 0});
      }
    }
    const startX = randomIntFromInterval(0, 9),
      startY = randomIntFromInterval(0, 9);
    board[startX][startY].grass = 1;
    return board;
  }

  io.on('connection', function(socket) {
      console.log('new connection ' + socket.id);
      kickoffTicker(socket);
      buildWorld();

  //     socket.on('login', function(userId) {
  //         console.log(userId + ' joining lobby');
  //         socket.userId = userId;  
       
  //         if (!users[userId]) {    
  //             console.log('creating new user');
  //             users[userId] = {userId: socket.userId, games:{}};
  //         } else {
  //             console.log('user found!');
  //             Object.keys(users[userId].games).forEach(function(gameId) {
  //                 console.log('gameid - ' + gameId);
  //             });
  //         }
          
  //         socket.emit('login', {users: Object.keys(lobbyUsers), 
  //                               games: Object.keys(users[userId].games)});
  //         lobbyUsers[userId] = socket;
          
  //         socket.broadcast.emit('joinlobby', socket.userId);
  //     });
      
  //     socket.on('invite', function(opponentId) {
  //         console.log('got an invite from: ' + socket.userId + ' --> ' + opponentId);
          
  //         socket.broadcast.emit('leavelobby', socket.userId);
  //         socket.broadcast.emit('leavelobby', opponentId);
        
         
  //         var game = {
  //             id: Math.floor((Math.random() * 100) + 1),
  //             board: null, 
  //             users: {white: socket.userId, black: opponentId}
  //         };
          
  //         socket.gameId = game.id;
  //         activeGames[game.id] = game;
          
  //         users[game.users.white].games[game.id] = game.id;
  //         users[game.users.black].games[game.id] = game.id;
    
  //         console.log('starting game: ' + game.id);
  //         lobbyUsers[game.users.white].emit('joingame', {game: game, color: 'white'});
  //         lobbyUsers[game.users.black].emit('joingame', {game: game, color: 'black'});
          
  //         delete lobbyUsers[game.users.white];
  //         delete lobbyUsers[game.users.black];   
          
  //         socket.broadcast.emit('gameadd', {gameId: game.id, gameState:game});
  //     });
      
  //      socket.on('resumegame', function(gameId) {
  //         console.log('ready to resume game: ' + gameId);
           
  //         socket.gameId = gameId;
  //         var game = activeGames[gameId];
          
  //         users[game.users.white].games[game.id] = game.id;
  //         users[game.users.black].games[game.id] = game.id;
    
  //         console.log('resuming game: ' + game.id);
  //         if (lobbyUsers[game.users.white]) {
  //             lobbyUsers[game.users.white].emit('joingame', {game: game, color: 'white'});
  //             delete lobbyUsers[game.users.white];
  //         }
          
  //         if (lobbyUsers[game.users.black]) {
  //             lobbyUsers[game.users.black] && 
  //             lobbyUsers[game.users.black].emit('joingame', {game: game, color: 'black'});
  //             delete lobbyUsers[game.users.black];  
  //         }
  //     });
      
  //     socket.on('move', function(msg) {
  //         socket.broadcast.emit('move', msg);
  //         activeGames[msg.gameId].board = msg.board;
  //         console.log(msg);
  //     });
      
  //     socket.on('disconnect', function(msg) {
          
  //       console.log(msg);
        
  //       if (socket && socket.userId && socket.gameId) {
  //         console.log(socket.userId + ' disconnected');
  //         console.log(socket.gameId + ' disconnected');
  //       }
        
  //       delete lobbyUsers[socket.userId];
        
  //       socket.broadcast.emit('logout', {
  //         userId: socket.userId,
  //         gameId: socket.gameId
  //       });
  //     });
  });

  http.listen(port, function() {
      console.log('listening on *: ' + port);
  });
})();
