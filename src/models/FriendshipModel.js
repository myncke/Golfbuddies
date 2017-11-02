import FirebaseModel from './FirebaseModel'
import UserModel from './UserModel'

export default class FriendshipModel extends FirebaseModel {

  static _firestoreFields = [
    'userKey1',
    'userKey2',
    'closeFriend',
    'conversationRef'
  ]

  static collectionName = 'Friendship'

  static async getFriendsOfCurrentUser (onFailure) {
    let ref = FriendshipModel.getNormalRef(FriendshipModel)
    let ref2 = ref
    ref = ref.where('userKey1', '==', (new UserModel())._getDocRef())
    ref2 = ref2.where('userKey2', '==', (new UserModel())._getDocRef())
    let list = await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure)
    list.push(...(await FriendshipModel.getAllFromRef(ref2, FriendshipModel, onFailure)))
    console.log(await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure))
    console.log(await FriendshipModel.getAllFromRef(ref2, FriendshipModel, onFailure))
    return list
  }

  async getFriend (onFailure) {
    return await UserModel.getFromRef(this.getFriendRef(), UserModel, onFailure)
  }

  getFriendRef () {
    if (this.userKey1 === (new UserModel()).key) {
      return this.userKey2
    } else {
      return this.userKey1
    }
  }

  // Booleans
  closeFriend

  // Strings
  userKey1
  userKey2

  getUser1 () {
    return this.makeDoc('Users', this.userKey1)
  }

  getUser2 () {
    return this.makeDoc('Users', this.userKey2)
  }

  // References
  conversationRef

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, FriendshipModel._subCollections, FriendshipModel._firestoreFields, FriendshipModel, keepListening, onSuccess, onFailure)
  }
}
