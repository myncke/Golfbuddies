<template>
  <div v-if="currentConversation && conversationPartner" ref="chatBox">
    <div class="loader" v-if="loading">
      <v-progress-circular style="display: inline-block;" indeterminate v-bind:size="100" color="green darken-1"></v-progress-circular>
    </div>

    <div v-else>

      <!-- CONTACTS PANE -->

      <v-layout row fill-height wrap style=" min-height: 100vh">
        <!-- <v-flex sm4 xs12 fill-height>
          <v-list two-line dark style="height: 100vh; overflow:scroll;">
            <v-list-tile>
              <v-subheader v-text="'Friends'"></v-subheader>
            </v-list-tile>
            <template v-for="model in friendUserModels">
              <v-list-tile avatar v-bind:key="model.user.key" @click="openConversationFriend(model)">
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
              <v-subheader v-text="'Group Conversations'"></v-subheader>
            </v-list-tile>
            <template v-for="group in conversationModels">
              <v-list-tile avatar v-bind:key="group.key" @click="openConversationGroup(group)">
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
        </v-flex> -->

        <!-- CHAT PANE -->

        <v-flex sm12 xs12 class="hidden-xs-only" >
          <div style="height: 70vh; overflow: scroll" v-chat-scroll>
            <p class="red--text">{{error}}</p>
            <p class="title text-xs-center">{{currentConversation.name}}</p>
            <v-divider></v-divider>
            <div v-for="message in messages">
              <v-layout row>
                <v-flex v-if="message.by.path != 'Users/' + getCurrentUser().uid" sm6>
                  <v-card class="message-card">
                    <p class="caption timestamp">{{message.timestamp | formatDate}}</p>
                    <v-layout row>
                      <v-flex sm9>
                        <p class="message message-him">{{message.message}}</p>
                      </v-flex>
                      <v-flex sm3>
                        <p class="caption by-him">{{message.byModel.nickname}}</p>
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
                <!-- <v-btn raised round @click="settings = !settings">
                  Settings <span style="margin-left: 5px"><v-icon>settings</v-icon></span>
                </v-btn> -->
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <v-dialog v-model="settings">
      <v-card>
        <v-card-title>
          <p class="title">Settings</p>
        </v-card-title>
        <v-card-text>
          <p class="subheading">Rename Group</p>
          <v-text-field
            label="Group Name"
            v-model="groupName">
          </v-text-field>
          <v-btn color="primary" :disabled="true" dark @click="renameGroup(); settings = !settings">Save Name</v-btn>
          <p class="subheading">Invite Friends</p>
          <p>TODO</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import firebase from 'firebase'
  import FriendshipModel from '../../models/FriendshipModel'
  import UserModel from '../../models/UserModel'
  import ConversationGroupModel, { MessageModel } from '../../models/ConversationGroupModel'
  import dateUtils from '../../utils/DateUtils'
  import ImageUtils from '../../utils/ImageUtils'
  import SportClubModel from '../../models/SportClubModel'

  export default {
    data () {
      return {
        error: undefined,
        friendUserModels: [],
        conversationModels: [],
        loading: true,
        currentConversation: undefined,
        messages: [],
        text: '',
        groupName: '',
        settings: false,
        conversationPartner: undefined
      }
    },
    created () {
      this.init()
    },
    watch: {
      $store: function () {
        console.log(this.$store.getters.conversation)
        this.init()
      }
    },
    computed: {
      getMessages: async (store) => {
        this.currentConversation = store.getters.conversation
        this.groupName = this.currentConversation.name
        this.messages = []
        this.error = undefined
        this.currentConversation.listenToMessagesOrdered(undefined, undefined, async function (list) {
          for (let message of list) {
            message.byModel = await UserModel.getFromRef(message.by, UserModel, error => { this.error = error.message; throw error })
          }
          this.messages = list
        }.bind(this), error => { this.error = error; throw error })
        return this.messages
      }
    },
    methods: {
      init: function () {
        this.initFriends().then(
          () => this.initConversations().then(
            this.loading = false
          )
        )
        this.openConversation(this.$store.getters.conversation)

        let partnerId = this.$store.getters.user.key
        this.conversationPartner = new UserModel(partnerId, false, () => {}, () => {})
      },
      initFriends: async function () {
        try {
          let list = await FriendshipModel.getFriendsOfCurrentUser(error => {
            this.error = error.message
          })
          // console.log(list)
          this.friendUserModels = []
          list.forEach(model => {
            model.getFriend(error => { this.error = error.message }).then(
              uModel => {
                this.friendUserModels.push({user: uModel, friendship: model})
                this.loading = false
                // console.log(uModel)
              }
            )
          })
        } catch (error) {
          this.error = error.message
        }
      },
      initConversations: async function () {
        try {
          let list = await SportClubModel.getMyClubs(error => { this.error = error.message }) // await ConversationGroupModel.getMyGroupConversations(error => { this.error = error })
          list = list.filter(element => element.conversationKey !== undefined)
          this.conversationModels = list || []
        } catch (error) {
          this.error = error.message
        }
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      openConversation: async function (conversationModel) {
        try {
          this.currentConversation = conversationModel
          this.groupName = conversationModel.name
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
        }
      },
      openConversationFriend: async function (model) {
        this.openConversation(await ConversationGroupModel.getFromRef(model.friendship.conversationRef, ConversationGroupModel, this.onFailure))
      },
      openConversationGroup: async function (model) {
        this.openConversation(await ConversationGroupModel.getFromRef(model.conversationKey, ConversationGroupModel, this.onFailure))
      },
      getCurrentUser: function () {
        return firebase.auth().currentUser
      },
      dateToString: function (date) {
        return dateUtils.dateToString(date)
      },
      sendMessage: async function () {
        let message = this.text
        this.text = ''
        let messageModel = new MessageModel()
        console.log(messageModel)
        messageModel.setBy(this.getCurrentUser().uid)
        messageModel.message = message
        messageModel.timestamp = Date.now()
        await this.currentConversation.addSubcollectionDoc('Messages', messageModel, this.onFailure)
        console.log('SENT')
      },
      renameGroup: async function () {
        let group = this.currentConversation
        if (group === undefined) {
          return
        }
        group.name = this.groupName
        group.save()
      },
      onFailure: function (error) {
        this.error = error
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
    text-align: start;
  }

  .by-me{
    text-align: end;
  }

  .by-him{
    text-align: start;
  }

</style>
