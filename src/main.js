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
import MessagingHandler from './utils/MessagingHandler'
import FullCalendar from 'vue-full-calendar'
import StringUtils from './utils/StringUtils'

require('firebase/firestore')
window.jQuery = window.$ = require('jquery')

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
Vue.use(require('vue-moment'))
Vue.use(FullCalendar)
Vue.use(require('v-media-query').default)

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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        this.$store.dispatch('initUser')
      }.bind(this))
      .catch(function (error) {
        console.log(error)
      })
    this.initMessaging()
  },
  methods: {
    initMessaging: async function () {
      await MessagingHandler.init()
    }
  }
})

Vue.filter('formatDate', dateUtils.dateToString)

Vue.prototype.$last = function (item, list) {
  return item === list[list.length - 1]
}

Vue.prototype.$capitalize = function (item) {
  return StringUtils.capitalize(item)
}
