<template>
  <full-calendar :config="{contentHeight: 400}" v-on:event-selected="eventSelected" defaultView="month" :events="events"></full-calendar>
</template>

<script>
  import GameModel from '../../models/GameModel'

  export default {
    data: () => ({
      events: [],
      games: [],
      locationBroadcasts: []
    }),
    watch: {
      games: function (newVal) {
        this.events = []
        for (let game of this.games) {
          this.events.push({
            title: game.title,
            start: game.date,
            color: 'yellow',
            textColor: 'black',
            id: game.key,
            isEvent: true
          })
        }
        console.log(this.events)
      }
    },
    created: function () {
      this.initGames()
      this.initLocationBroadcasts()
    },
    methods: {
      initGames: async function () {
        this.games = await GameModel.getInvitedGames()
      },
      initLocationBroadcasts: async function () {
        // TODO: this
      },
      eventSelected: function (event, jsEvent, view) {
        if(event.isEvent){
          this.$router.push({name: 'event', params: {id: event.id}})
        } else {
          // TODO: make a LocationBroadcast Show
        }
      }
    }
  }

</script>

<style>

</style>
