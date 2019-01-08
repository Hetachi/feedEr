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

io.on('connection', function (socket) {
  console.log(socket.id)
  var newUser = {
    id: socket.id,
    x: 10,
    y: 10
  };
  playerData.push(newUser);

  socket.emit('newPlayerData', playerData);

  socket.on('updatePlayerLocation', (data)=> {
    var playerIndex = playerData.findIndex(x => x.id == socket.id)
    playerData[playerIndex].x = data.x;
    playerData[playerIndex].y = data.y;

    socket.emit('updatedPlayerLocations', playerData);
  })

  socket.on('disconnect', (reason) => {
    var playerIndex = playerData.findIndex(x => x.id == socket.id)
    if(playerData[playerIndex]) {
      playerData.splice(playerIndex, 1);
    }
    console.log('player disconnected: '+socket.id);
  })
});
