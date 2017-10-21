<template>
  <v-layout row wrap v-if="model !== undefined">
    <v-flex xs12 class="pa-3">
      <p class="subheading">Golf Information</p>
    </v-flex>
    <v-flex sm6 xs12 class="pa-3">
      <v-text-field
        label="Federaal Nummer"
        v-model="model.federaalNummer"
        :disabled="!editMode"
      ></v-text-field>
    </v-flex>

    <v-flex sm6 xs12 class="pa-3">
      <v-text-field
        label="Handicap"
        v-model="model.hdc"
        :disabled="!editMode"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import GolfUserModel from '../../../models/GolfUserModel'

  export default {
    data: () => ({
      model: undefined,
      editMode: false
    }),
    created: function () {
      this.initModel()
    },
    methods: {
      initModel: async function () {
        this.model = new GolfUserModel(this.$store.getters.currentUser, false, model => { this.model = undefined; this.model = model }, error => { this.error = error.message })
        // this.model = await GolfUserModel.getFromRef(GolfUserModel.getNormalRef(GolfUserModel).doc(this.$store.getters.currentUser), GolfUserModel, error => console.log(error))
      },
      setEditMode: function (val) {
        this.editMode = val
      },
      save: async function () {
        if (typeof this.model.hdc === 'string') this.model.hdc = parseInt(this.model.hdc)
        await this.model.save()
        console.log('SAVED GOLFUSER')
      }
    }
  }
</script>

<style>

</style>
