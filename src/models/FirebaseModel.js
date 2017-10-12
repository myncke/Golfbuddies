/**
 * The reference to the database, used when we want to edit references in the database
 */
const DATABASE_REF = 'firestore.googleapis.com/project/golfbuddies-ef806/database/(default)/documents/'
export {DATABASE_REF}

/**
 * Contains some methods each model that is stored in firestore should contain and the documentation about them.
 */
class FirebaseModel {

  // Key of the model
  key

  /**
   * Make an empty object
   * @param key = the unique id of the model
   */
  constructor (key) {
    this.key = key
  }

  /**
   * Make a model and init it with the data from firebase.
   * Should contain a call to _listenToFirebase if keepListening == true
   * or a call to _getOnceFromFirebase if keepListening == false
   * @param key = the unique id of the model
   * @param keepListening = if you want to keep listening to updates
   * @param onSuccess = function(model:FirebaseModel)
   * @param onFailure = function(errorMessage:String)
   */
  /* constructor(key, keepListening, onSuccess, onFailure) {
    this.key = key
    //keepListening ? this._listenToFirebase(onSuccess,onFailure) : this._getOnceFromFirebase(onSuccess, onFailure)
  } */

    /** Only get the model once from firebase
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  _getOnceFromFirebase (onSuccess, onFailure) {
    throw NotImplementedError()
  }

  /** Keep listening for changes to the model
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  _listenToFirebase (onSuccess, onFailure) {
    throw NotImplementedError()
  }

  /** Map the firebase object to our own object
   * object = the object we want to map the fields on
   * doc = the documentSnapshot that we have to translate
   * onSucces = function(model:FirebaseModel)
   * onFailure = function(errorMessage:String)
   **/
  static _mapFields (object, doc, onSuccess, onFailure) {
    throw NotImplementedError()
  }

  /**
   * Gets all the models of this kind from firebase
   * @param onSuccess = function(list<FirebaseModel>)
   * @param onFailure = function(errorMessage)
   */
  static _getAllFromFirebase (onSuccess, onFailure) {
    throw NotImplementedError()
  }

  /**
   * Makes the correct json format to store in firestore
   */
  _toJson () {
    throw NotImplementedError()
  }

  /**
   * Tries to save this object to firestore.
   * TODO: think about having validations in here
   * @param onSuccess = function()
   * @param onFailure = function(errorMessage:String)
   */
  save (onSuccess, onFailure) {
    throw NotImplementedError()
  }
}

function NotImplementedError (message) {
  this.name = 'NotImplementedError'
  this.message = (message || 'NOT YET IMPLEMENTED')
}
NotImplementedError.prototype = Error.prototype

export default FirebaseModel
