import assets from './assets/assetList'
import {spriteList , gameObjectList, gameBounds,DEBUG_ENABLED} from './config'
import stageSetup from './js/components/stageSetup'
import collisionDetec from './js/components/atoms/collisionDetect'
import createKeyEvents from './js/components/atoms/createKeyEvents'
import gameLoop from './js/components/gameLoop'
import updatePlayerPosition from './js/components/molecules/updatePlayerPosition'
const PIXI = require('pixi.js')
const io = require('socket.io-client');
const socket = io('http://85.115.117.87:8081/');
const progressBar = document.getElementById('progressBar')
let player = ''
let enemy = ''

socket.on('connect', (data) => {
  DEBUG_ENABLED && console.log("Client connected: "+socket.id);
});

const App = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight
});
App.stage.interactive = true;
document.body.appendChild(App.view);

assets.map( asset => {
  PIXI.loader.add(asset.name, asset.file);
})

PIXI.loader.on('progress', (loader,res) => {
  DEBUG_ENABLED && console.log(loader.progress)
  progressBar.value = loader.progress
})

PIXI.loader.once('complete').load( (loader, resources) => {
    DEBUG_ENABLED && console.log(resources)
    progressBar.classList.toggle('hidden')

    const health = new PIXI.Text('❤',
      {
        fontFamily : 'Arial',
        fontSize: 25,
        stroke: 0x000000,
        strokeThickness: 5,
        fill : 0xC62300,
        align : 'center',
      }
    );
    health.x = 50
    health.y = 25
    health.hp = 1

    spriteList.push(health)
    DEBUG_ENABLED && console.log(resources)
    player = new PIXI.Sprite(resources.greenBlock.texture)
    player.id = socket.id

    spriteList.push(player)

    enemy = new PIXI.Sprite(resources.redBlock.texture)

    spriteList.push(enemy)

    DEBUG_ENABLED && console.log(spriteList)

    stageSetup(spriteList, App)

    createKeyEvents(player)

    setInterval(function ({socket, player}) {

      updatePlayerPosition({socket, player})

    }, 5, {socket, player});
})

socket.on('newPlayerData', (data) => {
  console.log('Got new data: '+ data );
  data.map(incomingPlayer => {
    DEBUG_ENABLED && console.log("SOCKET INCOMING PLAYER: ")
    DEBUG_ENABLED && console.log(incomingPlayer)
    if(incomingPlayer.id != player.id && !enemy.id) {
      enemy = new PIXI.Sprite(PIXI.loader.resources.redBlock.texture)
      enemy.x = incomingPlayer.x
      enemy.y = incomingPlayer.y
      enemy.id = incomingPlayer.id
      console.log("NEW ENEMY CREATED AND ADDED TO STAGE ID: "+ enemy.id)

    } else if(incomingPlayer.id != player.id && enemy.id) {
        enemy.x = incomingPlayer.x
        enemy.y = incomingPlayer.y
    }
  })
})

socket.on("updatedPlayerLocations", (playerData) => {
  playerData.map(newData => {
    if(newData.id != player.id) {
      enemy.x = newData.x
      enemy.y = newData.y
    }
  })
})

App.ticker.add(delta => gameLoop(delta, player ));
