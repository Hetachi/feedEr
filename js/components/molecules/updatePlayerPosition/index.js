import { DEBUG_ENABLED } from '../../../../config'

export default (data) => {
  const coords = {
    x: data.player.x,
    y: data.player.y
  }
  data.socket.emit('updatePlayerLocation', coords)
}
