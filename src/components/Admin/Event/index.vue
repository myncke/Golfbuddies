<template>
  <v-layout row wrap>
    <v-flex xs12>
      <p class="title">Admin Events Page</p>
    </v-flex>
    <v-flex lg6 xs12 v-for="event of currentmodels" :key="event.key">
      <div class="eventcard"></div>
      <event-card v-if="event !== undefined" :game="event"></event-card>
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
    }),
    created () {
      this.next()
    },
    methods: {
      deleteModel: async function (event) {
        event.deleteObject()
        this.$emit('deleted-model', event)
      },
      addModels: async function (last) {
        let startAfter = [null, null]
        if (last) {
          startAfter = [last.date, last.title]
        }
        return await GameModel.getAllFromRef(GameModel.getNormalRef(GameModel).orderBy('date').orderBy('title').limit(this.limit).startAfter(startAfter[0], startAfter[1]), GameModel, error => { console.log(error) })
      }
    },
    props: {
      limit: Number,
      currentmodels: Array
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
