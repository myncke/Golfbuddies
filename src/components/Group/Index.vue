<template>
  <v-container fluid class="pa-0" grid-list-lg>
    <group-search class="hidden-sm-and-down" v-on:search-selected="(club) => { goToGroupDetails(club.key) }" style="width: 100%;"></group-search>
    <v-layout row wrap>
      <v-flex xs12 v-for="club in clubModels" :key="club.key">

        <v-card class="white--text cover"
          :style="{ backgroundImage: 'url('+ club.headerPic + ')' }">
          <v-card-title primary-title class="cover">
            <v-flex column>
              <div class="headline">{{getStringUtils().capitalize(club.name)}}</div>
              <div>{{club.information}}</div>
            </v-flex>
          </v-card-title>
          <v-card-actions class="cover">
            <v-btn flat dark @click="goToGroupDetails(club.key)">View</v-btn>
          </v-card-actions>
        </v-card>

        <div>
          <!-- {{console.log(club)}} -->
        </div>


      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import SportClubModel from '../../models/SportClubModel'
  import GroupSearch from '../Shared/Search/GroupSearch'
  import StringUtils from '../../utils/StringUtils'

  /* Maybe later
  let typeMap = {
    'open': SportClubModel.getPublicClubs,
    'my': SportClubModel.getMyClubs
  } */

  export default {
    data: () => ({
      clubModels: [],
      type: '',
      error: ''
    }),
    created: function () {
      this.initModels()
    },
    watch: {
      $route: function (newVal) {
        this.initModels()
      }
    },
    methods: {
      initModels: async function () {
        // this.type = this.$route.params.type || 'open'
        // let list = (await typeMap[this.type](error => { this.error = error }))

        this.clubModels = []
        let result = {}
        let list = await SportClubModel.getPublicClubs(error => { this.error = error.message })
        list.forEach((element) => { result[element.key] = element })
        list = await SportClubModel.getMyClubs(error => { this.error = error.message })
        list.forEach((element) => { result[element.key] = element })
        console.log(Object.values(result))
        this.clubModels = Object.values(result)
      },
      goToGroupDetails: function (key) {
        this.$router.push({
          name: 'group', params: { id: key }
        })
      },
      getStringUtils: function () {
        return StringUtils
      }
    },
    components: {
      'group-search': GroupSearch
    }
  }
</script>

<style scoped>
  .cover {
     background: linear-gradient(to left,rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.8));
  }
</style>

