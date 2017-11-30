<template>
  <v-card style="width: 100%;">
    <v-card-title>
      <p class="title"> New Group </p>
    </v-card-title>
    <v-card-text>
      <p class="subheading red--text">{{error}}</p>
      <v-form ref="form" v-model="valid">
        <v-layout row wrap>
          <v-flex xs12 class="input-field">
            <v-text-field
              name="Group Name"
              label="Group Name"
              v-model="model.name"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="input-field">
            <vuetify-google-autocomplete
              id="map"
              append-icon="search"
              classname="form-control"
              placeholder="Start typing"
              v-on:placechanged="getAddressData"
              :placeholder="'Group Location'"
              types="address"
            >
            </vuetify-google-autocomplete>

            <!--<v-text-field
              name="Club Location"
              label="Club Location"
              v-model="model.location"
              required
              prepend-icon="location_on"
            ></v-text-field>-->
          </v-flex>
          <v-flex xs12 class="input-field">
            <v-text-field
              name="Group Information"
              label="Group Information"
              v-model="model.information"
              multiLine
            ></v-text-field>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <v-checkbox label="Private"
                        v-model="model.closed"
                        color="primary">
            </v-checkbox>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <!-- TODO: add this when multiple sports are made. -->
            <!--<v-radio-group v-model="model.sportType" required>
              <v-radio label="Golf" value="golf"></v-radio>
            </v-radio-group>-->
          </v-flex>
          <!-- TODO: make it possible to upload a picture to Firebase Storage -->
          <v-flex sm6 xs12 class="input-field">
            <v-text-field
              label="Header Picture"
              name="Header Picture"
              v-model="model.headerPic"
              type="url"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn v-if="isEdit" color="primary" :loading="loading" block @click="createClub()">Edit Club</v-btn>
        <v-btn v-else color="primary" :loading="loading" block @click="createClub()">Create Club</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import SportClubModel, { SportTypeModel } from '../../models/SportClubModel'
  import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  export default {
    data: () => ({
      model: {},
      sportTypeMap: {},
      requiredRule: [
        (val) => !!val || 'This field is required'
      ],
      loading: false,
      isEdit: false,
      valid: false
    }),
    watch: {
      $route: function (newVal) {
        this.init()
      }
    },
    created: function () {
      this.init()
    },
    methods: {
      init: function () {
        this.sportTypeMap = {
          'golf': SportTypeModel.getNormalRef(SportTypeModel).doc('Golf')
        }
        let id = this.$route.params.id
        if (id !== undefined) {
          this.model = undefined
          console.log(new SportClubModel(id, false, model => { this.model = model; this.model.sportType = 'golf' }, error => console.log(error)))
          this.isEdit = true
        } else {
          this.model = new SportClubModel()
        }
        this.model.sportType = 'golf'
      },
      createClub: async function () {
        if (!this.$refs.form.validate()) {
          return
        }

        this.loading = true
        this.model.sportType = this.sportTypeMap[this.model.sportType]
        this.model.closed = this.model.closed || false
        this.model.name = this.model.name.toLowerCase()
        // await this.getLocation()
        if (!this.model.locationString || !this.model.location) {
          this.loading = false
          this.error = 'Please fill in the location!'
          return
        }
        let user = this.$store.getters.user
        this.model.members = {}
        this.model.members[user.key] = true
        this.model.admin = user._getDocRef()
        await this.model.initConversationGroup()
        await this.model.save()
        this.loading = false
        this.$router.push({name: 'group', params: { id: this.model.key }})
        this.$router.go()
      },
      getLocation: async function () {
        /* try {
          let location = await LocationUtils.getLocation(this.model.location, this.$http)
          this.model.location = {latitude: location.lat, longitude: location.lng}
        } catch (error) {
          this.error = 'Invalid location, please try again with a more precise location.'
        } */
        // TODO: maybe delete later
      },
      getAddressData (addressData, placeResultData) {
        this.model.location = {latitude: addressData.latitude, longitude: addressData.longitude}
        this.model.locationString = placeResultData.formatted_address
      }
    },
    components: {
      'vuetify-google-autocomplete': VuetifyGoogleAutocomplete
    }
  }
</script>

<style scoped>

  .input-field {
    padding: 20px;
  }

</style>
