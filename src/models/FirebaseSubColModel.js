
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

  setSubcollection (list, key) {
    this.subCollectionResult[key] = list
  }

  /**
   * Add a model to a subcollection of this model
   * @param key
   * @param model
   * @param onFailure
   * @return {Promise.<void>}
   */
  async addSubcollectionDoc (key, model, onFailure) {
    try {
      return this._getDocRef().collection(key).doc(model.key).set(model._toJson())
    } catch (error) {
      onFailure(error)
      throw error
    }
  }

  /**
   * Gets all the models of a docs subcollections from firebase
   * @param key = the collection key
   * @param onFailure = function(errorMessage)
   * @private
   */
  async _getAllFromSubCollectionFirebase (key, onFailure) {
    this.subCollectionResult[key] = await this._getAllFromRefFirebase(this._getDocRef().collection(key), key, onFailure)
    return this.subCollectionResult[key]
  }

  /**
   *
   * @param ref
   * @param key
   * @param onSuccess
   * @param onFailure
   * @return undefined
   * @private
   */
  _listenToSubColRef (ref, key, onSuccess, onFailure) {
    ref.onSnapshot(collection => {
      let result = []
      for (let doc of collection.docs) {
        result.push(FirebaseModel._mapFields(this.subCollectionMap[key], undefined, doc, onFailure))
      }
      onSuccess(result)
    })
  }

  async _getAllFromRefFirebase (ref, key, onFailure) {
    let result = []
    try {
      console.log('MODELCLASS:')
      console.log(this.subCollectionMap[key])
      let snapShot = await ref.get()
      snapShot.forEach(
        doc => {
          result.push(FirebaseModel._mapFields(this.subCollectionMap[key], undefined, doc, onFailure))
        }
      )
    } catch (error) {
      onFailure(error)
    }
    return result
  }

  addRefOptions (ref, orderField, order, startAt, limit) {
    if (orderField !== undefined) {
      ref = ref.orderBy(orderField, order)
    }
    if (startAt !== undefined) {
      ref = ref.startAt(startAt)
    }
    if (limit !== undefined) {
      ref = ref.limit(limit)
    }
    return ref
  }

  async _getAllFromSubCollectionOrdered (key, orderField, order, startAt, limit, onFailure) {
    let ref = this._getDocRef().collection(key)
    ref = this.addRefOptions(ref, orderField, order, startAt, limit)
    return await this._getAllFromRefFirebase(ref, key, onFailure)
  }

  /**
   *
   * @param key
   * @param orderField
   * @param order
   * @param startAt
   * @param limit
   * @param onSuccess = {function(List<Model>)}
   * @param onFailure = {function(error)}
   */
  listenToSubColOrdered (key, orderField, order, startAt, limit, onSuccess, onFailure) {
    let ref = this._getDocRef().collection(key)
    ref = this.addRefOptions(ref, orderField, order, startAt, limit)
    this._listenToSubColRef(ref, key, onSuccess, onFailure)
  }
}
