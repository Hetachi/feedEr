import assets from './assets/assetList'
const PIXI = require('pixi.js')
const io = require('socket.io-client');
const socket = io('http://85.115.117.87:8081/');

socket.on('connect', (data) => {
  console.log("Client connected: "+socket.id);
});

const app = new PIXI.Application({
  width: 800,
  height: 600
});

assets.map( asset => {
  PIXI.loader.add(asset.name, asset.file);
})

PIXI.loader.once('complete').load( (loader, resources) => {
  setup(loader, resources);
})
