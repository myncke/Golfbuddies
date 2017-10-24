<template>
  <v-flex>
    <v-container>
      <v-layout>
        <v-flex>
          <v-card>
            <v-list two-line>
              <v-list-tile avatar :to="'/'">
                <v-list-tile-avatar>
                          <img src="https://uinames.com/api/photos/male/10.jpg" alt="">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Mats Myncke</v-list-tile-title>
                  <v-list-tile-sub-title>Gent, Belgium &#9679; {{ new Date().getDate() }} Okt. 2017</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout>
        <v-flex>
            <v-card>
            <v-list>
              <template v-for="group in groups">
                <v-subheader v-if="group.header" v-text="group.header" :to="'/groups'"></v-subheader>
                <v-divider v-else-if="group.divider" v-bind:inset="group.inset"></v-divider>
                <v-list-tile avatar v-else v-bind:key="group.title" @click="">
                  <v-list-tile-avatar>
                    <img v-bind:src="group.avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title v-html="group.title"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container>
      <v-layout>
        <v-flex>
            <v-card>
              <v-list>
              <v-subheader v-text="'My pictures'"></v-subheader>
              </v-list>
            <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
              <v-layout row wrap>
                <v-flex
                  xs4
                  v-for="n in 9"
                  :key="n"
                >
                  <v-card flat tile>
                    <v-card-media
                      :src="`https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`"
                      height="100px"
                    >
                    </v-card-media>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    groups: [
      { header: 'Groups' },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Golf groep Oostende', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
      { divider: true, inset: true },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Spani <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
      { divider: true, inset: true },
      { avatar: `https://unsplash.it/100/100?image=${Math.floor(Math.random() * 100) + 1}`, title: 'Andere Vrienden groep', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
    ],
    size: 'sm'
  })
}
</script>
