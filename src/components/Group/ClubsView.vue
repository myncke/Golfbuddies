<template>
  <ul class="list ma-3">
    <v-flex v-for="club in clubModels" :key="club.key">
      <club-card class="card-container" :club="club"></club-card>
      <v-divider></v-divider>
    </v-flex>
  </ul>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'
  import ClubCard from './components/ClubCard.vue'

  export default {
    data: () => ({
      clubModels: [],
      show: false,
      error: ''
    }),
    created: function () {
      this.initModels()
    },
    methods: {
      initModels: async function () {
        let list = (await SportClubModel.getPublicClubs(error => { this.error = error }))
        list.push(...list)
        list.push(...list)
        list.push(...list)
        this.clubModels = list
      }
    },
    components: {
      'club-card': ClubCard
    }
  }
</script>

<style scoped>
  .list {
    width: 100%;
    padding: 0;
  }

  .card-container {
    margin: 20px;
  }
</style>
