import FirebaseModel from './FirebaseModel'

export default class GolfUserModel extends FirebaseModel {

  static _firestoreFields = [
    'hdc',
    'federaalNummer',
    'userKey'
  ]

  static collectionName = 'GolfUser'

  // Integers
  hdc

  // References
  userKey

  getUserKey () {
    return this.userKey.path.substr('Users/'.length)
  }

  /**
   * Set the value of userKey
   * @param user = UserModel to which we make a reference
   */
  setUserKey (user) {
    if (typeof user === 'string') {
      this.userKey.path = 'Users/' + user
    } else {
      this.userKey.path = 'Users/' + user.key
    }
  }

  // Strings
  federaalNummer

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GolfUser._subCollections, GolfUser._firestoreFields, GolfUser, keepListening, onSuccess, onFailure)
  }
}
