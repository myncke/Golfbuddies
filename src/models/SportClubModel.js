import FirebaseModel from './FirebaseModel'
import FirebaseSubColModel from './FirebaseSubColModel'
import firebase from 'firebase'

/**
 * Class that only holds a key which is the name of this sportType
 * (Not really needed to make a new SportType, it'll only aid in breaking our daily limit)
 */
export class SportTypeModel extends FirebaseModel {
  static _firestoreFields = []

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

  static _firestoreFields = [
    'admin',
    'information',
    'location',
    'name',
    'closed',
    'sportType',
    'members',
    'headerPic'
  ]

  static _subCollections = {
    'Games': GameKey
  }

  static collectionName = 'SportClub'

  // Booleans
  closed // Boolean to show if the club is private or not (private is a keyword <.<)

  // Strings
  information
  name
  headerPic

  // References
  admin // Reference to Users

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

  sportType // Reference to SportTypes

  /**
   * Returns the key of the SportType
   * in this example this should be enough, because the key is the name of the SportType
   * and it doesn't hold any other information
   * @returns {string}
   */
  getSportType () {
    return this.creator.path.substr('SportTypes/'.length)
  }

  /**
   * Set the reference of sportType
   * @param sportType = String|SportTypeModel
   */
  setSportType (sportType) {
    if (typeof sportType === 'string') {
      this.admin.path = 'SportTypes/' + sportType
    } else {
      this.admin.path = 'SportTypes/' + sportType.key
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
