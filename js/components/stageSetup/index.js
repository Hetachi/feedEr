const PIXI = require('pixi.js')
import {DEBUG_ENABLED} from '../../../config'

export default (spriteList, App) => {
  spriteList.map(sprite => {
    sprite.x = (Math.floor(Math.random() * 4) + 1) * 50
    sprite.y = 25
    DEBUG_ENABLED && console.log("Sprite x coord: "+sprite.x)
    App.stage.addChild(sprite)
  })

  DEBUG_ENABLED && console.log(App.stage)
}
