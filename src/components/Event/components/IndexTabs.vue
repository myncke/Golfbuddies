<template>
    <v-tabs fixed>
      <v-tabs-bar class="white">
        <v-tabs-slider color="green"></v-tabs-slider>
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab"
          :href="'#tab-' + tab"
          ripple
          @click="initTab(tab)"
        >
          {{ tab }}
        </v-tabs-item>
      </v-tabs-bar>
      <v-divider></v-divider>

      <v-tabs-items>
        <v-tabs-content
          v-for="tab in tabs"
          :key="tab"
          :id="'tab-' + tab"
        >

        <v-card flat class="content">
          <v-layout row wrap v-if="tab == 'Explore'">
            <v-flex v-for="game in exploreData.games" :key="game.key" xs12 sm6 lg4>
              <game-card :game="game"></game-card>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="tab == 'Calendar'">
            <v-flex v-for="game in exploreData.games" :key="game.key" xs12>
              <game-card :game="game"></game-card>
            </v-flex>
          </v-layout>

          <v-layout row wrap v-if="tab == 'Clubs'">
            <v-flex v-for="game in exploreData.games" :key="game.key" xs12>
              <game-card :game="game"></game-card>
            </v-flex>
          </v-layout>
        </v-card>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
</template>

<script>
  import GameCard from './GameCard.vue'
  import GameModel from '../../../models/GameModel'

  export default {
    data () {
      return {
        tabs: ['Explore', 'Calendar', 'Clubs'],
        exploreData: {
          games: []
        }
      }
    },
    created: function () {
      this.initExplore()
    },
    methods: {
      initTab: async function (tab) {
        if (tab === 'Explore') {
          this.initExplore()
        }
      },
      initExplore: async function () {
        this.exploreData.games = await GameModel.getAllOpenGames(error => { this.error = error.message })
        console.log(this.exploreData.games)
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
