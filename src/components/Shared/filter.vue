<template>
  <v-container fluid class="ma-0 pa-0" >
    <v-layout>
      <v-flex>
        <v-expansion-panel>
          <v-expansion-panel-content v-model="open">
            <v-divider></v-divider>
            <div slot="header">
              <v-icon class="mr-3" left>filter_list</v-icon> Filters
              <!-- <v-icon class="ml-5">event</v-icon>
              <span class="ml-3">Oct.</span>
              <span class="ml-1">2017</span> -->
            </div>
            <v-card>
              <v-card-text class="grey lighten-5">
                <event-filter v-if="type === 'events'" ref="filter"></event-filter>
                <v-layout row>
                  <v-spacer></v-spacer>
                  <v-btn class="ml-5" color="primary" @click="updateFilters">Update Filters</v-btn>
                </v-layout>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EventFilter from '../Shared/EventFilter.vue'

  export default {
    data: () => ({
      open: false
    }),
    props: {
      type: String
    },
    methods: {
      updateFilters: function () {
        let object = this.$refs.filter.getFilterObject()
        console.log(object)
        this.$emit('filter-update', object)
      }
    },
    components: {
      'event-filter': EventFilter
    }
  }
</script>

<style>

</style>
