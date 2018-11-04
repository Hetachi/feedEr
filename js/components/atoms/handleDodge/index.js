import { dodgeDistance, dodgeMaxDistance, gameBounds } from '../../../../config'

export default (player) => {
  if(player.left && player.dodge && player.dodgedDistance < dodgeMaxDistance && player.x >= 0) {
      player.dodgedDistance++
      player.x -= player.dodgedDistance

      if(player.dodgedDistance >= dodgeMaxDistance) {
        player.dodge = false
      }

  } else if (player.right && player.dodge && player.x <= gameBounds.x - 50) {
    player.dodgedDistance++
    player.x += player.dodgedDistance

    if(player.dodgedDistance >= dodgeMaxDistance) {
      player.dodge = false
    }

  }
}
