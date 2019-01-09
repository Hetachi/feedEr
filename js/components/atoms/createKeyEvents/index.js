import keyboardEvents from '../../../keyboardEvents'

export default (player) => {
  const jump = keyboardEvents(32)
  const left = keyboardEvents(65)
  const right = keyboardEvents(68)
  const spawnMob = keyboardEvents(81)
  const dodge = keyboardEvents(16)
  const plantSpike = keyboardEvents(70)

  jump.press = () => {
    if(!player.jump && player.y > 50) {
      player.jumpVelocity = 20
      player.fallingSpeed = 0
      player.jump = true
    }
  }

  left.press = () => {
    player.left = true
  }

  left.release = () => {
    player.left = false
  }

  right.press = () => {
    player.right = true
  }

  right.release = () => {
    player.right = false
  }

  dodge.press = () => {
    player.dodgedDistance = 0
    player.dodge = true
  }

  dodge.release = () => {
    player.dodge = false
  }

  plantSpike.press = () => {
    player.plantedSpike = true
  }
}
