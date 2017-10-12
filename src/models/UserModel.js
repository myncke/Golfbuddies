import firebase from 'firebase'
require('firebase/firestore')
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
   * No-key constructor gets the current User's model
   */
  constructor (key, keepListening, onSuccess, onFailure) {
    // super(key || firebase.auth().currentUser.uid)
    super(key)
    if (keepListening !== undefined && onSuccess !== undefined && onFailure !== undefined) {
      keepListening ? this._listenToFirebase(onSuccess, onFailure) : this._getOnceFromFirebase(onSuccess, onFailure)
    }
  }

  _getDocRef () {
    return firebase.firestore().collection('Users').doc(this.key)
  }

  _getOnceFromFirebase (onSuccess, onFailure) {
    this._getDocRef().get()
      .then(doc => UserModel._mapFields(this, doc, onSuccess, onFailure))
      .catch(error => onFailure(error))
  }

  _listenToFirebase (onSuccess, onFailure) {
    this._getDocRef().get().onSnapshot(doc => UserModel._mapFields(this, doc, onSuccess, onFailure))
  }

  // TODO this can be simplified with reflection
  static _mapFields (object, doc, onSuccess, onFailure) {
    if (doc.exists) {
      let model = object || new UserModel(doc.id)
      let data = doc.data()
      for (let field of UserModel._firestoreFields) {
        model[field] = data[field]
      }
      console.log('Made an object: ' + model.toString())
      onSuccess(model)
    } else {
      onFailure('Something went wrong, we couldn\'t find the document')
    }
  }

  static getAllFromFirebase (onSuccess, onFailure) {
    let result = []
    firebase.firestore().collection('Users').get().then(
      snapShot => snapShot.forEach(
        doc => result.push(UserModel._mapFields(undefined, doc, onSuccess, onFailure))
      )
    )
    return result
  }

  toJson () {
    let json = {}
    for (let field of UserModel.firestoreFields) {
      json[field] = this[field]
    }
    return json
  }

  save (onSuccess, onFailure) {
    this._getDocRef().set(this.toJson()).then(onSuccess()).catch(error => onFailure(error))
  }

}
