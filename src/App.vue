<template>
  <v-app id="app">

    <v-layout v-if="userIsAuthenticated">
      <sidebar ref="drawer"></sidebar>
      <v-toolbar color="green darken-1" dark app clipped-left fixed dense>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
          <v-toolbar-side-icon @click.stop="$refs.drawer.switchOpenState()"></v-toolbar-side-icon>
          <v-btn :to="'/'" flat dark>
            Golfbuddies
          </v-btn>
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
            <v-layout row>
              <v-flex sm3>
                <gb-aside></gb-aside>
              </v-flex>

              <v-flex sm6>
                <v-container>
                  <router-view></router-view>
                </v-container>
              </v-flex>

              <v-flex sm3>
                <v-container>
                  <v-card>
                    <v-list two-line>
                      <template v-for="item in items">
                        <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                        <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                        <v-list-tile avatar v-else v-bind:key="item.title" @click="">
                          <v-list-tile-avatar>
                            <img v-bind:src="item.avatar">
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title v-html="item.title"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </template>
                    </v-list>
                  </v-card>
                </v-container>
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
  import UserSelection from './components/Shared/UserSelection'

  import GBAside from './components/Main/Aside'
  import NewEvent from './components/Event/New'

  export default {
    name: 'app',
    computed: {
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    data: () => ({
      drawer: false,
      items: [
        { header: 'This Week' },
        { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
      ]
    }),
    props: {
      source: String
    },
    components: {
      'sidebar': sidebar,
      'landing': landing,
      'user-search': UserSelection,
      'gb-aside': GBAside,
      'new-event': NewEvent
    },
    methods: {
      goToProfile: function (user) {
        // TODO: this when the profile page is merged
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
