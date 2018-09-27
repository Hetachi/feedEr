const PIXI = require('pixi.js')
const io = require('socket.io-client');
const socket = io('http://85.115.117.87:8081/');

socket.on('connect', (data) => {
  console.log("Client connected: "+socket.id);
});

const app = new PIXI.Application({
  width: window.width - 10,
  height: window.height - 20
});
