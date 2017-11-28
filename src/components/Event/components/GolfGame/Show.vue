<template>
  <v-layout row wrap>

    <!-- Booleans -->

    <v-flex lg4 sm6 xs12>
      <v-checkbox
        label="Buggie Possible"
        v-model="model.buggie"
        disabled
      ></v-checkbox>
      <p class="caption extra-info" v-if="model.buggie">To reserve one, add it to your Special Wishes when joining</p>
    </v-flex>

    <v-flex lg4 sm6 xs12>
      <v-checkbox
        label="Overnight Possible"
        v-model="model.overnight"
        disabled
      ></v-checkbox>
      <p class="caption extra-info" v-if="model.overnight">To reserve a room, add it to your Special Wishes when joining</p>
    </v-flex>

    <!-- Text Values -->

    <v-flex sm6 xs12>
      <p class="subheading">Price per Round: {{model.roundPrice}}</p>
    </v-flex>

    <v-flex sm6 xs12>
      <p class="subheading">Maximum Handicap: {{model.minHdc}}</p>
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
  .extra-info{
    margin-bottom: 30px;
    margin-top: -10px;
  }
</style>
