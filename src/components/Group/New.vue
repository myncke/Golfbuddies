<template>
  <v-card style="width: 100%; margin: 20px;">
    <v-card-title>
      <p class="title"> New Club </p>
    </v-card-title>
    <v-card-text>
      <p class="subheading red--text">{{error}}</p>
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
        <v-btn color="primary" block @click="createClub()">Create Club</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import SportClubModel, { SportTypeModel } from '../../models/SportClubModel'
  import UserModel from '../../models/UserModel'
  import LocationUtils from '../../utils/LocationUtils'

  export default {
    data: () => ({
      model: {},
      sportTypeMap: {},
      rules: {

      }
    }),
    created: function () {
      this.model = new SportClubModel()
      this.sportTypeMap = {
        'golf': SportTypeModel.getNormalRef(SportTypeModel).doc('Golf')
      }
      this.model.sportType = 'golf'
    },
    methods: {
      createClub: async function () {
        this.model.sportType = this.sportTypeMap[this.model.sportType]
        this.model.closed = this.model.closed || false
        await this.getLocation()
        // TODO: We have to find a way to init the members
        this.model.members = {}
        this.model.admin = (new UserModel())._getDocRef()
        await this.model.save()
        this.$router.push({
          name: 'group', params: { clubId: this.model.key }
        })
      },
      getLocation: async function () {
        try {
          let location = await LocationUtils.getLocation(this.model.location, this.$http)
          this.model.location = {latitude: location.lat, longitude: location.lng}
        } catch (error) {
          this.error = 'Invalid location, please try again with a more precise location.'
        }
      }
    }
  }
</script>

<style scoped>

  .input-field {
    padding: 20px;
  }

</style>
