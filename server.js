var port = process.env.PORT || 8081;
var app = require('express')();
var playerData = [];
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Credentials", "true")
      res.header("Access-Control-Allow-Origin", "http://exile.lv/rabbit");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

var server = app.listen(port);
var io = require('socket.io').listen(server);

function checkIfAllPlayersAreReady(playerData) {
  const totalPlayers = playerData.length
  const totalPlayersReady = playerData.filter(player => player.ready)
  if(totalPlayers === totalPlayersReady.length) {
    return true
  }
}

io.on('connection', function (socket) {
  socket.on('playerReady', (playerId)=> {
    console.log("Player ready: " +playerId)
    console.log(socket.id)
    var newUser = {
      id: socket.id,
      x: 0,
      y: 0,
      ready: false,
      dead: false,
    };
    playerData.push(newUser);
    console.log("New user added")

    if(playerData[0].ready && playerData[1].ready) {
      io.emit('newPlayerData', playerData);
    }

    playerData.map( player => {
      if(player.id === playerId){
        player.ready = true
        io.emit('startGame', playerData);
      }
    })
  })

  socket.on('abilityPlaced', (abilityInfo) => {
    playerData.map(player => {
      if (player.id != abilityInfo.id) {
        socket.broadcast.to(player.id).emit('newAbilityPlacement', abilityInfo)
      }
    })
  })

  socket.on('updatePlayerLocation', (data)=> {
    var playerIndex = playerData.findIndex(x => x.id == socket.id)
    if (playerData[playerIndex] && playerData[playerIndex].ready) {
      playerData[playerIndex].x = data.x;
      playerData[playerIndex].y = data.y;

      socket.emit('updatedPlayerLocations', playerData);
    }

  })

  socket.on('disconnect', (reason) => {
    console.log('player disconnected: '+socket.id);
  })

  socket.on('playerDied', (playerID) => {
    playerData.map((player, index) => {
      if(player.id === playerID) {
        player.dead = true
        player.ready = false
        io.emit('newPlayerData', playerData);
        gameStarted = false
      } else {
        player.ready = false
        io.emit('newPlayerData', playerData);
        gameStarted = false
      }
    })
    playerData = []
  })
});

const checkIfPlayersAreReady = setInterval(() => {
  if(checkIfAllPlayersAreReady(playerData)) {
    io.emit('newPlayerData', playerData);
    console.log('Sent out player data to begin game')
  } else {
    console.log(playerData)
      console.log('Players not ready')
  }
},1000)
