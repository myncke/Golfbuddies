<template>
  <v-layout column>
    <v-flex class="mb-3">
      <post-field></post-field>
    </v-flex>

    <v-divider class="mt-3 mb-3"></v-divider>

    <v-flex class="mb-3">
      <v-card>
        <v-card-title primary-title>
          <v-layout row align-content-center> 
            <v-avatar>
               <img src="https://uinames.com/api/photos/male/11.jpg" alt="">
            </v-avatar>
            <div class="ml-3">
              <h3 class="title mb-0">Jef De Bakker</h3>
              <h4 class="subheading">fasfasfas</h4>
            </div>
          </v-layout>
        </v-card-title>
        <v-card-text primary-title>
          <div>
            <h3 class="headline mb-0">Golfen in Oostende?</h3>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="orange">Share</v-btn>
          <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-flex>
      <v-card>
        <v-card-title primary-title>
          <v-layout row align-content-center> 
            <v-avatar>
               <img src="https://uinames.com/api/photos/male/12.jpg" alt="">
            </v-avatar>
            <div class="ml-3">
              <h3 class="title mb-0">Jef De Bakker</h3>
              <h4 class="subheading">fasfasfas</h4>
            </div>
          </v-layout>
        </v-card-title>
        <v-card-text primary-title>
          <div>
            <h3 class="headline mb-0">Golfen in Oostende?</h3>
            <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="orange">Share</v-btn>
          <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

  </v-layout>
</template>

<script>
import PostField from '../Shared/PostField'

export default {
  data () {
    return {
      items: [
        { header: 'This Week' },
        { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='grey--text text--darken-2'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='grey--text text--darken-2'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
        { divider: true, inset: true },
        { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='grey--text text--darken-2'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
      ]
    }
  },
  components: {
    'post-field': PostField
  }

}
</script>

