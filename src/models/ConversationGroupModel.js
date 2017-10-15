import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import firebase from 'firebase'

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
      this.by.path = 'Users/' + user
    } else {
      this.by.path = 'Users/' + user.key
    }
  }

  // Timestamps
  timestamp

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, MessageModel._firestoreFields, MessageModel, keepListening, onSuccess, onFailure)
  }
}

export default class ConversationGroupModel extends FirebaseSubColModel {

  static async getMyConversations (onFailure) {
    let ref = ConversationGroupModel.getNormalRef(ConversationGroupModel).where('participants.' + firebase.auth().currentUser.uid, '==', true)
    return await ConversationGroupModel.getAllFromRef(ref, ConversationGroupModel, onFailure)
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
