// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import firebase from 'firebase'
import '../node_modules/vuetify/dist/vuetify.min.css'

const config = {
  apiKey: 'AIzaSyC21Ih6lJtA89S3CPca0FkkPiALPPB-XJw',
  authDomain: 'golfbuddies-ef806.firebaseapp.com',
  databaseURL: 'https://golfbuddies-ef806.firebaseio.com',
  projectId: 'golfbuddies-ef806',
  storageBucket: 'golfbuddies-ef806.appspot.com',
  messagingSenderId: '755720795488'
}

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp(config)
  }
})
