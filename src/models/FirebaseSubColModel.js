
import FirebaseModel from './FirebaseModel'

export default class FirebaseSubColModel extends FirebaseModel {
  subCollectionMap
  subCollectionResult = {}

  constructor (key, subCollectionMap, firebaseParams, modelClass, keepListening, onSuccess, onFailure) {
    super(key, firebaseParams, modelClass, keepListening, onSuccess, onFailure)
    this.subCollectionMap = subCollectionMap
  }

  async initSubcollection (key, onFailure) {
    return this._getAllFromSubCollectionFirebase(key, onFailure)
  }

  /**
   * Gets all the models of a docs subcollections from firebase
   * @param key = the collection key
   * @param onFailure = function(errorMessage)
   * @private
   */
  async _getAllFromSubCollectionFirebase (key, onFailure) {
    let result = []
    try {
      let snapShot = await this._getDocRef().collection(key).get()
      snapShot.forEach(
        doc => {
          result.push(FirebaseModel._mapFields(this.subCollectionMap[key], undefined, doc, onFailure))
        }
      )
    } catch (error) {
      onFailure(error)
    }
    this.subCollectionResult[key] = result
    return this.subCollectionResult[key]
  }
}
