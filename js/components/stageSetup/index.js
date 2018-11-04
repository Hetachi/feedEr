const PIXI = require('pixi.js')
import {DEBUG_ENABLED, defaultVelocity} from '../../../config'

export default (spriteList, App) => {
  spriteList.map( sprite => {
    if(!sprite.hp || !sprite.armor) {
      sprite.x = (Math.floor(Math.random() * 4) + 1) * 50
    }
    sprite.y = 25
    sprite.isFalling = true
    sprite.fallingSpeed = defaultVelocity
    DEBUG_ENABLED && console.log("sprite x coord: " + sprite.x)
    App.stage.addChild(sprite)
  })
  DEBUG_ENABLED && console.log(App.stage)
}
