<template>
  <div>
    <div class="loader" v-if="loading">
      <v-progress-circular style="display: inline-block;" indeterminate v-bind:size="100" color="green darken-1"></v-progress-circular>
    </div>

    <!-- TODO: this needs a lot of work xD -->
    <div v-if="!loading">

      <!-- CONTACTS PANE -->

      <v-layout row fill-height wrap style="width: 100vw; min-height: 100vh">
        <v-flex sm4 xs12 fill-height>
          <v-list two-line dark style="height: 100vh; overflow:scroll;">
            <v-list-tile>
              <v-subheader v-text="'Friends'"></v-subheader>
            </v-list-tile>
            <template v-for="model in friendUserModels">
              <v-list-tile avatar v-bind:key="model.user.key" @click="console.log('TODO, not sure what to do here :/')">
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
              <v-subheader v-text="'Conversation Groups'"></v-subheader>
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

        <!-- CHAT PANE -->

        <v-flex sm8 xs12 class="hidden-xs-only" >
          <div style="height: 70vh; overflow: scroll" v-chat-scroll>
            <h4>Contact - Index</h4>
            <p class="red--text">{{error}}</p>
            <div v-for="message in messages">
              <v-layout row>
                <v-flex v-if="message.by.path != 'Users/' + getCurrentUser().uid" sm6>
                  <v-card class="message-card">
                    <p class="caption timestamp">{{message.timestamp | formatDate}}</p>
                    <v-layout row>
                      <v-flex sm3>
                        <p class="caption by-him">{{message.byModel.nickname}}</p>
                      </v-flex>
                      <v-flex sm9>
                        <p class="message message-him">{{message.message}}</p>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
                <v-flex v-else offset-sm6 sm6>
                  <v-card class="message-card">
                    <p class="caption timestamp">{{message.timestamp | formatDate}}</p>
                    <v-layout row>
                      <v-flex sm9>
                        <p class="message message-me">{{message.message}}</p>
                      </v-flex>
                      <v-flex sm3>
                        <p class="caption by-me">{{message.byModel.nickname}}</p>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
          </div>
          <div style="margin: 10px">
            <v-divider style="margin-bottom: 10px"></v-divider>
            <v-layout row v-if="currentConversation != undefined">
              <v-flex sm8>
                <v-text-field multiLine
                              label="Message"
                              v-model="text"
                              required>
                </v-text-field>
              </v-flex>
              <v-flex sm4>
                <v-btn class="primary" @click="sendMessage()">
                  Send Message <span style="margin-left: 5px"><v-icon>send</v-icon></span>
                </v-btn>
              </v-flex>
            </v-layout>
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
  import ConversationGroupModel, { MessageModel } from '../../models/ConversationGroupModel'
  import dateUtils from '../../utils/DateUtils'

  export default {
    data () {
      return {
        error: undefined,
        friendUserModels: [],
        conversationModels: [],
        loading: true,
        currentConversation: undefined,
        messages: [],
        text: ''
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
          let list = await FriendshipModel.getFriendsOfCurrentUser(error => {
            this.error = error.message
          })
          console.log(list)
          this.friendUserModels = []
          list.forEach(model => {
            let key
            this.getCurrentUser().uid === model.userKey1 ? key = model.userKey2 : key = model.userKey1
            let uModel = new UserModel(key, false, user => {
              this.friendUserModels.push({user: user, friendship: model})
              this.loading = false
            }, error => {
              this.error = error.message
            })
            console.log(uModel)
          })
        } catch (error) {
          this.error = error.message
        }
      },
      initConversations: async function () {
        try {
          let list = await ConversationGroupModel.getMyConversations(error => { this.error = error })
          console.log(list)
          this.conversationModels = list
        } catch (error) {
          this.error = error.message
        }
      },
      makeInitialsImage: function (user) {
        return 'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&rounded=true'
      },
      openConversation: async function (conversationModel) {
        try {
          this.currentConversation = conversationModel
          this.messages = []
          this.error = undefined
          conversationModel.listenToMessagesOrdered(undefined, undefined, async function (list) {
            for (let message of list) {
              message.byModel = await UserModel.getFromRef(message.by, UserModel, error => { this.error = error.message; throw error })
            }
            this.messages = list
          }.bind(this), error => { this.error = error; throw error })
        } catch (error) {
          this.error = error.message
          throw error
        }
      },
      getCurrentUser: function () {
        return firebase.auth().currentUser
      },
      dateToString: function (date) {
        return dateUtils.dateToString(date)
      },
      scrollChatBottom: function () {
        let container = document.getElementById('chatcontainer')
        container.scrollTop = container.scrollHeight
      },
      sendMessage: async function () {
        let message = this.text
        this.text = ''
        let messageModel = new MessageModel()
        console.log(messageModel)
        messageModel.setBy(this.getCurrentUser().uid)
        messageModel.message = message
        messageModel.timestamp = Date.now()
        await this.currentConversation.addSubcollectionDoc('Messages', messageModel, error => { this.error = error })
        console.log('SENT')
      }
    }
  }
</script>
<style scoped>
  .loader{
    position: absolute;margin: auto;left: 0;right: 0;top: 0;bottom:0;width: 100px;height: 100px;
  }

  .message-card{
    padding: 10px;
    margin: 10px;
  }

  .timestamp{
    font-size: 10px !important;
  }

  .message{
    font-size: 15px !important;
  }

  .message-me{
    text-align: start;
  }

  .message-him{
    text-align: end;
  }

  .by-me{
    text-align: end;
  }

  .by-him{
    text-align: start;
  }

</style>
