<template>
  <v-app id="app">

    <v-layout v-if="userIsAuthenticated">
      <!-- <sidebar ref="drawer"></sidebar> -->
      <v-toolbar color="green darken-1" dark app clipped-left fixed dense style="z-index: 10000">
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="$refs.drawer.switchOpenState()"></v-toolbar-side-icon>
          <v-btn :to="'/'" flat dark>
            Golfbuddies
          </v-btn>
        </v-toolbar-title>
        <user-search class="hidden-sm-and-down" v-on:search-selected="goToProfile"></user-search>
        <v-spacer></v-spacer>
        <v-btn flat :to="'/contacts'">
          <v-icon left>contacts</v-icon>
          <p class="hidden-sm-and-down subheading mb-0">Contacts</p>
        </v-btn>
        <v-btn flat @click="$store.dispatch('signUserOut')">
          <v-icon left>lock_open</v-icon>
          <p class="hidden-sm-and-down subheading mb-0"> SIGN OUT</p>
        </v-btn>
        <notifications></notifications>
      </v-toolbar>

      <main>
        <v-content>
          <v-container fluid fill-height class="pa-0">
            <v-layout row>
              <v-flex sm3>
                <user-aside></user-aside>
              </v-flex>

              <v-flex sm6>
                <v-container>
                  <router-view transition="slide-x-transition"></router-view>
                </v-container>
              </v-flex>

              <v-flex sm3>
                <user-events> </user-events>
              </v-flex>


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
  import Notifications from './components/Main/Notifications.vue'

  import MainAside from './components/Main/Aside'
  import MainEvents from './components/Main/Events'

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
      'user-search': UserSelection,
      'user-aside': MainAside,
      'user-events': MainEvents,
      'notifications': Notifications
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

  user-search {
    height: 20px;
  }
</style>
