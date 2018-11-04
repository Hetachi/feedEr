import { defaultVelocity, gameBounds, gameRate } from '../../../../config'

export default (player) => {
  if(player.jump < 20) {
    player.jump++
    player.jumpVelocity >= 0 ?
    player.jumpVelocity-- :
    player.jumpVelocity = 0

    player.y -= player.jumpVelocity
  } else if(player.jump) {
    player.jump = false
    player.jumpVelocity = 0
  }
}
