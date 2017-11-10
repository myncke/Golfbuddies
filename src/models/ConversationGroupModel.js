import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import firebase from 'firebase'
import SportClubModel from './SportClubModel'

export class MessageModel extends FirebaseModel {

  static _firestoreFields = [
    'message',
    'by',
    'timestamp'
  ]

  // Strings
  message

  // References
  by

  getBy () {
    return this.gameKey.path.substr('Users/'.length)
  }

  /**
   * Set the value of user1
   * @param user = UserModel to which we make a reference
   */
  setBy (user) {
    if (typeof user === 'string') {
      this.by = this.makeDoc('Users', user)
    } else {
      this.by = this.makeDoc('Users', user.key)
    }
  }

  // Timestamps
  timestamp

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, MessageModel._firestoreFields, MessageModel, keepListening, onSuccess, onFailure)
    this.by = this.makeDoc('Users')
  }
}

export default class ConversationGroupModel extends FirebaseSubColModel {

  static async getMyConversations (onFailure) {
    let ref = ConversationGroupModel.getNormalRef(ConversationGroupModel).where('participants.' + firebase.auth().currentUser.uid, '==', true)
    return await ConversationGroupModel.getAllFromRef(ref, ConversationGroupModel, onFailure)
  }

  static async getMyGroupConversations (onFailure) {
    let clubs = await SportClubModel.getMyClubs()
    let result = []
    let promises = []
    for (let club of clubs) {
      let promise = ConversationGroupModel.getFromRef(club.conversationKey, ConversationGroupModel, onFailure)
      promises.push(promise)
      result.push(await promise)
    }
    return Promise.all(promises).then(
      () => { return result }
    )
  }

  async getMessagesOrdered (startAt, limit, onFailure) {
    let list = await this._getAllFromSubCollectionOrdered('Messages', 'timestamp', 'desc', startAt, limit, onFailure)
    list = list.reverse()
    this.setSubcollection(list, 'Messages')
    return list
  }

  listenToMessagesOrdered (startAt, limit, onSuccess, onFailure) {
    this.listenToSubColOrdered('Messages', 'timestamp', 'desc', startAt, limit, list => {
      let revList = list.reverse()
      onSuccess(revList)
    }, error => onFailure(error))
  }

  static _firestoreFields = [
    'name',
    'participants'
  ]

  static _subCollections = {
    'Messages': MessageModel
  }

  static collectionName = 'ConversationGroup'

  // Strings
  name

  // Objects
  participants

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, ConversationGroupModel._subCollections, ConversationGroupModel._firestoreFields, ConversationGroupModel, keepListening, onSuccess, onFailure)
  }
}
