import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import GolfGameModel from './GolfGameModel'
import MessageModel from './MessageModel'

let PrefGameSex = ['Men Only', 'Women Only', 'Mixed']
export {PrefGameSex}

let GameTypeNames = {
  'Golf': GolfGameModel
}
export {GameTypeNames}

let CollectionGameMap = {
  'GolfGame': GolfGameModel
}

export {CollectionGameMap}

export class GameUser extends FirebaseModel {

  static _firestoreFields = [ 'specialWishes' ]

  // Strings
  specialWishes

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameUser._firestoreFields, GameUser, keepListening, onSuccess, onFailure)
  }
}

export default class GameModel extends FirebaseSubColModel {

  static async getAllOpenGames (onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', false).orderBy('date', 'asc'), GameModel, onFailure)
  }

  async getFirstXMessages (start, limit, onFailure) {
    return await this._getAllFromSubCollectionOrdered('Messages', 'timestamp', 'desc', start, limit, onFailure)
  }

  static _firestoreFields = [
    'competition',
    'international',
    'prefGameSex',
    'specialWishes',
    'prefGroupSize',
    'creator',
    'date',
    'location',
    'inviteOnly',
    'subGame'
  ]

  static _subCollections = {
    'GameUsers': GameUser,
    'Messages': MessageModel
  }

  static collectionName = 'Game'

  // Booleans
  competition
  international
  inviteOnly

  // Strings
  prefGameSex
  specialWishes

  // Integers
  prefGroupSize

  // References
  creator
  subGame

  getCreator () {
    return this.creator.path.substr('Users/'.length)
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
