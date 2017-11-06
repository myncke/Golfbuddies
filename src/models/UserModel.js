import firebase from 'firebase'
import FirebaseModel from './FirebaseModel'
import StringUtils from '../utils/StringUtils'
import MessageHandler from '../utils/MessagingHandler'

let sexes = ['Male', 'Female']
export {sexes}

export default class UserModel extends FirebaseModel {

  static signUpAndIn (email, password, onSuccess, onFailure) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(
            () => onSuccess(),
            error => onFailure(error)
          )
      }, error => onFailure(error))
  }

  static async searchUser (input, onFailure) {
    return await this.getAllFromRef(this.getNormalRef(UserModel).where('nickname', '>=', input.toLowerCase()).where('nickname', '<', StringUtils.makeLexiNext(input).toLowerCase()), UserModel, onFailure)
  }

  async addDeviceToken () {
    let ref = this._getDocRef().collection('NotificationInfo').doc('deviceGroups')
    let object = await ref.get()
    let array = object.data().tokens
    console.log(MessageHandler.token)
    array = array.filter(obj => obj !== MessageHandler.token)
    array.push(MessageHandler.token)
    await ref.set({
      tokens: array
    })
  }

  async deleteDeviceToken () {
    let ref = this._getDocRef().collection('NotificationInfo').doc('deviceGroups')
    let object = await ref.get()
    let array = object.data().tokens
    console.log(MessageHandler.token)
    array = array.filter(obj => obj !== MessageHandler.token)
    await ref.set({
      tokens: array
    })
  }

  static _firestoreFields = [
    'firstName',
    'lastName',
    'nickname',
    'nationality',
    'region',
    'sex',
    'birthdate'
  ]

  static collectionName = 'Users'

  // Booleans
  /**
   * Only used for signing up/in with social logins
   * @type {boolean}
   */
  isInited = false

  // Strings
  firstName
  lastName
  nickname
  nationality
  region
  sex

  // Integers

  // References

  // Timestamps
  birthdate

  // Geopoints

  /**
   * Constructor with currentUser == True, gets the current User's model
   * Otherwise it's a normal constructor
   * @param key = String
   * @param keepListening = Bool
   * @param onSuccess = function(model)
   * @param onFailure = function(error)
   */
  constructor (key, keepListening, onSuccess, onFailure) {
    super(key || firebase.auth().currentUser.uid, UserModel._firestoreFields, UserModel, keepListening, onSuccess, onFailure)
  }
}
