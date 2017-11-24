<template>
  <v-container>
    <v-layout column wrap>
      <v-flex>
        <p class="title">General Information</p>
        <v-checkbox
          label="Competitive"
          v-model="model.competition"
          disabled
        ></v-checkbox>

        <v-checkbox
          label="International"
          v-model="model.international"
          disabled
        ></v-checkbox>

        <v-checkbox
          label="Dinner"
          v-model="model.dinner"
          disabled
        ></v-checkbox>

        <v-checkbox
          label="Carpool"
          v-model="model.carpool"
          disabled
        ></v-checkbox>

        <p class="subheading">Preferred Group Size: {{model.prefGroupSize}} Players</p>
        <p class="subheading">Preferred Group Composition: {{model.prefGameSex}}</p>
      </v-flex>

      <v-flex class="mt-3">
        <p class="title">Golf Information</p>
        <golf-show v-if="this.subModel.buggie !== undefined" :model="this.subModel"></golf-show>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GolfShow from '../components/GolfGame/Show'

export default {
  data: () => ({
  }),
  props: [ 'model', 'subModel' ],
  created: function () {
  },
  methods: {
  },
  components: {
    'golf-show': GolfShow
  }
}
</script>
