import { abilityPlacementList } from '../../../../config'

export default (playerX, playerY, playerID, App, resources, socket, enemy) => {
  if(enemy.ready && !enemy.dead) {
    const spike = new PIXI.Sprite(resources.redSpike.texture)
    spike.x = playerX
    spike.y = playerY
    spike.lifeTime = 0
    spike.deadly = false
    spike.fallingSpeed = 0
    spike.isFalling = false
    if(playerID){
      socket.emit('abilityPlaced', {id:playerID,x:spike.x, y:spike.y})
    }
    App.stage.addChild(spike)
    abilityPlacementList.push(spike)
  }
}
