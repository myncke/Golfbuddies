<template>
    <v-container>
      <v-layout column>

          <v-flex class="mb-4">
            <v-card>
              <v-list two-line>
                <template v-for="item in notifications">
                  <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                  <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
                  <v-list-tile avatar v-else v-bind:key="item.title" @click="">
                    <v-list-tile-avatar>
                      <!-- <img v-bind:src="item.avatar"> -->
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <!-- <v-list-tile-title v-html="item.title"></v-list-tile-title> -->
                      <!-- <v-list-tile-sub-title >24 Okt. 2017</v-list-tile-sub-title> -->
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
            </v-card>
          </v-flex>

          <friend-list></friend-list>
          <!-- <v-flex class="mb-4">
            <v-card>
              <v-list two-line>
                <template v-for="item in support">
                  <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
                </template>
                <div class="placeholder">Coming Soon!</div>
              </v-list>
            </v-card>
          </v-flex> -->

      </v-layout>
    </v-container>

</template>

<script>
import FriendList from '../Contact/FriendList'
export default {
  data: () => ({
    notifications: [
      { header: 'Notifications' }
    ],
    friends: [
      { header: 'Friends' }
    ],
    support: [
      { header: 'Support' },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
      { divider: true, inset: true },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
      { divider: true, inset: true },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
    ]
  }),
  components: {
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
