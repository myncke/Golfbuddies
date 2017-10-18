<template>
  <v-app id="app">

    <sidebar :open="drawer"></sidebar>

    <v-toolbar color="green darken-1" dark app clipped-left fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3" >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        Golfbuddies
      </v-toolbar-title>
      <v-text-field solo prepend-icon="search" placeholder="Search" class="hidden-sm-and-down"></v-text-field>
      <!-- <v-spacer></v-spacer> -->
      <v-btn flat :to="'/profile'">
        <v-icon left>person</v-icon>
        Profile
      </v-btn>
      <v-btn flat :to="'/signup'">
        <v-icon left>face</v-icon>
        Sign up
      </v-btn>
      <v-btn flat @click="openModal()">
        <v-icon left>lock_open</v-icon>
        Sign in
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
    </main>

    <signin ref="signInModal"></signin>

    <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
  import signin from './components/User/Signin'
  import sidebar from './components/Sidebar'

  export default {
    name: 'app',
    computed: {
      menuAuthItems () {
        let items = [
          {icon: 'face', title: 'Sign up', link: '/signup'},
          {icon: 'lock_open', title: 'Sign ip', link: '/signip'}
        ]

        if (this.userIsAuthenticated) {
          items = [
           {icon: 'face', title: 'Sign up', link: '/signup'}
          ]
        }
        return items
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    data: () => ({
      dialog: false,
      drawer: false
    }),
    methods: {
      openModal: function () {
        this.$refs.signInModal.changeModal(true)
      }
    },
    props: {
      source: String
    },
    components: {
      'signin': signin,
      'sidebar': sidebar
    }
  }
</script>