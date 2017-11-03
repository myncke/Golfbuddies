<template>
  <v-container fluid class="pa-0" grid-list-lg>
    <group-search class="hidden-sm-and-down" v-on:search-selected="(club) => { goToGroupDetails(club.key) }" style="width: 100%; padding: 10px;"></group-search>
    <v-layout row wrap>
      <v-flex xs12 v-for="club in clubModels" :key="club.key">

        <v-card color="blue-grey darken-1" class="white--text">
          <v-card-title primary-title>
            <v-flex column>
              <div class="headline">{{getStringUtils().capitalize(club.name)}}</div>
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
  import GroupSearch from '../Shared/Search/GroupSearch'
  import StringUtils from '../../utils/StringUtils'

  // TODO: Use this to make a my clubs page aswell, easiest is to wrap this in a bigger GroupIndex and then pass the prop by checking the route params
  let typeMap = {
    'open': SportClubModel.getPublicClubs,
    'my': SportClubModel.getMyClubs
  }

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
        this.type = this.$route.params.type || 'open'
        this.clubModels = []
        let list = (await typeMap[this.type](error => { this.error = error }))
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
