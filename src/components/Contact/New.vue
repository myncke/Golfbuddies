<template>
  <v-container>
    <v-card>
      <div class="pa-3">
        <p class="title">Search a user to befriend</p>
        <p class="caption">On their profile, there will be a button 'Add Friend'</p>
      </div>
      <v-card-content>
        <user-search v-on:search-selected="selectedUser" :toolbar="false" style="width: 100%;" class="pa-3"></user-search>
      </v-card-content>
    </v-card>
  </v-container>
</template>

<script>
  import UserSearch from '../Shared/Search/UserSearch'
  export default {
    data: () => ({

    }),
    methods: {
      selectedUser (user) {
        this.$router.push({name: 'profile', params: {id: user.key}})
      }
    },
    components: {
      'user-search': UserSearch
    }
  }

</script>

<style>

</style>
