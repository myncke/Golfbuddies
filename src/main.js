// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import '../node_modules/vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import firebase from 'firebase'
import Vuex from 'vuex'
import { store } from './store'
import dateUtils from './utils/DateUtils'
import VueChatScroll from 'vue-chat-scroll'
import VueResource from 'vue-resource'
require('firebase/firestore')

const config = {
  apiKey: 'AIzaSyC21Ih6lJtA89S3CPca0FkkPiALPPB-XJw',
  authDomain: 'golfbuddies-ef806.firebaseapp.com',
  databaseURL: 'https://golfbuddies-ef806.firebaseio.com',
  projectId: 'golfbuddies-ef806',
  storageBucket: 'golfbuddies-ef806.appspot.com',
  messagingSenderId: '755720795488'
}

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueChatScroll)
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp(config)
    try {
      firebase.firestore().enablePersistence()
    } catch (error) {
      console.log('PERSISTENCE FAILED:')
      console.log(error.message)
    }
    this.$store.dispatch('initUser')
  }
})

Vue.filter('formatDate', dateUtils.dateToString)

Vue.prototype.$last = function (item, list) {
  return item === list[list.length - 1]
}
