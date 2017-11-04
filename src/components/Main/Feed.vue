<template>
  <v-layout column>
    <v-flex class="mb-5">
      <v-card>
        <v-list two-line subheader>
          <v-subheader>Upcoming events</v-subheader>
        </v-list>

          <template v-for="item in events" >
            <div :key="item.id">
              <v-container class="pa-1">
                <v-layout row>
                  <v-flex column sm2 class="pl-0 pr-3 pt-3 pb-3">
                    <div class="title text-sm-right">{{ item.date | moment("D MMM.") }}</div>
                    <div class="text-sm-right">{{ item.date | moment("dddd") }}</div>
                  </v-flex>

                  <v-flex column sm10>
                    <v-btn flat nuxt color="primary" class="ma-0 pa-0" @click="goToEvent(item.key)">{{item.title}}</v-btn>
                    <p class="pl-3 ma-0">{{ item.date | moment("hh:mm a") }} &#9679; {{item.locationString}} </p>
                    <div>
                      <v-btn small flat value="going" color="blue-grey" class="caption">
                        <v-icon left dark color="" class="caption">check</v-icon> Going
                      </v-btn>
                      <v-btn small flat value="maybe" color="blue-grey" class="caption">
                        <v-icon left dark color="" class="body-1">help_outline</v-icon> maybe 
                      </v-btn>
                      <v-btn small flat value="ignore" color="blue-grey" class="caption">
                        <v-icon left dark color="" class="caption">clear</v-icon>Ignore
                      </v-btn>
                    </div>
                  </v-flex>

                </v-layout>
              </v-container>
              <v-divider v-bind:inset="item.inset"></v-divider>
            </div>
          </template>
        <v-card-actions >
          <v-btn flat block small color="primary" :to="'/calendar'" class="mb-1">See all upcoming events</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex>
      <v-card>
        <v-list two-line subheader>
          <v-subheader>Upcoming travels</v-subheader>
        </v-list>

          <template v-if="travels.length == 0">
            <div :key="travels">
              <v-container>
                <v-layout column>
                  <v-flex class="ml-2">
                    Nobody is travelling in the near future.
                  </v-flex>
                </v-layout>
              </v-container>
              <v-divider></v-divider>
            </div>
          </template>

          <template v-else v-for="item in travels" >
            <div :key="item">
              <v-container>
                <v-layout row>
                  <v-flex column sm2 class="pa-3">
                    <div class="title text-sm-right" v-text="item.date"></div>
                    <div class="text-sm-right" v-text="item.day"></div>
                  </v-flex>

                  <v-flex column sm10>
                    <v-btn small flat nuxt color="primary" class="ma-0 pa-0">Golfpartij in Oostende</v-btn>
                    <p class="pl-3 ma-0">{{item.time}} &#9679; {{item.location}} </p>
                    <div>
                      <v-btn small outline value="going"><v-icon left dark>check</v-icon> Going</v-btn>
                      <v-btn small outline value="maybe"><v-icon left dark>help_outline</v-icon> maybe </v-btn>
                      <v-btn small outline value="ignore"><v-icon left dark>clear</v-icon>Ignore</v-btn>
                    </div>
                  </v-flex>

                </v-layout>
              </v-container>
              <v-divider v-bind:inset="item.inset"></v-divider>
            </div>
          </template>
        <v-card-actions >
          <v-btn v-if="travels.length > 0" flat block small color="primary" :to="'/calendar'" class="mb-1">See all upcomming events</v-btn>
          <v-btn else flat block small color="primary" :to="'/calendar'" class="mb-1">Plan in your travels</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import GameModel from '../../models/GameModel'

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
        this.events = await GameModel.getAllOpenGames(console.log('ERROR'))
        console.log(this.events)
      }
    }
  }
</script>
