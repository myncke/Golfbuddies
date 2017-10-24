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

  static async getAllGamesWithFilter (filterObject, onFailure) {
    let ref = GameModel.getNormalRef(GameModel)

    for (let key of ['International', 'Competition']) {
      if (filterObject.select && filterObject.select.indexOf(key) >= 0) {
        ref = ref.where(key.toLowerCase(), '==', true)
      }
    }
    if (filterObject.sex) {
      ref = ref.where('prefGameSex', '==', filterObject.sex)
    }

    if (filterObject.group_size && filterObject.group_size !== 0) {
      ref = ref.where('prefGroupSize', '==', filterObject.group_size)
    }

    ref = ref.where('date', '>=', filterObject.start || new Date())

    if (filterObject.end) {
      ref = ref.where('date', '<=', filterObject.end)
    }

    // TODO: add the max handicap

    ref = ref.where('inviteOnly', '==', false)
    ref = ref.orderBy('date', 'asc')
    let list = await GameModel.getAllFromRef(ref, GameModel, onFailure)

    if (!filterObject.select) return list

    let result = []
    for (let game of list) {
      let gGame = await GolfGameModel.getFromRef(game.subGame, GolfGameModel, onFailure)
      console.log(game)
      console.log(gGame)
      let canAdd = true
      for (let gGameKey of ['Buggie', 'Overnight']) {
        if (filterObject.select.indexOf(gGameKey) >= 0) {
          canAdd = gGame[gGameKey.toLowerCase()]
        }
      }
      if (canAdd) {
        result.push(game)
      }
    }
    return result
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
    'subGame',
    'locationString'
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
