import FirebaseModel from './FirebaseModel'

export default class FriendshipModel extends FirebaseModel {

  static _firestoreFields = [
    'userKey1',
    'userKey2',
    'closeFriend'
  ]

  static collectionName = 'Friendship'

  static async getFriendsOfCurrentUser (onFailure) {
    let ref = FriendshipModel.getNormalRef(FriendshipModel)
    return await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure)
  }

  // Booleans
  closeFriend

  // References
  userKey1
  userKey2

  getUser1 () {
    return this.userKey1.path.substr('Users/'.length)
  }

  /**
   * Set the value of user1
   * @param user = UserModel to which we make a reference
   */
  setUser1 (user) {
    if (typeof user === 'string') {
      this.userKey1.path = 'Users/' + user
    } else {
      this.userKey1.path = 'Users/' + user.key
    }
  }

  getUser2 () {
    return this.userKey2.path.substr('Users/'.length)
  }

  /**
   * Set the value of user2
   * @param user = UserModel to which we make a reference
   */
  setUser2 (user) {
    if (typeof user === 'string') {
      this.userKey2.path = 'Users/' + user
    } else {
      this.userKey2.path = 'Users/' + user.key
    }
  }

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, FriendshipModel._subCollections, FriendshipModel._firestoreFields, FriendshipModel, keepListening, onSuccess, onFailure)
  }
}
