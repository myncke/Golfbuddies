import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import firebase from 'firebase'
import StringUtils from '../utils/StringUtils'
import ConversationGroupModel from './ConversationGroupModel'

/**
 * Class that only holds a key which is the name of this sportType
 * (Not really needed to make a new SportType, it'll only aid in breaking our daily limit)
 */
export class SportTypeModel extends FirebaseModel {
  static _firestoreFields = []

  static collectionName = 'SportTypes'

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, SportTypeModel._firestoreFields, SportTypeModel, keepListening, onSuccess, onFailure)
  }
}

/**
 * Class that only holds a key to another GameModel
 */
export class GameKey extends FirebaseModel {
  static _firestoreFields = []

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, GameKey._firestoreFields, GameKey, keepListening, onSuccess, onFailure)
  }
}

/**
 * Class that models a SportClub and all its subcollections
 */
export default class SportClubModel extends FirebaseSubColModel {

  async initConversationGroup () {
    let conversationModel = new ConversationGroupModel()
    conversationModel.participants = this.members
    conversationModel.name = this.name
    await conversationModel.save()
    this.conversationKey = conversationModel._getDocRef()
  }

  /**
   * Gets all the public clubs
   * @param onFailure
   * @return {Promise.<Array>}
   */
  static async getPublicClubs (onFailure) {
    return await SportClubModel.getAllFromRef(SportClubModel.getNormalRef(SportClubModel).where('closed', '==', false), SportClubModel, onFailure)
  }

  /**
   * Gets all the clubs you are a member of.
   * @param onFailure
   * @return {Promise.<Array>}
   */
  static async getMyClubs (onFailure) {
    return await SportClubModel.getAllFromRef(SportClubModel.getNormalRef(SportClubModel).where('members.' + firebase.auth().currentUser.uid, '==', true), SportClubModel, onFailure)
  }

  static listenToMyClubs (onUpdate, onFailure) {
    let ref = SportClubModel.getNormalRef(SportClubModel).where('members.' + firebase.auth().currentUser.uid, '==', true)
    SportClubModel.listenToAllFromFirebase(ref, SportClubModel, onUpdate, onFailure)
  }

  /**
   * Search a club by prefix
   * @param input {String} (the prefix to search for)
   * @param onFailure
   * @return {Promise.<Array>}
   */
  static async searchClub (input, onFailure) {
    return await this.getAllFromRef(this.getNormalRef(SportClubModel).where('name', '>=', input.toLowerCase()).where('name', '<', StringUtils.makeLexiNext(input).toLowerCase()), SportClubModel, onFailure)
  }

  static _firestoreFields = [
    'admin',
    'information',
    'location',
    'locationString',
    'name',
    'closed',
    'sportType',
    'members',
    'headerPic',
    'conversationKey'
  ]

  static _subCollections = {
    'Games': GameKey
  }

  static collectionName = 'SportClub'

  // Booleans
  closed // Boolean to show if the club is private or not (private is a keyword <.<)

  // Strings
  information = ''
  name
  headerPic
  locationString

  // References
  admin // Reference to Users
  conversationKey // Reference to the ConversationGroup

  getAdmin () {
    return this.admin.path.substr('Users/'.length)
  }

  /**
   * Set the value of creator
   * @param user = UserModel to which we make a reference
   */
  setAdmin (user) {
    if (typeof user === 'string') {
      this.admin.path = 'Users/' + user
    } else {
      this.admin.path = 'Users/' + user.key
    }
  }

  sportType = 'SportType/Golf'// Reference to SportTypes

  /**
   * Returns the key of the SportType
   * in this example this should be enough, because the key is the name of the SportType
   * and it doesn't hold any other information
   * @returns {string}
   */
  getSportType () {
    return this.sportType.path.substr('SportTypes/'.length)
  }

  /**
   * Set the reference of sportType
   * @param sportType = String|SportTypeModel
   */
  setSportType (sportType) {
    if (typeof sportType === 'string') {
      this.sportType.path = 'SportTypes/' + sportType
    } else {
      this.sportType.path = 'SportTypes/' + sportType.key
    }
  }

  // Geopoints
  location

  // Objects
  members

  constructor (key, keepListening, onSuccess, onFailure) {
    super(key, SportClubModel._subCollections, SportClubModel._firestoreFields, SportClubModel, keepListening, onSuccess, onFailure)
  }
}
