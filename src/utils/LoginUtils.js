import firebase from 'firebase'
import UserModel from '../models/UserModel'
import StringUtils from './StringUtils'

export default {
  async logInWithFacebook (onFailure) {
    let provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('user_birthday')
    try {
      let result = await firebase.auth().signInWithPopup(provider)
      console.log(result)
      let userModel = new UserModel(firebase.auth().currentUser.uid)
      return userModel
    } catch (error) {
      console.log(error)
      onFailure(error)
      return undefined
    }
  },
  async logInWithGoogle (onFailure) {
    let provider = new firebase.auth.GoogleAuthProvider()
    try {
      let result = await firebase.auth().signInWithPopup(provider)
      console.log(result)
      let userModel = new UserModel(firebase.auth().currentUser.uid)
      let profile = result.additionalUserInfo.profile
      userModel.firstName = profile.given_name
      userModel.lastName = profile.family_name
      if (profile.sex !== undefined) userModel.sex = StringUtils.capitalize(profile.sex)
      return userModel
    } catch (error) {
      console.log(error)
      onFailure(error)
      return undefined
    }
  }
}
