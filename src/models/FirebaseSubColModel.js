
import FirebaseModel from './FirebaseModel'

export default class FirebaseSubColModel extends FirebaseModel {
  subCollectionMap
  subCollectionResult = {}

  constructor (key, subCollectionMap, firebaseParams, modelClass, keepListening, onSuccess, onFailure) {
    super(key, firebaseParams, modelClass, keepListening, onSuccess, onFailure)
    this.subCollectionMap = subCollectionMap
  }

  initSubcollection (key, onSuccess, onFailure) {
    this._getAllFromSubCollectionFirebase(key, onSuccess, onFailure)
  }

  /**
   * Gets all the models of a docs subcollections from firebase
   * @param onSuccess = function(List<Model>)
   * @param onFailure = function(errorMessage)
   * @private
   */
  _getAllFromSubCollectionFirebase (key, onSuccess, onFailure) {
    let result = []
    this._getDocRef().collection(key).get().then(
      snapShot => {
        snapShot.forEach(
          doc => {
            FirebaseModel._mapFields(this.subCollectionMap[key], undefined, doc, model => {
              result.push(model)
            }, error => {
              console.log(error)
              onFailure(error)
            })
          }
        )
        this.subCollectionResult[key] = result
        onSuccess(this.subCollectionResult[key])
      },
      error => onFailure(error)
    )
  }
}
