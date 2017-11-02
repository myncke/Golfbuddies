<template>
    <v-tabs fixed>
      <v-tabs-bar class="white">
        <v-tabs-slider color="green"></v-tabs-slider>
        <v-tabs-item
          v-for="tab in tabs"
          :key="tab"
          :href="'#tab-' + tab"
          ripple
          @click="() => { currentTab = tab }"
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
            <calendar-view :games="exploreData.games"></calendar-view>
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
  import CalendarView from './EventCalendarView'

  export default {
    data () {
      return {
        tabs: ['Explore', 'Calendar', 'Clubs'],
        currentTab: 'Explore',
        exploreData: {
          games: []
        }
      }
    },
    props: {
      filter: Object
    },
    watch: {
      filter: function (newValue) {
        this.initTab(this.currentTab)
      },
      currentTab: function (newValue) {
        this.initTab(newValue)
        console.log(newValue)
      }
    },
    created: function () {
      this.initTab(this.currentTab)
    },
    methods: {
      initTab: async function (tab) {
        if (tab === 'Explore') {
          this.initExplore()
        }
      },
      initExplore: async function () {
        console.log(this.filter)
        this.exploreData.games = await GameModel.getAllGamesWithFilter(this.filter, error => { throw error })
        console.log(this.exploreData.games)
      }
    },
    components: {
      'game-card': GameCard,
      'calendar-view': CalendarView
    }
  }
</script>

<style>
.content.card.card--flat {
  background-color: transparent;
}
</style>
