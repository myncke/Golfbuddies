import firebase from 'firebase'
require('firebase/firestore')

const uuidv1 = require('uuid/v1')

/**
 * Contains some methods each model that is stored in firestore should contain and the documentation about them.
 */
class FirebaseModel {

  // Key of the model
  key
  firebaseParams
  modelClass

  static collectionName = ''

  /**
   * Make a model and init it with the data from firebase.
   * Should contain a call to _listenToFirebase if keepListening == true
   * or a call to _getOnceFromFirebase if keepListening == false
   * @param key = the unique id of the model
   * @param firebaseParams = parameters that are stored in firebase
   * @param modelClass = Class of the object we're modeling
   * @param keepListening = if you want to keep listening to updates
   * @param onSuccess = function(model:FirebaseModel)
   * @param onFailure = function(errorMessage:String)
   */
  constructor (key, firebaseParams, modelClass, keepListening, onSuccess, onFailure) {
    key === undefined ? this.key = uuidv1() : this.key = key
    this.key = key
    this.firebaseParams = firebaseParams
    this.modelClass = modelClass
    if (typeof keepListening === 'boolean' && typeof onSuccess === 'function' && typeof onFailure === 'function') {
      keepListening ? this._listenToFirebase(onSuccess, onFailure) : this._getOnceFromFirebase(onSuccess, onFailure)
    }
  }

  /**
   * Make the correct reference to the doc with our key
   * @returns {firebase.firestore.DocumentReference}
   */
  _getDocRef () {
    return firebase.firestore().collection(this.modelClass.collectionName).doc(this.key)
  }

    /** Only get the model once from firebase
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  _getOnceFromFirebase (onSuccess, onFailure) {
    this._getDocRef().get()
      .then(
        doc => FirebaseModel._mapFields(this.modelClass, this, doc, onSuccess, onFailure),
        error => onFailure(error)
      )
  }

  /** Keep listening for changes to the model
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  _listenToFirebase (onSuccess, onFailure) {
    this._getDocRef().get().onSnapshot(doc => FirebaseModel._mapFields(this.modelClass, this, doc, onSuccess, onFailure))
  }

  /** Map the firebase object to our own object
   * object = the object we want to map the fields on
   * doc = the documentSnapshot that we have to translate
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  static _mapFields (ModelClass, object, doc, onSuccess, onFailure) {
    if (doc.exists) {
      let model = object || new ModelClass(doc.id)
      let data = doc.data()
      for (let field of ModelClass._firestoreFields) {
        model[field] = data[field]
      }
      console.log('Made an object: ')
      console.log(model)
      onSuccess(model)
    } else {
      onFailure('Something went wrong, we couldn\'t find the document')
    }
  }

  /**
   * Gets all the models of the collectionName from firebase
   * @param modelClass = Class of a model
   * @param onSuccess = function(list<FirebaseModel>)
   * @param onFailure = function(errorMessage)
   */
  static getAllFromFirebase (modelClass, onSuccess, onFailure) {
    FirebaseModel.getAllFromRef(FirebaseModel.getNormalRef(modelClass), modelClass, onSuccess, onFailure)
  }

  /**
   * Gets a normal ref to the collection of the given modelClass
   * @param modelClass
   * @returns {firebase.firestore.CollectionReference}
   */
  static getNormalRef (modelClass) {
    return firebase.firestore().collection(modelClass.collectionName)
  }

  /**
   * Gets all the objects from the database from the collection given by ref
   * @param ref = reference to the db
   * @param modelClass = class to instantiate
   * @param onSuccess = function(list<modelClass>)
   * @param onFailure = function(error)
   */
  static getAllFromRef (ref, modelClass, onSuccess, onFailure) {
    let result = []
    ref.get().then(
      snapShot => {
        snapShot.forEach(
          doc => FirebaseModel._mapFields(modelClass, undefined, doc, onSuccess, onFailure)
        )
        onSuccess(result)
      },
      error => onFailure(error)
    )
  }

  /**
   * Makes the correct json format to store in firestore
   */
  _toJson () {
    let json = {}
    if (this.firebaseParams !== undefined) {
      for (let field of this.firebaseParams) {
        json[field] = this[field]
      }
    }
    return json
  }

  /**
   * Tries to save this object to firestore.
   * TODO: think about having validations in here
   * @param onSuccess = function()
   * @param onFailure = function(errorMessage:String)
   */
  save (onSuccess, onFailure) {
    this._getDocRef().set(this._toJson()).then(onSuccess(), error => onFailure(error))
  }

  deleteObject (onSuccess, onFailure) {
    this._getDocRef().delete().then(onSuccess, error => onFailure(error))
  }
}
export default FirebaseModel

function NotImplementedError (message) {
  this.name = 'NotImplementedError'
  this.message = (message || 'NOT YET IMPLEMENTED')
}
NotImplementedError.prototype = Error.prototype
