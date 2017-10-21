<template>
  <v-container v-if="club !== undefined" class="pa-0 ma-0" fluid>
    <v-layout column>
      <v-flex>
        <v-card>
          <v-card-media :src="club.headerPic" height="400px">
            <v-parallax :src="club.headerPic" class="resize-parallax">
              <v-layout column align-left justify-end style="width:100%;">
                <!-- <h1 class="white--text">{{club.name}}</h1>
                <h4 class="white--text">Build your application today!</h4> -->
              </v-layout>
            </v-parallax>
          </v-card-media>
        </v-card>
      </v-flex>
      <v-card>
        <v-card-title primary-title>
          <p class="text-xs-center headline" style="width: 100%">{{club.name}}</p>
        </v-card-title>
        <v-card-text style="margin: 10px">
          <p>{{club.information}}</p>
          <v-divider style="margin: 10px"></v-divider>
        </v-card-text>
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
      showMembers: false
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

  .resize-parallax {
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center; 
    width: 100%;
    height: auto;
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
