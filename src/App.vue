<template>
  <v-app id="app">

    <v-layout v-if="userIsAuthenticated">
      <sidebar ref="drawer"></sidebar>
      <v-toolbar class="gradient" color="green darken-1" dark app clipped-left fixed style="z-index: 10000">
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="$refs.drawer.switchOpenState()"></v-toolbar-side-icon>
            Golfbuddies
        </v-toolbar-title>
        <user-search class="hidden-sm-and-down" v-on:search-selected="goToProfile" small style="width:25%" ></user-search>
        
        <v-spacer></v-spacer>
        <v-btn flat :to="'/calendar'" class="hidden-xs-only" style="min-width:50px;">
          <v-icon>events</v-icon> <p class="hidden-sm-and-down subheading mb-0">Calendar</p> 
        </v-btn>
        <notifications class="mobile-notifications"></notifications>
        <v-btn flat right @click="$store.dispatch('signUserOut')" class="hidden-xs-only">
          <v-icon left>lock_open</v-icon>
          <p class="hidden-sm-and-down subheading mb-0"> SIGN OUT</p>
        </v-btn>

        <div class="hidden-sm-and-up mobile-menu">
          <v-menu offset-y>
            <v-btn color="" flat dark slot="activator" class="" > <v-icon class="pa-0">more_vert</v-icon> </v-btn>
            <v-list>
              <v-list-tile>
                <v-btn flat :to="'/calendar'" class="pa-0">
                  <v-icon right>events</v-icon> <p class="subheading mb-0">Calendar</p> 
                </v-btn>
              </v-list-tile>

              <v-list-tile>
                <v-btn flat right @click="$store.dispatch('signUserOut')" >
                  <v-icon>lock_open</v-icon>
                  <p class="subheading mb-0"> SIGN OUT</p>
                </v-btn>
              </v-list-tile>

            </v-list>
          </v-menu>
        </div>
      </v-toolbar>

      <main>
        <v-content>
          <v-container fluid class="pa-0 pb-5 green lighten-4" style="min-height:calc(100vh - 48px);" >
            <v-layout row>

              <v-flex sm10 xs12 offset-sm1>
                <v-container class="pt-5">
                  <router-view transition="slide-x-transition"></router-view>
                </v-container>
              </v-flex>

            </v-layout>
          </v-container>
        </v-content>
        <!-- <v-footer class="pa-3">
          <v-spacer></v-spacer>
          <div>© {{ new Date().getFullYear() }}</div>
        </v-footer> -->
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
      drawer: true
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

  .gradient {
    background: #11998e;  /* fallback for old browsers */
    background: -webkit-linear-gradient(120deg, #4caf50, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(120deg, #4caf50, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  @media screen and (max-width: 600px) {
    .mobile-notifications {
      /* margin: 0px; */
      width: 25px;
      z-index: 100;
    }

    .mobile-menu {
      margin-right: 0px !important;
      /* width: 24px; */
      /* margin: 0px; */
    }

    .mobile-menu > div.menu {
      /* width: 24px; */
    }
  }

</style>
