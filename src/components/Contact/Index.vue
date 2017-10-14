<template>
  <div>
    <div v-if="loading">
      <!--<v-container fill-height style="margin: auto;">
        <v-layout row wrap align-center>
          <v-flex class="text-xs-center">
            <v-progress-circular style="display: inline-block;" indeterminate v-bind:size="100" color="green darken-1"></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>-->

    </div>
    <v-container v-if="loading" style="width: 100vw" fill-height>
      <v-layout row wrap align-center>
        <v-flex class="text-xs-center">
          <v-progress-circular style="display: inline-block;" indeterminate v-bind:size="100" color="green darken-1"></v-progress-circular>
          <p>Loading...</p>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- TODO: this needs a lot of work xD -->
    <div v-if="!loading">
      <h1>Contact - Index</h1>
      <p class="error">{{error}}</p>
      <v-container>
        <v-card style="margin: 10px" v-for="user in friendUserModels" :key="user">
          <p></p>
          <v-avatar class="red align-center">
            <span class="white--text headline">{{user.firstName[0]}}{{user.lastName[0]}}</span>
          </v-avatar>
          <p class="title text-xs-center">{{user.firstName}} {{user.lastName}}</p>
        </v-card>
      </v-container>
    </div>

    <!-- <div v-for="friend in friendModels">
      <p>{{friend.getUser1()}}</p>
    </div>
    <div v-for="user in friendUserModels">
      <p>{{user.firstName}}</p>
      <p>{{user.lastName}}</p>
    </div> -->
  </div>
</template>
<script>
  import firebase from 'firebase'
  import FriendshipModel from '../../models/FriendshipModel'
  import UserModel from '../../models/UserModel'

  export default {
    data () {
      return {
        friendModels: [],
        error: '',
        friendUserModels: [],
        loading: true
      }
    },
    created () {
      this.initFriends()
    },
    methods: {
      initFriends: async function () {
        try {
          await firebase.auth().signInWithEmailAndPassword('omg.kvb@gmail.com', 'kekkek')
          let userModel = new UserModel()
          let list = await FriendshipModel.getFriendsOfCurrentUser(userModel, error => {
            this.error = error.message
          })
          this.friendModels = list
          this.friendUserModels = []
          list.forEach(model => {
            let ref
            userModel.key === model.userKey1.path ? ref = model.getUser2() : ref = model.getUser1()
            let uModel = new UserModel(ref, false, model => {
              this.friendUserModels.push(model)
              this.loading = false
            }, error => {
              this.error = error.message
            })
            console.log(uModel)
          })
        } catch (error) {
          this.error = error.message
          console.log(error)
        }
      }
    }
  }
</script>
<style scoped>
</style>
