import FirebaseModel from './FirebaseModel'

export default class LocationBroadcastModel  extends FirebaseModel{

  static _firestoreFields = [
    'start',
    'end',
    'location',
    'userKey'
  ]

  // Dates
  start
  end

  // Strings
  location

  // References
  userKey

  static collectionName = 'LocationBroadcast'

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, LocationBroadcastModel._firestoreFields, LocationBroadcastModel, keepListening, onSuccess, onFailure)
  }
}
