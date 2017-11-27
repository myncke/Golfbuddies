<template>
  <v-layout column>
    <v-flex class="">
      <v-card class="elevation-0">
        <v-list dense two-line subheader>
          <v-subheader>Upcoming events &#9679; {{events.length}}</v-subheader>
        </v-list>


        <div style="height:25vh; overflow: scroll;">
          <template v-for="item in events.reverse()" >
            <div :key="item.id">
              <v-container class="pa-1">
                <v-layout row>
                  <v-flex column sm2 class="pl-1 pr-2 pt-3 pb-3">
                    <div class="body-2 text-sm-right">{{ item.date | moment("D MMM.") }}</div>
                    <div class="caption text-sm-right">{{ item.date | moment("dddd") }}</div>
                  </v-flex>


                  <v-flex column sm10>
                    
                    <v-layout row>
                      <v-btn flat small nuxt color="primary" class="pa-0" @click="goToEvent(item.key)">{{item.title}}</v-btn>
                      <v-spacer></v-spacer>
                      <join-event :gameModel="item"></join-event>
                    </v-layout>
                    <p class="pl-4 ma-0 caption">{{ item.date | moment("hh:mm a") }} &#9679; {{item.locationString}} </p>
                    
                  </v-flex>

                </v-layout>
              </v-container>
              <v-divider v-bind:inset="item.inset"></v-divider>
            </div>
          </template>
        </div>

        <v-card-actions >
          <v-btn flat block small color="primary" :to="'/calendar'" class="mb-1">See all upcoming events</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import GameModel from '../../models/GameModel'
  import Join from '../Event/Join'

  export default {
    data: () => ({
      items: [
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', date: '9 Jan', day: 'THU', time: '20:00', location: 'Oostende' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', date: '17 Jan', day: 'FRI', time: '20:00', location: 'Oostende' },
        { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', date: '28 Jan', day: 'SUN', time: '20:00', location: 'Oostende' }
      ],
      travels: [],
      events: null
    }),
    computed: {
      dateMonth (item) {
        return `${item.date.getDay} ${item.date.getMonth()}`
      }
    },
    created: function () {
      this.initFeed()
    },
    methods: {
      goToEvent: function (key) {
        console.log('Redirecting')
        this.$router.push({
          name: 'event', params: { id: key }
        })
      },
      initFeed: async function () {
        this.events = await GameModel.getAllUpcomingGames(error => console.log(error))
        console.log(this.events)
      }
    },
    components: {
      'join-event': Join
    }
  }
</script>
