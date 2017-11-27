<template>
  <v-navigation-drawer persistent clipped fixed app v-model="open" width='400'>
    <!-- <v-list dense>
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
    </v-list> -->
    <aside-left></aside-left>
  </v-navigation-drawer>
</template>

<script>
import SportClubModel from '../../models/SportClubModel'
import AsideLeft from '../Main/AsideLeft'

export default {
  data: () => ({
    open: false,
    items: [
      { text: 'Upcoming', icon: 'update', path: '/feed', info: 'All upcoming events you are invited to or are going to.' },
      { text: 'Calendar', icon: 'events', path: '/calendar', info: 'Calendar of all upcoming events and travels.' },
      { text: 'Discover', icon: 'search', path: '/events', info: 'Filter public events.' },
      { text: 'Create New Event', icon: 'add', path: '/event/new' },
      { text: 'Travel', icon: 'add', path: '/locationBroadcast/new' },
      {
        icon: 'keyboard_arrow_up',
        'icon-alt': 'keyboard_arrow_down',
        text: 'Groups',
        model: true,
        children: [
          { icon: 'group_work', text: 'All Groups', path: '/groups/open' },
          { icon: 'group', text: 'My Groups', path: '/groups/my' },
          { icon: 'group_add', text: 'Create Group', path: '/group/new' }
        ],
        path: '/'
      }
    ]
  }),
  created () {
    let person = { icon: 'person', text: 'Profile', path: '/profile/' + this.$store.getters.user.key }
    this.items.push(person)
  },
  methods: {
    switchOpenState () {
      this.open = !this.open
      console.log(
        SportClubModel.getAllFromRef(
          SportClubModel.getNormalRef(SportClubModel).where('members.' + this.$store.getters.user.key, '==', true), SportClubModel, () => ({})
        )
      )
    },
    goToProfile: function () {
      // this.$router.push({name: 'profile', params: {id: this.$store.getters.key}})
      return '/profile/' + this.$store.getters.user.key
    }
  },
  components: {
    'aside-left': AsideLeft
  }
}
</script>
