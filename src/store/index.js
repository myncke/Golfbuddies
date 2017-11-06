import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
import UserModel from '../models/UserModel'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = new UserModel(user.uid, false, model => {
              if (model.nickname !== undefined) {
                (new UserModel()).addDeviceToken()
                commit('setUser', newUser)
              } else {
                commit('setUser', null)
              }
            }, error => { this.error = error.message })
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = new UserModel(user.uid, false, model => {
              if (model.nickname !== undefined) {
                (new UserModel()).addDeviceToken()
                commit('setUser', newUser)
              } else {
                commit('setUser', null)
              }
            }, error => { this.error = error.message })
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserOut ({commit}) {
      (new UserModel()).deleteDeviceToken()
      firebase.auth().signOut()
        .then(
          () => {
            commit('setUser', null)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    initUser ({commit}) {
      let makeUser = function (key) {
        let userModel = new UserModel(key, false, model => {
          if (model.nickname !== undefined) {
            commit('setUser', userModel)
          } else {
            commit('setUser', null)
          }
        }, error => { this.error = error.message })
      }

      const currentUser = firebase.auth().currentUser
      if (currentUser !== null) {
        makeUser(currentUser.uid)
        return
      }

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          makeUser(user.uid)
        }
      })
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
})
