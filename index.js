import assets from './assets/assetList'
import {spriteList , gameObjectList, gameBounds,DEBUG_ENABLED} from './config'
import stageSetup from './js/components/stageSetup'
import keyboardEvents from './js/keyboardEvents'
import collisionDetec from './js/components/collisionDetect'
import gameLoop from './js/components/gameLoop'
const PIXI = require('pixi.js')
const io = require('socket.io-client');
const socket = io('http://85.115.117.87:8081/');
const progressBar = document.getElementById('progressBar')

socket.on('connect', (data) => {
  DEBUG_ENABLED && console.log("Client connected: "+socket.id);
});

const App = new PIXI.Application({
  width: gameBounds.x,
  height: gameBounds.y
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

    const scoreBoard = new PIXI.Text('0',
      {
        fontFamily : 'Arial',
        fontSize: 50,
        stroke: 0x000000,
        strokeThickness: 5,
        fill : 0xFFFFFF,
        align : 'center',
      }
    );

    scoreBoard.x = 300
    scoreBoard.y = 25

    spriteList.push(scoreBoard)

    for(var index in resources) {
      let resourceSprite = new PIXI.Sprite(resources[index].texture)

      spriteList.push(resourceSprite)
      gameObjectList.push(resourceSprite)
    }

    DEBUG_ENABLED && console.log(spriteList)

    stageSetup(spriteList, App)

    const jump = keyboardEvents(87)
    const spawnMob = keyboardEvents(81)

    jump.press = () => {
      console.log(App.stage)
      // if(!gameObjectList[0].jump) {
      //   gameObjectList[0].jump = true
      // }
    }

    spawnMob.press = () => {
      console.log(spriteList)
      App.stage.addChild(spriteList[1])
    }

})

    App.ticker.add(delta => gameLoop(delta, gameObjectList ));
