<template>
  <v-navigation-drawer disable-route-watcher persistent clipped fixed app v-model="open" width='400' class="pb-0" style="z-index:1000">
    <aside-left></aside-left>
  </v-navigation-drawer>
</template>

<script>
import AsideLeft from '../Main/AsideLeft'

export default {
  data: () => ({
    open: true,
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
      /* console.log(
        SportClubModel.getAllFromRef(
          SportClubModel.getNormalRef(SportClubModel).where('members.' + this.$store.getters.user.key, '==', true), SportClubModel, () => ({})
        )
      ) */
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
