import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import GolfGameModel from './GolfGameModel'
import MessageModel from './MessageModel'
import NotificationModel, { NotificationMessages } from './NotificationModel'
import UserModel from './UserModel'
import FriendshipModel from './FriendshipModel'
import firebase from 'firebase'
import StringUtils from '../utils/StringUtils'

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

  async sendInviteNotification (people) {
    let notification = new NotificationModel()
    notification.message = NotificationMessages.invited + this.title
    notification.seen = false
    notification.link = this.createShowLink()
    notification.receivers = {}
    for (let invite of (people || Object.keys(this.invites))) {
      notification.receivers[invite] = {seen: false, received: true}
    }
    await notification.save()
  }

  canJoin (user) {
    let count = 0
    for (let obj of Object.values(this.invites)) {
      if (obj && obj.accepted) {
        count++
      }
    }
    if (count > this.prefGroupSize) {
      return false
    }
    if (this.prefGameSex === 'Men Only') {
      return user.sex === 'Male'
    } else if (this.prefGameSex === 'Women Only') {
      return user.sex === 'Female'
    } else {
      return true
    }
  }

  static getDefaultRange () {
    let date = new Date()
    date.setDate(date.getDate() - 1)
    let inTwoMonths = new Date()
    inTwoMonths.setMonth(inTwoMonths.getMonth() + 2)
    return {
      start: date,
      end: inTwoMonths
    }
  }

  static async getAllUpcomingGames (onUpdate, onFailure) {
    let result = []
    result.push(GameModel.getAllMyInvitedUpcomingGamesRef())
    result.push(...(await GameModel.getAllUpcomingFriendlyGamesRef(onFailure)))
    result.push(GameModel.getAllMyAcceptedUpcomingGamesRef())
    result.push(GameModel.getAllUpcomingGamesRefByUser((new UserModel())._getDocRef(), onFailure))

    for (let reference of result) {
      GameModel.listenToAllFromFirebase(reference, GameModel, function (modelArray) {
        let range = GameModel.getDefaultRange()
        modelArray.added = modelArray.added.filter(obj => obj.date >= range.start && obj.date < range.end)
        let resultObject = {}
        for (let obj of modelArray.added) {
          resultObject[obj.key] = obj
        }
        modelArray.added = Object.values(resultObject)
        onUpdate(modelArray)
      }, onFailure)
    }
  }

  static async getAllUpcomingOpenGames (onFailure) {
    let range = GameModel.getDefaultRange()
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('inviteOnly', '==', false).where('date', '>=', range.start).where('date', '<', range.end).orderBy('date', 'asc'), GameModel, onFailure)
  }

  static getAllMyInvitedUpcomingGamesRef () {
    return GameModel.getNormalRef(GameModel).where('invites.' + (new UserModel()).key + '.invited', '==', true)
  }

  static getAllMyAcceptedUpcomingGamesRef () {
    return GameModel.getNormalRef(GameModel).where('invites.' + (new UserModel()).key + '.accepted', '==', true)
  }

  static async getAllUpcomingFriendlyGamesRef (onFailure) {
    let friends = await FriendshipModel.getFriendsOfCurrentUser(onFailure)
    console.log(friends)
    let result = []
    for (let friend of friends) {
      result.push(GameModel.getAllUpcomingGamesRefByUser(friend.getFriendRef(), onFailure))
    }
    return result
  }

  static getAllUpcomingGamesRefByUser (userRef, onFailure) {
    let range = GameModel.getDefaultRange()
    return GameModel.getNormalRef(GameModel).where('creator', '==', userRef).where('date', '>=', range.start).where('date', '<', range.end).orderBy('date', 'asc')
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
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('invites.' + (new UserModel()).key + '.invited', '==', true), GameModel, onFailure)
  }

  static async getJoinedGames (onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('invites.' + (new UserModel()).key + '.accepted', '==', true), GameModel, onFailure)
  }

  static async getMyGames (onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('creator', '==', (new UserModel())._getDocRef()), GameModel, onFailure)
  }

  static async getGamesJoinedByUserCreatedByMe (userKey, onFailure) {
    return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('creator', '==', (new UserModel())._getDocRef()).where('invites.' + userKey + '.accepted', '==', true), GameModel, onFailure)
  }

  async getFirstXMessages (start, limit, onFailure) {
    return await this._getAllFromSubCollectionOrdered('Messages', 'timestamp', 'desc', start, limit, onFailure)
  }

  static async swapEmailWithUID (onFailure) {
    let email = StringUtils.reformEmail(firebase.auth().currentUser.email)
    console.log(email)
    let list = await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).where('invites.' + email + '.invited', '==', true), GameModel, onFailure)
    console.log(list)
    for (let obj of list) {
      obj.invites[firebase.auth().currentUser.uid] = obj.invites[email]
      delete obj.invites[email]
      obj.save()
    }
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
    'invites',
    'enddate',
    'carpool',
    'dinner'
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
  carpool = false
  dinner = false

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
  enddate

  // Geopoints
  location

  // Objects
  invites = {}

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameModel._subCollections, GameModel._firestoreFields, GameModel, keepListening, onSuccess, onFailure)
  }
}
