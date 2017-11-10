<template>
  <v-card class="mobile-margin pa-1 mt-1">
    <v-layout v-if="model !== undefined && model.game !== undefined" row>
      <v-flex column sm2 class="pl-0 pr-3 pt-3 pb-3">
        <div class="title text-sm-right">{{ model.game.date | moment("D MMM.") }}</div>
        <div class="text-sm-right">{{ model.game.date | moment("dddd") }}</div>
      </v-flex>

      <v-flex column sm10>
        <v-btn flat nuxt color="primary" class="ma-0 pa-0" @click="goToEvent(model.game.key)">{{model.game.title}}</v-btn>
        <p class="pl-3 ma-0">{{ model.game.date | moment("hh:mm a") }} &#9679; {{model.game.locationString}} </p>
        <div>
          <v-btn small flat value="going" color="blue-grey" class="caption">
            <v-icon left dark color="" class="caption">check</v-icon> Going
          </v-btn>
          <v-btn small flat value="maybe" color="blue-grey" class="caption">
            <v-icon left dark color="" class="body-1">help_outline</v-icon> maybe
          </v-btn>
          <v-btn small flat value="ignore" color="blue-grey" class="caption">
            <v-icon left dark color="" class="caption">clear</v-icon>Ignore
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  import GameModel, { CollectionGameMap } from '../../../models/GameModel'

  export default {
    data: () => ({
      model: undefined
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
          // model.participants = (await this.initParticipants(game)) || []
          this.model = undefined
          this.model = model
        } else if (this.model.subGame !== undefined) {
          let game = this.game
          let modelClass = CollectionGameMap[this.model.subGame.path.split('/')[0]]
          model = await modelClass.getFromRef(this.model.subGame, modelClass, error => { throw error })
          model.game = game
          // model.participants = (await this.initParticipants(model.game)) || []
          this.model = undefined
          this.model = model
        }
      },
      goToEvent: function (key) {
        this.$router.push({
          name: 'event', params: { id: key }
        })
      }
    }
  }

</script>
