<template>
  <v-container fluid style="min-height: 0;" grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm6 lg4 v-for="club in clubModels" :key="club.key">

        <v-card color="blue-grey darken-1" class="white--text">
          <v-card-title primary-title>
            <v-flex column>
              <div class="headline">{{club.name}}</div>
              <div>{{club.information}}</div>
            </v-flex>
          </v-card-title>
          <v-card-actions>
            <v-btn flat dark @click="goToGroupDetails(club.key)">View</v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'

  export default {
    data: () => ({
      clubModels: [],
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
      },
      goToGroupDetails: function (key) {
        console.log('Redirecting')
        this.$router.push({
          name: 'group', params: { id: key }
        })
      }
    }
  }
</script>
