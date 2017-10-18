<template>
  <div style="width: 100%; margin-bottom: 80px"  v-if="club !== undefined">
    <img :src="club.headerPic" class="header-img"/>
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
          <iframe width="100%" height="450" frameborder="0" style="border:0;"
                  :src="'https://www.google.com/maps/embed/v1/place?q=' + club.location.latitude + ',+' + club.location.longitude + '&key=AIzaSyDuD6-jAzk7Gk7mko708x0VYslipwsoEt8'" allowfullscreen></iframe>
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
  </div>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'
  import UserModel from '../../models/UserModel'
  import ImageUtils from '../../utils/ImageUtils'
  import GolfGameModel from '../../models/GolfGameModel'
  import GameCard from './components/GameCard.vue'

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
        let groupId = this.$route.params.clubId
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
      'game-card': GameCard
    }
  }
</script>

<style scoped>
  .header-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
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
