<template>
  <v-container v-if="club !== undefined" class="pa-0 ma-0" fluid>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-media :src="club.headerPic" height="400px">
            <v-container class="ma-0 container-text-gradient" fluid>
              <v-layout column align-left justify-end>
                <h1 class="white--text display-2">{{club.name}}</h1>
                <h2 class="white--text subheading">{{club.information}}</h2>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>

      <v-tabs fixed icons centered>
        <v-tabs-bar class="white">
          <v-tabs-slider class="yellow"></v-tabs-slider>
          <v-tabs-item
            v-for="i in items"
            :key="i"
            :href="'#tab-' + i"
          > <v-icon>phone</v-icon>
            {{ i }}
          </v-tabs-item>
        </v-tabs-bar>
        <v-divider></v-divider>

        <v-tabs-items>
          <v-tabs-content
            v-for="i in items"
            :key="i"
            :id="'tab-' + i"
          >
            <v-card flat>
              <v-card-text>{{ text }}</v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>

      <v-card>
        <v-card-actions>
          <v-btn icon @click.native="showMembers = !showMembers; showLocation = false">
            <v-icon>{{ showMembers ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
          <p>Members</p>
          <v-spacer></v-spacer>
          <p>Location</p>
          <v-btn icon @click.native="showLocation = !showLocation; showMembers = false">
            <v-icon>{{ showLocation ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="showLocation">
            <location-view v-if="club.location !== undefined" :location="club.location"></location-view>
          </v-card-text>
        </v-slide-y-transition>
        <v-slide-y-transition>
          <v-card-text v-show="showMembers">
            <div v-for="member in members">
              <img :src="makeInitialsImage(member)" class="initials-img" /><p class="member subheading">{{member.firstName}} {{member.lastName}} - {{member.nickname}}</p>
            </div>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
      <p class="title text-xs-center" style="margin: 10px;">Games</p>
      <div style="width: 100%">
        <ul v-for="game in games" :key="game.key">
          <game-card :game="game"></game-card>
        </ul>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'
  import UserModel from '../../models/UserModel'
  import ImageUtils from '../../utils/ImageUtils'
  import GolfGameModel from '../../models/GolfGameModel'
  import GameCard from '../Event/components/GameCard.vue'
  import LocationView from '../Shared/LocationView'

  export default {
    data: () => ({
      club: undefined,
      members: [],
      games: [],
      showLocation: false,
      showMembers: false,
      items: ['Messages', 'Events', 'Members', 'Location'],
      text: 't d.'
    }),
    created: function () {
      this.initClub()
    },
    methods: {
      initClub: function () {
        let groupId = this.$route.params.id
        console.log(new SportClubModel(groupId, false, (model) => {
          this.club = model
          this.initMembers(model)
          this.initGames(model)
        }, error => { this.error = error.message }))
      },
      initMembers: async function (club) {
        for (let member of Object.keys(club.members)) {
          console.log(member)
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
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      }
    },
    components: {
      'game-card': GameCard,
      'location-view': LocationView
    }
  }
</script>

<style scoped>

  .container-text-gradient {
    background: linear-gradient(rgba(0,0,0,0.0) 70%, rgba(0,0,0,0.8));
  }

  @media screen and (max-width: 480px) {
    .resize-parallax {
      height: 200px;
    }
  }
  .initials-img {
    width: 40px;
    height: 40px;
    display: inline;
  }

  .member {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    margin-left: 5px;
  }
</style>
