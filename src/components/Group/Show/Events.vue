<template>
  <v-layout>
    <v-flex v-if="events.length && events">
      <template v-for="event in events">
        <event-card :game="event" :key="event.key"></event-card>
      </template>
    </v-flex>

    <v-flex v-else>
      No upcoming events
    </v-flex>
  </v-layout>
</template>

<script>
  import EventCard from '../../Event/components/GameCard'

  export default {
    data: () => ({
    }),
    props: {
      events: Array
    },
    created: function () {
    },
    methods: {
    },
    components: {
      'event-card': EventCard
    }
  }
</script>