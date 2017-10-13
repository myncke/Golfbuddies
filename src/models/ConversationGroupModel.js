import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import { UserKey } from './SportClubModel'

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
      this.gameKey.path = 'Users/' + user
    } else {
      this.gameKey.path = 'Users/' + user.key
    }
  }

  // Timestamps
  timestamp

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, MessageModel._firestoreFields, MessageModel, keepListening, onSuccess, onFailure)
  }
}

export default class ConversationGroupModel extends FirebaseSubColModel {

  static _firestoreFields = [
    'name'
  ]

  static _subCollections = {
    'Messages': MessageModel,
    'Participants': UserKey
  }

  static collectionName = 'Game'

  // Strings
  name

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, ConversationGroupModel._subCollections, ConversationGroupModel._firestoreFields, ConversationGroupModel, keepListening, onSuccess, onFailure)
  }
}
