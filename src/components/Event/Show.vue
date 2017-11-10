<template>
  <v-container class="pa-0">
    <v-layout column v-if="model !== undefined">
      <v-flex>
        <v-card class="mb-3">
          <v-card-media
            src="/static/img/gameHeader.jpg"
            height="200px"></v-card-media>
        </v-card>
      </v-flex>

      <v-flex>
        <v-card>
          <v-layout row>
          <v-flex column sm3 class="pl-0 pr-5 pt-3 pb-3">
            <div class="title text-sm-right">{{ model.date | moment("D MMM.") }}</div>
            <div class="text-sm-right">{{ model.date | moment("dddd") }}</div>
          </v-flex>

          <v-layout column justify-content-center class="pa-3">
            <v-flex>
              <h1 class="title ma-0">{{model.title}}</h1>
            </v-flex>
            <v-flex>
              <p class="caption ma-0" color="grey--after lighten-1">
                {{model.inviteOnly ? 'Public' : 'Private' }}
                &#9679; Hosted by
                <a href="">{{ creator.firstName || 'Unkown' }} {{ creator.lastName || ''}}</a>
              </p>
              <v-divider class="mt-2"></v-divider>
              <p class="caption ma-0 pt-2"> <v-icon :style="{ fontSize: 15+ 'px' }">location_on</v-icon> {{model.locationString}}</p>
            </v-flex>
          </v-layout>
        </v-layout>

        <v-divider></v-divider>

        <v-toolbar>
          <v-btn small flat value="going" color="blue-grey" class="caption">
            <v-icon left dark color="" class="caption">check</v-icon> Going
          </v-btn>
          <v-btn small flat value="maybe" color="blue-grey" class="caption">
            <v-icon left dark color="" class="body-1">help_outline</v-icon> maybe
          </v-btn>
          <v-btn small flat value="ignore" color="blue-grey" class="caption">
            <v-icon left dark color="" class="caption">clear</v-icon>Ignore
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn small flat value="ignore" color="blue-grey" class="caption">
            <v-icon left dark color="" class="caption">share</v-icon>Share
          </v-btn>
        </v-toolbar>
        </v-card>
      </v-flex>

      <v-flex class="mt-3">
        <participants-card :model="model"></participants-card>
      </v-flex>

      <v-flex v-if="isMyGame" class="mt-3">
        <v-btn color="primary" block @click="inviting = true">Invite User</v-btn>
        <v-dialog max-width="500" v-model="inviting" persistent>
          <v-card>
            <selection-view email :model="invitees"></selection-view>
            <v-btn block color="primary" @click="addPeople">Add People</v-btn>
          </v-card>
        </v-dialog>
      </v-flex>

      <v-flex class="mt-3">
        <v-card>
          <v-tabs class="elevation-1" scrollable grow>
            <v-tabs-bar class="white">
              <v-tabs-slider class="yellow"></v-tabs-slider>
              <v-tabs-item
                v-for="i in tabs"
                :key="i"
                :href="'#tab-' + i"
              >
                {{ i }}
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
                  <v-layout row wrap v-if="i == 'Details'">
                    <details-tab :model="model" :subModel="subModel"></details-tab>
                  </v-layout>

                  <v-layout row wrap v-if="i == 'Pictures'">
                    <pictures-tab></pictures-tab>
                  </v-layout>

                  <v-layout row wrap v-if="i == 'Location'">
                    <location-tab :location="model.location"></location-tab>
                  </v-layout>
                </v-card>
              </v-tabs-content>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- <br>
    <p class="title text-xs-center" v-if="messages.length > 0">Messages</p>
    <message-show v-for="message in messages" :model="message" :key="message.key"></message-show> -->
  </v-container>
</template>

<script>
import GameModel, { CollectionGameMap } from '../../models/GameModel'
import MessageShow from './components/Messages/Show'

import Location from './Show/Location'
import Pictures from './Show/Pictures'
import Details from './Show/Details'
import Participants from './Show/Participants'
import UserSelectionView from './components/UserSelectionView'
import UserModel from '../../models/UserModel'

export default {
  data: () => ({
    model: undefined,
    subModel: {},
    messages: [],
    error: '',
    tabs: ['Details', 'Location', 'Pictures'],
    creator: {},
    invitees: {invites: {}},
    inviting: false
  }),
  computed: {
    isMyGame: function () {
      return this.model.getCreator() === this.$store.getters.user.key
    }
  },
  created: function () {
    this.initModel(this.$route.params.id)
  },
  methods: {
    initModel: async function (gameId) {
      this.model = await GameModel.getFromRef(GameModel.getNormalRef(GameModel).doc(gameId), GameModel, this.onFailure)
      let subClass = CollectionGameMap[this.model.subGame.path.split('/')[0]]
      this.subModel = await GameModel.getFromRef(this.model.subGame, subClass, this.onFailure)
      // this.messages = await this.model.getFirstXMessages(0, 100, error => { this.error = error.message })
      this.messages = await this.model.initSubcollection('Messages', this.onFailure)
      this.initCreator()
    },
    initCreator: async function () {
      this.creator = await UserModel.getFromRef(this.model.creator, UserModel, this.onFailure)
    },
    onFailure: function (error) {
      this.error = error.message
    },
    addPeople: async function () {
      let invitees = this.invitees
      this.invitees = {invites: {}}
      console.log(this.invitees)
      for (let invites of Object.keys(invitees.invites)) {
        this.model.invites[invites] = invitees.invites[invites]
      }
      this.inviting = false
      await this.model.save()
      await this.model.sendInviteNotification(Object.keys(invitees.invites))
    }
  },
  components: {
    'message-show': MessageShow,
    'location-tab': Location,
    'pictures-tab': Pictures,
    'details-tab': Details,
    'participants-card': Participants,
    'selection-view': UserSelectionView
  }
}
</script>

<style scoped>
  .list {
    width: 100%;
    padding: 0;
  }
</style>
