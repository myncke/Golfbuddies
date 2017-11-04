import FirebaseModel from './FirebaseModel'
import UserModel from './UserModel'

export default class FriendshipModel extends FirebaseModel {

  static _firestoreFields = [
    'friends',
    'closeFriend',
    'conversationRef'
  ]

  static collectionName = 'Friendship'

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
   * @return {Promise.<void>}
   */
  static async sendRequest (userKey, closeFriend, onFailure) {
    let myKey = (new UserModel()).key
    let friendship = new FriendshipModel()
    friendship.friends = {}
    friendship.friends[myKey] = true
    friendship.friends[userKey] = false
    friendship.closeFriend = closeFriend
    // TODO: this should be inited or not?
    friendship.conversationRef = undefined
    await friendship.save()
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
    super(key, FriendshipModel._subCollections, FriendshipModel._firestoreFields, FriendshipModel, keepListening, onSuccess, onFailure)
  }
}
