<template>
  <v-flex>
    <v-card flat class="content">
      <v-layout row wrap>
        <v-flex v-for="game in exploreData.games" :key="game.key" xs12 sm12 lg12>
          <game-card :game="game"></game-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
  import GameCard from './GameCard.vue'
  import GameModel from '../../../models/GameModel'

  export default {
    data () {
      return {
        exploreData: {
          games: []
        }
      }
    },
    props: {
      filter: Object
    },
    watch: {
      filter () {
        this.init()
      }
    },
    created: function () {
      this.init()
    },
    methods: {
      init: async function () {
        console.log('FILTER', this.filter)
        this.exploreData.games = await GameModel.getAllGamesWithFilter(this.filter, error => { throw error })
        // console.log(this.exploreData.games)
      }
    },
    components: {
      'game-card': GameCard
    }
  }
</script>

<style>
.content.card.card--flat {
  background-color: transparent;
}
</style>
