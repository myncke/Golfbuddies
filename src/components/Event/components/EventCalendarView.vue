<template>
  <full-calendar :config="{contentHeight: 400}" v-on:event-selected="eventSelected" defaultView="month" :events="events"></full-calendar>
</template>

<script>
  export default {
    data: () => ({
      events: []
    }),
    props: {
      games: Array
    },
    watch: {
      games: function (newVal) {
        this.events = []
        for (let game of this.games) {
          this.events.push({
            title: game.title,
            start: game.date,
            color: 'yellow',
            textColor: 'black',
            id: game.key
          })
        }
        console.log(this.events)
      }
    },
    methods: {
      eventSelected: function (event, jsEvent, view) {
        this.$router.push({name: 'event', params: {id: event.id}})
      }
    }
    /* created: function () {
    } */
  }
</script>

<style scoped>
  @import '~fullcalendar/dist/fullcalendar.css';
</style>
