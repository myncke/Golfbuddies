<template>
  <v-app id="app">
    <v-navigation-drawer persistent clipped app v-model="drawer">
      <v-list dense>
        <template v-for="(item, i) in items">

          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>

          </v-layout>

          <!-- With Childeren -->
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>

          <!-- Single Tile -->
          <v-list-tile v-else @click="" :key="item.name" :to="item.path">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

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
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 py-4 title">
          Create contact
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import signin from './components/User/Signin'
  export default {
    name: 'app',
    computed: {
      currentUser () {
        return this.$store.getters.currentUser
      }
    },
    data: () => ({
      dialog: false,
      drawer: false,
      items: [
        { icon: 'events', text: 'Events', path: '/events' },
        { icon: 'contacts', text: 'Contacts', path: '/contacts' },
        // { icon: 'history', text: 'Frequently contacted', path: '/events/1' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Groups',
          model: true,
          children: [
            { icon: 'add', text: 'Create Group', path: '/' }
          ],
          path: '/'
        },
        // {
        //   icon: 'keyboard_arrow_up',
        //   'icon-alt': 'keyboard_arrow_down',
        //   text: 'More',
        //   model: false,
        //   children: [
        //     { text: 'Import', path: '/' },
        //     { text: 'Export', path: '/' },
        //     { text: 'Print', path: '/' },
        //     { text: 'Undo changes', path: '/' },
        //     { text: 'Other contacts', path: '/' }
        //   ],
        //   path: '/'
        // },
        { icon: 'settings', text: 'Settings', path: '/settings' },
        { icon: 'chat_bubble', text: 'Send feedback', path: '/feedback' },
        { icon: 'help', text: 'Help', path: '/help' },
        { icon: 'phonelink', text: 'Install App', path: '/install' }
      ]
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
      'signin': signin
    }
  }
</script>

<style>

</style>
