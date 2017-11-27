<template>
  <v-app id="app">

    <v-layout v-if="userIsAuthenticated">
      <sidebar ref="drawer"></sidebar>
      <v-toolbar color="green darken-1" dark app clipped-left fixed dense style="z-index: 10000">
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="$refs.drawer.switchOpenState()"></v-toolbar-side-icon>
          <v-btn :to="'/'" flat dark>
            Golfbuddies
          </v-btn>
        </v-toolbar-title>
        
        <v-spacer></v-spacer>
        <v-btn flat :to="'/contacts'" class="hidden-sm-and-up" style="min-width:50px;">
          <v-icon>contacts</v-icon>
        </v-btn>
        <notifications></notifications>
        <v-btn flat right @click="$store.dispatch('signUserOut')" class="hidden-xs-only">
          <v-icon left>lock_open</v-icon>
          <p class="hidden-sm-and-down subheading mb-0"> SIGN OUT</p>
        </v-btn>
      </v-toolbar>

      <main>
        <v-content>
          <v-container fluid fill-height class="pa-0">
            <v-layout row>
              <!-- <v-flex sm3 class="hidden-xs-only">
                <aside-left ></aside-left>
              </v-flex> -->

              <v-flex sm10 xs12 offset-xs1>
                <v-container class="pt-5">
                  <router-view transition="slide-x-transition"></router-view>
                </v-container>
              </v-flex>

              <!-- <v-flex sm3 class="hidden-xs-only">
                <aside-right> </aside-right>
              </v-flex> -->

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

  import AsideLeft from './components/Main/AsideLeft'
  import AsideRight from './components/Main/AsideRight'

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
      'aside-left': AsideLeft,
      'aside-right': AsideRight,
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

  main > div.content{
    /* padding: 48px 0px !important; */
  }
</style>
