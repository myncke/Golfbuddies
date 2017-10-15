import FirebaseModel from './FirebaseModel'
import firebase from 'firebase'

export default class FriendshipModel extends FirebaseModel {

  static _firestoreFields = [
    'userKey1',
    'userKey2',
    'closeFriend'
  ]

  static collectionName = 'Friendship'

  static async getFriendsOfCurrentUser (onFailure) {
    let ref = FriendshipModel.getNormalRef(FriendshipModel)
    let ref2 = ref
    ref.where('userKey1', '==', firebase.auth().uid)
    ref2.where('userKey2', '==', firebase.auth().uid)
    let list = await FriendshipModel.getAllFromRef(ref, FriendshipModel, onFailure)
    list.push(...(await FriendshipModel.getAllFromRef(ref2, FriendshipModel, onFailure)))
  }

  // Booleans
  closeFriend

  // Strings
  userKey1
  userKey2

  getUser1 () {
    return this.userKey1.path.substr('Users/'.length)
  }

  getUser2 () {
    return this.userKey2.path.substr('Users/'.length)
  }

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, FriendshipModel._subCollections, FriendshipModel._firestoreFields, FriendshipModel, keepListening, onSuccess, onFailure)
  }
}
