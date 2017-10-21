<template>
  <v-card>
    <v-card-media
      :src="club.headerPic"
      height="200px"
    >
    </v-card-media>
    <v-card-title primary-title>
      <div>
        <div class="headline">{{club.name}}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn flat>Share</v-btn>
      <v-btn flat color="purple" @click="goToGroupDetails()">View</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click.native="show = !show">
        <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="show">
        {{club.information}}
      </v-card-text>
    </v-slide-y-transition>
  </v-card>
</template>

<script>
  import SportClubModel from '../../../models/SportClubModel'

  export default {
    data: () => ({
      show: false
    }),
    props: {
      club: SportClubModel
    },
    methods: {
      goToGroupDetails: function () {
        console.log('Redirecting')
        this.$router.push({
          name: 'groupDetails', params: { clubId: this.club.key }
        })
      }
    }
  }
</script>

<style scoped>

</style>
