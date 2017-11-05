import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import GolfGameModel from './GolfGameModel'
import MessageModel from './MessageModel'
import NotificationModel, { NotificationMessages } from './NotificationModel'
import UserModel from './UserModel'
import FriendshipModel from './FriendshipModel'

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

  createShowLink () {
    return '/event/' + this.key
  }

  async sendInviteNotification () {
    let notification = new NotificationModel()
    notification.message = NotificationMessages.invited + this.title
    notification.seen = false
    notification.link = this.createShowLink()
    notification.receivers = {}
    for (let invite of Object.keys(this.invites)) {
      notification.receivers[invite] = {seen: false, received: true}
    }
    await notification.save()
  }

  static getDefaultRange () {
    let date = new Date()
    let inTwoMonths = new Date()
    inTwoMonths.setMonth(inTwoMonths.getMonth() + 2)
    return {
      start: date,
      end: inTwoMonths
    }
  }

  static async getAllUpcomingGames (onFailure) {
    let result = []
    result.push(...(await GameModel.getAllMyInvitedUpcomingGames(onFailure)))
    result.push(...(await GameModel.getAllUpcomingFriendlyGames(onFailure)))
    return result
  }

  static async getAllUpcomingOpenGames (onFailure) {
    let range = GameModel.getDefaultRange()
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', false).where('date', '>=', range.start).where('date', '<', range.end).orderBy('date', 'asc'), GameModel, onFailure)
  }

  static async getAllMyInvitedUpcomingGames (onFailure) {
    let range = GameModel.getDefaultRange()
    let list = await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('invites.' + (new UserModel()).key + '.invited', '==', true), GameModel, onFailure)
    list = list.filter(obj => obj.date >= range.start && obj.date < range.end)
    console.log(list)
    list.sort((a, b) => b.date - a.date)
    console.log(list)
    return list
  }

  static async getAllUpcomingFriendlyGames (onFailure) {
    let friends = await FriendshipModel.getFriendsOfCurrentUser(onFailure)
    console.log(friends)
    let result = []
    for (let friend of friends) {
      result.push(...(await GameModel.getAllUpcomingGamesByUser(friend.getFriendRef(), onFailure)))
    }
    return result
  }

  static async getAllUpcomingGamesByUser (userRef, onFailure) {
    let range = GameModel.getDefaultRange()
    return (await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', false).where('creator', '==', userRef).where('date', '>=', range.start).where('date', '<', range.end).orderBy('date', 'asc'), GameModel, onFailure))
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

  static async getInvitedGames (onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', true).where('invites.' + (new UserModel()).key + '.invited', '==', true), GameModel, onFailure)
  }

  static async getJoinedGames (onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', true).where('invites.' + (new UserModel()).key + '.accepted', '==', true), GameModel, onFailure)
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
    'locationString',
    'title',
    'invites'
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
  title

  // Integers
  prefGroupSize

  // Objects
  invites = {}

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

  // Objects
  invites = {}

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameModel._subCollections, GameModel._firestoreFields, GameModel, keepListening, onSuccess, onFailure)
  }
}
