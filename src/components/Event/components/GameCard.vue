<template>
  <v-container fluid class="mobile-margin">
    <v-layout>
      <v-flex>
        <v-card v-if="model !== undefined && model.game !== undefined">
          <v-card-media height="250px" v-if="model.game.location">
            <location-view :location="model.game.location"></location-view>
          </v-card-media>
          <v-card-text primary-title>
            <div>
              <span class="grey--text">{{model.game.date.toDateString()}}</span><br>
              <h3 class="headline mb-0">Mats Myncke</h3>
              <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              <!-- <game-card-info> </game-card-info> -->
            </div>
          </v-card-text>
          <!-- <v-card-actions>
            <v-btn flat v-if="model.buggie"><v-icon>child_friendly</v-icon></v-btn>
            <v-btn flat v-if="model.game.international"><v-icon>public</v-icon></v-btn>
            <v-btn flat v-if="model.game.competition"><v-icon >error_outline</v-icon></v-btn>
            <v-btn flat v-if="model.overnight"><v-icon>airline_seat_individual_suite</v-icon></v-btn>
          </v-card-actions> -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn flat color="green">Join</v-btn>
            <v-btn flat color="orange">Explore</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import GameModel, { CollectionGameMap } from '../../../models/GameModel'
  import LocationView from '../../../components/Shared/LocationView'
  import UserModel from '../../../models/UserModel'
  import ImageUtils from '../../../utils/ImageUtils'

  import GameCardInfo from './GameCardInfo'

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
      }
    },
    components: {
      'location-view': LocationView,
      'game-card-info': GameCardInfo
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

  @media screen and (max-width: 480px) {
    .mobile-margin {
      margin-left: 0px;
      margin-right: 0px;
      padding: 3px 3px 8px 3px;
  }
}
</style>
