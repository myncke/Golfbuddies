<template>
  <v-navigation-drawer persistent clipped app v-model="open" >
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
            @click="open = false"
            :to="child.path"
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
        <v-list-tile v-else @click="open = false" :key="item.name" :to="item.path">
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
</template>

<script>
import SportClubModel from '../../models/SportClubModel'

export default {
  data: () => ({
    open: false,
    items: [
      { icon: 'events', text: 'Events', path: '/events' },
      { icon: 'contacts', text: 'Contacts', path: '/contacts' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Groups',
        model: true,
        children: [
          { icon: 'group_work', text: 'All Groups', path: '/groups' },
          { icon: 'add', text: 'Create Group', path: '/group/new' }
        ],
        path: '/'
      },
      { icon: 'person', text: 'Profile', path: '/profile' },
      { icon: 'settings', text: 'Settings', path: '/settings' },
      { icon: 'chat_bubble', text: 'Send feedback', path: '/feedback' },
      { icon: 'help', text: 'Help', path: '/help' },
      { icon: 'phonelink', text: 'Install App', path: '/install' }
    ]
  }),
  methods: {
    switchOpenState () {
      this.open = !this.open
      console.log(
        SportClubModel.getAllFromRef(
          SportClubModel.getNormalRef(SportClubModel).where('members.' + this.$store.getters.user.uid, '==', true), SportClubModel, () => ({})
        )
      )
    }
  }
}
</script>
