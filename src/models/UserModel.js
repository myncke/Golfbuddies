import firebase from 'firebase'
import FirebaseModel from './FirebaseModel'

export default class UserModel extends FirebaseModel {

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
