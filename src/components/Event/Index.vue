<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout>
      <v-flex>
        <filter-view :type="'events'" v-on:filter-update="(filterObject) => currentFilter = filterObject"></filter-view>
        <index-tabs :filter="currentFilter"></index-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import IndexTabs from './components/IndexTabs'
  import Filter from '../Shared/filter'

  export default {
    data: () => ({
      currentFilter: {}
    }),
    methods: {
    },
    components: {
      'index-tabs': IndexTabs,
      'filter-view': Filter
    }
  }
</script>
