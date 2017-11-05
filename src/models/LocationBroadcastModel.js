import FirebaseModel from './FirebaseModel'
import FriendshipModel from './FriendshipModel'

export default class LocationBroadcastModel extends FirebaseModel {

  static async getBroadcastsFromUserOrdered (userRef, onFailure) {
    return await this.getAllFromRef(this.getNormalRef(LocationBroadcastModel).where('userKey', '==', userRef).orderBy('start'), LocationBroadcastModel, onFailure)
  }

  static async getBroadcastsFromUserOrderedLimited (userRef, onFailure) {
    let date = new Date()
    let inTwoMonths = new Date()
    inTwoMonths.setMonth(inTwoMonths.getMonth() + 2)
    return await this.getAllFromRef(this.getNormalRef(LocationBroadcastModel).where('userKey', '==', userRef).where('start', '>=', date).where('start', '<', inTwoMonths).orderBy('start'), LocationBroadcastModel, onFailure)
  }

  static async getAllUpcomingBroadcastsFromFriends (onFailure) {
    let friends = await FriendshipModel.getFriendsOfCurrentUser(onFailure)
    let result = []
    for (let friend of friends) {
      // TODO: test this!!
      result.push(...(await LocationBroadcastModel.getBroadcastsFromUserOrderedLimited(friend.getFriendRef().path.split('/')[1])))
    }
  }

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
