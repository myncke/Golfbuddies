<template>
  <v-app id="app">

    <v-layout v-if="userIsAuthenticated">
      <sidebar ref="drawer"></sidebar>
      <v-toolbar color="green darken-1" dark app clipped-left fixed>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3" >
          <v-toolbar-side-icon @click.stop="$refs.drawer.switchOpenState()"></v-toolbar-side-icon>
          Golfbuddies
        </v-toolbar-title>
        <user-search v-on:search-selected="goToProfile"></user-search>
        <v-spacer></v-spacer>
        <v-btn flat @click="$store.dispatch('signUserOut')">
          <v-icon left>lock_open</v-icon>
          <p class="hidden-sm-and-down subheading mb-0"> SIGN OUT</p>
        </v-btn>
      </v-toolbar>

      <main>
        <v-content>
          <v-container fluid fill-height class="pa-0">
            <v-layout>
              <router-view></router-view>
            </v-layout>
          </v-container>
        </v-content>
        <v-footer class="pa-3">
          <v-spacer></v-spacer>
          <div>© {{ new Date().getFullYear() }}</div>
        </v-footer>
      </main>
    </v-layout>

    <v-container v-else fluid fill-height class="pa-0">
      <landing></landing>
    </v-container>

  </v-app>
</template>

<script>
  import sidebar from './components/Shared/Sidebar'
  import landing from './components/Static/Landing'
  import UserSelection from './components/Shared/Search/UserSearch.vue'

  export default {
    name: 'app',
    computed: {
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    data: () => ({
      drawer: false
    }),
    props: {
      source: String
    },
    components: {
      'sidebar': sidebar,
      'landing': landing,
      'user-search': UserSelection
    },
    methods: {
      goToProfile: function (user) {
        this.$router.push({name: 'profile', params: {id: user.key}})
      }
    }
  }
</script>

<style>
main {
  width: 100%;
}
</style>
