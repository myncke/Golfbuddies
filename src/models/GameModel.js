import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'

export class GameUser extends FirebaseModel {

  static _firestoreFields = [
    'specialWishes'
  ]

  // Strings
  specialWishes

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameUser._firestoreFields, GameUser, keepListening, onSuccess, onFailure)
  }
}

export default class GameModel extends FirebaseSubColModel {

  static _firestoreFields = [
    'competition',
    'international',
    'prefGameSex',
    'specialWishes',
    'prefGroupSize',
    'creator',
    'date',
    'location'
  ]

  static _subCollections = {
    'GameUsers': GameUser
  }

  static collectionName = 'Game'

  // Booleans
  competition
  international

  // Strings
  prefGameSex
  specialWishes

  // Integers
  prefGroupSize

  // References
  creator

  getCreator () {
    return this.creator.split('/Users/')[1]
  }

  /**
   * Set the value of creator
   * @param user = UserModel to which we make a reference
   */
  setCreator (user) {
    if (typeof user === 'string') {
      this.creator.path = 'Users/' + user
    } else {
      this.creator.path = 'Users/' + user.key
    }
  }

  // Timestamps
  date

  // Geopoints
  location

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameModel._subCollections, GameModel._firestoreFields, GameModel, keepListening, onSuccess, onFailure)
  }
}
