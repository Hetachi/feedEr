import { defaultVelocity, gameBounds } from '../../../config'

export default (delta, gameObjectList ) => {
  gameObjectList.map(gameObject => {
    if(gameObject.y <= gameBounds.y - 50 && !gameObject.jump) {
      gameObject.y -= -defaultVelocity
    }
    // JUMPING OF OBJECTS --- COULD BE USEFUL -- TESTED AND WORKING!
    // else if(gameObject.jump) {
    //   if(gameObject.jump < 10) {
    //     gameObject.jump++
    //     gameObject.y -= +10
    //   } else if(gameObject.jump) {
    //     gameObject.jump = false
    //   }
    // }
  })
}
