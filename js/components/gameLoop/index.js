import { defaultVelocity, gameBounds, gameRate } from '../../../config'
import handleJump from '../atoms/handleJump'
import handleDodge from '../atoms/handleDodge'

export default (delta, player ) => {
    if(player.y < gameBounds.y - 50 && !player.jump && player.isFalling) {

      var tempPlayerY = player.y
      tempPlayerY -= -player.fallingSpeed
      if(tempPlayerY >= gameBounds.y - 50) {
        tempPlayerY = gameBounds.y - 50
      }
      player.y = tempPlayerY

      if(player.fallingSpeed <= 50) {
        player.fallingSpeed++
      }
    }

    else if(player.jump) {
      handleJump(player)
    }

    if(player.dodge) {
      handleDodge(player)
    }

    // MOVEMENT LEFT OR RIGHT
    if(player.left && player.x >= 0) {
      player.x -= (+1 * gameRate)
    }

    if(player.right && player.x <= gameBounds.x - 50) {
      player.x -= (-1 * gameRate)
    }
}
