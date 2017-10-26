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
                {{model.inviteOnly ? 'Public' : 'Private' }} &#9679; Hosted by
                <a href="">{{ model.creator.name || 'Unkown' }}</a>
              </p>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-flex>

      <v-divider class="mb-3"></v-divider>

      <v-flex class="mb-3">
        <v-card class=" pa-3">
          <v-layout row>
            <div>{{ model.date | moment("calendar") }}</div>
            <v-spacer></v-spacer>
            <div>{{model.locationString}}</div>
          </v-layout>
        </v-card>
      </v-flex>




      <v-flex class="mb-1">
        <v-card>
          <v-container>
            <v-layout column>
              <v-flex>
                wanneer
              </v-flex>
              <v-flex>
                waar
              </v-flex>
              <v-flex>
                Golf data
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>




      <v-card>
        <!-- TODO: we should make a map of sportTypes to images -->


        <v-card-text>
          <p class="subheading">Information:</p>
          <p class="body-1">{{model.specialWishes || 'None'}}</p>
          <!-- <location-view :location="model.location" :width="'100%'" :height="'200px'"></location-view> -->
        </v-card-text>
        <v-card-actions>
          <v-btn flat v-if="!model.inviteOnly">Share</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            More Info
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="show">
            <p class="title">General Information</p>
            <v-layout row wrap>

              <!-- Booleans -->

              <v-flex lg4 sm6 xs12>
                <v-checkbox
                  label="Competitive"
                  v-model="model.competition"
                  disabled
                ></v-checkbox>
              </v-flex>

              <v-flex lg4 sm6 xs12>
                <v-checkbox
                  label="International"
                  v-model="model.international"
                  disabled
                ></v-checkbox>
              </v-flex>

              <v-flex xs12></v-flex>

              <v-flex sm6 xs12>
                <p class="subheading">Preferred Group Size: {{model.prefGroupSize}} Players</p>
              </v-flex>
              <v-flex sm6 xs12>
                <p class="subheading">Preferred Group Composition: {{model.prefGameSex}}</p>
              </v-flex>
            </v-layout>

            <br>
            <v-divider></v-divider>
            <br>

            <!-- Specific Game Information -->

            <p class="title">Game-Specific Information</p>
            <golf-show v-if="this.subModel.buggie !== undefined" :model="this.subModel"></golf-show>

            <br>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
    </v-layout>
    <!-- <br>
    <p class="title text-xs-center" v-if="messages.length > 0">Messages</p>
    <message-show v-for="message in messages" :model="message" :key="message.key"></message-show> -->
  </v-container>
</template>

<script>
import GameModel, { CollectionGameMap } from '../../models/GameModel'
import GolfShow from './components/GolfGame/Show'
import MessageShow from './components/Messages/Show'
import LocationView from '../Shared/LocationView'

export default {
  data: () => ({
    show: false,
    model: undefined,
    subModel: {},
    messages: [],
    error: ''
  }),
  created: function () {
    this.initModel(this.$route.params.id)
  },
  methods: {
    initModel: async function (gameId) {
      this.model = await GameModel.getFromRef(GameModel.getNormalRef(GameModel).doc(gameId), GameModel, this.onFailure)
      console.log(this.model)
      let subClass = CollectionGameMap[this.model.subGame.path.split('/')[0]]
      console.log(this.model.subGame)
      this.subModel = await GameModel.getFromRef(this.model.subGame, subClass, this.onFailure)
      // this.messages = await this.model.getFirstXMessages(0, 100, error => { this.error = error.message })
      this.messages = await this.model.initSubcollection('Messages', this.onFailure)

      console.log(this.model)
      console.log(this.subModel)
      console.log(this.messages)
    },
    onFailure: function (error) {
      this.error = error.message
    }
  },
  components: {
    'golf-show': GolfShow,
    'message-show': MessageShow,
    'location-view': LocationView
  }
}
</script>

<style scoped>
  .list {
    width: 100%;
    padding: 0;
  }
</style>
