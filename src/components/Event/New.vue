<template>
  <div style="width: 100%;">
    <v-stepper v-model="page">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="page > 1">General Game Information</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="page > 2" v-if="maxPage > 1">Specific Game Information</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :complete="page > 3" v-if="maxPage > 2">Invite Users <small>Optional</small></v-stepper-step>
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
                  <v-text-field label="Event Title" v-model="model.title" prepend-icon="short_text" required
                  ></v-text-field>
                </v-flex>

                <!-- TODO: this needs to be filled in, no idea how though -->

                <v-flex md6 xs12 class="input-field">
                  <v-text-field label="Date" :mask="'date-with-time'" v-model="model.date" prepend-icon="date_range" required
                                :rules="rules.dateRules"
                                placeholder="dd/mm/yyyy hh:mm"
                                clearable
                  ></v-text-field>
                </v-flex>
                <v-flex md6 xs12 class="input-field">
                  <v-text-field label="End Date (Optional)" :mask="'date-with-time'" v-model="model.enddate" prepend-icon="date_range"
                                :rules="rules.enddateRules"
                                placeholder="dd/mm/yyyy hh:mm"
                                clearable
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 class="input-field">
                  <vuetify-google-autocomplete
                    id="map"
                    append-icon="search"
                    prepend-icon="location_on"
                    classname="form-control"
                    placeholder="Event Location"
                    v-on:placechanged="getAddressData"
                    :placeholder="model.locationString"
                    v-on:inputChange="(locationString) => { model.locationString = locationString.newVal }"
                    types="address"
                  >
                  </vuetify-google-autocomplete>
                  <!--<v-text-field label="Location" v-model="model.locationString" prepend-icon="location_on" required
                                :rules="rules.locationRules"
                  ></v-text-field>-->
                </v-flex>
                <v-flex xs12 class="special-wishes">
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs12 class="input-field">
                  <v-text-field label="Special Wishes / Information" v-model="model.specialWishes" multiLine
                  ></v-text-field>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Competition"
                              v-model="model.competition"
                              color="primary">
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="International"
                              v-model="model.international"
                              color="primary">
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Dinner"
                              v-model="model.dinner"
                              color="primary">
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Carpool"
                              v-model="model.carpool"
                              color="primary">
                  </v-checkbox>
                </v-flex>
                <v-flex lg4 sm6 xs12 class="input-field">
                  <v-checkbox label="Invite Only"
                              v-model="model.inviteOnly"
                              color="primary">
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
                  <v-radio-group v-model="sportType" required style="opacity:0">
                    <v-radio label="Golf" value="Golf" selected></v-radio>
                  </v-radio-group>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-stepper-content>
      <v-stepper-content v-if="maxPage > 1" step="2">
        <golf-new :model="subModel" v-if="sportType === 'Golf'" ref="subModelComponent"></golf-new>
      </v-stepper-content>
      <v-stepper-content v-if="maxPage > 2" step="3">
        <!--<v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>-->
        <user-selection email :model="model"></user-selection>
      </v-stepper-content>
    </v-stepper>
    <v-layout row style="height: auto">
      <v-btn color="primary" :disabled="page === 1 || loading" @click.native="page = Math.max(1,page-1)">Back</v-btn>
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
  import UserSelectionView from './components/UserSelectionView'

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
              return DateUtils.stringToDate(v) >= new Date() || 'Date should be in the future'
            }
            return !!v
          }
        ],
        enddateRules: [
          (v) => {
            if (typeof v === 'string') {
              /* (((!this.model.date && DateUtils.stringToDate(v) >= new Date()) || (this.model.date && DateUtils.stringToDate(v) > DateUtils.stringToDate(this.model.date)))) */
              return DateUtils.stringToDate(v) > new Date() || 'Date should be in the future and after the Start date'
            }
            return !!v
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
      loading: false,
      maxPage: 3,
      subModel: undefined,
      isEdit: false
    }),
    created: function () {
      this.init()
    },
    methods: {
      initSubModel: async function () {
        let modelClass = GameTypeNames[this.sportType]
        this.subModel = await modelClass.getFromRef(this.model.subGame, modelClass, error => console.log(error))
      },
      init: function () {
        this.sexes = PrefGameSex
        this.sportTypes = Object.keys(GameTypeNames)

        let id = this.$route.params.id
        console.log(id)
        if (id !== undefined) {
          this.model = {}
          this.maxPage = 2
          this.isEdit = true
          console.log(new GameModel(id, false, model => { this.model = model; console.log(model); this.initSubModel() }, error => console.log(error)))
        } else {
          this.model = new GameModel()
        }
      },
      nextPage: async function () {
        if (!this.valid) return
        if (this.page < this.maxPage) {
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
          return {latitude: location.lat, longitude: location.lng}
        } catch (error) {
          this.error = 'Invalid location, please try again with a more precise location.'
        }
      },
      submit: async function () {
        let subModel = this.$refs.subModelComponent.getModel()
        // await this.getLocation()

        // Fix some fields
        this.model.competition = this.model.competition || false
        this.model.international = this.model.international || false
        this.model.inviteOnly = this.model.inviteOnly || false
        this.model.dinner = this.model.dinner || false
        this.model.carpool = this.model.carpool || false
        this.model.prefGroupSize = parseInt(this.model.prefGroupSize)
        if (typeof this.model.date === 'string') {
          this.model.date = DateUtils.stringToDate(this.model.date)
        }
        if (typeof this.model.enddate === 'string') {
          this.model.enddate = DateUtils.stringToDate(this.model.enddate)
        } else {
          this.model.enddate = this.model.enddate || this.model.date
        }
        this.model.specialWishes = this.model.specialWishes || ''
        this.model.creator = UserModel.getNormalRef(UserModel).doc((new UserModel()).key)
        this.model.subGame = subModel._getDocRef()
        this.model.location = this.model.location || await this.getLocation() || {latitude: 0, longitude: 0}
        console.log(this.model.location)

        subModel.gameKey = GameModel.getNormalRef(GameModel).doc(this.model.key)
        console.log(this.model)
        // Save both models
        await this.model.save()
        await subModel.save()
        if (!this.isEdit) {
          await this.model.sendInviteNotification()
        }
      },
      getAddressData (addressData, placeResultData) {
        this.model.location = {latitude: addressData.latitude, longitude: addressData.longitude}
        this.model.locationString = placeResultData.formatted_address
      }
    },
    components: {
      'golf-new': GolfGameNew,
      'vuetify-google-autocomplete': VuetifyGoogleAutocomplete,
      'user-selection': UserSelectionView
    }
  }
</script>

<style>
  .input-field {
    padding: 10px;
  }

  .special-wishes{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
