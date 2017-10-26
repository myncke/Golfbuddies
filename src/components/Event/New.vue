<template>
  <div style="width: 100%;">
    <v-stepper v-model="page">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="page > 1">General Game Information</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="page > 2">Specific Game Information</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="page > 3">Invite Users <small>Optional</small></v-stepper-step>
      </v-stepper-header>
      <v-stepper-content step="1">
        <v-card>
          <v-card-title>
            <p class="title">Game Information</p>
          </v-card-title>
          <v-card-text>
            <v-form  v-model="valid" :value="false" ref="form">
              <v-layout row wrap>
                <v-flex md6 xs12 class="input-field">
                  <v-text-field label="Date" :mask="'date-with-time'" v-model="model.date" prepend-icon="date_range" required
                                :rules="rules.dateRules"
                  ></v-text-field>
                </v-flex>
                <v-flex md6 xs12 class="input-field">
                  <vuetify-google-autocomplete
                    id="map"
                    append-icon="search"
                    classname="form-control"
                    placeholder="Start typing"
                    v-on:placechanged="getAddressData"
                    types="address"
                  >
                  </vuetify-google-autocomplete>
                  <!--<v-text-field label="Location" v-model="model.locationString" prepend-icon="location_on" required
                                :rules="rules.locationRules"
                  ></v-text-field>-->
                </v-flex>
                <v-flex xs12 class="input-field">
                  <v-text-field label="Special Wishes / Information" v-model="model.specialWishes" multiLine
                  ></v-text-field>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Competition"
                              v-model="model.competition"
                              color="primary"
                              required>
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="International"
                              v-model="model.international"
                              color="primary"
                              required>
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Invite Only"
                              v-model="model.inviteOnly"
                              color="primary"
                              required>
                  </v-checkbox>
                </v-flex>
                <v-flex xs12></v-flex>
                <v-flex sm6 xs12 class="input-field">
                  <v-select
                    v-bind:items="sexes"
                    v-model="model.prefGameSex"
                    :rules="rules.prefGameSexRules"
                    label="Prefered Participant Sexes"
                    single-line
                    bottom
                    required
                  ></v-select>
                </v-flex>
                <v-flex sm6 xs12 class="input-field">
                  <v-text-field label="Prefered Group Size" :mask="'##'" v-model="model.prefGroupSize" required
                                :rules="rules.groupSizeRules"
                  ></v-text-field>
                </v-flex>
                <v-flex sm6 xs12 class="input-field">
                  <v-radio-group v-model="sportType" required>
                    <v-radio label="Golf" value="Golf" selected></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="2">
        <golf-new v-if="sportType === 'Golf'" ref="subModelComponent"></golf-new>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
      </v-stepper-content>
    </v-stepper>
    <v-layout row style="height: auto">
      <v-btn color="primary" :disabled="page < 3" @click.native="page = Math.max(1,page-1)">Back</v-btn>
      <v-spacer style="height: 1px"></v-spacer>
      <v-btn color="primary" :disabled="!valid || loading" :loading="loading" @click.native="nextPage()">Continue</v-btn>
    </v-layout>
  </div>
</template>
<script>
  import GameModel, { GameTypeNames, PrefGameSex } from '../../models/GameModel'
  import LocationUtils from '../../utils/LocationUtils'
  import GolfGameNew from './components/GolfGame/New.vue'
  import DateUtils from '../../utils/DateUtils'
  import UserModel from '../../models/UserModel'
  import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete'

  export default {
    data: () => ({
      model: {},
      page: 1,
      sexes: [],
      valid: false,
      rules: {
        dateRules: [
          (v) => !!v || 'Date is required',
          (v) => {
            if (typeof v === 'string') {
              return DateUtils.stringToDate(v) > new Date() || 'Date should be in the future'
            }
            return v
          }
        ],
        locationRules: [
          (v) => !!v || 'Location is required'
        ],
        groupSizeRules: [
          (v) => !!v || 'Prefered Group Size is required'
        ],
        prefGameSexRules: [
          (v) => !!v || 'Prefered Participants Sex is required'
        ]
      },
      sportType: 'Golf',
      sportTypes: [],
      loading: false
    }),
    created: function () {
      this.model = new GameModel()
      this.sexes = PrefGameSex
      this.sportTypes = Object.keys(GameTypeNames)
    },
    methods: {
      nextPage: async function () {
        if (!this.valid) return
        if (this.page < 3) {
          this.page += 1
        } else {
          this.loading = true
          await this.submit()
          this.loading = false
          this.$router.push({name: 'event', params: {id: this.model.key}})
        }
      },
      getLocation: async function () {
        try {
          let location = await LocationUtils.getLocation(this.model.locationString, this.$http)
          this.model.location = {latitude: location.lat, longitude: location.lng}
        } catch (error) {
          this.error = 'Invalid location, please try again with a more precise location.'
        }
      },
      submit: async function () {
        let subModel = this.$refs.subModelComponent.getModel()
        await this.getLocation()

        // Fix some fields
        this.model.competition = this.model.competition || false
        this.model.international = this.model.international || false
        this.model.inviteOnly = this.model.inviteOnly || false
        this.model.prefGroupSize = parseInt(this.model.prefGroupSize)
        this.model.date = DateUtils.stringToDate(this.model.date)
        this.model.specialWishes = this.model.specialWishes || ''
        this.model.creator = UserModel.getNormalRef(UserModel).doc((new UserModel()).key)
        this.model.subGame = subModel._getDocRef()

        subModel.gameKey = GameModel.getNormalRef(GameModel).doc(this.model.key)

        // Save both models
        await this.model.save()
        await subModel.save()
      },
      getAddressData (data) {
        console.log(data)
        return
      }
    },
    components: {
      'golf-new': GolfGameNew,
      'vuetify-google-autocomplete': VuetifyGoogleAutocomplete
    }
  }
</script>

<style>
  .input-field {
    padding: 10px;
  }
</style>
