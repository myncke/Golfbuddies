<template>
  <v-container v-if="club !== undefined && hasInformationPermission" class="pa-0 ma-0" fluid>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-media :src="club.headerPic" height="200px">
            <v-container class="ma-0 container-text-gradient" fluid>
              <v-layout column align-left justify-end>
                <h1 class="white--text display-2">{{club.name}}</h1>
                <h2 class="white--text subheading">{{!club.closed ? 'Public' : 'Private' }} &#9679; {{club.information}}</h2>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>

      <v-btn color="primary" @click="inviting = true" block v-if="isMyGroup">Add Members</v-btn>
      <v-dialog v-if="isMyGroup" v-model="inviting" persistent>
        <v-card>
          <selection-view :model="invitees"></selection-view>
          <v-btn block color="primary" @click="addPeople">Add People</v-btn>
        </v-card>
      </v-dialog>

      <v-btn color="primary" @click="joinGroup" block v-if="canJoin">Join Group</v-btn>

      <v-btn color="green" dark @click="openConversation()" block v-if="hasFullPermission">
        Open GroupChat <v-icon class="ml-3">comment</v-icon>
      </v-btn>

      <v-tabs class="elevation-1 mt-3" scrollable grow>
        <v-tabs-bar class="white">
          <v-tabs-slider class="yellow"></v-tabs-slider>
          <v-tabs-item
            v-for="i in tabs"
            :key="i"
            :href="'#tab-' + i"
          >
            {{ i === 'Pictures' ? i : (hasFullPermission) ? i : 'No Permission'}}
          </v-tabs-item>
        </v-tabs-bar>
        <v-divider></v-divider>

        <v-tabs-items>
          <v-tabs-content
            v-for="i in tabs"
            :key="i"
            :id="'tab-' + i"
          >
            <v-card flat>
              <v-layout row wrap v-if="i == 'Events'">
                <events-tab :events="games"></events-tab>
              </v-layout>

              <v-layout row wrap v-if="i == 'Members'">
                <members-tab :iscreator="isMyGroup" :members="members" v-on:remove-user="removeUser"></members-tab>
              </v-layout>

              <v-layout row wrap v-if="i == 'Pictures' && hasFullPermission">
                <pictures-tab></pictures-tab>
              </v-layout>

              <v-layout row wrap v-if="i == 'Details'">
                <details-tab :location="club.location" :owner="club.admin"></details-tab>
              </v-layout>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-layout>
  </v-container>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'
  import UserModel from '../../models/UserModel'
  import GolfGameModel from '../../models/GolfGameModel'

  import Events from './Show/Events'
  import Members from './Show/Members'
  import Pictures from './Show/Pictures'
  import Details from './Show/Details'
  import UserSelectionView from '../Event/components/UserSelectionView'
  import ConversationGroupModel from '../../models/ConversationGroupModel'

  export default {
    data: () => ({
      club: undefined,
      members: [],
      games: [],
      inviting: false,
      tabs: ['Events', 'Members', 'Details'], // 'Pictures',
      invitees: {invites: []}
    }),
    created: function () {
      this.initClub()
    },
    watch: {
      $route: function (newVal) {
        this.initClub()
      }
    },
    computed: {
      isMyGroup: function () {
        return this.club.getAdmin() === this.$store.getters.user.key
      },
      canJoin: function () {
        return (!this.club.closed && this.club.members[this.$store.getters.user.key] !== true && !this.isMyGroup)
      },
      hasFullPermission () {
        let user = this.$store.getters.user
        return this.club.members[user.key] === true || this.isMyGroup
      },
      hasInformationPermission () {
        let permission = !this.club.closed
        if (!permission) {
          this.$router.push('/')
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      initClub: function () {
        this.members = []
        this.games = []
        let groupId = this.$route.params.id
        console.log(new SportClubModel(groupId, false, (model) => {
          this.club = model
          this.initMembers(model)
          this.initGames(model)
        }, error => { this.error = error.message }))
      },
      initMembers: async function (club) {
        this.members = []
        for (let member of Object.keys(club.members)) {
          console.log(new UserModel(member, false, model => { this.members.push(model) }, error => { this.error = error.message }))
        }
      },
      initGames: async function (club) {
        let games = await club.initSubcollection('Games', error => { this.error = error })
        for (let game of games) {
          // TODO: this should be a switch base on the sportType
          console.log(new GolfGameModel(game.key, false, model => {
            this.games.push(model)
          }, error => {
            this.error = error.message
            throw error
          }))
        }
      },
      addPeople: async function () {
        let invitees = this.invitees
        this.invitees = {invites: []}
        for (let invites of Object.keys(invitees.invites)) {
          this.club.members[invites] = true
        }
        this.inviting = false
        this.club.save()
        this.members = []
        this.initMembers(this.club)
        await this.updateConversation()
      },
      async removeUser (user) {
        if (user.key !== this.club.getAdmin()) {
          delete this.club.members[user.key]
          this.members = this.members.filter(model => model.key !== user.key)
          await this.club.save()
        }
      },
      updateConversation: async function () {
        let conversation = await ConversationGroupModel.getFromRef(this.club.conversationKey, ConversationGroupModel, error => { this.error = error.message })
        conversation.members = this.club.members
        await conversation.save()
      },
      joinGroup: async function () {
        let user = this.$store.getters.user
        this.members.push(user)
        this.club.members[user.key] = true
        await this.club.save()
        await this.updateConversation()
      },
      async openConversation () {
        var convo = (await ConversationGroupModel.getFromRef(this.club.conversationKey, ConversationGroupModel, error => { throw error }))
        this.$store.dispatch('changeConversation', convo)
        this.$router.push('/contacts')
      }
    },
    components: {
      'events-tab': Events,
      'members-tab': Members,
      'pictures-tab': Pictures,
      'details-tab': Details,
      'selection-view': UserSelectionView
    }
  }
</script>

<style scoped>
  .container-text-gradient {
    background: linear-gradient(rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.8));
  }

  .member {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    margin-left: 5px;
  }
</style>
