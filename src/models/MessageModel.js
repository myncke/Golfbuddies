import FirebaseModel from './FirebaseModel'

export default class MessageModel extends FirebaseModel {

  static _firestoreFields = [
    'sender',
    'text',
    'pictures',
    'timestamp'
  ]

  static collectionName = 'GolfGame'

  // Booleans
  text

  // References
  sender

  // Dates
  timestamp

  // Arrays
  pictures

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, MessageModel._firestoreFields, MessageModel, keepListening, onSuccess, onFailure)
  }
}
