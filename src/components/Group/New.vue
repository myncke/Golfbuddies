<template>
  <v-card style="width: 100%; margin: 20px;">
    <v-card-title>
      <p class="title"> New Club </p>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-layout row wrap>
          <v-flex md6 xs12 class="input-field">
            <v-text-field
              name="Club Name"
              label="Club Name"
              v-model="model.name"
              required
            ></v-text-field>

          </v-flex>
          <v-flex md6 xs12 class="input-field">
            <v-text-field
              name="Club Location"
              label="Club Location"
              v-model="model.location"
              required
              prepend-icon="location_on"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="input-field">
            <v-text-field
              name="Club Information"
              label="Club Information"
              v-model="model.information"
              required
              multiLine
            ></v-text-field>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <v-checkbox label="Private"
                        v-model="model.closed"
                        color="primary"
                        required>
            </v-checkbox>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <v-radio-group v-model="model.sportType" required>
              <v-radio label="Golf" value="golf"></v-radio>
            </v-radio-group>
          </v-flex>
          <!-- TODO: make it possible to upload a picture to Firebase Storage -->
          <v-flex sm6 xs12 class="input-field">
            <v-text-field
              label="Header Picture"
              name="Header Picture"
              v-model="model.headerPic"
              type="url"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- TODO: make this method -->
        <v-btn color="primary" block @click="createClub()">Create Club</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
  <!-- // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBE-PlO7hiB520Y0VN4_0JkMHk69v0n17w -->
</template>

<script>
  import SportClubModel, { SportTypeModel } from '../../models/SportClubModel'
  let sportTypeMap = {
    'golf': SportClubModel.getNormalRef(SportTypeModel).doc('Golf')
  }
  export default {
    data: () => ({
      model: {}
    }),
    created: function () {
      this.model = new SportClubModel()
    },
    methods: {
      createClub: function () {
        this.model.sportType = sportTypeMap[this.model.sportType]
        this.getLocation()
      },
      getLocation: async function () {
        let response = this.$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(this.model.location) + '&key=AIzaSyBE-PlO7hiB520Y0VN4_0JkMHk69v0n17w')
        console.log(response.body)
      }
    }
  }
</script>

<style scoped>

  .input-field {
    padding: 20px;
  }

</style>
