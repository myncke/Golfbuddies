<template>
  <v-layout row wrap>
    <v-flex xs12>
      <p class="title">Admin Events Page</p>
    </v-flex>
    <v-flex lg6 xs12 v-for="event of currentEvents" :key="event.key">
      <div class="eventcard"></div>
      <event-card :game="event"></event-card>
      <v-btn color="primary" class="deletebutton" @click="deleteModel(event)" block>Delete Game</v-btn>
      <v-divider></v-divider>
    </v-flex>
  </v-layout>
</template>

<script>
  import GameModel from '../../../models/GameModel'
  import EventCard from '../../Event/components/GameCard'

  export default {
    data: () => ({
      currentEvents: [],
      allEvents: [],
      startAt: 0
    }),
    created () {
      this.next()
    },
    watch: {
      startAt: function (newVal) {
        this.$emit('retrieved-models', Math.min(this.startAt, this.allEvents.length))
      }
    },
    methods: {
      deleteModel: async function (event) {
        event.deleteObject()
        this.currentEvents = this.currentEvents.filter((model) => model.key !== event.key)
        this.allEvents = this.allEvents.filter((model) => model.key !== event.key)
      },
      next: async function () {
        this.$emit('loading', true)
        let startAfter = [null, null]
        if (this.currentEvents !== undefined && this.currentEvents.length > 0) {
          let last = this.currentEvents[this.currentEvents.length - 1]
          startAfter = [last.date, last.title]
        }
        if (this.allEvents.length < this.startAt + 1) {
          await this.allEvents.push(...(await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).orderBy('date').orderBy('title').limit(this.limit).startAfter(startAfter[0], startAfter[1]), GameModel, error => { console.log(error) })))
        }
        this.currentEvents = undefined
        this.currentEvents = this.allEvents.slice(this.startAt, this.startAt + this.limit)
        this.startAt += this.limit
        this.$emit('loading', false)
      },
      previous: async function () {
        console.log(this.currentEvents)
        console.log(this.allEvents.slice(this.startAt - this.limit, this.startAt))
        this.startAt -= this.limit
        this.currentEvents = undefined
        this.currentEvents = this.allEvents.slice(this.startAt - this.limit, this.startAt)
        console.log(this.startAt, this.limit)
      }
    },
    props: {
      limit: Number
    },
    components: {
      'event-card': EventCard
    }
  }
</script>

<style scoped>
  .eventcard{
    margin-top: 20px;
  }
  .deletebutton{
    margin-bottom: 20px;
  }
</style>
