import firebase from 'firebase'
import UserModel from '../models/UserModel'
import StringUtils from './StringUtils'

export default {
  // TODO: needs to be tested
  async logInWithFacebook (onFailure) {
    let provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('user_birthday')
    try {
      let result = await firebase.auth().signInWithPopup(provider)
      let userModel = new UserModel(result.user.uid)
      userModel.isSocial = true
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
      let userModel = new UserModel(result.user.uid)
      userModel.isSocial = true
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
