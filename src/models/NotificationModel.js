import FirebaseModel from './FirebaseModel'

let NotificationMessages = {
  invited: 'You have been invited to a game: ',
  eventUpdate: 'An event you are going to has been updated: '
}

export {NotificationMessages}

export default class NotificationModel extends FirebaseModel {

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
  receivers

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, NotificationModel._firestoreFields, NotificationModel, keepListening, onSuccess, onFailure)
  }
}
