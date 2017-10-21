<template>
  <v-card style="margin: 10px" v-if="model != undefined && model.game != undefined" >
    <v-card-text>
      <v-layout row>
        <v-spacer></v-spacer>
        <p class="d-inline-block title">{{model.game.date.toDateString()}}</p>
      </v-layout>


      <!-- BOOLEANS -->

      <v-layout row wrap>
        <v-flex lg3 sm6 xs12>
          <v-checkbox label="International"
                      color="primary"
                      :input-value="model.game.international"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12>
          <v-checkbox label="Competition"
                      color="primary"
                      :input-value="model.game.competition"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12 v-if="model.buggie !== undefined">
          <v-checkbox label="Buggie"
                      v-model="model.buggie"
                      color="primary"
                      :input-value="model.buggie"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
        <v-flex lg3 sm6 xs12 v-if="model.overnight !== undefined">
          <v-checkbox label="Overnight"
                      color="primary"
                      :input-value="model.overnight"
                      value
                      disabled
                      hide-details></v-checkbox>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <!-- Default information -->

      <v-layout row wrap style="margin-top: 10px">
        <v-flex sm6 xs12>
          <p class="subheading">Preferred Group Size: {{model.game.prefGroupSize}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Current Group Size: {{model.participants.length}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Preferred Group: {{model.game.prefGameSex}}</p>
        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <!-- SportType specific information -->

      <v-layout row v-if="model.buggie !== undefined">
        <v-flex sm6 xs12>
          <p class="subheading">Minimum Handicap: {{model.minHdc}}</p>
        </v-flex>
        <v-flex sm6 xs12>
          <p class="subheading">Round Price: {{model.roundPrice}}</p>
        </v-flex>
      </v-layout>

      <!-- TODO: make a page where a user can sign up for a game -->
      <!-- TODO: make sure the user is the correct gender before they can join  -->
      <v-btn block color="green" class="white--text" :disabled="(model.participants.length > model.game.prefGroupSize)" @click="openJoin()">Join Game!</v-btn>
      <v-btn block color="blue" class="white--text" @click="'TODO!!!'">Open Game Page</v-btn>
      <join-dialog ref="join" :gameModel="model.game"></join-dialog>
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
      <v-card-text v-show="showLocation" v-if="model.game.location !== undefined">
        <location-view :location="model.game.location"></location-view>
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-card-text v-show="showMembers">
        <div v-for="member in model.participants">
          <img :src="makeInitialsImage(member.user)" class="initials-img" /><p class="member subheading">{{member.user.firstName}} {{member.user.lastName}} - {{member.user.nickname}}</p>
          <p class="subheading">Special Wishes: </p>
          <p>{{member.user.specialWishes}}</p>
          <v-divider></v-divider>
        </div>
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
  import GameModel, { CollectionGameMap } from '../../../models/GameModel'
  import LocationView from '../../../components/Shared/LocationView'
  import UserModel from '../../../models/UserModel'
  import ImageUtils from '../../../utils/ImageUtils'
  import GameJoin from '../../Event/Join'

  export default {
    data: () => ({
      model: undefined,
      showLocation: false,
      showMembers: false,
      checked: true
    }),
    props: {
      game: Object
    },
    created: function () {
      this.model = this.game
      if (this.model !== undefined) {
        this.initGame()
      }
    },
    methods: {
      initGame: async function () {
        let model
        if (this.model.gameKey !== undefined) {
          let game = await GameModel.getFromRef(this.model.gameKey, GameModel, error => { this.error = error.message })
          model = this.model
          model.game = game
          model.participants = (await this.initParticipants(game)) || []
          this.model = undefined
          this.model = model
          console.log(this.model)
        } else if (this.model.subGame !== undefined) {
          let game = this.game
          let modelClass = CollectionGameMap[this.model.subGame.path.split('/')[0]]
          model = await modelClass.getFromRef(this.model.subGame, modelClass, error => { throw error })
          model.game = game
          model.participants = (await this.initParticipants(model.game)) || []
          this.model = undefined
          this.model = model
          console.log('MODELERONI')
          console.log(this.model)
        }
      },
      initParticipants: async function (game) {
        try {
          let subCol = await game.initSubcollection('GameUsers', error => { this.error = error.message })
          for (let doc of subCol) {
            doc.user = await UserModel.getFromRef(UserModel.getNormalRef(UserModel).doc(doc.key), UserModel, error => { this.error = error.message })
          }
          return subCol
        } catch (error) {
          console.log(error)
          return []
        }
      },
      makeInitialsImage: function (user) {
        return ImageUtils.makeInitialsImage(user)
      },
      openJoin: function () {
        this.$refs['join'].openDialog()
      }
    },
    components: {
      'location-view': LocationView,
      'join-dialog': GameJoin
    }
  }

</script>

<style scoped>
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
