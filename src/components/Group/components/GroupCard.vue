<template>
  <v-card class="white--text cover"
          :style="{ backgroundImage: 'url('+ club.headerPic + ')' }">
    <v-card-title primary-title class="cover">
      <v-flex column>
        <div class="headline">{{$capitalize(club.name)}}</div>
        <div>{{club.information}}</div>
      </v-flex>
    </v-card-title>
    <v-card-actions class="cover">
      <v-btn flat dark @click="goToGroupDetails(club.key)">View</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      club: Object
    },
    methods: {
      goToGroupDetails: function (key) {
        this.$router.push({
          name: 'group', params: { id: key }
        })
      }
    }
  }
</script>

<style scoped>
  .cover {
    background: linear-gradient(to left,rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.8));
  }
</style>
