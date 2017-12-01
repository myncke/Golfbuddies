import FirebaseModel from './FirebaseModel'

export default class GolfGameModel extends FirebaseModel {

  canJoin (golfUser) {
    return parseFloat((golfUser.hdc).replace('A', '').replace('I', '')) <= this.minHdc
  }

  static _firestoreFields = [
    'buggie',
    'overnight',
    'minHdc',
    'roundPrice',
    'gameKey'
  ]

  static collectionName = 'GolfGame'

  // Booleans
  buggie
  overnight

  // Integers
  minHdc
  roundPrice = 0

  // References
  gameKey

  getGameKey () {
    return this.gameKey.path.substr('Game/'.length)
  }

  /**
   * Set the value of gameKey
   * @param user = UserModel to which we make a reference
   */
  setGameKey (game) {
    if (typeof game === 'string') {
      this.gameKey.path = 'Game/' + game
    } else {
      this.gameKey.path = 'Game/' + game.key
    }
  }

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GolfGameModel._firestoreFields, GolfGameModel, keepListening, onSuccess, onFailure)
  }
}
