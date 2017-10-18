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
    // key === undefined || key === null ? this.key = uuidv1() : this.key = key
    this.key = key || uuidv1()
    console.log('KEY: ' + this.key)
    this.firebaseParams = firebaseParams
    this.modelClass = modelClass
    if (typeof keepListening === 'boolean' && typeof onSuccess === 'function' && typeof onFailure === 'function') {
      keepListening ? this._listenToFirebase(onSuccess, onFailure) : this._getOnceFromFirebase(onFailure).then(onSuccess)
    }
  }

  /**
   * Make the correct reference to the doc with our key
   * @returns {firebase.firestore.DocumentReference}
   */
  _getDocRef () {
    return firebase.firestore().collection(this.modelClass.collectionName).doc(this.key)
  }

  /**
   * Make a doc or collection reference
   * @param collection
   * @param key
   * @return {*}
   */
  makeDoc (collection, key) {
    if (key === undefined) {
      return firebase.firestore().collection(collection)
    }
    return firebase.firestore().collection(collection).doc(key)
  }

    /** Only get the model once from firebase
   * onFailure = function(errorMessage:String)
     * @return {Promise<model>}
   **/
  async _getOnceFromFirebase (onFailure) {
    try {
      let doc = await this._getDocRef().get()
      return FirebaseModel._mapFields(this.modelClass, this, doc, onFailure)
    } catch (error) {
      onFailure(error)
    }
  }

  /** Keep listening for changes to the model
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  _listenToFirebase (onSuccess, onFailure) {
    this._getDocRef().get().onSnapshot(doc => onSuccess(FirebaseModel._mapFields(this.modelClass, this, doc, onFailure)))
  }

  /** Map the firebase object to our own object
   * object = the object we want to map the fields on
   * doc = the documentSnapshot that we have to translate
   * onFailure = function(errorMessage:String)
   * @return {model}
   **/
  static _mapFields (ModelClass, object, doc, onFailure) {
    if (doc.exists) {
      let model = object || new ModelClass(doc.id)
      let data = doc.data()
      for (let field of ModelClass._firestoreFields) {
        model[field] = data[field]
      }
      console.log('Made an object: ')
      console.log(model)
      return model
    } else {
      onFailure('Something went wrong, we couldn\'t find the document')
    }
  }

  /**
   * Gets all the models of the collectionName from firebase
   * @param modelClass = {Class of a model}
   * @param onFailure = {function(errorMessage)}
   * @return {Promise.<Array>}
   */
  static async getAllFromFirebase (modelClass, onFailure) {
    return await FirebaseModel.getAllFromRef(FirebaseModel.getNormalRef(modelClass), modelClass, onFailure)
  }

  /**
   * Gets a normal ref to the collection of the given modelClass
   * @param modelClass
   * @returns {firebase.firestore.CollectionReference}
   */
  static getNormalRef (modelClass) {
    return firebase.firestore().collection(modelClass.collectionName)
  }

  static async getFromRef (ref, modelClass, onFailure) {
    let doc = await ref.get()
    return FirebaseModel._mapFields(modelClass, undefined, doc, onFailure)
  }

  /**
   * Gets all the objects from the database from the collection given by ref
   * @param ref = reference to the db
   * @param modelClass = class to instantiate
   * @param onFailure = function(error)
   * @return {Promise.<Array>}
   */
  static async getAllFromRef (ref, modelClass, onFailure) {
    let result = []
    try {
      let snapShot = await ref.get()
      snapShot.forEach(
        doc => {
          console.log(doc)
          result.push(FirebaseModel._mapFields(modelClass, undefined, doc, onFailure))
        }
      )
    } catch (error) {
      console.log(error)
      onFailure(error)
    }
    return result
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
   * @return {Promise<void>}
   */
  async save () {
    return await this._getDocRef().set(this._toJson())
  }

  /**
   * Deletes the current object from the firestore database
   * @return {Promise<void>}
   */
  async deleteObject () {
    return await this._getDocRef().delete()
  }
}
export default FirebaseModel

function NotImplementedError (message) {
  this.name = 'NotImplementedError'
  this.message = (message || 'NOT YET IMPLEMENTED')
}
NotImplementedError.prototype = Error.prototype
