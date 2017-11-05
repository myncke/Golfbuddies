<template>
  <v-container v-if="club !== undefined" class="pa-0 ma-0" fluid>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-media :src="club.headerPic" height="200px">
            <v-container class="ma-0 container-text-gradient" fluid>
              <v-layout column align-left justify-end>
                <h1 class="white--text display-2">{{club.name}}</h1>
                <h2 class="white--text subheading">{{club.closed ? 'Public' : 'Private' }} &#9679; {{club.information}}</h2>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>

      <v-tabs class="elevation-1 mt-3" scrollable grow>
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
              <v-layout row wrap v-if="i == 'Events'">
                <events-tab :events="games"></events-tab>
              </v-layout>

              <v-layout row wrap v-if="i == 'Members'">
                <members-tab :members="members"></members-tab>
              </v-layout>

              <v-layout row wrap v-if="i == 'Pictures'">
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

  export default {
    data: () => ({
      club: undefined,
      members: [],
      games: [],
      tabs: ['Events', 'Members', 'Pictures', 'Details']
    }),
    created: function () {
      this.initClub()
    },
    watch: {
      $route: function (newVal) {
        this.initClub()
      }
    },
    methods: {
      initClub: function () {
        this.games = []
        let groupId = this.$route.params.id
        console.log(new SportClubModel(groupId, false, (model) => {
          this.club = model
          this.initMembers(model)
          this.initGames(model)
        }, error => { this.error = error.message }))
      },
      initMembers: async function (club) {
        for (let member of Object.keys(club.members)) {
          // TODO: THIS IS UGLY
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
      }
    },
    components: {
      'events-tab': Events,
      'members-tab': Members,
      'pictures-tab': Pictures,
      'details-tab': Details
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
