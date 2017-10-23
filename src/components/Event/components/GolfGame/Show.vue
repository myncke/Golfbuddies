<template>
  <v-layout row wrap>

    <!-- Booleans -->

    <v-flex lg4 sm6 xs12>
      <v-checkbox
        label="Buggie Included"
        v-model="model.buggie"
        disabled
      ></v-checkbox>
    </v-flex>

    <v-flex lg4 sm6 xs12>
      <v-checkbox
        label="Overnight"
        v-model="model.overnight"
        disabled
      ></v-checkbox>
    </v-flex>

    <!-- Text Values -->

    <v-flex sm6 xs12>
      <p class="subheading">Price per Round: {{model.roundPrice}}</p>
    </v-flex>

    <v-flex sm6 xs12>
      <p class="subheading">Minimum Handicap: {{model.minHdc}}</p>
    </v-flex>

  </v-layout>
</template>

<script>
  import GolfGameModel from '../../../../models/GolfGameModel'

  export default {
    props: {
      model: GolfGameModel
    }
  }
</script>

<style scoped>

</style>
