<template>
  <v-card>
    <v-card-title>
      <p class="title">Where are you going?</p>
    </v-card-title>
    <v-card-text>
      <v-layout row wrap>

        <v-flex sm6 xs12>
          <date-picker class="ma-3" label="Departure Date" v-on:date-chosen="val => { model.start = new Date(val) }"
                       :allowedFunction="(date) => date >= (new Date())"
          ></date-picker>
        </v-flex>

        <v-flex sm6 xs12>
          <date-picker class="ma-3" label="Return Date" v-on:date-chosen="val => { model.end = new Date(val) }"
                       :allowedFunction="(date) => date > (model.start || new Date())"
          ></date-picker>
        </v-flex>

        <v-flex sm6 xs12>
          <v-text-field
            class="ma-3"
            label="Location"
            name="Location"
            v-model="model.location"
            required
          ></v-text-field>
        </v-flex>

      </v-layout>

      <v-btn block color="primary" @click="saveModel">
        Save Travel
      </v-btn>

    </v-card-text>
  </v-card>
</template>

<script>
  import LocationBroadcastModel from '../../models/LocationBroadcastModel'
  import MenuDatePicker from '../Shared/MenuDatePicker'
  import UserModel from '../../models/UserModel'

  export default {
    data: () => ({
      model: undefined
    }),
    created: function () {
      this.model = new LocationBroadcastModel()
      this.model.userKey = this.$store.getters.user.key
    },
    methods: {
      saveModel: function () {
        this.model.start = new Date(this.model.start)
        this.model.end = new Date(this.model.end)
        this.model.userKey = (new UserModel())._getDocRef()
        this.model.save()
        this.$router.push({name: 'locationBroadcast', params: {id: this.model.key}})
      }
    },
    components: {
      'date-picker': MenuDatePicker
    }
  }
</script>

<style>

</style>
