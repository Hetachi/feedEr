import { defaultVelocity, gameBounds, gameRate, abilityCoolDown, abilityPlacementList, abilityNotDeadlyCoolDown} from '../../../config'
import handleJump from '../atoms/handleJump'
import handleDodge from '../atoms/handleDodge'
import abilityUse from '../atoms/abilityUse'
import hitRegistration from '../atoms/hitRegistration'

export default (delta, player, App, resources, socket, enemy) => {
    if(player.y < gameBounds.y - 50 && !player.jump && player.isFalling && !player.dead && !enemy.dead && player.ready && enemy.ready) {

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

    if(player.left && player.x >= 0) {
      player.x -= (+1 * gameRate)
    }

    if(player.right && player.x <= gameBounds.x - 50) {
      player.x -= (-1 * gameRate)
    }

    if(player.abilityCoolDown === 0 && player.plantedSpike) {
      abilityUse(player.x, player.y, player.id, App, resources, socket, enemy)
      player.abilityCoolDown++
    }

    else if (player.plantedSpike) {
      if(player.abilityCoolDown < abilityCoolDown) {
        player.abilityCoolDown++
        document.getElementById('skillCooldownProgress').value = player.abilityCoolDown
      }
      else {
        player.abilityCoolDown = 0
        player.plantedSpike = false
      }
    }

    abilityPlacementList.map( spike => {
      if(spike.lifeTime > abilityNotDeadlyCoolDown) {
        spike.deadly = true
        spike.isFalling = true
      } else {
        spike.lifeTime++
      }

      if(spike.y < gameBounds.y - 50 && spike.isFalling) {

        var tempSpikeY = spike.y
        tempSpikeY -= -spike.fallingSpeed
        if(tempSpikeY >= gameBounds.y - 50) {
          tempSpikeY = gameBounds.y - 50
        }
        spike.y = tempSpikeY

        if(spike.fallingSpeed <= 3) {
          spike.fallingSpeed++
        }
      }

      if(hitRegistration(spike, player) && spike.deadly) {
        socket.emit('playerDied', player.id)
      }
    })
}
