<template>
  <v-tabs dark v-model="active">
  <v-tabs-bar class="green">
    <v-tabs-item
      v-for="tab in tabs"
      :key="tab"
      :href="'#' + tab"
      ripple
      @click="initTab(tab)"
    >
      {{ tab }}
    </v-tabs-item>
    <v-tabs-slider color="yellow"></v-tabs-slider>
  </v-tabs-bar>
  <v-tabs-items>
    <v-tabs-content
      v-for="tab in tabs"
      :key="tab"
      :id="tab"
    >

      <!-- EXPLORE -->
      <v-layout row wrap v-if="tab === 'Explore'">
        <v-flex v-for="game in exploreData.games" :key="game.key" xs12>
          <game-card :game="game"></game-card>
        </v-flex>
      </v-layout>

      <!-- Calendar -->



      <!-- Clubs -->

    </v-tabs-content>
  </v-tabs-items>
</v-tabs>
</template>
<script>
  import GameCard from '../Group/components/GameCard.vue'
  import GameModel from '../../models/GameModel'
  export default {
    data () {
      return {
        tabs: ['Explore', 'Calendar', 'Clubs'],
        active: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        exploreData: {
          games: []
        }
      }
    },
    created: function () {
      this.initExplore()
    },
    methods: {
      next () {
        this.active = this.tabs[(this.tabs.indexOf(this.active) + 1) % this.tabs.length]
      },
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
<style scoped>
</style>
