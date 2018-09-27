var port = process.env.PORT || 8081;
var app = require('express')();
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Credentials", "true")
      res.header("Access-Control-Allow-Origin", "http://exile.lv/rabbit");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

var server = app.listen(port);
var io = require('socket.io').listen(server);
