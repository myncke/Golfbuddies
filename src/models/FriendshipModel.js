import FirebaseModel from './FirebaseModel'
import UserModel from './UserModel'
import ConversationGroupModel from './ConversationGroupModel'
import NotificationModel, { NotificationMessages } from './NotificationModel'

export default class FriendshipModel extends FirebaseModel {

  static _firestoreFields = [
    'friends',
    'closeFriend',
    'conversationRef'
  ]

  static collectionName = 'Friendship'

  async sendNotification (toModel, fromModel) {
    let notification = new NotificationModel()
    notification.message = NotificationMessages.friendRequest + fromModel.firstName + ' ' + fromModel.lastName
    notification.seen = false
    notification.link = '/profile/' + fromModel.key
    notification.receivers = {}
    notification.receivers[toModel.key] = {seen: false, received: true}
    console.log('SAVING NOTIF')
    await notification.save()
    console.log('SAVED NOTIF: ', notification)
  }

  async initConversationModel (onFailure) {
    let conversationModel = new ConversationGroupModel()
    let name = ''
    conversationModel.participants = {}
    for (let friend of Object.keys(this.friends)) {
      conversationModel.participants[friend] = true
      let friendModel = await UserModel.getFromRef((new UserModel(friend))._getDocRef(), UserModel, onFailure)
      name += friendModel.nickname + ' - '
    }
    name = name.substr(0, name.length - 3)
    conversationModel.name = name
    await conversationModel.save()
    this.conversationRef = conversationModel._getDocRef()
  }

  static async getFriendsOfCurrentUser (onFailure) {
    let ref = FriendshipModel.getNormalRef(FriendshipModel).where('friends.' + (new UserModel()).key, '==', true)
    return await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure)
  }

  static async getFriendRequests (onFailure) {
    let ref = FriendshipModel.getNormalRef(FriendshipModel).where('friends.' + (new UserModel()).key, '==', false)
    return await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure)
  }

  async getFriend (onFailure) {
    return await UserModel.getFromRef(this.getFriendRef(), UserModel, onFailure)
  }

  static async getFriendship (user1, user2, onFailure) {
    return (await FriendshipModel.getAllFromRef(FriendshipModel.getNormalRef(FriendshipModel)
      .where('friends.' + user1, '==', true)
      .where('friends.' + user2, '==', true), FriendshipModel, onFailure))[0]
  }

  static async hasSentFriendship (user1, user2, onFailure) {
    let mutual = (await FriendshipModel.getFriendship(user1, user2, onFailure))
    let oneWay = (await FriendshipModel.getAllFromRef(FriendshipModel.getNormalRef(FriendshipModel).where('friends.' + user1, '==', false).where('friends.' + user2, '==', true), FriendshipModel, onFailure))[0]
    return mutual || oneWay
  }

  getFriendRef () {
    for (let key of Object.keys(this.friends)) {
      if (key !== (new UserModel()).key) {
        return (new UserModel(key))._getDocRef()
      }
    }
  }

  isMutualFriend () {
    for (let key of Object.keys(this.friends)) {
      if (this.friends[key] === false) {
        return false
      }
    }
    return true
  }

  /**
   * Sends a friendRequest to the specified user (with key === userKey)
   * @param userKey String
   * @param closeFriend Boolean
   * @param onFailure
   * @return {Promise.<FriendshipModel>}
   */
  static async sendRequest (userKey, closeFriend, onFailure) {
    let myKey = (new UserModel()).key
    let friendship = new FriendshipModel()
    friendship.friends = {}
    friendship.friends[myKey] = true
    friendship.friends[userKey] = false
    friendship.closeFriend = closeFriend || false
    await friendship.initConversationModel(onFailure)
    await friendship.save()
    console.log(friendship)
    return friendship
  }

  // Booleans
  closeFriend

  // Object

  /**
   * This is an object with keys: UserModel Keys
   * and values: true == is friend or sent the request || false == received the request, but didn't accept yet.
   */
  friends

  // References
  conversationRef

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, FriendshipModel._firestoreFields, FriendshipModel, keepListening, onSuccess, onFailure)
  }
}
