import assets from './assets/assetList'
import {spriteList , gameObjectList, gameBounds,DEBUG_ENABLED} from './config'
import stageSetup from './js/components/stageSetup'
import collisionDetec from './js/components/atoms/collisionDetect'
import createKeyEvents from './js/components/atoms/createKeyEvents'
import gameLoop from './js/components/gameLoop'
import updatePlayerPosition from './js/components/molecules/updatePlayerPosition'
import abilityUse from './js/components/atoms/abilityUse'
const PIXI = require('pixi.js')
const io = require('socket.io-client');
const socket = io('http://85.115.117.87:8081/');
const progressBar = document.getElementById('progressBar')
let player = ''
let enemy = ''
const life = "❤"

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

    const health = new PIXI.Text(life,
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

    DEBUG_ENABLED && console.log(spriteList)

    stageSetup(spriteList, App)

    createKeyEvents(player, App)

    setInterval(function ({socket, player}) {

      updatePlayerPosition({socket, player})

    }, 5, {socket, player});
})

socket.on('newPlayerData', (data) => {
    data.map(incomingPlayer => {
      if(incomingPlayer.dead && enemy.id === incomingPlayer.id) {
        document.getElementById('endScreen').classList.remove('hidden')
        document.getElementById('winner').classList.remove('hidden')
        enemy.dead = true
      } else if (incomingPlayer.dead && player.id === incomingPlayer.id) {
        document.getElementById('endScreen').classList.remove('hidden')
        document.getElementById('loser').classList.remove('hidden')
        player.dead = true
      }
      if(incomingPlayer.id != player.id && !enemy.id) {
        enemy = new PIXI.Sprite(PIXI.loader.resources.redBlock.texture)
        enemy.x = incomingPlayer.x
        enemy.y = incomingPlayer.y
        enemy.id = incomingPlayer.id
        enemy.ready = incomingPlayer.ready
        enemy.dead = incomingPlayer.dead
        App.stage.addChild(enemy)

      } else if(incomingPlayer.id != player.id && enemy.id) {
          enemy.x = incomingPlayer.x
          enemy.y = incomingPlayer.y
          enemy.ready = incomingPlayer.ready
          enemy.dead = incomingPlayer.dead
      }

      if(incomingPlayer.id === player.id) {
        player.ready = incomingPlayer.ready
        player.dead = incomingPlayer.dead
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

socket.on('startGame', (playerData) => {
  playerData.map( incomingPlayer => {
    if( incomingPlayer.id === player.id) {
      player.ready = incomingPlayer.ready
    } else if (incomingPlayer.id === enemy.id) {
      enemy.ready = incomingPlayer.ready
    }
  })
})

socket.on('newAbilityPlacement', (newAbilityInfo) => {
  abilityUse(newAbilityInfo.x, newAbilityInfo.y, false, App, PIXI.loader.resources, socket, enemy)
})

App.ticker.add(delta => gameLoop(delta, player, App, PIXI.loader.resources, socket, enemy));

function startGame() {
    socket.emit('playerReady', socket.id)
    document.getElementById('readyScreen').classList.add('hidden')
}
document.getElementById('readyButton').addEventListener('click', startGame)
