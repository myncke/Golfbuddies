<template>
  <v-flex class="mb-4">
    <v-expansion-panel expand>
      <v-expansion-panel-content v-model="open">
        <div slot="header">Friends</div>
        <v-card >
          <v-card-text class="grey lighten-3 pa-0">
            <v-list two-line style="height: 60vh; overflow:scroll;">
              <template v-for="model in friendUserModels">
                <v-list-tile avatar v-bind:key="model.user.key">
                  <v-list-tile-avatar>
                    <img v-bind:src="'https://ui-avatars.com/api/?name=' + model.user.firstName + '+' + model.user.lastName + '&rounded=true'"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content @click="goToProfile(model.user)">
                    <v-list-tile-title v-html="model.user.nickname"></v-list-tile-title>
                    <v-list-tile-sub-title v-html="model.user.firstName + ' ' + model.user.lastName"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon ripple @click="openConversation(model)">
                      <v-icon color="grey lighten-1">comment</v-icon>
                    </v-btn>
                    <v-btn icon ripple @click="closeFriend(model.friendship)">
                      <v-icon v-if="model.friendship.closeFriend" color="red">favorite</v-icon>
                    <v-icon v-else color="red">favorite_border</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-bind:inset="true"></v-divider>
              </template>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <user-search class="hidden-sm-and-down" v-on:search-selected="goToProfile" style="width:100%" ></user-search>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-flex>

</template>

<script>
  import firebase from 'firebase'
  import FriendshipModel from '../../models/FriendshipModel'
  // import UserModel from '../../models/UserModel'
  import ConversationGroupModel, { MessageModel } from '../../models/ConversationGroupModel'
  import dateUtils from '../../utils/DateUtils'
  import ImageUtils from '../../utils/ImageUtils'
  import SportClubModel from '../../models/SportClubModel'
  import UserSelection from '../Shared/Search/UserSearch.vue'

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
        open: true
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
      goToProfile: function (user) {
        this.$router.push({name: 'profile', params: {id: user.key}})
      },
      initFriends: async function () {
        try {
          let list = await FriendshipModel.getFriendsOfCurrentUser(error => {
            this.error = error.message
          })
          console.log(list)
          this.friendUserModels = []
          list.forEach(model => {
            model.getFriend(error => { this.error = error.message }).then(
              uModel => {
                this.friendUserModels.push({user: uModel, friendship: model})
                this.loading = false
                console.log(uModel)
              }
            )
          })
        } catch (error) {
          this.error = error.message
        }
      },
      initConversations: async function () {
        try {
          let list = await SportClubModel.getMyClubs(error => { this.error = error.message })  // await ConversationGroupModel.getMyGroupConversations(error => { this.error = error })
          list = list.filter(element => element.conversationKey !== undefined)
          this.conversationModels = list || []
        } catch (error) {
          this.error = error.message
        }
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
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
      },
      openConversation: async function (model) {
        var convo = (await ConversationGroupModel.getFromRef(model.friendship.conversationRef, ConversationGroupModel, this.onFailure))
        this.$store.dispatch('changeConversation', convo)
        this.$router.push('/contacts')
      },
      async closeFriend (friendship) {
        friendship.closeFriend = !friendship.closeFriend
        await friendship.save()
        console.log('SAVED')
      }
    },
    components: {
      'user-search': UserSelection
    }
  }
</script>
