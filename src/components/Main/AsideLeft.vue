<template>
  <v-flex class="">
    <v-container class="pa-0">
      <v-layout>
        <v-flex sm12>
          <v-card>
            <v-list two-line>
              <v-list-tile avatar :to="`/profile/${user.key}`">
                <v-list-tile-avatar>
                  <img :src="makeInitialsImage(user)" class="initials-img" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{$capitalize(user.firstName)}} {{$capitalize(user.lastName)}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{user.region}}, {{user.nationality}} </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="pa-0">
      <feed-lite></feed-lite>
    </v-container>

    <v-divider></v-divider>
    <v-container class="pa-0">
      <v-tabs dark grow>
        <v-tabs-bar class="green">
          <v-tabs-slider class="yellow"></v-tabs-slider>
          <v-tabs-item
            v-for="i in items"
            :key="i"
            :href="'#tab-' + i"
          >
            {{ i }}
          </v-tabs-item>
        </v-tabs-bar>
        <v-divider></v-divider>
        
        <v-tabs-items>
          <v-tabs-content
            v-for="i in items"
            :key="i"
            :id="'tab-' + i"
          >
            <v-card flat>

               <div v-if="i == 'Groups'">
                <v-container class="pa-0">
                  <v-layout>
                    <v-flex sm12>
                      <v-card>
                        <v-list>
                          <v-layout row align-center>
                            <v-btn outline flat class="" :to="'/groups'"> Search</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn outline flat class="" :to="'/group/new'">Create</v-btn>
                          </v-layout>

                          <template v-for="group in clubModels">
                            <v-list-tile avatar v-bind:key="group.id" :to="`/group/${group.key}`">
                              <v-list-tile-avatar>
                                <img v-bind:src="group.headerPic">
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="group.name"></v-list-tile-title>
                              </v-list-tile-content>
                            </v-list-tile>
                            <v-divider v-if="!$last(group, clubModels)" :inset="true"></v-divider>
                          </template>
                        </v-list>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
               </div>

               <div v-else>
                 <friend-list></friend-list>
               </div>

            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-container>

  </v-flex>
</template>

<script>
import SportClubModel from '../../models/SportClubModel'
import EventNavCard from '../Event/components/NavCard'
import ImageUtils from '../../utils/ImageUtils'
import FeedLite from './FeedLite'
import FriendList from '../Contact/FriendListLite'

export default {
  computed: {
    user () {
      console.log(this.$store.getters.user)
      return this.$store.getters.user
    }
  },
  data: () => ({
    clubModels: [],
    tips: [
      { header: 'Tips' }
    ],
    error: '',
    items: ['Groups', 'Friends'],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }),
  created: function () {
    this.initModels()
  },
  methods: {
    initModels: async function () {
      this.clubModels = []
      let list = (await SportClubModel.getMyClubs(error => { this.error = error }))
      // list.push(...(await SportClubModel.getMyClubs(error => { this.error = error })))
      this.clubModels = list
    },
    goToGroupDetails: function (key) {
      this.$router.push({
        name: 'group', params: { id: key }
      })
    },
    makeInitialsImage: function (user) {
      return ImageUtils.makeInitialsImage(user)
    }
  },
  components: {
    'event-nav-card': EventNavCard,
    'feed-lite': FeedLite,
    'friend-list': FriendList
  }
}
</script>

<style scoped>
.placeholder {
  margin: 1em;
  padding: 1em;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
