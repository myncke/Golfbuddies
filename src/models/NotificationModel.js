import FirebaseModel from './FirebaseModel'
import UserModel from './UserModel'

let NotificationMessages = {
  invited: 'You have been invited to a game: ',
  eventUpdate: 'An event you are going to has been updated: ',
  friendRequest: 'A user want so be your friend: ',
  friendAccepted: 'A user accepted your friend request: '
}

export {NotificationMessages}

export default class NotificationModel extends FirebaseModel {

  static async getMyNotifications (onFailure) {
    let key = (new UserModel()).key
    let ref = NotificationModel.getNormalRef(NotificationModel).where('receivers.' + key + '.received', '==', true)
    return await NotificationModel.getAllFromRef(ref, NotificationModel, onFailure)
  }

  static listenToNotifications (onUpdate, onFailure) {
    let key = (new UserModel()).key
    let ref = NotificationModel.getNormalRef(NotificationModel).where('receivers.' + key + '.received', '==', true)
    NotificationModel.listenToAllFromFirebase(ref, NotificationModel, onUpdate, onFailure)
  }

  static _firestoreFields = [
    'receivers',
    'message',
    'link'
  ]

  static collectionName = 'Notification'

  // Booleans
  message
  link

  // Object

  /**
   * This is an object with keys == a key of a user and value an object of {seen: Boolean}
   *
   * Example (also default):
   *   {
   *    userKey: {
   *      seen: false,
   *      received: true
   *    }
   *   }
   */
  receivers

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, NotificationModel._firestoreFields, NotificationModel, keepListening, onSuccess, onFailure)
  }
}
