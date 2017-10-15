<template>
  <div>
    <div class="loader" v-if="loading">
      <v-progress-circular style="display: inline-block;" indeterminate v-bind:size="100" color="green darken-1"></v-progress-circular>
    </div>

    <!-- TODO: this needs a lot of work xD -->
    <div v-if="!loading">
      <p v-if="error != undefined" class="error">{{error}}</p>
      <v-layout row fill-height wrap style="width: 100vw; min-height: 100vh">
        <v-flex sm4 xs12 fill-height>
          <v-list two-line dark style="min-height: 100vh">
            <v-list-tile>
              <v-subheader v-text="'Friends'"></v-subheader>
            </v-list-tile>
            <template v-for="model in friendUserModels">
              <v-list-tile avatar v-bind:key="model.user.key" @click="openConversation(model)">
                <v-list-tile-avatar>
                  <img v-bind:src="'https://ui-avatars.com/api/?name=' + model.user.firstName + '+' + model.user.lastName + '&rounded=true'"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="model.user.nickname"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="model.user.firstName + ' ' + model.user.lastName"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon v-if="model.friendship.closeFriend" large color="red">favorite</v-icon>
                  <v-icon v-else large color="red">favorite_border</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-bind:inset="true"></v-divider>
            </template>
            <v-list-tile>
              <v-subheader v-text="'Friends'"></v-subheader>
            </v-list-tile>
            <template v-for="group in conversationModels">
              <v-list-tile avatar v-bind:key="group.key" @click="openConversation(group)">
                <v-list-tile-avatar>
                  <img v-bind:src="makeInitialsImage({ firsName: group.name, lastName: '' })"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="group.name"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-bind:inset="true"></v-divider>
            </template>
          </v-list>
        </v-flex>
        <v-flex sm8 xs12 class="hidden-xs-only">
          <div>
            <h4>Contact - Index</h4>
            <div v-for="message in messages">
              <p>{{message.message}}</p>
              <p>{{message.by.path}}</p>
              <p>{{message.timestamp}}</p>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import FriendshipModel from '../../models/FriendshipModel'
  import UserModel from '../../models/UserModel'
  import ConversationGroupModel from '../../models/ConversationGroupModel'

  export default {
    data () {
      return {
        error: undefined,
        friendUserModels: [],
        conversationModels: [],
        loading: true,
        messages: []
      }
    },
    created () {
      this.initFriends().then(
        () => this.initConversations().then(
          this.loading = false
        )
      )
    },
    methods: {
      initFriends: async function () {
        try {
          await firebase.auth().signInWithEmailAndPassword('omg.kvb@gmail.com', 'kekkek')
          let userModel = new UserModel()
          console.log('USERMODEL KEY: ' + userModel.key)
          let list = await FriendshipModel.getFriendsOfCurrentUser(error => {
            // throw error
            // this.error = error.message
            console.log('ERROR AT FRIENDS')
            console.log(error)
          })
          console.log(list)
          this.friendUserModels = []
          list.forEach(model => {
            let key
            userModel.key === model.userKey1 ? key = model.userKey2 : key = model.userKey1
            let uModel = new UserModel(key, false, user => {
              this.friendUserModels.push({user: user, friendship: model})
              this.loading = false
            }, error => {
              // throw error
              this.error = error.message
            })
            console.log(uModel)
          })
        } catch (error) {
          this.error = error.message
          console.log(error)
          throw error
        }
      },
      initConversations: async function () {
        let list = await ConversationGroupModel.getMyConversations(error => { this.error = error })
        console.log(list)
        this.conversationModels = list
      },
      makeInitialsImage: function (user) {
        return 'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&rounded=true'
      },
      openConversation: async function (conversationModel) {
        this.messages = await conversationModel.initSubcollection('Messages', error => { /* this.error = error.message */ throw error })
      }
    }
  }
</script>
<style scoped>
  .loader{
    position: absolute;margin: auto;left: 0;right: 0;top: 0;bottom:0;width: 100px;height: 100px;
  }
</style>
