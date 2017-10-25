import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
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
            const newUser = {
              id: user.uid
            }
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
      // TODO: add new usermodel to the central state
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const newUser = {
              id: user.uid
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    signUserOut ({commit}) {
      firebase.auth().signOut()
        .then(
          commit('setUser', null)
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    },
    initUser ({commit}) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          commit('setUser', { id: user.uid })
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
